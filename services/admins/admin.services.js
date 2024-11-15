const Admin = require("../../models/user.model");
const User = require("../../models/user.model");
const Website = require("../../models/website.models");
const WebsiteSetting = require("../../models/websiteSetting.model");
const Activity = require("../../models/activity.model");
const Wallet = require("../../models/wallet.model");
const Transaction = require("../../models/transaction.model");
const ExposureTransaction = require("../../models/exposure.transaction.model");
const Match = require("../../models/match.model");
const Bet = require("../../models/bet.model");
const BetPosition = require("../../models/betPosition.model");
const SessionBet = require("../../models/sessionBet.model");
const SportBookBet = require("../../models/sportsBookBet.model");
const moment = require("moment")
let bcrypt = require('bcryptjs');
const { isEmpty } = require("lodash");
const { responseData } = require("../../helpers/responseData");
const { generateAdminAuthToken, reGenerateAuthTokenHelper, getUserType } = require("../../helpers/helper")
const { timeZoneListToSend } = require("../../helpers/variablesList");
const { ObjectId } = require('mongodb');
const { saveActivity, getPaginateObj } = require('../../helpers/serviceHelper');
const satelize = require('satelize');
const emailExistence = require('email-existence');
const { triggerMethod } = require('../../helpers/socketWork');
const async = require('async');

