const User = require("../../models/user.model");
const CasinoGame = require("../../models/casinoGames.model");
const CasinoProvider = require("../../models/casinoProvider.model");
const Activity = require("../../models/activity.model");
const WebsiteSetting = require("../../models/websiteSetting.model");
const Website = require("../../models/website.models");
const Subscribe = require("../../models/subscribe.model");
const { isEmpty } = require("lodash");
const { responseData } = require("../../helpers/responseData");
let bcrypt = require('bcryptjs');
const { v4 } = require("uuid");
const { generateAuthToken, reGenerateUserAuthTokenHelper, totalExposureAmount, totalAmount, totalMultiMarketExposure, getUserType, generateRandomString } = require("../../helpers/helper")
const { saveActivity, getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const { triggerMethod } = require('../../helpers/socketWork');
const GlobalLimitSetting = require("../../models/globalLimitSetting.model");
const Wallet = require("../../models/wallet.model");
const Transaction = require("../../models/transaction.model");
const CasinoTransaction = require("../../models/casinoTransaction.model");
const { makeid } = require("../../helpers/helper");
const fs = require('fs');
const crypto = require('crypto');

var axios = require('axios').default;
var qs = require('qs');

const apiPath = 'https://tttint.onlinegames22.com/';
const liveApiPath = 'https://api.onlinegames22.com/';
const agent = 'cricinfotech';
const sabaPrefix = '9bx';
const cert = 'md4It4TXGn3xTUxRZ1d';

const javaAgent = 'javaexch';
const javaPrefix = 'jh3';
const javaCert = '4ButmmSYxVe3KKRYKlJ';

const ninexAgent = '9exchenge';
const ninexPrefix = '9bx';
const ninexCert = 'vvrjdmp1YW3J4Rwn2xx';

const betxAgent = 'cricinfotechsingel1';
const betxPrefix = 'uc1';
const betxCert = 'eKclsAqmtUuWYww65ia';

// easytogo code
const easyToGoOP = 'oc91';
const easyToGoSIGN = 'ZoxHM4L7SBd44LDnlE1ZlRgF5wgP1SK8';
const easyToGoApiPath = 'https://api.easytogo123.com';
const easyToGoPROD = "011";

const satelize = require('satelize');
const async = require('async');
const ReferralSetting = require("../../models/referralSetting.models");
const CasinoGames = require("../../models/casinoGames.model");

module.exports = {
    user_login: async (req, res) => {
        try {

            const { username, uniqueId, website } = req.body;
            const usernameUpdate = username.toLowerCase();
            let password = (username == "javademo") ? "Octal@123" : req.body?.password;
            const user = await User.findOne({
                username: usernameUpdate, userType: { $in: ["user"] }
            }).select({
                _id: 1, password: 1, status: 1, uniqueId: 1,
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
            if (!isEmpty(user)) {

                let ObjectIdData = [];
                if (user.ownerId) {
                    ObjectIdData.push(user.ownerId)
                }
                if (user.subOwnerId) {
                    ObjectIdData.push(user.subOwnerId)
                }
                if (user.adminId) {
                    ObjectIdData.push(user.adminId)
                }
                if (user.superAdminId) {
                    ObjectIdData.push(user.superAdminId)
                }
                if (user.subAdminId) {
                    ObjectIdData.push(user.subAdminId)
                }
                if (user.superSeniorId) {
                    ObjectIdData.push(user.superSeniorId)
                }
                if (user.superAgentId) {
                    ObjectIdData.push(user.superAgentId)
                }

                let userStatus = [];

                if (ObjectIdData && ObjectIdData.length > 0) {
                    userStatus = await User.distinct('status', {
                        _id: { $in: ObjectIdData }
                    });
                }

                if (userStatus.findIndex((item) => item === "locked") >= 0) {
                    return res.json(responseData("USER_IS_LOCKED", {}, req, false));
                }
                if (userStatus.findIndex((item) => item === "suspend") >= 0) {
                    return res.json(responseData("USER_IS_SUSPENEDED", {}, req, false));
                }

                if (user.status === 'suspend') {
                    return res.json(responseData("USER_IS_SUSPENEDED", {}, req, false));
                }
                else if (user.status === 'locked') {
                    return res.json(responseData("USER_IS_LOCKED", {}, req, false));
                }
                else if (user.status === 'cheater') {
                    return res.json(responseData("USER_IS_LOCKED", {}, req, false));
                }
                if (req.body?.website && (req.body?.website != "localhost" && req.body?.website != "world-exchange-website.vercel.app")) {
                    const subOwnerData = await User.findOne({ _id: new ObjectId(user?.subOwnerId) }).select({ _id: 1, website: 1 });
                    if (!isEmpty(subOwnerData)) {
                        if (subOwnerData?.website !== website) {
                            return res.json(responseData("INVALID_LOGIN", {}, req, false));
                        }
                    }
                }

                // if(user.uniqueId === uniqueId){
                //     console.log('forceLogout resp',resp);
                //     throw new Error('UNIQUEId_ALREADY_REGISTERED');
                // }

                if (username != "javademo") {
                    const resp = await triggerMethod.forceLogout({ user_id: user._id });
                }

                bcrypt.compare(password, user.password, async (err, response) => {
                    if (err)
                        return res
                            .json(responseData("INVALID_LOGIN", {}, req, false));
                    if (!response)
                        return res.json(responseData("INVALID_LOGIN", {}, req, false));

                    let userValue = await User.findByIdAndUpdate({
                        _id: user.id
                    },
                        {
                            $set:
                            {
                                uniqueId,
                                isOnline: 1,
                                lastIp: req.ip
                            }
                        },
                        { returnOriginal: false })
                        .select({
                            _id: 1,
                            uniqueId: 1,
                            // userType:1,
                            email: 1,
                            // phone:1,
                            username: 1,
                            firstName: 1,
                            lastName: 1,
                            totalCoins: 1,
                            casinoCoins: 1,
                            // aeCasinoUserId:1,
                            exposure: 1,
                            // website:1,
                            // createdById:1,
                            authority: 1,
                            timeZone: 1,
                            timeZoneOffset: 1,
                            status: 1,
                            betsBlocked: 1,
                            "total_coins": "$totalCoins",
                        });
                    const userData = userValue.toJSON()
                    delete userData["password"];
                    saveActivity(req, userData._id)
                    let deviceTokens = generateAuthToken(userData);
                    // console.log('ACCOUNT_LOGIN resp',userData);
                    userData.matchSetting = await GlobalLimitSetting.find();
                    return res.json(responseData("ACCOUNT_LOGIN", { ...userData, ...deviceTokens }, req, true));
                });
            } else {
                return res.json(responseData("ADMIN_NOT_FOUND", {}, req, false));
            }
        } catch (err) {
            console.log('err', err)
            return res.status(422).json(responseData(err, {}, req, false));
        }
    },
    profile: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user._id });
            if (!isEmpty(user)) {
                const userData = user.toJSON();
                userData.editStake = (userData.editStake && userData.editStake.length > 0) ? userData.editStake : [100, 500, 1000, 5000, 10000]
                userData.editOneClickBetStake = (userData.editOneClickBetStake && userData.editOneClickBetStake.length > 0) ? userData.editOneClickBetStake : [100, 500, 1000, 5000, 10000]
                userData.defaultOneClickBetStake = (userData.defaultOneClickBetStake) ? userData.defaultOneClickBetStake : 0;
                userData.defaultStake = (userData.defaultStake) ? userData.defaultStake : 0;
                userData.matchSetting = await GlobalLimitSetting.find();
                userData.exposure = Math.abs(userData.exposure);
                userData.beforeInPlay = 30;
                return res.json(responseData("Profile", userData, req, true));
            } else {
                return res.json(responseData("USER_NOT_FOUND", {}, req, false));
            }
        } catch (err) {
            return res.status(422).json(responseData(err, {}, req, false));
        }
    },
    profile_update: async (req, res) => {
        try {
            const { fancyBet, sportsBook, binary, odds, stake, isOneClickBetStake, defaultOneClickBetStake } = req.body;
            const { _id } = req.user._id;
            const updateValues = {}
            updateValues.fancyBet = (fancyBet) ? true : false
            updateValues.sportsBook = (sportsBook) ? true : false
            updateValues.binary = (binary) ? true : false
            updateValues.odds = (odds) ? true : false
            updateValues.isOneClickBetStake = (isOneClickBetStake) ? true : false

            if (defaultOneClickBetStake) updateValues.defaultOneClickBetStake = defaultOneClickBetStake;
            if (stake) updateValues.stake = stake;
            if (req.body?.defaultStake) updateValues.defaultStake = req.body?.defaultStake;

            const userUpdate = await User.findOneAndUpdate({ _id }, { $set: updateValues }, { new: true })
            if (userUpdate) {
                return res.json(responseData("USER_UPDATE_SUCCESS", userUpdate, req, true));
            } else {
                return res.json(responseData("ERROR_OCCUR", {}, req, false));
            }
        } catch (err) {
            return res.status(422).json(responseData("ERROR_OCCUR", {}, req, false));
        }
    },
    edit_stake: async (req, res) => {
        try {
            const { editStake } = req.body;
            const { _id } = req.user._id;
            const userUpdate = await User.findOneAndUpdate({ _id }, { $set: { editStake } }, { new: true })
            if (userUpdate) {
                return res.json(responseData("USER_UPDATE_SUCCESS", userUpdate, req, true));
            } else {
                return res.json(responseData("ERROR_OCCUR", {}, req, false));
            }
        } catch (err) {
            return res.status(422).json(responseData("ERROR_OCCUR", {}, req, false));
        }
    },
    edit_one_click_stake: async (req, res) => {
        try {
            const { editOneClickBetStake } = req.body;
            const { _id } = req.user._id;
            const userUpdate = await User.findOneAndUpdate({ _id }, { $set: { editOneClickBetStake } }, { new: true })
            if (userUpdate) {
                return res.json(responseData("USER_UPDATE_SUCCESS", userUpdate, req, true));
            } else {
                return res.json(responseData("ERROR_OCCUR", {}, req, false));
            }
        } catch (err) {
            return res.status(422).json(responseData("ERROR_OCCUR", {}, req, false));
        }
    },
    refresh_amount: async (req, res) => {
        try {
            let matchPattern = {
                isDeclared: false,
                forBet: 1
            };
            matchPattern.userId = ObjectId(req.user._id);
            const totalExposure = await Transaction.aggregate([
                {
                    $match: matchPattern
                },
                {
                    $group: {
                        _id: null,
                        totalExposureAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            const totalAMT = await Transaction.aggregate([
                {
                    $match: {
                        userId: ObjectId(req.user._id),
                        // forCasinoBet: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            await User.findOneAndUpdate({
                _id: ObjectId(req.user._id)
            },
                {
                    $set: {
                        exposure: totalExposure.length > 0 ? Math.abs(totalExposure[0].totalExposureAmount) : 0,
                        totalCoins: totalAMT.length > 0 ? totalAMT[0].totalAmount : 0,
                        betBlock: false
                    }
                });
            const objectToSend = await User.findOne({ _id: req.user._id }, { exposure: 1, totalCoins: 1, betBlock: 1 });
            // console.log('objectToSend',objectToSend)
            return res.json(responseData("AMOUNT", objectToSend, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    refresh_token: async (req, res) => {
        try {
            let { refresh_token } = req.body;
            if (!refresh_token) { return res.json(responseData("REF_TOKEN", [], req, false)); }
            let deviceTokens = reGenerateUserAuthTokenHelper(refresh_token);
            if (deviceTokens) {
                return res.json(responseData("TOKEN_REGENERATE", deviceTokens, req, true));
            } else {
                return res.json(responseData("INVALID_REF_TOKEN", deviceTokens, req, false));
            }

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const { _id } = req.user;
            const user = await User.findOne({ _id })
            const match = await bcrypt.compare(oldPassword, user.password)
            if (match) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newPassword, salt, async function (err, hash) {
                        if (err || !hash) {
                            return res.json(responseData("ERROR_OCCUR", {}, req, false));
                        } else {
                            await User.findOneAndUpdate({ _id }, { password: hash });
                            return res.json(responseData("PASSWORD_CHANGED", {}, req, true));
                        }
                    });
                });
            } else {
                return res.json(responseData("INVALID_OLD_PASSWORD", {}, req, false));
            }
        } catch (err) {
            console.log('err', err);
            return res.status(422).json(responseData("ERROR_OCCUR", {}, req, false));
        }
    },
    activity_logs: async (req, res) => {
        try {

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Activity.countDocuments({ userId: ObjectId(req.user._id) });

            let query = await Activity.find({ userId: ObjectId(req.user._id) })
                .sort({ 'activityDate': 1 })
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
    subscribe: async (req, res) => {
        try {
            const { type, fieldValue } = req.body;

            const subscribe = await Subscribe.create({ type, fieldValue })

            return res.json(responseData("SUBSCRIBE_SUCCESS", subscribe, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    totalExposureAmount: async (req, res) => {
        try {
            const totalExposure = await totalExposureAmount({ marketId: "468267" })
            const amount = await totalAmount({ userId: req.user._id })
            const multiMarket = await totalMultiMarketExposure({ marketId: ["468394", "468398"] })

            var resObj = {
                totalExposure: totalExposure.length > 0 ? totalExposure[0].totalExposureAmount : 0,
                totalAmount: amount.length > 0 ? amount[0].totalAmount : 0,
                multiMarket: multiMarket.length > 0 ? multiMarket[0].totalAmount : 0,
            }

            return res.json(responseData("SUCCESS", resObj, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    casinoAmountAdd: async (req, res) => {
        try {
            let { amount } = req.body
            const userId = req.user._id;
            const userData = await User.aggregate([
                {
                    $match: {
                        _id: ObjectId(userId)
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "subOwnerId",
                        "foreignField": "_id",
                        "as": "subOwnerData"
                    }
                },
                {
                    $unwind: {
                        path: '$subOwnerData',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $project: {
                        _id: 1,
                        subOwnerId: 1,
                        email: 1,
                        userId: 1,
                        username: 1,
                        "domain": "$subOwnerData.website"
                    }
                }
            ]);

            let userExist = (userData && userData.length > 0) ? userData[0] : false;
            if (!userExist || !userExist?.domain) {
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }

            let certValue = cert;
            let agentValue = agent;
            let livePath = apiPath;
            let isLive = true;
            if (userExist?.domain == "javaexch.com") {
                certValue = javaCert;
                agentValue = javaAgent;
                livePath = liveApiPath;
            } else if (userExist?.domain == "9exchenge.live") {

                certValue = ninexCert;
                agentValue = ninexAgent;
                livePath = liveApiPath;
            } else if (userExist?.domain == "playbets365.live" || userExist?.domain == "1xbets.pro" || userExist?.domain == "betx365.ca" || userExist?.domain == "winx247.live" || userExist?.domain == "bazi-365.live" || userExist?.domain == "maza247.bet") {

                certValue = betxCert;
                agentValue = betxAgent;
                livePath = liveApiPath;
            }

            if (amount >= 0) {

                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });

                const betLimit = (isLive) ? '{"SEXYBCRT":{"LIVE":{"limitId":[140113]}},"VENUS":{"LIVE":{"limitId":[140111]}},"HORSEBOOK":{"LIVE":{"minbet":10,"maxbet":500,"maxBetSumPerHorse":5000,"minorMinbet":10,"minorMaxbet":100,"minorMaxBetSumPerHorse":500}},"PP":{"LIVE":{"limitId":["G1"]}},"SV388":{"LIVE":{"maxbet":1000,"minbet":1,"mindraw":1,"matchlimit":1000,"maxdraw":100}}}' : '{"SEXYBCRT":{"LIVE":{"limitId":[140101]}},"VENUS":{"LIVE":{"limitId":[140101]}},"HORSEBOOK":{"LIVE":{"minbet":10,"maxbet":500,"maxBetSumPerHorse":5000,"minorMinbet":10,"minorMaxbet":100,"minorMaxBetSumPerHorse":500}},"PP":{"LIVE":{"limitId":["G1"]}},"SV388":{"LIVE":{"maxbet":1000,"minbet":1,"mindraw":1,"matchlimit":1000,"maxdraw":100}}}';
                var data = qs.stringify({
                    'cert': certValue,
                    'agentId': agentValue,
                    'userId': userExist?.username,
                    'currency': 'MYR',
                    'betLimit': betLimit,
                    'language': 'en',
                    'userName': userExist?.username
                });
                var config = {
                    method: 'post',
                    url: livePath + 'wallet/createMember',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'charset': 'UTF-8',
                        'Cookie': 'incap_ses_706_2395338=so9lezSu5SsbWcp9DzjMCfBGvWMAAAAA/3dHBG18Q/BGMNWXPP585g==; visid_incap_2395338=ryMUpjrDRtaisUqKBfxjWqdotWMAAAAAQUIPAAAAAAC4qQGkhIb0CLaLDrT2Ufo7'
                    },
                    data: data
                };

                axios(config).then(async function (response) {
                    // console.log('response------',response);
                    if (response.data?.status == '0000' || (response.data?.status == '1001' && response.data?.desc == 'Account existed')) {

                        await User.findOneAndUpdate({
                            _id: ObjectId(userId)
                        },
                            {
                                $set: {
                                    aeCasinoUserId: userExist?.username
                                }
                            });

                        if (amount != 0) {

                            try {

                                const requestSubmit = {
                                    'cert': certValue,
                                    'agentId': agentValue,
                                    'userId': userExist?.username,
                                    'txCode': `txnd${makeid(10)}`,
                                    'withdrawType': '1',
                                    'transferAmount': amount
                                };
                                // console.log(requestSubmit,'----------requestSubmit')
                                var dataGenerate = qs.stringify(requestSubmit);
                                var config = {
                                    method: 'post',
                                    url: `${livePath}wallet/deposit`,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'charset': 'UTF-8'
                                    },
                                    data: dataGenerate
                                };

                                axios(config).then(async function (response) {
                                    // console.log('response------',response);
                                    if (response.data?.status == '0000') {
                                        await Transaction.create({
                                            transactionType: 'debit',
                                            userId: userId,
                                            amount: Math.abs(amount),
                                            realCutAmount: -Math.abs(amount),
                                            status: 'success',
                                            ip: req.ip,
                                            location: ispData ? ispData.country.en : null,
                                            forCasino: 1,
                                            geolocation: {
                                                type: 'Point',
                                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                            },
                                            userAgent: req.get('User-Agent')
                                        });

                                        await CasinoTransaction.create({
                                            transactionType: 'credit',
                                            userId: userId,
                                            amount: Math.abs(amount),
                                            realCutAmount: Math.abs(amount),
                                            status: 'success',
                                            ip: req.ip,
                                            location: ispData ? ispData.country.en : null,
                                            geolocation: {
                                                type: 'Point',
                                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                            },
                                            userAgent: req.get('User-Agent')
                                        });
                                        triggerMethod.coinUpdate({ user_id: userId });
                                        userExist.aeCasinoUserId = userExist?.username;
                                        return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));

                                    } else {
                                        triggerMethod.coinUpdate({ user_id: userId });
                                        return res.json(responseData(response.data?.desc, {}, req, false));
                                    }
                                }).catch(function (error) {
                                    console.log('error------------', error);
                                    res.status(200).json({ "status": false, "message": error, "data": {} })
                                });

                            } catch (error) {
                                console.log('error9', error);
                                return res.json(responseData("ERROR_OCCUR", error, req, false));
                            }

                        } else {

                            triggerMethod.coinUpdate({ user_id: userId });
                            userExist.aeCasinoUserId = userExist?.username;
                            return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));
                        }

                    } else {
                        triggerMethod.coinUpdate({ user_id: userId });
                        return res.json(responseData(response.data?.desc, {}, req, false));
                    }
                });


                // if(!userExist?.aeCasinoUserId){

                //     var data = qs.stringify({
                //         'cert': cert,
                //         'agentId': agent,
                //         'userId': userExist?.username,
                //         'currency': 'MYR',
                //         'betLimit': '{"SEXYBCRT":{"LIVE":{"limitId":[140101]}},"VENUS":{"LIVE":{"limitId":[140101]}},"HORSEBOOK":{"LIVE":{"minbet":10,"maxbet":500,"maxBetSumPerHorse":5000,"minorMinbet":10,"minorMaxbet":100,"minorMaxBetSumPerHorse":500}},"PP":{"LIVE":{"limitId":["G1"]}},"SV388":{"LIVE":{"maxbet":1000,"minbet":1,"mindraw":1,"matchlimit":1000,"maxdraw":100}}}',
                //         'language': 'en',
                //         'userName': userExist?.username
                //     });
                //     var config = {
                //         method: 'post',
                //         url: 'https://tttint.onlinegames22.com/wallet/createMember',
                //         headers: {
                //             'Content-Type': 'application/x-www-form-urlencoded',
                //             'charset': 'UTF-8',
                //             'Cookie': 'incap_ses_706_2395338=so9lezSu5SsbWcp9DzjMCfBGvWMAAAAA/3dHBG18Q/BGMNWXPP585g==; visid_incap_2395338=ryMUpjrDRtaisUqKBfxjWqdotWMAAAAAQUIPAAAAAAC4qQGkhIb0CLaLDrT2Ufo7'
                //         },
                //         data : data
                //     };

                //     axios(config).then( async function (response) {
                //         if(response.data?.status=='0000')
                //         {
                //             await User.findOneAndUpdate({
                //                 _id:ObjectId(userId)
                //             },
                //             {
                //                 $set:{
                //                     aeCasinoUserId:userExist?.username
                //                 }
                //             });

                //             if(amount != 0){

                //                 try{

                //                     const requestSubmit = {
                //                         'cert': cert,
                //                         'agentId': agent,
                //                         'userId': userExist?.username,
                //                         'txCode': `txnd${makeid(10)}`,
                //                         'withdrawType': '1',
                //                         'transferAmount': amount
                //                     };
                //                     // console.log(requestSubmit,'----------requestSubmit')
                //                     var dataGenerate = qs.stringify(requestSubmit);
                //                     var config = {
                //                         method: 'post',
                //                         url: `${apiPath}wallet/deposit`,
                //                         headers: {
                //                             'Content-Type': 'application/x-www-form-urlencoded',
                //                             'charset': 'UTF-8'
                //                         },
                //                         data : dataGenerate
                //                     };

                //                     axios(config).then(async function (response) {
                //                             // console.log('response------',response);
                //                             if(response.data?.status=='0000')
                //                             {
                //                                 await Transaction.create({
                //                                     transactionType: 'debit',
                //                                     userId: userId,
                //                                     amount: Math.abs(amount),
                //                                     realCutAmount:-Math.abs(amount),
                //                                     status: 'success',
                //                                     ip:req.ip,
                //                                     location:ispData?ispData.country.en:null,
                //                                     forCasino:1,
                //                                     geolocation:{
                //                                         type:'Point',
                //                                         coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                //                                     },
                //                                     userAgent:req.get('User-Agent')
                //                                 });

                //                                 await CasinoTransaction.create({
                //                                     transactionType: 'credit',
                //                                     userId: userId,
                //                                     amount: Math.abs(amount),
                //                                     realCutAmount:Math.abs(amount),
                //                                     status: 'success',
                //                                     ip:req.ip,
                //                                     location:ispData?ispData.country.en:null,
                //                                     geolocation:{
                //                                         type:'Point',
                //                                         coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                //                                     },
                //                                     userAgent:req.get('User-Agent')
                //                                 });
                //                                 triggerMethod.coinUpdate({user_id:userId});
                //                                 userExist.aeCasinoUserId=userExist?.username;
                //                                 return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));

                //                             }else{
                //                                 triggerMethod.coinUpdate({user_id:userId});
                //                                 return res.json(responseData(response.data?.desc, {}, req, false));
                //                             }
                //                         }).catch(function (error) {
                //                             console.log('error------------',error);
                //                             res.status(200).json({"status":false,"message":error,"data":{}})
                //                     });

                //                 } catch (error) {
                //                     console.log('error9',error);
                //                     return res.json(responseData("ERROR_OCCUR", error, req, false));
                //                 }

                //             }else{

                //                 triggerMethod.coinUpdate({user_id:userId});
                //                 userExist.aeCasinoUserId=userExist?.username;
                //                 return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));

                //             }
                //         }else{
                //             triggerMethod.coinUpdate({user_id:userId});
                //             return res.json(responseData(response.data?.desc, {}, req, false));
                //         }
                //     })
                //     .catch(function (error) {
                //         console.log(error);
                //         return res.json(responseData(error, {}, req, false));
                //     });

                // }else{

                //     if(amount != 0){

                //         try{

                //             const requestSubmit = {
                //                 'cert': cert,
                //                 'agentId': agent,
                //                 'userId': userExist?.aeCasinoUserId,
                //                 'txCode': `txnd${makeid(10)}`,
                //                 'withdrawType': '1',
                //                 'transferAmount': amount
                //             };
                //             // console.log(requestSubmit,'----------requestSubmit')
                //             var dataGenerate = qs.stringify(requestSubmit);
                //             var config = {
                //                 method: 'post',
                //                 url: `${apiPath}wallet/deposit`,
                //                 headers: {
                //                     'Content-Type': 'application/x-www-form-urlencoded',
                //                     'charset': 'UTF-8'
                //                 },
                //                 data : dataGenerate
                //             };

                //             axios(config).then(async function (response) {
                //                     // console.log('response------',response);
                //                     if(response.data?.status=='0000')
                //                     {
                //                         await Transaction.create({
                //                             transactionType: 'debit',
                //                             userId: userId,
                //                             amount: Math.abs(amount),
                //                             realCutAmount:-Math.abs(amount),
                //                             status: 'success',
                //                             ip:req.ip,
                //                             forCasino:1,
                //                             location:ispData?ispData.country.en:null,
                //                             geolocation:{
                //                                 type:'Point',
                //                                 coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                //                             },
                //                             userAgent:req.get('User-Agent')
                //                         });

                //                         await CasinoTransaction.create({
                //                             transactionType: 'credit',
                //                             userId: userId,
                //                             amount: Math.abs(amount),
                //                             realCutAmount:Math.abs(amount),
                //                             status: 'success',
                //                             ip:req.ip,
                //                             location:ispData?ispData.country.en:null,
                //                             geolocation:{
                //                                 type:'Point',
                //                                 coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                //                             },
                //                             userAgent:req.get('User-Agent')
                //                         });
                //                         triggerMethod.coinUpdate({user_id:userId});
                //                         return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));

                //                     }else{
                //                         return res.json(responseData(response.data?.desc, {}, req, false));
                //                     }
                //                 }).catch(function (error) {
                //                     console.log('error------------',error);
                //                     res.status(200).json({"status":false,"message":error,"data":{}})
                //             });

                //         } catch (error) {
                //             console.log('error9',error);
                //             return res.json(responseData("ERROR_OCCUR", error, req, false));
                //         }

                //     }else{

                //         triggerMethod.coinUpdate({user_id:userId});

                //         return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));
                //     }
                // }

            } else {
                return res.json(responseData("AMOUNT_CANT_BE_ZERO", {}, req, false));
            }

        } catch (error) {
            console.log('error---', error)
            return res.status(422).json(responseData(error.message, {}, req, false));
        }
    },
    easyToGoCasinoAmountAdd: async (req, res) => {
        try {

            let { amount } = req.body
            const userId = req.user._id;
            let userExist = await User.findById(userId)
            if (!userExist) {
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }

            if (amount >= 0) {

                const pwd = "Abc123";
                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });

                var data = {
                    "op": easyToGoOP,
                    "mem": userExist?.username,
                    "pass": pwd,
                    "sign": easyToGoSIGN
                };

                var config = {
                    method: 'post',
                    url: `${easyToGoApiPath}/createplayer`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'charset': 'UTF-8'
                    },
                    data
                };

                axios(config).then(async function (response) {
                    // console.log('response------',response.data, Math.abs(amount).toFixed(2));
                    if (response.data?.err == 1 || response.data?.err == 702) {

                        await User.findOneAndUpdate({
                            _id: ObjectId(userId)
                        },
                            {
                                $set: {
                                    easyToGoUserId: userExist?.username
                                }
                            });

                        if (Math.abs(amount) != 0) {

                            try {

                                const requestSubmit = {
                                    "op": easyToGoOP,
                                    "mem": userExist?.username,
                                    "pass": pwd,
                                    "sign": easyToGoSIGN,
                                    "prod": easyToGoPROD,
                                    "amount": Math.abs(amount).toFixed(2),
                                    "ref_no": "TXNCRI" + makeid(10)
                                };

                                var config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: `${easyToGoApiPath}/deposit`,
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'charset': 'UTF-8'
                                    },
                                    data: requestSubmit
                                };
                                axios(config).then(async function (response) {
                                    // console.log('response------',response.data, requestSubmit);
                                    if (response.data?.err == 1) {
                                        await Transaction.create({
                                            transactionType: 'debit',
                                            userId: userId,
                                            amount: Math.abs(amount),
                                            realCutAmount: -Math.abs(amount),
                                            status: 'success',
                                            ip: req.ip,
                                            location: ispData ? ispData.country.en : null,
                                            forCasino: 1,
                                            forEasyGoCasino: 1,
                                            geolocation: {
                                                type: 'Point',
                                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                            },
                                            userAgent: req.get('User-Agent')
                                        });

                                        await CasinoTransaction.create({
                                            transactionType: 'credit',
                                            userId: userId,
                                            amount: Math.abs(amount),
                                            realCutAmount: Math.abs(amount),
                                            status: 'success',
                                            ip: req.ip,
                                            location: ispData ? ispData.country.en : null,
                                            geolocation: {
                                                type: 'Point',
                                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                            },
                                            userAgent: req.get('User-Agent'),
                                            forEasyGoCasino: 1,
                                        });

                                        triggerMethod.coinUpdate({ user_id: userId });
                                        userExist.aeCasinoUserId = userExist?.username;
                                        return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));

                                    } else {
                                        triggerMethod.coinUpdate({ user_id: userId });
                                        return res.json(responseData(response.data?.desc, {}, req, false));
                                    }
                                }).catch(function (error) {
                                    console.log('error------------', error);
                                    res.status(200).json({ "status": false, "message": error, "data": {} })
                                });

                            } catch (error) {
                                console.log('error9', error);
                                return res.json(responseData("ERROR_OCCUR", error, req, false));
                            }

                        } else {

                            triggerMethod.coinUpdate({ user_id: userId });
                            userExist.aeCasinoUserId = userExist?.username;
                            return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", userExist, req, true));
                        }

                    } else {
                        triggerMethod.coinUpdate({ user_id: userId });
                        return res.json(responseData(response.data?.desc, {}, req, false));
                    }
                });

            } else {
                return res.json(responseData("AMOUNT_CANT_BE_ZERO", {}, req, false));
            }

        } catch (error) {
            console.log('error---', error)
            return res.status(422).json(responseData(error.message, {}, req, false));
        }
    },
    list_website_setting: async (req, res) => {
        try {
            const { website } = req.query

            let websiteId = "64d2216a4ec87ee083ba15e8";
            const websiteData = await Website.findOne({ domain: website })
            if (!isEmpty(websiteData)) {
                websiteId = websiteData?._id
            }
            const result = await WebsiteSetting.findOne({ websiteId })
            return res.json(responseData("details", result, req, true));

        } catch (error) {
            return res.status(422).json(responseData(error.message, {}, req, false));
        }
    },
    // casinoVendorList: async (req, res) => {
    //     try {
    //         var config = {
    //             method: 'GET',
    //             url: process.env.CASINO_API_BASE_URL + 'vendorList',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'charset': 'UTF-8',
    //                 'authToken': process.env.CASINO_AUTH_KEY
    //             }
    //         };
    //         const result = await axios.get(config.url, {
    //             headers: config.headers
    //         })
    //         console.log('result', result)
    //         return res.json(result.data);
    //     } catch (error) {
    //         return res.json(responseData("ERROR_OCCUR", error, req, false));
    //     }
    // },
    // casinoGameListByVendor: async (req, res) => {
    //     try {
    //         let { provider } = req.query
    //         provider = provider.split('/')
    //         provider = provider[0].trim()
    //         var config = {
    //             method: 'GET',
    //             url: process.env.CASINO_API_BASE_URL + 'gameList?provider=' + provider,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'charset': 'UTF-8',
    //                 'authToken': process.env.CASINO_AUTH_KEY
    //             }
    //         };
    //         const result = await axios.get(config.url, {
    //             headers: config.headers
    //         })
    //         return res.json(result.data);
    //     } catch (error) {
    //         return res.json(responseData("ERROR_OCCUR", error, req, false));
    //     }
    // },
    // casinoGameURL: async (req, res) => {
    //     try {
    //         const { username, gameId } = req.query
    //         var config = {
    //             method: 'GET',
    //             url: process.env.CASINO_API_BASE_URL + 'getGameUrl?username=' + username + '&gameId=' + gameId,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'charset': 'UTF-8',
    //                 'authToken': process.env.CASINO_AUTH_KEY
    //             }
    //         };
    //         const result = await axios.get(config.url, {
    //             headers: config.headers
    //         })
    //         console.log('result.data', result.data.data.url)
    //         return res.json(result.data);
    //     } catch (error) {
    //         return res.json(responseData("ERROR_OCCUR", error, req, false));
    //     }
    // },
    // casinoAddUser: async (req, res) => {
    //     try {
    //         const { username } = req.query
    //         const userExist = await User.findOne({ casinoUsername: username })
    //         if (!isEmpty(userExist)) {
    //             return res.json({
    //                 "code": 0,
    //                 "error": false,
    //                 "message": "Success",
    //                 "data": {}
    //             })
    //         } else {
    //             var config = {
    //                 method: 'POST',
    //                 url: process.env.CASINO_API_BASE_URL + 'addUser?username=' + username,
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'charset': 'UTF-8',
    //                     'authToken': process.env.CASINO_AUTH_KEY
    //                 }
    //             };
    //             const result = await axios(config)
    //             if (!result.data.error) {
    //                 await User.findOneAndUpdate({ _id: req.user._id }, { $set: { casinoUsername: username } }, { new: true })
    //             }
    //             return res.json(result.data);
    //         }
    //     } catch (error) {
    //         console.log('error', error)
    //         return res.json(responseData("ERROR_OCCUR", error, req, false));
    //     }
    // },
    casinoGameList: async (req, res) => {
        try {
            const { provider, searchKey } = req.query
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.pageSize, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const findObj = {}
            if (provider) {
                findObj.provider_name = provider
            }

            if (searchKey) {
                findObj.game_name = { $regex: searchKey, $options: 'i' }
            }

            const total = await CasinoGame.countDocuments(findObj);

            let query = await CasinoGame.find(findObj)
                .skip(startIndex)
                .limit(limit)

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseObj = {
                data: query,
                count: query.length,
                ...paginateObj,
            }

            // const games = await CasinoGame.find(findObj).select({ game_id: 1, game_name: 1, url_thumb: 1, provider_name: 1 }).skip(page).limit(pageSize)
            return res.json(responseObj);
        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    topCasinoList: async (req, res) => {
        try {
            const casinoList = await CasinoGame.find({ top_games: 1 }).select({ game_id: 1, game_name: 1, url_thumb: 1, provider_name: 1 })
            if (isEmpty(casinoList)) {
                return res.json(responseData("NOT_FOUND_TOP_CASINO", [], req, true));
            }
            return res.json(responseData("GET_LIST", casinoList, req, true));


            // const total = await CasinoGame.countDocuments(findObj);

            // let query = await CasinoGame.find(findObj)
            //     .skip(startIndex)
            //     .limit(limit)

            // let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            // let responseObj = {
            //     data: query,
            //     count: query.length,
            //     ...paginateObj,
            // }

            // const games = await CasinoGame.find(findObj).select({ game_id: 1, game_name: 1, url_thumb: 1, provider_name: 1 }).skip(page).limit(pageSize)
            return res.json(responseObj);
        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    casinoProviderList: async (req, res) => {
        try {
            const games = await CasinoProvider.find({}).sort({ sortOrder: 1 })

            return res.json({ data: games });
        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    casinoGameLogin: async (req, res) => {
        // try {
        //     const { providerName, balance, gameId } = req.body
        //     var config = {
        //         method: 'POST',
        //         url: process.env.CASINO_API_BASE_URL + 'operatorLogin',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'charset': 'UTF-8',
        //             // 'Signature': process.env.CASINO_AUTH_KEY
        //         },
        //         data: {
        //             operatorId: process.env.CASINO_OPERATOR_ID,
        //             providerName,
        //             gameId,
        //             userId: req.user._id,
        //             username: req.user.username,
        //             platformId: "desktop",
        //             lobby: false,
        //             clientIp: process.env.SERVER_IP,
        //             currency: "INR",
        //             balance,
        //             redirectUrl: process.env.APP_URL
        //         }
        //     };
        //     console.log('config payload====>>>>', config);
        //     const result = await axios(config)
        //     // let urlToken = result?.data?.url

        //     // urlToken = urlToken.split('token=')[1]

        //     // urlToken = urlToken.split('&')[0]
        //     // console.log('result.data====>>>', result?.data);
        //     if (result.data.status == 0) {
        //         const updateObj = {
        //             casinoToken: result?.data?.token
        //         }
        //         await User.findOneAndUpdate({ _id: req.user._id }, { $set: updateObj })
        //     }
        //     return res.json(result.data);
        // } catch (error) {
        //     console.log('error:::::::::::::', error)
        //     return res.json(responseData("ERROR_OCCUR", error, req, false));
        // }
        try {
            const { providerName, balance, gameId } = req.body

            var currentDate = new Date();

            // Extract the year and month
            var currentYear = currentDate.getFullYear();
            var currentMonth = currentDate.getMonth() + 1; // Note: Months are zero-based, so we add 1

            if (currentMonth != 10 && currentMonth != 11 && currentMonth != 12) {
                currentMonth = '0' + currentMonth;
            }

            // Build the start date for the current month
            var startDate = new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`);

            // Build the start date for the next month
            var nextMonth = currentMonth == 12 ? '01' : Number(currentMonth) + 1;

            if (nextMonth != 10 && nextMonth != 11 && nextMonth != 12) {
                nextMonth = '0' + nextMonth;
            }

            var nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
            var endDate = new Date(`${nextMonthYear}-${nextMonth}-01T00:00:00.000Z`);



            const casinoBets = await Transaction.aggregate([
                {
                    $lookup: {
                        from: "casino_bets",
                        localField: "casinoBetTransactionId",
                        foreignField: "transactionId",
                        as: "casinoBetData"
                    }
                },
                {
                    $unwind: { path: "$casinoBetData", preserveNullAndEmptyArrays: true }
                },
                {
                    $addFields: {
                        casinoBetStatus: "$casinoBetData.status",
                    }
                },
                {
                    $match: {
                        gameType: "casino",
                        transactionType: "debit",
                        createdAt: {
                            $gte: startDate,
                            $lt: endDate
                        },
                        casinoBetStatus: { $in: ['result', 'bet'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ])

            console.log('startDate: ', startDate, ' endDate: ', endDate, casinoBets[0]?.totalAmount);
            if (casinoBets[0]?.totalAmount >= process.env.CASINO_AMOUNT_LIMIT) {
                return res.json({
                    errorDescripion: "Casino bets limit exceeded",
                    status: 1
                })
            } else {
                const payload = {
                    operatorId: process.env.CASINO_OPERATOR_ID,
                    providerName,
                    gameId,
                    userId: req.user._id,
                    username: req.user.username,
                    platformId: "desktop",
                    lobby: false,
                    clientIp: process.env.SERVER_IP,
                    currency: "INR",
                    balance,
                    redirectUrl: process.env.APP_URL
                }
                const privateKey = fs.readFileSync('private_key.pem', 'utf8');
                const signature = createSignature(payload, privateKey);
                const config = {
                    method: 'POST',
                    url: process.env.CASINO_API_BASE_URL + 'api/operator/login',
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'UTF-8',
                        'Signature': signature
                    },
                    data: JSON.stringify(payload)
                };
                console.log('config payload====>>>>', config);
                const result = await axios(config)
                // let urlToken = result?.data?.url

                // urlToken = urlToken.split('token=')[1]

                // urlToken = urlToken.split('&')[0]
                // console.log('result.data====>>>', result?.data);
                if (result.data.status == 0) {
                    const updateObj = {
                        casinoToken: result?.data?.token
                    }
                    await User.findOneAndUpdate({ _id: req.user._id }, { $set: updateObj })
                }
                return res.json(result.data);
            }
        } catch (error) {
            console.log('error:::::::::::::', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    add_user: async (req, res) => {
        try {
            // emailExistence.check(req.body.email, async(error, response) => {
            var password = Math.random().toString(36).slice(-8);
            var username = Math.floor(100000000 + Math.random() * 900000000);
            console.log("------------>", password, username);
            const adminUser = await User.findOne({ username: "directagent" })
            // console.log("adminUser", adminUser);
            var createdBy = adminUser?._id;
            var timeZone = "Asia/Kolkata"
            // if(response){

            const checkUser = await User.findById({ _id: ObjectId(createdBy) });
            if (!checkUser) {
                return res.json(
                    responseData("invalidUser", {}, req, false)
                );
            }
            const usernameUpdate = username;
            const checkUsername = await User.findOne({ username: usernameUpdate })
            if (checkUsername) {
                return res.json(
                    responseData("USERNAME_ALREADY_REGISTERED", {}, req, false)
                );
            } else {
                // console.log("password", password);
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

                            const user = await User.create({
                                username: usernameUpdate,
                                userType,
                                // firstName,
                                // lastName,
                                // email,
                                // phone,
                                timeZone: timeZone,
                                ip_address: req.body?.ip_address,
                                website: req.body?.website,
                                timeZoneOffset: req.body?.offset,
                                password: hash,
                                pwd: (userType == 'user') ? password : false,
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

                            await User.findOneAndUpdate({ _id: ObjectId(user?._id) }, { $set: { userId: user?._id } })

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
                                await User.findOneAndUpdate({ _id: ObjectId(user?._id) }, { $set: { totalCoins: req.body?.amount } })
                                await User.findOneAndUpdate({ _id: ObjectId(createdBy) }, { $set: { totalCoins: checkUser?.totalCoins - req.body?.amount } })
                            }
                            let admin = await User.findOne({ _id: user?._id }).select({ _id: 1, userType: 1, email: 1, phone: 1, username: 1, pwd: 1, firstName: 1, lastName: 1, totalCoins: 1, website: 1, createdById: 1, createdBy: 1, timeZone: 1 });
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
    register: async (req, res) => {
        try {
            // if(response){
            const { email, username, password, firstName, lastName, phone, refferedCode } = req.body;
            const adminUser = await User.findOne({ username: "directagent" });
            // console.log("adminUser", adminUser);
            var createdBy = adminUser?._id;
            var timeZone = "Asia/Kolkata";
            const checkUser = await User.findById({ _id: ObjectId(createdBy) });
            if (!checkUser) {
                return res.json(responseData("invalidUser", {}, req, false));
            }
            const usernameUpdate = username.toLowerCase();
            const checkUsername = await User.findOne({ username: usernameUpdate });
            const checkEmail = await User.findOne({ email: email });
            const mobile = await User.findOne({ phone: phone });
            if (checkUsername) {
                return res.json(
                    responseData("USERNAME_ALREADY_REGISTERED", {}, req, false)
                );
            } else if (mobile) {
                return res.json(
                    responseData("MOBILE_NUMBER_ALREADY_EXISTS", {}, req, false)
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
                            if (changeIntype === "user") {
                                userId = changeInId;
                            } else if (changeIntype === "agent") {
                                agentId = changeInId;
                            } else if (changeIntype === "super_agent") {
                                superAgentId = changeInId;
                            } else if (changeIntype === "senior_super") {
                                superSeniorId = changeInId;
                            } else if (changeIntype === "sub_admin") {
                                subAdminId = changeInId;
                            } else if (changeIntype === "super_admin") {
                                superAdminId = changeInId;
                            } else if (changeIntype === "admin") {
                                adminId = changeInId;
                            } else if (changeIntype === "sub_owner") {
                                subOwnerId = changeInId;
                            } else if (changeIntype === "owner") {
                                ownerId = changeInId;
                            }

                            let isReferralApplicable = false;
                            let checkReferral;

                            if (refferedCode) {
                                checkReferral = await User.findOne({ referralCode: refferedCode })
                                if (isEmpty(checkReferral)) {
                                    return res.json(responseData("INVALID_REFERRAL", {}, req, false));
                                } else {
                                    isReferralApplicable = true
                                }
                            }

                            const referralCode = generateRandomString()

                            const user = await User.create({
                                username: usernameUpdate,
                                userType,
                                firstName,
                                lastName,
                                email,
                                phone,
                                timeZone: timeZone,
                                ip_address: req.body?.ip_address,
                                website: req.body?.website,
                                timeZoneOffset: req.body?.offset,
                                password: hash,
                                pwd: userType == "user" ? req.body?.password : false,
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
                                refferedCode,
                                referralCode
                            });

                            await User.findOneAndUpdate(
                                { _id: ObjectId(user?._id) },
                                { $set: { userId: user?._id } }
                            );

                            if (isReferralApplicable) {
                                const superOwnerData = await User.findOne({ _id: ObjectId(process.env.SUPER_OWNER_ID) })
                                const referraSetting = await ReferralSetting.findOne({ slug: "referralSetting" })
                                if (
                                    userType == "user" &&
                                    Math.abs(
                                        Math.abs(superOwnerData?.totalCoins) -
                                        Math.abs(superOwnerData?.exposure)
                                    ) >= Math.abs(
                                        Math.abs(referraSetting?.referralBonus) +
                                        Math.abs(referraSetting?.signupBonus)
                                    )
                                ) {
                                    let ispData = null;
                                    let ipAddress =
                                        process.env.IP == "CLIVE" ? req.ip : "111.93.58.10";
                                    satelize.satelize({ ip: ipAddress }, function (err, payload) {
                                        ispData = payload;
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
                                        createdBy: superOwnerData?._id,
                                        amount: Math.abs(referraSetting?.signupBonus),
                                        realCutAmount: Math.abs(referraSetting?.signupBonus),
                                        oldBalance: 0,
                                        newBalance: Math.abs(referraSetting?.signupBonus),
                                        status: "success",
                                        ip: req.ip,
                                        location: ispData ? ispData.country.en : null,
                                        geolocation: {
                                            type: "Point",
                                            coordinates: [
                                                ispData ? ispData.longitude : null,
                                                ispData ? ispData.latitude : null,
                                            ],
                                        },
                                        userAgent: req.get("User-Agent"),
                                    });

                                    //signup bonus update of new registered user
                                    await User.findOneAndUpdate(
                                        { _id: ObjectId(user?._id) },
                                        { $set: { totalCoins: Math.abs(referraSetting?.signupBonus) } }
                                    );

                                    const totalAMTReferredUser = await Transaction.aggregate([
                                        {
                                            $match: { userId: ObjectId(checkReferral?._id), forCasinoBet: 0 },
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                totalAmount: { $sum: "$realCutAmount" },
                                            },
                                        },
                                    ]);
                                    const oldBalanceRefferedUser = totalAMTReferredUser.length > 0 ? totalAMTReferredUser[0]?.totalAmount : 0;

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
                                        userId: checkReferral?._id,
                                        createdBy: superOwnerData?._id,
                                        amount: Math.abs(referraSetting?.referralBonus),
                                        realCutAmount: Math.abs(referraSetting?.referralBonus),
                                        oldBalance: Math.abs(oldBalanceRefferedUser),
                                        newBalance: Math.abs(oldBalanceRefferedUser) + Math.abs(referraSetting?.referralBonus),
                                        status: "success",
                                        ip: req.ip,
                                        location: ispData ? ispData.country.en : null,
                                        geolocation: {
                                            type: "Point",
                                            coordinates: [
                                                ispData ? ispData.longitude : null,
                                                ispData ? ispData.latitude : null,
                                            ],
                                        },
                                        userAgent: req.get("User-Agent"),
                                    });



                                    //referral bonus update of referred user
                                    await User.findOneAndUpdate(
                                        { _id: ObjectId(checkReferral?._id) },
                                        { $set: { totalCoins: checkReferral?.totalCoins + Math.abs(referraSetting?.referralBonus) } }
                                    );

                                    const totalAMT = await Transaction.aggregate([
                                        {
                                            $match: { userId: ObjectId(superOwnerData?._id), forCasinoBet: 0 },
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                totalAmount: { $sum: "$realCutAmount" },
                                            },
                                        },
                                    ]);
                                    const oldBalanceSuperowner = totalAMT.length > 0 ? totalAMT[0]?.totalAmount : 0;

                                    await Transaction.create({
                                        transactionType: "debit",
                                        userId: superOwnerData?._id,
                                        amount: Math.abs(
                                            Math.abs(referraSetting?.referralBonus) +
                                            Math.abs(referraSetting?.signupBonus)
                                        ),
                                        realCutAmount: -Math.abs(
                                            Math.abs(referraSetting?.referralBonus) +
                                            Math.abs(referraSetting?.signupBonus)
                                        ),
                                        oldBalance: oldBalanceSuperowner,
                                        newBalance:
                                            oldBalanceSuperowner > 0
                                                ? Math.abs(oldBalanceSuperowner) - Math.abs(
                                                    Math.abs(referraSetting?.referralBonus) +
                                                    Math.abs(referraSetting?.signupBonus)
                                                )
                                                : oldBalanceSuperowner,
                                        status: "success",
                                        ip: req.ip,
                                        location: ispData ? ispData.country.en : null,
                                        geolocation: {
                                            type: "Point",
                                            coordinates: [
                                                ispData ? ispData.longitude : null,
                                                ispData ? ispData.latitude : null,
                                            ],
                                        },
                                        userAgent: req.get("User-Agent"),
                                    });


                                    //signup bonus - referral bonus update of superowner
                                    await User.findOneAndUpdate(
                                        { _id: ObjectId(superOwnerData._id) },
                                        {
                                            $set: {
                                                totalCoins: superOwnerData?.totalCoins - Math.abs(
                                                    Math.abs(referraSetting?.referralBonus) +
                                                    Math.abs(referraSetting?.signupBonus)
                                                ),
                                            },
                                        }
                                    );
                                }
                            }

                            let admin = await User.findOne({ _id: user?._id }).select({
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
                            });
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
}

function createSignature(payload, privateKey) {
    const privateKeyBuffer = Buffer.from(privateKey, 'utf8');
    // console.log("PRBuffer   ",privateKeyBuffer)
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(JSON.stringify(payload));
    const signature = signer.sign(privateKeyBuffer, 'base64');
    return signature;
}