module.exports = {
    admin_login: async (req, res) => {
        try {
            const { username, password, uniqueId, website } = req.body;
            const usernameUpdate = username.toLowerCase();
            const admin = await Admin.findOne({
                username: usernameUpdate, userType: { $in: ["owner", "sub_owner", "admin", "super_admin", "sub_admin", 'senior_super', 'super_agent', 'agent'] }
            })
                .select({
                    _id: 1,
                    password: 1,
                    status: 1,
                    uniqueId: 1,
                    userType: 1,
                    subOwnerId: 1,
                    ownerId: 1,
                    adminId: 1,
                    superAdminId: 1,
                    subAdminId: 1,
                    superSeniorId: 1,
                    superAgentId: 1,
                    agentId: 1,
                });
            if (!isEmpty(admin)) {

                if (admin.userType != 'owner') {
                    let ObjectIdData = [];
                    if (admin.ownerId) {
                        ObjectIdData.push(admin.ownerId)
                    }
                    if (admin.subOwnerId) {
                        ObjectIdData.push(admin.subOwnerId)
                    }
                    if (admin.adminId) {
                        ObjectIdData.push(admin.adminId)
                    }
                    if (admin.superAdminId) {
                        ObjectIdData.push(admin.superAdminId)
                    }
                    if (admin.subAdminId) {
                        ObjectIdData.push(admin.subAdminId)
                    }
                    if (admin.superSeniorId) {
                        ObjectIdData.push(admin.superSeniorId)
                    }
                    if (admin.superAgentId) {
                        ObjectIdData.push(admin.superAgentId)
                    }
                    let userStatus = await Admin.distinct('status', {
                        _id: { $in: ObjectIdData }
                    });

                    if (userStatus.findIndex((item) => item === "locked") >= 0) {
                        return res.json(responseData("USER_IS_LOCKED", {}, req, false));
                    }
                    if (userStatus.findIndex((item) => item === "suspend") >= 0) {
                        return res.json(responseData("USER_IS_SUSPENEDED", {}, req, false));
                    }
                }

                if (admin.status === 'suspend') {
                    return res.json(responseData("USER_IS_SUSPENEDED", {}, req, false));
                }
                else if (admin.status === 'locked') {
                    return res.json(responseData("USER_IS_LOCKED", {}, req, false));
                }
                else if (admin.status === 'cheater') {
                    return res.json(responseData("USER_IS_LOCKED", {}, req, false));
                }

                if (req.body?.website && admin.userType != 'owner') {
                    const subOwnerData = await User.findOne({ _id: admin.userType == "sub_owner" ? new ObjectId(admin?._id) : new ObjectId(admin?.subOwnerId) }).select({ _id: 1, website: 1 });
                    if (!isEmpty(subOwnerData)) {
                        if (subOwnerData?.website !== website) {
                            return res.json(responseData("INVALID_LOGIN", {}, req, false));
                        }
                    }
                }

                if (admin.userType != 'owner') {
                    await triggerMethod.forceLogout({ user_id: admin._id, uniqueId });
                    if (admin.uniqueId === uniqueId) {
                        throw new Error('UNIQUEId_ALREADY_REGISTERED');
                    }
                }

                bcrypt.compare(password, admin.password, async (err, response) => {
                    if (err)
                        return res
                            .json(responseData("INVALID_LOGIN", {}, req, false));
                    if (!response)
                        return res.json(responseData("INVALID_LOGIN", {}, req, false));

                    // const resp = await triggerMethod.forceLogout({user_id: admin._id, uniqueId});
                    // // console.log('forceLogout resp',resp);

                    let adminValue = await Admin.findByIdAndUpdate({
                        _id: admin.id
                    },
                        {
                            $set: {
                                uniqueId,
                                isOnline: 1,
                                lastIp: req.ip
                            }
                        },
                        { returnOriginal: false })
                        .select({
                            _id: 1,
                            uniqueId: 1,
                            userType: 1,
                            email: 1,
                            phone: 1,
                            username: 1,
                            firstName: 1,
                            lastName: 1,
                            totalCoins: 1,
                            website: 1,
                            createdById: 1,
                            authority: 1,
                            timeZone: 1,
                            status: 1,
                            timeZone: 1,
                            currency: 1,
                            timeZoneOffset: 1,
                            usedFor: 1
                        });
                    const adminData = adminValue.toJSON()
                    delete adminData["password"];
                    let deviceTokens = generateAdminAuthToken(adminData);
                    saveActivity(req, adminData._id)
                    // // console.log('ACCOUNT_LOGIN resp',adminData);
                    return res.json(responseData("ACCOUNT_LOGIN", { ...adminData, ...deviceTokens }, req, true));
                });
            } else {
                return res.json(responseData("ADMIN_NOT_FOUND", {}, req, false));
            }
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    refresh_token: async (req, res) => {
        try {
            let { refresh_token } = req.body;
            if (!refresh_token) { return res.json(responseData("REF_TOKEN", [], req, false)); }
            let deviceTokens = reGenerateAuthTokenHelper(refresh_token);
            // return res.json(responseData("TOKEN_REGENERATE", deviceTokens, req, true));
            if (deviceTokens) {
                return res.json(responseData("TOKEN_REGENERATE", deviceTokens, req, true));
            } else {
                return res.status(403).json(responseData("INVALID_REF_TOKEN", deviceTokens, req, false));
            }
        } catch (error) {
            return res.status(403).json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    update_reference_amount: async (req, res) => {
        try {
            const { reference_amount, user_id, password } = req.body;
            const { _id } = req.user;
            const admin = await Admin.findOne({ _id })
            if (!admin) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const match = await bcrypt.compare(password, admin.password)
            if (match) {
                if (!reference_amount) { return res.json(responseData("reference_amount_required", [], req, false)); };
                await Admin.findOneAndUpdate({ _id: ObjectId(user_id) }, { $set: { creditReference: reference_amount } });
                return res.json(responseData("reference_amount", { creditReference: reference_amount }, req, true));
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (error) {
            // console.log('error--',error)
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const _id = (req.query?.user_id) ? req.query?.user_id : req?.user?._id;
            const admin = await Admin.findOne({ _id: req?.user?._id })
            const match = await bcrypt.compare(oldPassword, admin.password)
            if (match) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newPassword, salt, async function (err, hash) {
                        if (err || !hash) {
                            return res.json(responseData("ERROR_OCCUR", {}, req, false));
                        } else {
                            await Admin.findOneAndUpdate({ _id }, { password: hash });
                            return res.json(responseData("PASSWORD_CHANGED", {}, req, true));
                        }
                    });
                });
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    admin_user_list: async (req, res) => {
        try {

            let {
                start_date,
                end_date,
                keyword,
                sort_by,
                sort_type,
                status,
                userType
            } = req.query

            req.query.limit = 10;

            const created_by = (req.query?.created_by) ? req.query?.created_by : req?.user?._id;

            let matchFilter = {}
            let dateFilter = {}

            if (created_by && !keyword) matchFilter.createdById = ObjectId(created_by)
            if (status) matchFilter.status = status;

            if (start_date) {
                const fromDate = moment(new Date(start_date)).utc().startOf('day')
                dateFilter = {
                    ...dateFilter,
                    "$gte": new Date(fromDate),
                }
            }

            if (end_date) {
                const endDate = moment(new Date(end_date)).utc().endOf("day")
                dateFilter = {
                    ...dateFilter,
                    "$lte": new Date(endDate),
                }
            }

            if (end_date || start_date) {
                dateFilter = { "createdAt": dateFilter }
                matchFilter = dateFilter
            }

            if (keyword) {
                // matchFilter.$or = [
                //     { 'firstName': { $regex: keyword, $options: 'i' } },
                //     { 'lastName': { $regex: keyword, $options: 'i' } },
                //     { 'username': { $regex: keyword, $options: 'i' } },
                //     { 'email': { $regex: keyword, $options: 'i' } },
                // ]
                matchFilter.$and = [
                    {
                        $or: [
                            { 'superSeniorId': req?.user?._id },
                            { 'superAgentId': req?.user?._id },
                            { 'superAdminId': req?.user?._id },
                            { 'subOwnerId': req?.user?._id },
                            { 'subAdminId': req?.user?._id },
                            { 'ownerId': req?.user?._id },
                            { 'createdById': req?.user?._id },
                            { 'adminId': req?.user?._id },
                            { 'agentId': req?.user?._id },
                        ]
                    },
                    {
                        $or: [
                            { 'firstName': { $regex: keyword, $options: 'i' } },
                            { 'lastName': { $regex: keyword, $options: 'i' } },
                            { 'username': { $regex: keyword, $options: 'i' } },
                            { 'email': { $regex: keyword, $options: 'i' } },
                        ]
                    }
                ]
            }

            let keyType;

            if (userType === "owner") {
                keyType = "subOwnerId"
            }
            if (userType === "sub_owner") {
                keyType = "superAdminId"
            }
            if (userType === "super_admin") {
                keyType = "adminId"
            }
            if (userType === "admin") {
                keyType = "subAdminId"
            }
            if (userType === "sub_admin") {
                keyType = "superSeniorId"
            }
            if (userType === "senior_super") {
                keyType = "superAgentId"
            }
            if (userType === "super_agent") {
                keyType = "agentId"
            }
            if (userType === "agent") {
                keyType = "userId"
            }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Admin.countDocuments(matchFilter);

            let queryResponse;
            if (typeof (keyType) == "undefined" || !keyType) {
                queryResponse = await Admin.aggregate([
                    {
                        $match: matchFilter
                    },
                    {
                        $sort: { ["createdAt"]: -1 },
                    },
                    {
                        $skip: startIndex
                    },
                    {
                        $limit: limit
                    },
                    {
                        $lookup: {
                            from: 'transactions',
                            let: {
                                addr: '$_id'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$userId', '$$addr'] }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalAmount: { $sum: "$realCutAmount" }
                                    }
                                },
                                {
                                    $sort: { ["_id"]: -1 },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        totalAmount: 1,
                                        createdAt: 1
                                    }
                                }
                            ],
                            as: 'transaction'
                        }
                    },
                    {
                        $unwind: {
                            path: '$transaction',
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            userType: 1,
                            email: 1,
                            phone: 1,
                            username: 1,
                            firstName: 1,
                            lastName: 1,
                            totalCoins: 1,
                            casinoCoins: 1,
                            website: 1,
                            createdById: 1,
                            createdBy: 1,
                            timeZone: 1,
                            exposureLimit: 1,
                            playerBalance: { $ifNull: ["$userData.playerBalance", "$playerBalance"] },
                            availableLimit: 1,
                            creditReference: 1,
                            status: 1,
                            exposure: { $ifNull: ["$userData.playerExposure", "$exposure"] },
                            transaction: 1,
                            betsBlocked: 1
                        }
                    }
                ]);
            } else {
                queryResponse = await Admin.aggregate([
                    {
                        $match: matchFilter
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: "userData",
                            let: {
                                addr: '$_id'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $and: [
                                            { $expr: { $eq: ["$" + keyType, '$$addr'] } },
                                            { $expr: { $eq: ['$userType', "user"] } },
                                        ]
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        playerBalance: { $sum: "$totalCoins" },
                                        playerExposure: { $sum: "$exposure" },
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: '$userData',
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $sort: { ["createdAt"]: -1 },
                    },
                    {
                        $skip: startIndex
                    },
                    {
                        $limit: limit
                    },
                    {
                        $lookup: {
                            from: 'transactions',
                            let: {
                                addr: '$_id'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$userId', '$$addr'] }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalAmount: { $sum: "$realCutAmount" }
                                    }
                                },
                                {
                                    $sort: { ["_id"]: -1 },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        totalAmount: 1,
                                        createdAt: 1
                                    }
                                }
                            ],
                            as: 'transaction'
                        }
                    },
                    {
                        $unwind: {
                            path: '$transaction',
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            userType: 1,
                            email: 1,
                            phone: 1,
                            username: 1,
                            firstName: 1,
                            lastName: 1,
                            totalCoins: 1,
                            casinoCoins: 1,
                            website: 1,
                            createdById: 1,
                            createdBy: 1,
                            timeZone: 1,
                            exposureLimit: 1,
                            playerBalance: { $ifNull: ["$userData.playerBalance", "$playerBalance"] },
                            availableLimit: 1,
                            creditReference: 1,
                            status: 1,
                            exposure: { $ifNull: ["$userData.playerExposure", "$exposure"] },
                            transaction: 1,
                            betsBlocked: 1
                        }
                    }
                ]);
            }

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let balance = await Admin.aggregate([
                {
                    $match: {
                        _id: ObjectId(created_by)
                    }
                },

                {
                    $project: {
                        _id: 1,

                        username: 1,
                        availableLimit: "$availableLimit",
                        totalCoins: "$totalCoins",
                        playerBalance: "$playerBalance",
                        exposure: "$exposure",
                        totalAmount: "$totalCoins",
                        totalAvailableLimit: "$availableLimit",
                        userType: 1,
                        timeZoneOffset: 1,
                        timeZone: 1
                    }
                }
            ]);


            balance = (balance.length > 0) ? balance[0] : [];

            // balance
            const matchPlayerFilter = {};
            let changeIntype = balance?.userType;
            if (changeIntype === 'agent') {
                matchPlayerFilter.agentId = ObjectId(created_by);
            } else if (changeIntype === 'super_agent') {
                matchPlayerFilter.superAgentId = ObjectId(created_by);
            } else if (changeIntype === 'senior_super') {
                matchPlayerFilter.superSeniorId = ObjectId(created_by);
            } else if (changeIntype === 'sub_admin') {
                matchPlayerFilter.subAdminId = ObjectId(created_by);
            } else if (changeIntype === 'super_admin') {
                matchPlayerFilter.superAdminId = ObjectId(created_by);
            } else if (changeIntype === 'admin') {
                matchPlayerFilter.adminId = ObjectId(created_by);
            } else if (changeIntype === 'sub_owner') {
                matchPlayerFilter.subOwnerId = ObjectId(created_by);
            } else if (changeIntype === 'owner') {
                matchPlayerFilter.ownerId = ObjectId(created_by);
            } else {
                matchPlayerFilter.ownerId = "-1";
            }
            matchPlayerFilter.userType = "user";

            const playerBalance = await Admin.aggregate([
                {
                    $match: matchPlayerFilter
                },
                {
                    $group: {
                        _id: 0,
                        sumTotalCoins: { $sum: { "$toDouble": "$totalCoins" } },
                        sumExposure: { $sum: { "$toDouble": "$exposure" } },
                    }
                },
                { $project: { _id: 0, sumTotalCoins: 1, sumExposure: 1 } }
            ]);

            const exposureNTotalBalance = await Admin.aggregate([
                {
                    $match: { createdById: ObjectId(created_by) }
                },
                {
                    $group: {
                        _id: 0,
                        sumCurrentUserTotalCoins: { $sum: { "$toDouble": "$totalCoins" } },
                        sumCurrentUserExposure: { $sum: { "$toDouble": "$exposure" } },
                    }
                },
                { $project: { _id: 0, sumCurrentUserTotalCoins: 1, sumCurrentUserExposure: 1 } }
            ]);

            balance.totalCoins = (exposureNTotalBalance && exposureNTotalBalance.length > 0 && exposureNTotalBalance[0]?.sumCurrentUserTotalCoins) ? exposureNTotalBalance[0]?.sumCurrentUserTotalCoins : 0;
            balance.totalExposure = Math.abs((exposureNTotalBalance && exposureNTotalBalance.length > 0 && exposureNTotalBalance[0]?.sumCurrentUserExposure) ? exposureNTotalBalance[0]?.sumCurrentUserExposure : 0);
            balance.availableLimit = (balance.totalCoins && balance.totalCoins > 0) ? Math.abs(balance.totalCoins) - Math.abs(balance.totalExposure) : 0;

            balance.playerBalance = (playerBalance && playerBalance.length > 0 && playerBalance[0]?.sumTotalCoins) ? playerBalance[0]?.sumTotalCoins : 0;
            balance.exposure = Math.abs((playerBalance && playerBalance.length > 0 && playerBalance[0]?.sumExposure) ? playerBalance[0]?.sumExposure : 0);
            balance.playerPL = 0;
            balance.totalAmount = (balance.totalAmount) ? balance.totalAmount : 0;
            balance.totalAvailableLimit = (balance.totalAvailableLimit) ? balance.totalAvailableLimit : 0;

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
                balance
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    risk_profile_list: async (req, res) => {
        try {
            const created_by = req?.user?._id;
            const matchPlayerFilter = {};
            let changeIntype = req?.user?.userType;
            if (changeIntype === 'agent') {
                matchPlayerFilter.agentId = ObjectId(created_by);
            } else if (changeIntype === 'super_agent') {
                matchPlayerFilter.superAgentId = ObjectId(created_by);
            } else if (changeIntype === 'senior_super') {
                matchPlayerFilter.superSeniorId = ObjectId(created_by);
            } else if (changeIntype === 'sub_admin') {
                matchPlayerFilter.subAdminId = ObjectId(created_by);
            } else if (changeIntype === 'super_admin') {
                matchPlayerFilter.superAdminId = ObjectId(created_by);
            } else if (changeIntype === 'admin') {
                matchPlayerFilter.adminId = ObjectId(created_by);
            } else if (changeIntype === 'sub_owner') {
                matchPlayerFilter.subOwnerId = ObjectId(created_by);
            } else if (changeIntype === 'owner') {
                matchPlayerFilter.ownerId = ObjectId(created_by);
            } else {
                matchPlayerFilter.ownerId = "-1";
            }

            const sessionBet = await SessionBet.distinct('userId', { isDeclared: false });
            const sportBookBet = await SportBookBet.distinct('userId', { isDeclared: false });
            const bets = await Bet.distinct('userId', { isDeclared: false });

            const finalBetData = [...sessionBet, ...sportBookBet, ...bets];
            let uniqueItems = (finalBetData && finalBetData.length > 0) ? [...new Set(finalBetData)] : [];

            const exposure = await Admin.aggregate([
                {
                    $match: {
                        ...matchPlayerFilter,
                        _id: { $in: uniqueItems }
                        // exposure:{$gt:0}
                        // $or:[
                        //         { '_id': ObjectId(_id) },
                        //         { '_id': _id },
                        //         { 'username':_id },
                        //     ]
                    }
                },
                {
                    $sort: { ["exposure"]: -1 },
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        owner: 1,
                        sub_owner: 1,
                        admin: 1,
                        super_admin: 1,
                        sub_admin: 1,
                        super_senior: 1,
                        super_agent: 1,
                        agent: 1,
                        availableLimit: "$availableLimit",
                        totalCoins: "$totalCoins",
                        playerBalance: "$playerBalance",
                        exposure: "$exposure",
                        totalAmount: "$totalCoins",
                        totalAvailableLimit: "$availableLimit",
                        userType: 1,
                        timeZoneOffset: 1,
                        timeZone: 1
                    }
                }
            ]);

            const matched = await Admin.aggregate([
                {
                    $match: {
                        ...matchPlayerFilter,
                        totalCoins: { $gt: 0 },
                        exposure: { $gt: 0 }
                    }
                },
                {
                    $lookup: {
                        from: 'bets',
                        as: "betData",
                        let: {
                            addr: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$userId', '$$addr'] },
                                    isDeclared: false,
                                    isMatched: true,
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    amount: { $sum: "$profitAmount" },
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    amount: 1
                                }
                            },

                        ]
                    }
                },
                {
                    $sort: { exposure: -1, totalCoins: -1 },
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        owner: 1,
                        sub_owner: 1,
                        admin: 1,
                        super_admin: 1,
                        sub_admin: 1,
                        super_senior: 1,
                        super_agent: 1,
                        agent: 1,
                        availableLimit: "$availableLimit",
                        totalCoins: "$totalCoins",
                        playerBalance: "$playerBalance",
                        exposure: "$exposure",
                        totalAmount: "$totalCoins",
                        totalAvailableLimit: "$availableLimit",
                        userType: 1,
                        timeZoneOffset: 1,
                        timeZone: 1
                    }
                }
            ]);

            return res.json(responseData("GET_LIST", { matched, exposure }, req, true));
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    locked_user_list: async (req, res) => {
        try {
            const created_by = req?.user?._id;
            const matchPlayerFilter = {};
            let changeIntype = req?.user?.userType;
            if (changeIntype === 'agent') {
                matchPlayerFilter.agentId = ObjectId(created_by);
            } else if (changeIntype === 'super_agent') {
                matchPlayerFilter.superAgentId = ObjectId(created_by);
            } else if (changeIntype === 'senior_super') {
                matchPlayerFilter.superSeniorId = ObjectId(created_by);
            } else if (changeIntype === 'sub_admin') {
                matchPlayerFilter.subAdminId = ObjectId(created_by);
            } else if (changeIntype === 'super_admin') {
                matchPlayerFilter.superAdminId = ObjectId(created_by);
            } else if (changeIntype === 'admin') {
                matchPlayerFilter.adminId = ObjectId(created_by);
            } else if (changeIntype === 'sub_owner') {
                matchPlayerFilter.subOwnerId = ObjectId(created_by);
            } else if (changeIntype === 'owner') {
                matchPlayerFilter.ownerId = ObjectId(created_by);
            } else {
                matchPlayerFilter.ownerId = "-1";
            }
            matchPlayerFilter.userType = "user";
            matchPlayerFilter.status = "locked";

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Admin.countDocuments(matchPlayerFilter);

            const queryResponse = await Admin.aggregate([
                {
                    $match: matchPlayerFilter
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$ownerId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'owner'
                    }
                },
                {
                    $unwind: {
                        path: '$owner',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$subOwnerId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'sub_owner'
                    }
                },
                {
                    $unwind: {
                        path: '$sub_owner',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$adminId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'admin'
                    }
                },
                {
                    $unwind: {
                        path: '$admin',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$superAdminId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'super_admin'
                    }
                },
                {
                    $unwind: {
                        path: '$super_admin',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$subAdminId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'sub_admin'
                    }
                },
                {
                    $unwind: {
                        path: '$sub_admin',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$superSeniorId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'super_senior'
                    }
                },
                {
                    $unwind: {
                        path: '$super_senior',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$superAgentId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'super_agent'
                    }
                },
                {
                    $unwind: {
                        path: '$super_agent',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$agentId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'agent'
                    }
                },
                {
                    $unwind: {
                        path: '$agent',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $sort: { ["createdAt"]: -1 },
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 1,
                        owner: 1,
                        sub_owner: 1,
                        admin: 1,
                        super_admin: 1,
                        sub_admin: 1,
                        super_senior: 1,
                        super_agent: 1,
                        username: 1,
                        agent: 1,
                        userType: 1,
                        timeZoneOffset: 1,
                        timeZone: 1,
                        status: 1
                    }
                }
            ]);

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    match_profile_list: async (req, res) => {
        try {
            const created_by = req?.query?.userId;
            const betType = (req?.query?.betType) ? req?.query?.betType : "betfaire";
            const matchPlayerFilter = {};
            let changeIntype = req?.query?.userType;
            let keyType;
            if (changeIntype === 'agent') {
                matchPlayerFilter.agentId = ObjectId(created_by);
                keyType = "userId"
            } else if (changeIntype === 'super_agent') {
                matchPlayerFilter.superAgentId = ObjectId(created_by);
                keyType = "agentId"
            } else if (changeIntype === 'senior_super') {
                matchPlayerFilter.superSeniorId = ObjectId(created_by);
                keyType = "superAgentId"
            } else if (changeIntype === 'sub_admin') {
                matchPlayerFilter.subAdminId = ObjectId(created_by);
                keyType = "superSeniorId"
            } else if (changeIntype === 'super_admin') {
                matchPlayerFilter.superAdminId = ObjectId(created_by);
                keyType = "adminId"
            } else if (changeIntype === 'admin') {
                matchPlayerFilter.adminId = ObjectId(created_by);
                keyType = "subAdminId"
            } else if (changeIntype === 'sub_owner') {
                matchPlayerFilter.subOwnerId = ObjectId(created_by);
                keyType = "superAdminId"
            } else if (changeIntype === 'owner') {
                matchPlayerFilter.ownerId = ObjectId(created_by);
                keyType = "subOwnerId"
            } else {
                matchPlayerFilter.ownerId = "-1";
            }

            // console.log('matchPlayerFilter',matchPlayerFilter, created_by)

            // matchPlayerFilter.userType =  "user";
            const matchFilter = {};
            matchFilter.createdById = ObjectId(created_by);

            let matchExist = await Match.findOne({
                eventId: req?.query?.eventId
            });

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let BetFairS1;
            let BetFairS2;
            let BetFairS3;
            if (betType == "bookmaker") {
                BetFairS1 = (matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[0] && matchExist?.jsonBookmakerData[0]?.SelectionId) ? matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[0] && matchExist?.jsonBookmakerData[0]?.SelectionId : null;
                BetFairS2 = (matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[1] && matchExist?.jsonBookmakerData[1]?.SelectionId) ? matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[1] && matchExist?.jsonBookmakerData[1]?.SelectionId : null;
                BetFairS3 = (matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[2] && matchExist?.jsonBookmakerData[2]?.SelectionId) ? matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[2] && matchExist?.jsonBookmakerData[2]?.SelectionId : null;
            } else {
                BetFairS1 = (matchExist?.jsonData && matchExist?.jsonData[0] && matchExist?.jsonData[0]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[0] && matchExist?.jsonData[0]?.SelectionId : null;
                BetFairS2 = (matchExist?.jsonData && matchExist?.jsonData[1] && matchExist?.jsonData[1]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[1] && matchExist?.jsonData[1]?.SelectionId : null;
                BetFairS3 = (matchExist?.jsonData && matchExist?.jsonData[2] && matchExist?.jsonData[2]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[2] && matchExist?.jsonData[2]?.SelectionId : null;
            }

            const exposure = await Admin.aggregate([
                {
                    $match: {
                        ...matchFilter,
                        _id: { $in: await Bet.distinct(keyType, { ...matchPlayerFilter, isDeclared: false, eventId: req?.query?.eventId }) }
                    }
                },
                {
                    $sort: { ["exposure"]: -1 },
                },
                {
                    $project: {
                        _id: 1,
                        ownerId: 1,
                        subOwnerId: 1,
                        adminId: 1,
                        superAdminId: 1,
                        subAdminId: 1,
                        superSeniorId: 1,
                        superAgentId: 1,
                        agentId: 1,
                        username: 1,
                        owner: 1,
                        sub_owner: 1,
                        admin: 1,
                        super_admin: 1,
                        sub_admin: 1,
                        super_senior: 1,
                        super_agent: 1,
                        agent: 1,
                        availableLimit: "$availableLimit",
                        totalCoins: "$totalCoins",
                        playerBalance: "$playerBalance",
                        exposure: "$exposure",
                        totalAmount: "$totalCoins",
                        totalAvailableLimit: "$availableLimit",
                        userType: 1,
                        timeZoneOffset: 1,
                        timeZone: 1
                    }
                }
            ]);

            const positionArray = [];
            async.eachSeries(exposure, async (item, callback) => {
                // console.log('item',item);
                const matchPlayerFilter = {};
                let changeIntype = item.userType;
                let keyType;
                if (changeIntype === 'agent') {
                    matchPlayerFilter.agentId = ObjectId(item._id);
                    keyType = "agentId"
                } else if (changeIntype === 'super_agent') {
                    matchPlayerFilter.superAgentId = ObjectId(item._id);
                    keyType = "superAgentId"
                } else if (changeIntype === 'senior_super') {
                    matchPlayerFilter.superSeniorId = ObjectId(item._id);
                    keyType = "superSeniorId"
                } else if (changeIntype === 'sub_admin') {
                    matchPlayerFilter.subAdminId = ObjectId(item._id);
                    keyType = "subAdminId"
                } else if (changeIntype === 'super_admin') {
                    matchPlayerFilter.superAdminId = ObjectId(item._id);
                    keyType = "superAdminId"
                } else if (changeIntype === 'admin') {
                    matchPlayerFilter.adminId = ObjectId(item._id);
                    keyType = "adminId"
                } else if (changeIntype === 'sub_owner') {
                    matchPlayerFilter.subOwnerId = ObjectId(item._id);
                    keyType = "subOwnerId"
                } else if (changeIntype === 'user') {
                    matchPlayerFilter.userId = ObjectId(item._id);
                    keyType = "userId"
                } else {
                    matchPlayerFilter.ownerId = ObjectId(item._id);
                    keyType = "ownerId"
                }
                const finalData = [
                    { "selectionId": BetFairS1, position: 0, lay_position: 0 },
                    { "selectionId": BetFairS2, position: 0, lay_position: 0 },
                    { "selectionId": BetFairS3, position: 0, lay_position: 0 }
                ];

                const bets = await Bet.distinct("matchBetId", { ...matchPlayerFilter, isDeclared: false, eventId: req?.query?.eventId });
                // console.log('bets',bets, {...matchPlayerFilter,isDeclared: false, eventId:req?.query?.eventId})
                const BetFairBackS1Data = await BetPosition.aggregate([
                    {
                        $match: {
                            eventId: req?.query?.eventId,
                            marketId: matchExist?.marketId,
                            selectionId: `${BetFairS1}`,
                            matchBetId: { $in: bets },
                        }
                    },
                    {
                        $group: {
                            _id: "$userId",
                            positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                            positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                        }
                    },
                    {
                        $project: { _id: 1, selectionId: `${BetFairS1}`, positionProfitAmount: 1, positionLoseAmount: 1 }
                    }
                ]);

                const BetFairBackS2Data = await BetPosition.aggregate([
                    {
                        $match: {
                            eventId: req?.query?.eventId,
                            marketId: matchExist?.marketId,
                            selectionId: `${BetFairS2}`,
                            matchBetId: { $in: bets },
                        }
                    },
                    {
                        $group: {
                            _id: "$userId",
                            positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                            positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                        }
                    },
                    {
                        $project: { _id: 1, selectionId: `${BetFairS2}`, positionProfitAmount: 1, positionLoseAmount: 1 }
                    }
                ]);

                const BetFairBackS3Data = BetPosition.aggregate([
                    {
                        $match: {
                            eventId: req?.query?.eventId,
                            matchBetId: { $in: bets },
                            marketId: matchExist?.marketId,
                            selectionId: `${BetFairS3}`
                        }
                    },
                    {
                        $group: {
                            _id: "$userId",
                            positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                            positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                        }
                    },
                    { $project: { _id: 1, selectionId: `${BetFairS3}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
                ]);
                if (BetFairBackS1Data && BetFairBackS1Data.length) {
                    if (BetFairBackS1Data[0].positionProfitAmount > BetFairBackS1Data[0].positionLoseAmount) {
                        finalData[0].position = BetFairBackS1Data[0].positionProfitAmount - BetFairBackS1Data[0].positionLoseAmount;
                    } else {
                        let losAmt = BetFairBackS1Data[0].positionLoseAmount - BetFairBackS1Data[0].positionProfitAmount;
                        finalData[0].position = -losAmt;
                    }
                }

                if (BetFairBackS2Data && BetFairBackS2Data.length) {
                    if (BetFairBackS2Data[0].positionProfitAmount > BetFairBackS2Data[0].positionLoseAmount) {
                        finalData[1].position = BetFairBackS2Data[0].positionProfitAmount - BetFairBackS2Data[0].positionLoseAmount;
                    } else {
                        let losAmt = BetFairBackS2Data[0].positionLoseAmount - BetFairBackS2Data[0].positionProfitAmount;
                        finalData[1].position = -losAmt;
                    }
                }

                if (BetFairBackS3Data && BetFairBackS3Data.length) {
                    if (BetFairBackS3Data[0].positionProfitAmount > BetFairBackS3Data[0].positionLoseAmount) {
                        finalData[2].position = BetFairBackS3Data[0].positionProfitAmount - BetFairBackS3Data[0].positionLoseAmount;
                    } else {
                        let losAmt = BetFairBackS3Data[0].positionLoseAmount - BetFairBackS3Data[0].positionProfitAmount;
                        finalData[2].position = -losAmt;
                    }
                }

                positionArray.push({ 'position': finalData, eventId: req?.query?.eventId, ...item });

            }, function (err) {
                if (err) {
                    console.log('err-------------', err)
                    return res.json(responseData("ERROR_OCCUR", err, req, false));
                }
                // console.log('done all', positionArray)
                // return res.json(responseData("BET_POSITION",{match:matchExist,position:positionArray}, req, true));
                return res.json(responseData("GET_LIST", positionArray, req, true));
            }
            );
        } catch (err) {
            // console.log('err0',err)
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    profile: async (req, res) => {
        try {
            const _id = (req.query?.user_id) ? req.query?.user_id : req?.user?._id;

            let adminQuery = await Admin.aggregate([
                {
                    $match: {
                        $or: [
                            { '_id': ObjectId(_id) },
                            { '_id': _id },
                            { 'username': _id },
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$ownerId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'owner'
                    }
                },
                {
                    $unwind: {
                        path: '$owner',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$subOwnerId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'sub_owner'
                    }
                },
                {
                    $unwind: {
                        path: '$sub_owner',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$adminId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'admin'
                    }
                },
                {
                    $unwind: {
                        path: '$admin',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$superAdminId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'super_admin'
                    }
                },
                {
                    $unwind: {
                        path: '$super_admin',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$subAdminId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'sub_admin'
                    }
                },
                {
                    $unwind: {
                        path: '$sub_admin',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$superSeniorId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'super_senior'
                    }
                },
                {
                    $unwind: {
                        path: '$super_senior',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$superAgentId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'super_agent'
                    }
                },
                {
                    $unwind: {
                        path: '$super_agent',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$agentId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'agent'
                    }
                },
                {
                    $unwind: {
                        path: '$agent',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userType: 1,
                        email: 1,
                        phone: 1,
                        username: 1,
                        firstName: 1,
                        lastName: 1,
                        totalCoins: 1,
                        website: 1,
                        createdById: 1,
                        createdBy: 1,
                        timeZone: 1,
                        exposureLimit: 1,
                        playerBalance: 1,
                        availableLimit: 1,
                        totalCoins: 1,
                        creditReference: 1,
                        status: 1,
                        exposure: 1,
                        owner: 1,
                        sub_owner: 1,
                        admin: 1,
                        super_admin: 1,
                        sub_admin: 1,
                        super_senior: 1,
                        super_agent: 1,
                        agent: 1,
                        timeZoneOffset: 1,
                        commission: 1
                    }
                }
            ]);

            const data = (adminQuery && adminQuery.length > 0) ? adminQuery[0] : {};

            return res.json(responseData("profile", data, req, true));
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    amount: async (req, res) => {
        try {
            const _id = (req.query?.id) ? req.query?.id : req?.user?._id;
            const totalAMT = await Transaction.aggregate([
                {
                    $match: { userId: ObjectId(_id) }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            await Admin.findOneAndUpdate({
                _id: ObjectId(_id)
            },
                {
                    $set: {
                        totalCoins: totalAMT.length > 0 ? totalAMT[0].totalAmount : 0,
                    }
                });
            // console.log('totalAMT.length > 0 ? totalAMT[0].totalAmount : 0',totalAMT.length > 0 ? totalAMT[0].totalAmount : 0)
            let admin = await Admin.findOne({ _id }).select({ _id: 1, totalCoins: 1 });
            return res.json(responseData("amount", { totalCoins: admin?.totalCoins || 0 }, req, true));
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    add_admin: async (req, res) => {
        try {

            // emailExistence.check(req.body.email, async(error, response) => {

            // if(response){
            const {
                email,
                username,
                password,
                // phone,
                // firstName,
                // lastName,
                timeZone,
                createdBy
            } = req.body;
            const checkUser = await Admin.findById({ _id: ObjectId(createdBy) });
            if (!checkUser) {
                return res.json(
                    responseData("invalidUser", {}, req, false)
                );
            }
            const usernameUpdate = username.toLowerCase();
            const checkUsername = await Admin.findOne({ username: usernameUpdate })
            if (checkUsername) {
                return res.json(
                    responseData("USERNAME_ALREADY_REGISTERED", {}, req, false)
                );
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err || !hash) {
                            return res.json(responseData("ERROR", {}, req, false));
                        } else {
                            const userType = getUserType(checkUser.userType);
                            if (!userType) {
                                return res.json(
                                    responseData("INVALID_USERTYPE", {}, req, false)
                                );
                            }
                            let changeIntype = checkUser.userType;
                            let changeInId = checkUser._id;

                            let ownerId = checkUser?.ownerId;
                            let subOwnerId = checkUser?.subOwnerId;
                            let adminId = checkUser?.adminId;
                            let superAdminId = checkUser?.superAdminId;
                            let subAdminId = checkUser?.subAdminId;
                            let superSeniorId = checkUser?.superSeniorId;
                            let superAgentId = checkUser?.superAgentId;
                            let agentId = checkUser?.agentId;
                            let userId = checkUser?.userId;

                            // // // console.log('changeIntype userType',userType, changeIntype)

                            // "owner","sub_owner", "admin", "super_admin","sub_admin",'senior_super','super_agent','agent','user'
                            if (changeIntype === 'user') {
                                userId = changeInId;
                            } else if (changeIntype === 'agent') {
                                agentId = changeInId;
                            } else if (changeIntype === 'super_agent') {
                                superAgentId = changeInId;
                            } else if (changeIntype === 'senior_super') {
                                superSeniorId = changeInId;
                            } else if (changeIntype === 'sub_admin') {
                                subAdminId = changeInId;
                            } else if (changeIntype === 'super_admin') {
                                superAdminId = changeInId;
                            } else if (changeIntype === 'admin') {
                                adminId = changeInId;
                            } else if (changeIntype === 'sub_owner') {
                                subOwnerId = changeInId;
                            } else if (changeIntype === 'owner') {
                                ownerId = changeInId;
                            }

                            const user = await Admin.create({
                                username: usernameUpdate,
                                userType,
                                // firstName,
                                // lastName,
                                email,
                                // phone,
                                timeZone: timeZone,
                                ip_address: req.body?.ip_address,
                                website: req.body?.website,
                                timeZoneOffset: req.body?.offset,
                                password: hash,
                                pwd: (userType == 'user') ? req.body?.password : false,
                                createdById: checkUser?._id,
                                createdBy: checkUser?.userType,
                                totalCoins: 0,
                                commission: req.body?.commission || 0,
                                exposureLimit: req.body?.exposureLimit || 0,
                                lastIp: req.ip,
                                ownerId,
                                subOwnerId,
                                adminId,
                                superAdminId,
                                subAdminId,
                                superSeniorId,
                                superAgentId,
                                agentId,
                            });

                            await Admin.findOneAndUpdate({ _id: ObjectId(user?._id) }, { $set: { userId: user?._id } })

                            if (userType == 'user' && req.body?.amount > 0 && Math.abs(Math.abs(checkUser?.totalCoins) - Math.abs(checkUser?.exposure)) >= req.body?.amount) {
                                let ispData = null;
                                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                                    ispData = payload
                                });
                                await Transaction.create({
                                    transactionType: "credit",
                                    ownerId,
                                    subOwnerId,
                                    adminId,
                                    superAdminId,
                                    subAdminId,
                                    superSeniorId,
                                    superAgentId,
                                    agentId,
                                    userId: user?._id,
                                    createdBy: checkUser?._id,
                                    amount: Math.abs(req.body?.amount),
                                    realCutAmount: Math.abs(req.body?.amount),
                                    oldBalance: 0,
                                    newBalance: Math.abs(req.body?.amount),
                                    status: 'success',
                                    ip: req.ip,
                                    location: ispData ? ispData.country.en : null,
                                    geolocation: {
                                        type: 'Point',
                                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                    },
                                    userAgent: req.get('User-Agent')
                                });

                                const totalAMT = await Transaction.aggregate([
                                    {
                                        $match: { userId: ObjectId(user?._id), forCasinoBet: 0 }
                                    },
                                    {
                                        $group: {
                                            _id: null,
                                            totalAmount: { $sum: "$realCutAmount" }
                                        }
                                    }
                                ]);
                                const oldBalance = totalAMT.length > 0 ? totalAMT[0].totalAmount : 0;

                                await Transaction.create({
                                    transactionType: "debit",
                                    userId: checkUser?._id,
                                    amount: Math.abs(req.body?.amount),
                                    realCutAmount: - Math.abs(req.body?.amount),
                                    oldBalance,
                                    newBalance: (oldBalance > 0) ? Math.abs(oldBalance) - Math.abs(req.body?.amount) : oldBalance,
                                    status: 'success',
                                    ip: req.ip,
                                    location: ispData ? ispData.country.en : null,
                                    geolocation: {
                                        type: 'Point',
                                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                    },
                                    userAgent: req.get('User-Agent')
                                });
                                await Admin.findOneAndUpdate({ _id: ObjectId(user?._id) }, { $set: { totalCoins: req.body?.amount } })
                                await Admin.findOneAndUpdate({ _id: ObjectId(createdBy) }, { $set: { totalCoins: checkUser?.totalCoins - req.body?.amount } })
                            }
                            let admin = await Admin.findOne({ _id: user?._id }).select({ _id: 1, userType: 1, email: 1, phone: 1, username: 1, firstName: 1, lastName: 1, totalCoins: 1, website: 1, createdById: 1, createdBy: 1, timeZone: 1 });
                            return res.json(responseData("ADD_SUCCESS", admin, req, true));
                        }
                    });
                });
            }

            //     }else{
            //         return res.json(responseData("EMAIL_NOT_EXIST", {}, req, false));
            //     }
            // });

        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    edit_admin: async (req, res) => {
        try {
            const { first_name, last_name, email, phone } = req.body;
            const { _id } = req.params;
            const updateValues = {}
            if (first_name) updateValues.first_name = first_name;
            if (last_name) updateValues.last_name = last_name;
            if (email) updateValues.email = email;
            if (phone) updateValues.phone = phone
            const adminUpdate = await Admin.findOneAndUpdate({ _id }, { $set: updateValues }, { new: true })
            if (adminUpdate) {
                return res.json(responseData("USER_UPDATE_SUCCESS", adminUpdate, req, true));
            } else {
                return res.json(responseData("ERROR_OCCUR", {}, req, false));
            }
        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    update_status: async (req, res) => {
        try {

            const { status, password } = req.body;
            const arr = ["active", "suspend", "locked"];
            if (!arr.includes(status)) {
                return res.json(
                    responseData("INVALID_STATUS", {}, req, false)
                );
            }
            let adminExist = await Admin.findById({ _id: ObjectId(req?.user?._id) });
            const match = await bcrypt.compare(password, adminExist.password)
            if (!match) {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
            const resp = await Admin.updateOne({ _id: req.params.id }, { $set: { status } });
            await Admin.updateOne({ subOwnerId: req.params.id }, { $set: { status } });
            await Admin.updateOne({ adminId: req.params.id }, { $set: { status } });
            await Admin.updateOne({ superAdminId: req.params.id }, { $set: { status } });
            await Admin.updateOne({ subAdminId: req.params.id }, { $set: { status } });
            await Admin.updateOne({ superSeniorId: req.params.id }, { $set: { status } });
            await Admin.updateOne({ superAgentId: req.params.id }, { $set: { status } });
            await Admin.updateOne({ agentId: req.params.id }, { $set: { status } });
            if (resp.modifiedCount) {
                return res.json(responseData("STATUS_UPDATE", {}, req, true));
            } else {
                return res.json(responseData("NOT_FOUND", {}, req, false));
            }

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));;
        }
    },
    user_meta_data: async (req, res) => {
        try {

            let websiteList = await Website.find({ createdById: ObjectId(req.user._id) });
            let timeZoneList = timeZoneListToSend;
            return res.json(responseData("WEBSITE_LIST", { websiteList, timeZoneList }, req, true));

        } catch (err) {
            return res.json(responseData(err.message, {}, req, false));
        }
    },
    activity_logs: async (req, res) => {
        try {

            let { user_id } = req.query

            user_id = user_id ? user_id : req.user._id

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Activity.countDocuments({ userId: ObjectId(user_id) });

            let query = await Activity.find({ userId: ObjectId(user_id) })
                .sort({ 'activityDate': -1 })
                .skip(startIndex)
                .limit(limit)

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseObj = {
                data: query,
                count: query.length,
                ...paginateObj,
            }

            return res.json(responseData("ACTIVITY_LIST", responseObj, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    save_coin_owner: async (req, res) => {
        try {
            const { coins, mypassword } = req.body;
            const { _id } = req.user;
            const admin = await Admin.findOne({ _id })
            if (!admin) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const match = await bcrypt.compare(mypassword, admin.password)
            if (match) {

                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });

                let walletExist = await Wallet.findOne({
                    userId: ObjectId(req.user._id)
                })

                let oldBalance;
                let newBalance;

                if (!walletExist) {

                    oldBalance = 000
                    newBalance = Math.abs(coins)

                    await Wallet.create({
                        transactionType: "credit",
                        userId: req.user._id,
                        balance: Math.abs(coins),
                        oldBalance: 000,
                        newBalance: Math.abs(coins),
                        status: false,
                        isDeleted: false
                    })

                } else {

                    oldBalance = walletExist.newBalance
                    newBalance = walletExist.newBalance + Math.abs(coins)

                    await Wallet.findByIdAndUpdate({
                        _id: ObjectId(walletExist)
                    },
                        {
                            $set: {
                                transactionType: 'credit',
                                userId: req.user._id,
                                balance: Math.abs(coins),
                                oldBalance: oldBalance,
                                newBalance: newBalance
                            }
                        })

                }

                await Transaction.create({
                    transactionType: "credit",
                    userId: req.user._id,
                    amount: Math.abs(coins),
                    realCutAmount: Math.abs(coins),
                    status: 'success',
                    ip: req.ip,
                    location: ispData ? ispData.country.en : null,
                    geolocation: {
                        type: 'Point',
                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                    },
                    oldBalance: oldBalance,
                    newBalance: newBalance,
                    userAgent: req.get('User-Agent')
                });

                await Admin.findOneAndUpdate({
                    _id: ObjectId(_id)
                },
                    {
                        $inc: {
                            totalCoins: coins
                        }
                    });

                const resp = triggerMethod.coinUpdate({ user_id: req.user._id, newBalance });
                // // console.log('coinUpdate resp',resp)
                return res.json(responseData("COINS_UPDATED", { totalCoins: newBalance }, req, true));
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (err) {
            // // console.log('err',err)
            return res.json(responseData("ERROR_OCCUR", err.message, req, false));;
        }
    },
    deposit_amount: async (req, res) => {
        try {
            const { coins, userId, mypassword } = req.body;
            const { _id } = req.user;
            const user = await Admin.findOne({ _id: userId })
            if (!user) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const admin = await Admin.findOne({ _id })
            if (!admin) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const match = await bcrypt.compare(mypassword, admin.password)
            if (match) {

                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });

                // let walletExist = await Wallet.findOne({
                //     userId:ObjectId(req.user._id)
                // })

                // let oldBalance;
                // let newBalance;

                // if(!walletExist){

                //     oldBalance = 000
                //     newBalance = coins

                //     await Wallet.create({
                //         transactionType: "credit",
                //         userId: req.user._id,
                //         balance: coins,
                //         oldBalance: 000,
                //         newBalance: coins,
                //         status: false,
                //         isDeleted: false
                //     })

                // }else{

                //     oldBalance = walletExist.newBalance
                //     newBalance = walletExist.newBalance + coins

                //     await Wallet.findByIdAndUpdate({
                //         _id:ObjectId(walletExist)
                //     },
                //     {
                //         $set:{
                //             transactionType: 'credit',
                //             userId: req.user._id,
                //             balance: coins,
                //             oldBalance: oldBalance,
                //             newBalance: newBalance
                //         }
                //     })

                // }

                // await Transaction.create({
                //     transactionType: "credit",
                //     userId: req.user._id,
                //     amount: Math.abs(coins),
                //     realCutAmount: Math.abs(coins),
                //     status: 'success',
                //     ip:req.ip,
                //     location:ispData?ispData.country.en:null,
                //     geolocation:{
                //         type:'Point',
                //         coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                //     },
                //     oldBalance: oldBalance,
                //     newBalance: newBalance,
                //     userAgent:req.get('User-Agent')
                // });

                // await Admin.findOneAndUpdate({
                //     _id:ObjectId(_id)
                // },
                // {
                //     $inc:{
                //         totalCoins:coins
                //     }
                // });

                // const resp = triggerMethod.coinUpdate({user_id: req.user._id, newBalance});
                // // // console.log('coinUpdate resp',resp)
                return res.json(responseData("COINS_UPDATED", { totalCoins: 0 }, req, true));
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (error) {
            // // console.log('err',error)
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));;
        }
    },
    search_user: async (req, res) => {
        try {

            let { keyword } = req.query;

            if (!keyword) {
                return res.json(responseData("KEYWORD_IS_MISSING", {}, req, false));
            }

            keyword = keyword.toLowerCase();

            // Pagination
            const page = parseInt(req.body.page, 10) || 1;
            const limit = parseInt(req.body.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let query = await Admin.aggregate([
                {
                    $match: {
                        $and: [
                            { 'username': keyword },
                            {
                                $or: [
                                    { ownerId: ObjectId(req.user._id) },
                                    { subOwnerId: ObjectId(req.user._id) },
                                    { adminId: ObjectId(req.user._id) },
                                    { superAdminId: ObjectId(req.user._id) },
                                    { subAdminId: ObjectId(req.user._id) },
                                    { superSeniorId: ObjectId(req.user._id) },
                                    { superAgentId: ObjectId(req.user._id) },
                                    { agentId: ObjectId(req.user._id) },
                                    { userId: ObjectId(req.user._id) },
                                ]
                            }
                        ]
                    }
                },
                { $sort: { createdAt: 1 } },
                {
                    $facet: {
                        paginatedResults: [
                            { $skip: startIndex },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$ownerId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'owner'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$owner',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$subOwnerId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'sub_owner'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$sub_owner',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$adminId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'admin'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$admin',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$superAdminId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'super_admin'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$super_admin',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$subAdminId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'sub_admin'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$sub_admin',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$superSeniorId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'super_senior'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$super_senior',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$superAgentId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'super_agent'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$super_agent',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: {
                                        addr: '$agentId'
                                    },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$addr'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                userType: 1,
                                                username: 1
                                            }
                                        }
                                    ],
                                    as: 'agent'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$agent',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    createdById: 1,
                                    createdBy: 1,
                                    email: 1,
                                    username: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    image: 1,
                                    isVerified: 1,
                                    isOnline: 1,
                                    status: 1,
                                    isDeleted: 1,
                                    owner: 1,
                                    sub_owner: 1,
                                    admin: 1,
                                    super_admin: 1,
                                    sub_admin: 1,
                                    super_senior: 1,
                                    super_agent: 1,
                                    agent: 1,
                                    totalCoins: 1,
                                    exposure: 1,
                                    pwd: 1,
                                }
                            }
                        ],
                        totalCount: [
                            { $count: 'count' }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: '$totalCount',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        paginatedResults: "$paginatedResults",
                        total:
                        {
                            $cond: [{ $gte: ["$totalCount.count", 0] }, "$totalCount.count", 0]
                        }
                    }
                },
            ])

            let paginateObj = await getPaginateObj(query[0].total, limit, page, startIndex, endIndex)

            let responseObj = {
                data: query[0].paginatedResults,
                count: query[0].paginatedResults.length,
                ...paginateObj
            }

            return res.json(responseData("GET_LIST", responseObj, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));;
        }
    },
    create_website: async (req, res) => {
        try {

            let { name, domain } = req.body

            if (req.user.userType != 'owner') {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }

            const checkWebsite = await Website.findOne({ domain })
            if (checkWebsite) {
                return res.json(
                    responseData("DOMAIN_ALREADY_TAKEN", {}, req, false)
                );
            }

            const result = await Website.create({
                name,
                domain,
                createdById: req.user._id
            })

            return res.json(responseData("SUCCESSFULLY_CREATED", result, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    list_website: async (req, res) => {
        try {

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Website.countDocuments();



            let queryResponse = await Website.aggregate([
                {
                    $match: { createdById: ObjectId(req.user._id) }
                },
                {
                    $sort: { "createdAt": -1 },
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    list_website_setting: async (req, res) => {
        try {

            let { websiteId } = req.query

            if (!req.query.websiteId) {
                return res.json(responseData("INVALID_websiteId", {}, req, false));
            }

            const result = await WebsiteSetting.findOne({ websiteId })
            return res.json(responseData("details", result, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    create_website_setting: async (req, res) => {
        try {

            let { websiteId, telegramContent, telegramContent2, whatsappContent, whatsappContent2, emailContent, emailContent2, skypeContent, instagramContent, facebookContent, telegramShowing, telegramShowing2, whatsappShowing, whatsappShowing2, emailShowing, emailShowing2, skypeShowing, instagramShowing, facebookShowing } = req.body

            if (!req.body.websiteId) {
                return res.json(responseData("INVALID_WEBSITE_ID", {}, req, false));
            }

            const createdById = req.user._id;

            const checkWebsite = await WebsiteSetting.findOne({ websiteId })
            if (checkWebsite) {
                await WebsiteSetting.findOneAndUpdate({ websiteId }, { $set: { createdById, websiteId, telegramContent, telegramContent2, whatsappContent, whatsappContent2, emailContent, emailContent2, skypeContent, instagramContent, facebookContent, telegramShowing, telegramShowing2, whatsappShowing, whatsappShowing2, emailShowing, emailShowing2, skypeShowing, instagramShowing, facebookShowing } });
                const result = await WebsiteSetting.findOne({ websiteId })
                return res.json(responseData("SUCCESSFULLY_UPDATED", result, req, true));
            } else {
                const result = await WebsiteSetting.create({ createdById, websiteId, telegramContent, telegramContent2, whatsappContent, whatsappContent2, emailContent, emailContent2, skypeContent, instagramContent, facebookContent, telegramShowing, telegramShowing2, whatsappShowing, whatsappShowing2, emailShowing, emailShowing2, skypeShowing, instagramShowing, facebookShowing });
                return res.json(responseData("SUCCESSFULLY_CREATED", result, req, true));
            }

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    exposure_list: async (req, res) => {
        try {
            const { userId, userType } = req.query;
            let matchPattern = {
                forBet: 1,
                isDeclared: false
            }
            if (userType === "owner") {
                matchPattern.ownerId = ObjectId(userId)
            }
            if (userType === "sub_owner") {
                matchPattern.subOwnerId = ObjectId(userId)
            }
            if (userType === "super_admin") {
                matchPattern.superAdminId = ObjectId(userId)
            }
            if (userType === "admin") {
                matchPattern.adminId = ObjectId(userId)
            }
            if (userType === "sub_admin") {
                matchPattern.subAdminId = ObjectId(userId)
            }
            if (userType === "senior_super") {
                matchPattern.superSeniorId = ObjectId(userId)
            }
            if (userType === "super_agent") {
                matchPattern.superAgentId = ObjectId(userId)
            }
            if (userType === "agent") {
                matchPattern.agentId = ObjectId(userId)
            }
            if (userType === "user") {
                matchPattern.userId = ObjectId(userId)
            }

            // console.log('matchPattern--',req.query, matchPattern)
            let queryResponse = await Transaction.aggregate([
                {
                    $match: matchPattern
                },
                {
                    $sort: { "createdAt": -1 },
                }
            ])

            let responseCreate = {
                data: queryResponse
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));

        } catch (error) {
            console.log('error.message', error)
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_exposure: async (req, res) => {
        try {
            const { exposure_limit, password, user_id } = req.body;
            const { _id } = req.user;
            const admin = await Admin.findOne({ _id })
            if (!admin) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const match = await bcrypt.compare(password, admin.password);
            if (match) {
                if (!exposure_limit) { return res.json(responseData("exposure_limit_required", [], req, false)); };
                if (!user_id) { return res.json(responseData("user_id", [], req, false)); };
                await User.findOneAndUpdate({ _id: ObjectId(user_id) }, { $set: { exposureLimit: exposure_limit } });
                return res.json(responseData("exposure_limit", { exposureLimit: exposure_limit }, req, true));
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (error) {
            // // console.log('error--',error)
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    update_commission: async (req, res) => {
        try {
            const { commission, password, user_id } = req.body;
            const { _id } = req.user;
            const admin = await Admin.findOne({ _id })
            if (!admin) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const match = await bcrypt.compare(password, admin.password);
            if (match) {
                if (!commission) { return res.json(responseData("commission", [], req, false)); };
                if (!user_id) { return res.json(responseData("user_id", [], req, false)); };
                await User.findOneAndUpdate({ _id: ObjectId(user_id) }, { $set: { commission } });
                return res.json(responseData("exposure_limit", { commission }, req, true));
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (error) {
            // console.log('error--',error)
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    profit_loss: async (req, res) => {
        try {
            let { fromPeriod, toPeriod, gameType } = req.query;

            let regexFilter = {};
            if (fromPeriod) {
                fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                fromPeriod = new Date(fromPeriod)
                // console.log("fromPeriod", fromPeriod)
                regexFilter.timeInserted = { $gte: fromPeriod }
            }
            if (toPeriod) {
                toPeriod = moment(toPeriod).format("MM-DD-YYYY")
                toPeriod = new Date(toPeriod)
                toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
                toPeriod = new Date(toPeriod)
                regexFilter.timeInserted = { $lt: toPeriod }
            }

            regexFilter.isDeclared = false;
            regexFilter.isMatched = true;

            const matchFilter = {};

            let eventType;
            if (gameType == 'casino') {
                eventType = "-1"

            } else if (gameType == 'soccer') {
                eventType = "2"

            } else if (gameType == 'tennis') {
                eventType = "1"

            } else {
                eventType = "4";
            }
            regexFilter.eventType = eventType;

            // // console.log('eventType',eventType);
            let exposure;
            if (gameType == 'fancy') {
                matchFilter._id = { $in: await SessionBet.distinct('userId', { isDeclared: false }) };
                exposure = await Admin.aggregate([
                    {
                        $match: matchFilter
                    },
                    {
                        $lookup: {
                            from: 'session_bets',
                            as: "betData",
                            let: {
                                addr: '$_id'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$userId', '$$addr'] },
                                        isDeclared: false
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        amount: { $sum: "$profitAmount" },
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        amount: 1
                                    }
                                },

                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: '$betData',
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $sort: { "betData.amount": -1 },
                    },
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            amount: "$betData.amount"
                        }
                    }
                ]);
            } else {
                matchFilter._id = { $in: await Bet.distinct('userId', regexFilter) };
                exposure = await Admin.aggregate([
                    {
                        $match: matchFilter
                    },
                    {
                        $lookup: {
                            from: 'bets',
                            as: "betData",
                            let: {
                                addr: '$_id'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$userId', '$$addr'] },
                                        isDeclared: false,
                                        isMatched: true,
                                        eventType
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        amount: { $sum: "$profitAmount" },
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        amount: 1
                                    }
                                },

                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: '$betData',
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $sort: { "betData.amount": -1 },
                    },
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            amount: "$betData.amount"
                        }
                    }
                ]);
            }

            return res.json(responseData("GET_LIST", exposure, req, true));
        } catch (error) {
            // console.log("error", error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    match_profit_loss: async (req, res) => {
        try {
            let { eventId } = req.query;
            let regexFilter = {};
            let matchFilter = {};
            regexFilter.eventId = eventId;
            matchFilter._id = { $in: await Bet.distinct('userId', regexFilter) };

            let matchExist = await Match.findOne({
                eventId
            });

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let exposure = await Admin.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                    }
                }
            ]);

            if (!exposure) {
                return res.json(responseData("NO", [], req, true));
            }

            const BetFairS1 = (matchExist?.jsonData && matchExist?.jsonData[0] && matchExist?.jsonData[0]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[0] && matchExist?.jsonData[0]?.SelectionId : null;
            const BetFairS2 = (matchExist?.jsonData && matchExist?.jsonData[1] && matchExist?.jsonData[1]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[1] && matchExist?.jsonData[1]?.SelectionId : null;
            const BetFairS3 = (matchExist?.jsonData && matchExist?.jsonData[2] && matchExist?.jsonData[2]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[2] && matchExist?.jsonData[2]?.SelectionId : null;

            const positionArray = [];
            async.eachSeries(exposure, (item, callback) => {
                // // console.log('item?._id',item?._id, BetFairS1, BetFairS2)
                BetPosition.aggregate([
                    {
                        //
                        $match: { userId: item?._id, marketId: matchExist?.marketId, selectionId: `${BetFairS1}` }
                    },
                    {
                        $group: {
                            _id: 0,
                            positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                            positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                        }
                    },
                    { $project: { _id: 0, selectionId: `${BetFairS1}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
                ]).then(BetFairBackS1Data => {

                    BetPosition.aggregate([
                        {
                            $match: { userId: item?._id, marketId: matchExist?.marketId, selectionId: `${BetFairS2}` }
                        },
                        {
                            $group: {
                                _id: 0,
                                positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                                positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                            }
                        },
                        { $project: { _id: 0, selectionId: `${BetFairS2}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
                    ]).then(BetFairBackS2Data => {

                        if (BetFairS3) {
                            BetPosition.aggregate([
                                {
                                    $match: { userId: item?._id, marketId: matchExist?.marketId, selectionId: `${BetFairS3}` }
                                },
                                {
                                    $group: {
                                        _id: 0,
                                        positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                                        positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                                    }
                                },
                                { $project: { _id: 0, selectionId: `${BetFairS2}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
                            ]).then(BetFairBackS3Data => {

                                const finaldata = [{ "selectionId": BetFairS1, position: 0, lay_position: 0 }, { "selectionId": BetFairS2, position: 0, lay_position: 0 }, { "selectionId": BetFairS3, position: 0, lay_position: 0 }];
                                // back
                                if (BetFairBackS1Data && BetFairBackS1Data.length) {
                                    if (BetFairBackS1Data[0].positionProfitAmount > BetFairBackS1Data[0].positionLoseAmount) {
                                        finaldata[0].position = BetFairBackS1Data[0].positionProfitAmount - BetFairBackS1Data[0].positionLoseAmount;
                                    } else {
                                        let losAmt = BetFairBackS1Data[0].positionLoseAmount - BetFairBackS1Data[0].positionProfitAmount;
                                        finaldata[0].position = -losAmt;
                                    }
                                }

                                if (BetFairBackS2Data && BetFairBackS2Data.length) {
                                    if (BetFairBackS2Data[0].positionProfitAmount > BetFairBackS2Data[0].positionLoseAmount) {
                                        finaldata[1].position = BetFairBackS2Data[0].positionProfitAmount - BetFairBackS2Data[0].positionLoseAmount;
                                    } else {
                                        let losAmt = BetFairBackS2Data[0].positionLoseAmount - BetFairBackS2Data[0].positionProfitAmount;
                                        finaldata[1].position = -losAmt;
                                    }
                                }

                                if (BetFairBackS3Data && BetFairBackS3Data.length) {
                                    if (BetFairBackS3Data[0].positionProfitAmount > BetFairBackS3Data[0].positionLoseAmount) {
                                        finaldata[2].position = BetFairBackS3Data[0].positionProfitAmount - BetFairBackS3Data[0].positionLoseAmount;
                                    } else {
                                        let losAmt = BetFairBackS3Data[0].positionLoseAmount - BetFairBackS3Data[0].positionProfitAmount;
                                        finaldata[2].position = -losAmt;
                                    }
                                }

                                positionArray.push({ 'position': finaldata, eventId, ...item })

                                callback(null);
                            }).catch(error => {
                                // console.log('error----1',error);
                                return res.json(responseData("ERROR_OCCUR", error, req, false));
                            })

                        } else {

                            const finaldata = [{ "selectionId": BetFairS1, position: 0, lay_position: 0 }, { "selectionId": BetFairS2, position: 0, lay_position: 0 }];
                            // back
                            if (BetFairBackS1Data && BetFairBackS1Data.length) {
                                if (BetFairBackS1Data[0].positionProfitAmount > BetFairBackS1Data[0].positionLoseAmount) {
                                    finaldata[0].position = BetFairBackS1Data[0].positionProfitAmount - BetFairBackS1Data[0].positionLoseAmount;
                                } else {
                                    let losAmt = BetFairBackS1Data[0].positionLoseAmount - BetFairBackS1Data[0].positionProfitAmount;
                                    finaldata[0].position = -losAmt;
                                }
                            }

                            if (BetFairBackS2Data && BetFairBackS2Data.length) {
                                if (BetFairBackS2Data[0].positionProfitAmount > BetFairBackS2Data[0].positionLoseAmount) {
                                    finaldata[1].position = BetFairBackS2Data[0].positionProfitAmount - BetFairBackS2Data[0].positionLoseAmount;
                                } else {
                                    let losAmt = BetFairBackS2Data[0].positionLoseAmount - BetFairBackS2Data[0].positionProfitAmount;
                                    finaldata[1].position = -losAmt;
                                }
                            }

                            positionArray.push({ 'position': finaldata, eventId, ...item })

                            callback(null);
                        }
                    }).catch(error => {
                        // console.log('error----2',error);
                        return res.json(responseData("ERROR_OCCUR", error, req, false));
                    })
                }).catch(error => {
                    // console.log('error------3',error);
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                })
                // callback(null)
            }, function (err) {
                if (err) {
                    // console.log('err-------------',err)
                    return res.json(responseData("ERROR_OCCUR", err, req, false));
                }
                return res.json(responseData("BET_POSITION", { match: matchExist, position: positionArray }, req, true));
            }
            );

            // return res.json(responseData("GET_LIST", positionArray, req, true));
        } catch (error) {
            // console.log("error", error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }

}