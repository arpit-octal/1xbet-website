const Match = require("../../models/match.model");
const Tournament = require("../../models/tournament.model");
const Admin = require("../../models/user.model");
const Transaction = require("../../models/transaction.model");
const DeletedTransaction = require("../../models/deletedTransaction.model");
const Report = require("../../models/report.model");
const DeletedReport = require("../../models/deletedReport.model");
const Bet = require("../../models/bet.model");
const SessionBet = require("../../models/sessionBet.model");
const BetPosition = require("../../models/betPosition.model");
const SportBook = require("../../models/sportBook.model");
const SportBookBet = require("../../models/sportsBookBet.model");
const SportBookPremiumFancy = require("../../models/sportBookPremiumFancy");
const { responseData } = require('../../helpers/responseData');
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const moment = require("moment");
const Fancy = require("../../models/fancy.model");
let bcrypt = require('bcryptjs');
const async = require('async');
const { isEmpty } = require("lodash");
const { triggerMethod } = require('../../helpers/socketWork');
const { Promise } = require("bluebird");
const CasinoGames = require("../../models/casinoGames.model");

module.exports = {
    get_match_list: async (req, res) => {
        try {
            let {
                keyword,
            } = req.query

            let regexFilter = {}

            if (keyword) {
                regexFilter = {
                    $or: [
                        { 'gameType': { $regex: keyword, $options: 'i' } },
                        { 'eventId': { $regex: keyword, $options: 'i' } },
                        { 'marketId': { $regex: keyword, $options: 'i' } },
                        { 'eventName': { $regex: keyword, $options: 'i' } },
                    ]
                }
            }

            if (req?.query?.gameType) {
                regexFilter.gameType = req?.query?.gameType;
            }
            if (req?.query?.status) {
                if (req?.query?.status == 'active') {
                    regexFilter.status = { $in: ['active', 'in_play'] };
                } else {
                    regexFilter.status = req?.query?.status;
                }
            } else {
                regexFilter.status = { $in: ['active', 'in_play'] };
            }

            // regexFilter.status ={$in:['active','in_play']};
            let sortBy = { eventDateTime: 1 };
            if (req?.query?.status && (req?.query?.status == 'active' || req?.query?.status == 'in_play' || req?.query?.status == 'abounded' || req?.query?.status == 'completed' || req?.query?.status == "tie" || req?.query?.status == "suspend")) {
                sortBy = { eventDateTime: -1 };
            }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Match.countDocuments(regexFilter);

            let queryResponse = await Match.aggregate([
                {
                    $match: regexFilter
                },
                { $sort: sortBy },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'fancies',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    status: 'open',
                                    isDeleted: false
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    matchId: 1,
                                    fancyName: 1,
                                    status: 1,
                                }
                            },
                            { $sort: { eventDateTime: 1 } }
                        ],
                        as: 'fancyList'
                    }
                },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'match': '$match',
                        'matchOdds': '$matchOdds',
                        'premiumFancy': '$premiumFancy',
                        'bookMaker': '$bookMaker',
                        'fancy': '$fancy',
                        'isMarketDataDelayed': '$isMarketDataDelayed',
                        'eventName': '$eventName',
                        'countryCode': '$countryCode',
                        'venue': '$venue',
                        'timeZone': '$timeZone',
                        'eventDateTime': '$eventDateTime',
                        'marketCount': '$marketCount',
                        'createdAt': '$createdAt',
                        'runners': '$jsonData',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'status': '$status',
                        'eventType': "$eventType",
                        'matchSetting': "$matchSetting",
                        'fancyList': "$fancyList",
                        'isBetFairDeclared': "$isBetFairDeclared",
                        'isBookmakerDeclared': "$isBookmakerDeclared",
                        'winner': "$winner"
                    }
                }
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST_TOURNAMENT", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    result_match_list: async (req, res) => {
        try {
            let {
                keyword,
            } = req.query

            let regexFilter = {
                // isBetFairDeclared: false
            }

            if (keyword) {
                regexFilter = {
                    $or: [
                        { 'gameType': { $regex: keyword, $options: 'i' } },
                        { 'eventId': { $regex: keyword, $options: 'i' } },
                        { 'marketId': { $regex: keyword, $options: 'i' } },
                        { 'eventName': { $regex: keyword, $options: 'i' } },
                    ]
                }
            }

            if (req?.query?.gameType) {
                regexFilter.gameType = req?.query?.gameType;
            }
            if (req?.query?.status) {
                if (req?.query?.status == 'active') {
                    regexFilter.status = { $in: ['active', 'in_play'] };
                } else {
                    regexFilter.status = req?.query?.status;
                }
            } else {
                regexFilter.status = { $in: ['active', 'in_play'] };
            }

            // regexFilter.status ={$in:['active','in_play']};
            let sortBy = { eventDateTime: -1 };
            // if(req?.query?.status && (req?.query?.status=='abounded' || req?.query?.status=='completed' || req?.query?.status=="tie" || req?.query?.status=="suspend"))
            // {
            //     sortBy ={eventDateTime:-1};
            // }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Match.countDocuments(regexFilter);

            let queryResponse = await Match.aggregate([
                {
                    $match: regexFilter
                },
                { $sort: sortBy },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'match': '$match',
                        'matchOdds': '$matchOdds',
                        'premiumFancy': '$premiumFancy',
                        'bookMaker': '$bookMaker',
                        'fancy': '$fancy',
                        'isMarketDataDelayed': '$isMarketDataDelayed',
                        'eventName': '$eventName',
                        'countryCode': '$countryCode',
                        'venue': '$venue',
                        'timeZone': '$timeZone',
                        'eventDateTime': '$eventDateTime',
                        'marketCount': '$marketCount',
                        'createdAt': '$createdAt',
                        'runners': '$jsonData',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'status': '$status',
                        'eventType': "$eventType",
                        'isBetFairDeclared': "$isBetFairDeclared",
                        'isBookmakerDeclared': "$isBookmakerDeclared",
                        'winner': "$winner",
                        'ip': "$isBetFairDeclaredType"
                    }
                }
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST_TOURNAMENT", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    add_match_list: async (req, res) => {
        try {
            let {
                keyword,
            } = req.query

            let regexFilter = {}

            if (keyword) {
                regexFilter = {
                    $or: [
                        { 'gameType': { $regex: keyword, $options: 'i' } },
                        { 'eventId': { $regex: keyword, $options: 'i' } },
                        { 'marketId': { $regex: keyword, $options: 'i' } },
                        { 'eventName': { $regex: keyword, $options: 'i' } },
                    ]
                }
            }

            if (req?.query?.gameType) {
                regexFilter.gameType = req?.query?.gameType;
            }

            if (req?.query?.status) {
                regexFilter.status = req?.query?.status;
            } else {
                regexFilter.status = 'pending';
            }
            regexFilter.eventDateTime = { $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Match.countDocuments(regexFilter);

            let queryResponse = await Match.aggregate([
                {
                    $match: regexFilter
                },
                { $sort: { eventDateTime: 1 } },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'match': '$match',
                        'matchOdds': '$matchOdds',
                        'premiumFancy': '$premiumFancy',
                        'bookMaker': '$bookMaker',
                        'fancy': '$fancy',
                        'isMarketDataDelayed': '$isMarketDataDelayed',
                        'eventName': '$eventName',
                        'countryCode': '$countryCode',
                        'venue': '$venue',
                        'timeZone': '$timeZone',
                        'eventDateTime': '$eventDateTime',
                        'marketCount': '$marketCount',
                        'createdAt': '$createdAt',
                        'runners': '$jsonData',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'status': '$status',
                        'eventType': "$eventType"
                    }
                }
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST_TOURNAMENT", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    update_multiple: async (req, res) => {
        try {

            let { status, eventIds } = req.body
            let query;
            const updateObj = { status: status };
            if (status == "delete") {
                await Match.deleteMany({ eventId: { $in: eventIds } });

            } else {
                query = await Match.updateMany({
                    eventId: { $in: eventIds }
                },
                    {
                        $set: updateObj
                    },
                    { returnOriginal: false })
            }

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    get_match_detail: async (req, res) => {
        try {
            let {
                eventId,
            } = req.query;

            if (!eventId) return res.json(responseData("INVALID", {}, req, false));

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

            let match = await Match.aggregate([
                {
                    $lookup: {
                        from: 'tournaments',
                        let: {
                            addr: '$seriesId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$seriesId', '$$addr'] },
                                    status: 'active'
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    seriesId: 1,
                                    seriesName: 1
                                }
                            },
                            { $sort: { eventDateTime: 1 } },
                        ],
                        as: 'tournament'
                    }
                },
                {
                    $unwind: {
                        path: '$tournament',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'fancies',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    // status:'open',
                                    // isDeleted:false,
                                    selectionId: {
                                        $in: await SessionBet.distinct('selectionId', { ...matchPlayerFilter, eventId, isDeclared: false })
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    matchId: 1,
                                    selectionId: 1,
                                    fancyName: 1,
                                    marketStatus: 1,
                                    marketType: 1,
                                    categoryType: 1,
                                    eventId: 1,
                                    marketId: 1,
                                    centralizedId: 1,
                                    jsonData: 1,
                                    eventDateTime: 1,
                                    status: 1,
                                    eventType: 1,
                                    // "positions":"$positions"
                                }
                            },
                            { $sort: { eventDateTime: 1 } },

                        ],
                        as: 'fancyList',

                    }
                },
                {
                    $match: {
                        eventId
                    }
                }
            ]);

            const matchData = (match && match.length > 0) ? match[0] : [];

            (matchData && matchData?.fancyList && matchData?.fancyList.length > 0) && await Promise.map(matchData?.fancyList, async function (item, i) {

                const positions = await SessionBet.aggregate([
                    {
                        $match: {
                            ...matchPlayerFilter,
                            selectionId: item.selectionId,
                            eventId: item.eventId,
                            isDeclared: false
                        }
                    },
                    {
                        $group: {
                            _id: { selectionId: '$selectionId', eventId: "$eventId" },
                            positionProfitAmount: { $sum: { "$toDouble": "$profitAmount" } },
                            positionLoseAmount: { $sum: { "$toDouble": "$loseAmount" } },
                            betRun: { $min: "$betRun" },
                            lossRunRange: { $min: "$lossRunRange" },
                            profitRunRange: { $max: "$profitRunRange" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            betRun: 1,
                            lossRunRange: 1,
                            profitRunRange: 1,
                            "selectionId": "$_id.selectionId",
                            positionProfitAmount: 1,
                            positionLoseAmount: 1
                        }
                    }
                ]);

                matchData.fancyList[i].positions = (positions && positions.length > 0) ? positions[0] : {};
            });

            return res.json(responseData("GET_LIST", matchData, req, true));

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    update_status: async (req, res) => {
        try {

            let { status, date_time } = req.body
            let id = req.params.id
            let query;
            if (status === 'update' && !req.body?.date_time) { return res.json(responseData("DATE_REQ", [], req, false)); }
            const updateObj = (status === 'update') ? { eventDateTime: new Date(req.body?.date_time) } : { status: status };
            query = await Match.findByIdAndUpdate({
                _id: ObjectId(id)
            },
                {
                    $set: updateObj
                },
                { returnOriginal: false })

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    add_match_ad: async (req, res) => {
        try {

            let { adsContent, adsStatus } = req.body
            let eventId = req.params.id
            await Match.findOneAndUpdate({
                eventId
            },
                {
                    $set: {
                        adsContent,
                        adsStatus
                    }
                },
                { returnOriginal: false });

            let query = await Match.findOne({
                eventId
            });

            triggerMethod.refreshPage(query);

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_status_by_eventId: async (req, res) => {
        try {

            let { status, eventId } = req.query
            if (status == 'abounded') {
                const query = await Match.findOneAndUpdate({
                    eventId
                },
                    {
                        $set: { status: status, isBetFairDeclared: true }
                    },
                    { returnOriginal: false });

                const deletedTransactions = await Transaction.find({ eventId })

                await DeletedTransaction.insertMany(deletedTransactions)

                await Transaction.deleteMany({ eventId });
                const deleteReports = await Report.find({ eventId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ eventId });

                await SessionBet.deleteMany({ eventId });
                await Bet.deleteMany({ eventId });
                await BetPosition.deleteMany({ eventId });
                await SportBookBet.deleteMany({ eventId });

                return res.json(responseData("UPDATED_SUCCESSFULLY", { query }, req, true));

            } else if (status == 'tie') {
                const query = await Match.findOneAndUpdate({
                    eventId
                },
                    {
                        $set: { status: status, isBetFairDeclared: true }
                    },
                    { returnOriginal: false });

                const deletedTransactions = await Transaction.find({ eventId, betFaireType: 'betfair' })

                await DeletedTransaction.insertMany(deletedTransactions)
                await Transaction.deleteMany({ eventId, betFaireType: 'betfair' });
                const deleteReports = await Report.find({ eventId, reportType: 'betfair' })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ eventId, reportType: 'betfair' });

                // await SessionBet.deleteMany({ eventId });
                await Bet.deleteMany({ eventId });
                await BetPosition.deleteMany({ eventId });
                // await SportBookBet.deleteMany({ eventId });

                return res.json(responseData("UPDATED_SUCCESSFULLY", { query }, req, true));
            } else {
                const query = await Match.updateMany({
                    eventId
                },
                    {
                        $set: { status: status }
                    },
                    { returnOriginal: false });

                return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

            }

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    inplay_status: async (req, res) => {
        try {
            let { status } = req.query

            if (status === 'abounded') {
                const updateObj = { status: 'abounded' };
                const query = await Match.updateMany({
                    eventDateTime: { $lte: new Date(moment().subtract(5, 'hours').format("YYYY-MM-DD HH:mm:ss")) },
                },
                    {
                        $set: updateObj
                    });

                return res.json(responseData("UPDATED_SUCCESSFULLY", { query }, req, true));

            } else {
                const updateObj = { status: 'in_play' };
                const query = await Match.updateMany({
                    eventDateTime: { $lte: new Date(moment().format("YYYY-MM-DD HH:mm:ss")) },
                    // status:'active'
                },
                    {
                        $set: updateObj
                    });

                return res.json(responseData("UPDATED_SUCCESSFULLY", { query }, req, true));
            }

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_series_status: async (req, res) => {
        try {

            let { status, seriesId } = req.body
            let query;
            if (!req.body?.seriesId) { return res.json(responseData("seriesId_req", [], req, false)); }
            query = await Match.updateMany({
                seriesId
            },
                {
                    $set: { status: status }
                },
                { returnOriginal: false });

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_match: async (req, res) => {
        try {

            if (!req.params.id) { return res.json(responseData("id field is required", [], req, false)); }
            let id = req.params.id
            const updateData = {};
            if (req.body?.match) updateData.match = req.body?.match;
            if (req.body?.matchOdds) updateData.matchOdds = req.body?.matchOdds;
            if (req.body?.bookMaker) updateData.bookMaker = req.body?.bookMaker;
            if (req.body?.premiumFancy) updateData.premiumFancy = req.body?.premiumFancy;
            if (req.body?.fancy) updateData.fancy = req.body?.fancy;

            let query = await Match.findByIdAndUpdate({
                _id: ObjectId(id)
            },
                {
                    $set: updateData
                },
                { returnOriginal: false })

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_match_limit: async (req, res) => {
        try {

            let { data } = req.body;
            let type = (req.body?.seriesId) ? { seriesId: req.body?.seriesId } : { eventId: req.body?.eventId };
            const query = await Match.updateMany(type,
                {
                    $set: { matchSetting: data }
                },
                { upsert: true, returnOriginal: false });

            if (req.body?.seriesId) {
                await Tournament.updateMany({
                    seriesId: req.body?.seriesId
                },
                    {
                        $set: { matchSetting: data }
                    },
                    { upsert: true, returnOriginal: false });
            }

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    get_fancy_list: async (req, res) => {
        try {

            let regexFilter = {}
            let { eventId, fancyStatus } = req.query;
            if (req.query?.fancyType && req.query?.fancyType == "premium-fancy-list") {
                if (req.query?.keyword) {
                    regexFilter = {
                        $or: [
                            { 'fancyName': { $regex: req.query?.keyword, $options: 'i' } },
                            { 'eventName': { $regex: req.query?.keyword, $options: 'i' } },
                        ]
                    }
                }
                regexFilter.eventId = eventId;
                regexFilter.isDeleted = false;
                regexFilter.marketId = { $in: await SportBookBet.distinct('marketId', { eventId }) }
                if (fancyStatus) {
                    if (fancyStatus === 'pending') {
                        regexFilter.status = { $in: ["pending", "open", "active"] };
                    } else {
                        regexFilter.status = fancyStatus;
                    }

                } else {
                    regexFilter.status = { $in: ["pending", "open", "active", "close", "completed"] };
                }
                let sortBy = { updatedAt: 1 };
                // regexFilter.eventId=eventId;
                const result = await SportBook.aggregate([
                    {
                        $match: regexFilter
                    },
                    { $sort: sortBy }
                ]);

                return res.json(responseData("List", result, req, true));
            } else {

                if (req.query?.keyword) {
                    regexFilter = {
                        $or: [
                            { 'fancyName': { $regex: req.query?.keyword, $options: 'i' } },
                            { 'eventName': { $regex: req.query?.keyword, $options: 'i' } },
                        ]
                    }
                }
                regexFilter.eventId = eventId;
                regexFilter.isDeleted = false;
                regexFilter.selectionId = { $in: await SessionBet.distinct('selectionId', { eventId }) }
                if (fancyStatus) {
                    if (fancyStatus === 'pending') {
                        regexFilter.status = { $in: ["pending", "open", "active"] };
                    } else {
                        regexFilter.status = fancyStatus;
                    }

                } else {
                    regexFilter.status = { $in: ["pending", "open", "active", "close", "completed"] };
                }
                let sortBy = { updatedAt: 1 };
                // regexFilter.eventId=eventId;
                const result = await Fancy.aggregate([
                    {
                        $match: regexFilter
                    },
                    { $sort: sortBy }
                ]);

                return res.json(responseData("List", result, req, true));
            }


        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    get_premium_fancy_list: async (req, res) => {
        try {

            let regexFilter = {}
            let { eventId, fancyStatus } = req.query;
            if (req.query?.keyword) {
                regexFilter = {
                    $or: [
                        { 'fancyName': { $regex: req.query?.keyword, $options: 'i' } },
                        { 'eventName': { $regex: req.query?.keyword, $options: 'i' } },
                    ]
                }
            }
            regexFilter.eventId = eventId;
            regexFilter.isDeleted = false;
            regexFilter.marketId = { $in: await SportBookBet.distinct('marketId', { eventId }) }
            if (fancyStatus) {
                if (fancyStatus === 'pending') {
                    regexFilter.status = { $in: ["pending", "open", "active"] };
                } else {
                    regexFilter.status = fancyStatus;
                }

            } else {
                regexFilter.status = { $in: ["pending", "open", "active", "close", "completed"] };
            }
            let sortBy = { updatedAt: 1 };
            // regexFilter.eventId=eventId;
            const result = await SportBookBet.aggregate([
                {
                    $match: regexFilter
                },
                { $sort: sortBy }
            ]);

            return res.json(responseData("List", result, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    get_result_fancy_premium_list: async (req, res) => {
        try {

            let regexFilter = {}
            let { eventId, fancyStatus } = req.query;
            if (req.query?.keyword) {
                regexFilter = {
                    $or: [
                        { 'fancyName': { $regex: req.query?.keyword, $options: 'i' } },
                        { 'eventName': { $regex: req.query?.keyword, $options: 'i' } },
                    ]
                }
            }
            regexFilter.eventId = eventId;
            regexFilter.isDeleted = false;
            regexFilter.status = { $in: ["pending", "open", "active", "close", "completed"] };
            let sortBy = { updatedAt: 1 };
            const premiumFancy = await SportBookPremiumFancy.aggregate([
                {
                    $match: {
                        ...regexFilter,
                        eventId
                    }
                },
                { $sort: sortBy }
            ]);

            const fancy = await Fancy.aggregate([
                {
                    $match: {
                        ...regexFilter,
                        selectionId: { $in: await SessionBet.distinct('selectionId', { eventId }) }
                    }
                },
                { $sort: sortBy }
            ]);

            const newObject = [...fancy, ...premiumFancy];

            const newDataArr = newObject && await newObject.map((item) => {
                return { ...item, fancyType: (item?.fancySelectionId) ? "premium" : "fancy" }
            })

            // console.log('newObject', newObject)

            return res.json(responseData("List", newDataArr, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    fancy_delete: async (req, res) => {
        try {

            const { _id } = req.user;
            const admin = await Admin.findOne({ _id })
            if (!req.body?.password) {
                return res.json(responseData("PASSWORD_REQUIRED", {}, req, false));
            }
            let { password, selectionId, eventId } = req.body;
            if (!admin) {
                return res.json(responseData("INVALID_USER", {}, req, false));
            }
            const match = await bcrypt.compare(password, admin.password)
            if (match) {

                await Fancy.findOneAndUpdate({
                    selectionId,
                    eventId
                },
                    {
                        $set: { isDeleted: true }
                    },
                    { returnOriginal: false });

                query = await SessionBet.findOneAndUpdate({
                    selectionId,
                    eventId
                },
                    {
                        $set: { isDeleted: true }
                    },
                    { returnOriginal: false });

                const deletedTransactions = await Transaction.find({ selectionId, eventId })

                await DeletedTransaction.insertMany(deletedTransactions)
                await Transaction.deleteMany({ selectionId, eventId });
                const deleteReports = await Report.find({ selectionId, eventId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ selectionId, eventId });

                return res.json(responseData("Deleted", {}, req, true));
            } else {
                return res.json(responseData("INVALID_PASSWORD", {}, req, false));
            }

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_fancy_status: async (req, res) => {
        try {
            let { eventId, selectionId, status } = req.body;
            if (status === "locked") {
                await Fancy.findOneAndUpdate({
                    selectionId,
                    eventId
                },
                    {
                        $set: { status }
                    },
                    { returnOriginal: false });

                await SessionBet.updateMany({
                    selectionId,
                    eventId
                },
                    {
                        $set: { isDeleted: true, status: "deleted" }
                    },
                    { returnOriginal: false });

                const deletedTransactions = await Transaction.find({ selectionId, eventId })

                await DeletedTransaction.insertMany(deletedTransactions)
                await Transaction.deleteMany({ selectionId, eventId });
                const deleteReports = await Report.find({ selectionId, eventId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ selectionId, eventId });
            } else {
                await Fancy.findOneAndUpdate({
                    selectionId,
                    eventId
                },
                    {
                        $set: { status }
                    },
                    { returnOriginal: false });
            }
            return res.json(responseData("Updated", {}, req, true));
        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_premiumfancy_status: async (req, res) => {
        try {
            let { eventId, selectionId, status, marketId } = req.body;
            if (status === "locked") {
                await SportBookPremiumFancy.findOneAndUpdate({
                    selectionId,
                    // marketId,
                    eventId
                },
                    {
                        $set: { status }
                    },
                    { returnOriginal: false });

                await SessionBet.updateMany({
                    selectionId,
                    // marketId,
                    eventId
                },
                    {
                        $set: { isDeleted: true, status: "deleted" }
                    },
                    { returnOriginal: false });

                const deletedTransactions = await Transaction.find({ selectionId, eventId })

                await DeletedTransaction.insertMany(deletedTransactions)
                await Transaction.deleteMany({ selectionId, eventId }); //marketId
                const deleteReports = await Report.find({ selectionId, eventId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ selectionId, eventId }); //marketId
            } else {
                await SportBookPremiumFancy.findOneAndUpdate({
                    selectionId,
                    // marketId,
                    eventId
                },
                    {
                        $set: { status }
                    },
                    { returnOriginal: false });
            }
            return res.json(responseData("Updated", {}, req, true));
        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    fancy_bet_position: async (req, res) => {
        try {
            let { eventId, marketId, selectionId, status } = req.query;
            // console.log('eventId, selectionId', eventId, selectionId);
            const previousBet = await SessionBet.aggregate([
                {
                    $match: { eventId, selectionId, isDeleted: false, status: { $in: ["pending", "active"] } }
                },
                {
                    $group: {
                        _id: "$betRun",
                        positionProfitAmount: { $sum: { "$toDouble": "$profitAmount" } },
                        positionLoseAmount: { $sum: { "$toDouble": "$loseAmount" } },
                        betRun: { $min: "$betRun" },
                        lossRunRange: { $min: "$lossRunRange" },
                        profitRunRange: { $max: "$profitRunRange" },
                    }
                },
                { $project: { _id: 0, betRun: 1, lossRunRange: 1, profitRunRange: 1, selectionId: `${selectionId}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
            ]);

            return res.json(responseData("Updated", previousBet, req, true));
        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    get_sport_filter_list: async (req, res) => {
        try {

            let regexFilter = {};

            if (req.query?.eventType) {
                regexFilter.eventType = req.query?.eventType
            }
            // else{
            //     regexFilter.eventType = '4';
            // }

            if (req.query?.eventId) {
                regexFilter.eventId = req.query?.eventId
            }

            let filterData = {};

            if (req.query?.status && req.query?.status == "in_play") {
                const sessionBet = await SessionBet.distinct('eventId', { isDeclared: false, status: { $ne: "deleted" } });
                const sportBookBet = await SportBookBet.distinct('eventId', { isDeclared: false });
                const finalBetData = [...sessionBet, ...sportBookBet];
                filterData = {
                    ...regexFilter,
                    $or: [
                        { eventId: { $in: finalBetData } },
                    ]
                }
            } else {
                if (req.query?.status) {
                    regexFilter.status = req.query?.status
                } else {
                    regexFilter.status = { $in: ['in_play', 'active'] };
                }

                filterData = {
                    ...regexFilter
                }
            }

            let matchData = await Match.aggregate([
                {
                    $match: filterData
                },
                {
                    $sort: {
                        eventDateTime: -1
                    }
                },
                {
                    $project: {
                        eventName: 1,
                        eventId: 1,
                        eventType: 1
                    }
                }
            ]);

            return res.json(responseData("GET_LIST_SPORT", matchData, req, true));

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_sport_filter_list_fancy_result: async (req, res) => {
        try {
            let regexFilter = {};
            if (req.query?.eventType) {
                regexFilter.eventType = req.query?.eventType
            }
            // else{
            //     regexFilter.eventType = '4';
            // }

            if (req.query?.status) {
                regexFilter.status = req.query?.status
            } else {
                regexFilter.status = { $in: ['in_play', 'active'] };
            }

            if (req.query?.fancyType == "premium-fancy-list") {
                let SessionBetExist = await SportBookBet.distinct('eventId', { isDeclared: false, status: { $ne: "deleted" } });
                if (SessionBetExist && SessionBetExist.length > 0) {
                    regexFilter.eventId = { $in: SessionBetExist };
                }
            } else {
                let SportBookBetExist = await SessionBet.distinct('eventId', { isDeclared: false, status: { $ne: "deleted" } });
                if (SportBookBetExist && SportBookBetExist.length > 0) {
                    regexFilter.eventId = { $in: SportBookBetExist };
                }
            }
            // console.log("regexFilter", regexFilter);
            let matchData = await Match.aggregate([
                {
                    $match: regexFilter
                },
                {
                    $project: {
                        eventName: 1,
                        eventId: 1,
                        eventType: 1
                    }
                }
            ]);

            return res.json(responseData("GET_LIST_SPORT", matchData, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    risk_match_list: async (req, res) => {
        try {
            const created_by = req?.query?.userId;
            const matchPlayerFilter = {};
            let changeIntype = req?.query?.userType;
            let keyType;
            if (changeIntype === 'agent') {
                matchPlayerFilter.agentId = ObjectId(created_by);
                keyType = "agentId"
            } else if (changeIntype === 'super_agent') {
                matchPlayerFilter.superAgentId = ObjectId(created_by);
                keyType = "superAgentId"
            } else if (changeIntype === 'senior_super') {
                matchPlayerFilter.superSeniorId = ObjectId(created_by);
                keyType = "superSeniorId"
            } else if (changeIntype === 'sub_admin') {
                matchPlayerFilter.subAdminId = ObjectId(created_by);
                keyType = "subAdminId"
            } else if (changeIntype === 'super_admin') {
                matchPlayerFilter.superAdminId = ObjectId(created_by);
                keyType = "superAdminId"
            } else if (changeIntype === 'admin') {
                matchPlayerFilter.adminId = ObjectId(created_by);
                keyType = "adminId"
            } else if (changeIntype === 'sub_owner') {
                matchPlayerFilter.subOwnerId = ObjectId(created_by);
                keyType = "subOwnerId"
            } else if (changeIntype === 'owner') {
                matchPlayerFilter.ownerId = ObjectId(created_by);
                keyType = "ownerId"
            } else {
                matchPlayerFilter.ownerId = "-1";
            }
            let betFaireResponse = await Match.aggregate([
                {
                    $match: {
                        status: { $in: ["in_play", "active"] },
                        $or: [
                            { eventId: { $in: await Bet.distinct('eventId', { ...matchPlayerFilter, betFaireType: "betfair", isMatched: true, isDeclared: false }) } },
                        ],
                        // $and:[
                        //     {status:"in_play"}
                        // ]
                    }
                },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'match': '$match',
                        'matchOdds': '$matchOdds',
                        'premiumFancy': '$premiumFancy',
                        'bookMaker': '$bookMaker',
                        'fancy': '$fancy',
                        'isMarketDataDelayed': '$isMarketDataDelayed',
                        'eventName': '$eventName',
                        'countryCode': '$countryCode',
                        'venue': '$venue',
                        'timeZone': '$timeZone',
                        'eventDateTime': '$eventDateTime',
                        'marketCount': '$marketCount',
                        'createdAt': '$createdAt',
                        'runners': '$jsonData',
                        'centralizedId': "$centralizedId"
                    }
                }
            ]);

            const bets = await Bet.distinct("matchBetId", { ...matchPlayerFilter, isDeclared: false });

            if (betFaireResponse && betFaireResponse.length > 0) {
                const positionArray = [];
                async.eachSeries(betFaireResponse, (item, callback) => {
                    const BetFairS1 = (item?.runners && item?.runners[0] && item?.runners[0]?.SelectionId) ? item?.runners && item?.runners[0] && item?.runners[0]?.SelectionId : null;
                    const BetFairS2 = (item?.runners && item?.runners[1] && item?.runners[1]?.SelectionId) ? item?.runners && item?.runners[1] && item?.runners[1]?.SelectionId : null;
                    const BetFairS3 = (item?.runners && item?.runners[2] && item?.runners[2]?.SelectionId) ? item?.runners && item?.runners[2] && item?.runners[2]?.SelectionId : null;

                    BetPosition.aggregate([
                        {
                            $match: {
                                matchBetId: { $in: bets },
                                marketId: item?.marketId,
                                selectionId: `${BetFairS1}`,
                            }
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
                                $match: { matchBetId: { $in: bets }, marketId: item?.marketId, selectionId: `${BetFairS2}` }
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
                                        $match: { matchBetId: { $in: bets }, marketId: item?.marketId, selectionId: `${BetFairS3}` }
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

                                    const finaldata = [{ "selectionId": BetFairS1, position: 0 }, { "selectionId": BetFairS2, position: 0 }, { "selectionId": BetFairS3, position: 0 }];
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

                                    positionArray.push({ 'position': finaldata, ...item })

                                    callback(null);
                                }).catch(error => {
                                    console.log('error----1', error);
                                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                                })

                            } else {

                                const finaldata = [{ "selectionId": BetFairS1, position: 0 }, { "selectionId": BetFairS2, position: 0 }];
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

                                positionArray.push({ 'position': finaldata, ...item })

                                callback(null);
                            }
                        }).catch(error => {
                            console.log('error----2', error);
                            return res.json(responseData("ERROR_OCCUR", error, req, false));
                        })
                    }).catch(error => {
                        console.log('error------3', error);
                        return res.json(responseData("ERROR_OCCUR", error, req, false));
                    })
                }, function (err) {
                    if (err) {
                        console.log('err-------------', err)
                        return res.json(responseData("ERROR_OCCUR", err, req, false));
                    }
                    return res.json(responseData("betFaire", positionArray, req, true));
                }
                );
                // return res.json(responseData("GET_LIST", {betFaireResponse}, req, true));
            } else {
                return res.json(responseData("GET_LIST", { betFaireResponse }, req, true));
            }
        } catch (err) {
            console.log('err---------------------', err)
            return res.status(422).json(responseData(err, {}, req, false));
        }
    },
    risk_bookmaker_match_list: async (req, res) => {
        try {

            let betFaireResponse = await Match.aggregate([
                {
                    $match: {
                        status: { $in: ["in_play", "active"] },
                        $or: [
                            { eventId: { $in: await Bet.distinct('eventId', { betFaireType: "bookmaker", isMatched: true, isDeclared: false }) } },
                        ]
                    }
                },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'match': '$match',
                        'matchOdds': '$matchOdds',
                        'premiumFancy': '$premiumFancy',
                        'bookMaker': '$bookMaker',
                        'fancy': '$fancy',
                        'isMarketDataDelayed': '$isMarketDataDelayed',
                        'eventName': '$eventName',
                        'countryCode': '$countryCode',
                        'venue': '$venue',
                        'timeZone': '$timeZone',
                        'eventDateTime': '$eventDateTime',
                        'marketCount': '$marketCount',
                        'createdAt': '$createdAt',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'bookmakerCentralizedId': "$bookmakerCentralizedId"
                    }
                }
            ])

            if (betFaireResponse && betFaireResponse.length > 0) {
                const positionArray = [];
                async.eachSeries(betFaireResponse, (item, callback) => {
                    const BetFairS1 = (item?.bookmakerRunners && item?.bookmakerRunners[0] && item?.bookmakerRunners[0]?.SelectionId) ? item?.bookmakerRunners && item?.bookmakerRunners[0] && item?.bookmakerRunners[0]?.SelectionId : null;
                    const BetFairS2 = (item?.bookmakerRunners && item?.bookmakerRunners[1] && item?.bookmakerRunners[1]?.SelectionId) ? item?.bookmakerRunners && item?.bookmakerRunners[1] && item?.bookmakerRunners[1]?.SelectionId : null;
                    const BetFairS3 = (item?.bookmakerRunners && item?.bookmakerRunners[2] && item?.bookmakerRunners[2]?.SelectionId) ? item?.bookmakerRunners && item?.bookmakerRunners[2] && item?.bookmakerRunners[2]?.SelectionId : null;

                    console.log('item?._id', item?._id, BetFairS1, BetFairS2)
                    BetPosition.aggregate([
                        {
                            //
                            $match: { marketId: item?.marketId, selectionId: `${BetFairS1}` }
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
                                $match: { marketId: item?.marketId, selectionId: `${BetFairS2}` }
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
                                        $match: { marketId: item?.marketId, selectionId: `${BetFairS3}` }
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

                                    const finaldata = [{ "selectionId": BetFairS1, position: 0 }, { "selectionId": BetFairS2, position: 0 }, { "selectionId": BetFairS3, position: 0 }];
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

                                    positionArray.push({ 'position': finaldata, ...item })

                                    callback(null);
                                }).catch(error => {
                                    console.log('error----1', error);
                                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                                })

                            } else {

                                const finaldata = [{ "selectionId": BetFairS1, position: 0 }, { "selectionId": BetFairS2, position: 0 }];
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

                                positionArray.push({ 'position': finaldata, ...item })

                                callback(null);
                            }
                        }).catch(error => {
                            console.log('error----2', error);
                            return res.json(responseData("ERROR_OCCUR", error, req, false));
                        })
                    }).catch(error => {
                        console.log('error------3', error);
                        return res.json(responseData("ERROR_OCCUR", error, req, false));
                    })
                }, function (err) {
                    if (err) {
                        console.log('err-------------', err)
                        return res.json(responseData("ERROR_OCCUR", err, req, false));
                    }
                    // positionArray
                    return res.json(responseData("bookmaker", positionArray, req, true));
                }
                );
                // return res.json(responseData("GET_LIST", {betFaireResponse}, req, true));
            } else {
                return res.json(responseData("GET_LIST", { betFaireResponse }, req, true));
            }
        } catch (err) {
            console.log('err---------------------', err)
            return res.status(422).json(responseData(err, {}, req, false));
        }
    },
    top_casino_list: async (req, res) => {
        try {
            const casinoList = await CasinoGames.find({ game_name: { $regex: req?.query?.keyword, $options: 'i' } })
            if (isEmpty(casinoList)) {
                return res.json(responseData("NOT_FOUND_TOP_CASINO", [], req, true));
            }
            return res.json(responseData("GET_LIST", casinoList, req, true));
        } catch (error) {
            console.log("error", error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    casino_status_update: async (req, res) => {
        try {
            const { status } = req.body;
            const casinoList = await CasinoGames.findOneAndUpdate({ _id: req.params.id }, { $set: { top_games: status } }, { new: true })
            if (isEmpty(casinoList)) {
                return res.json(responseData("NOT_FOUND_TOP_CASINO", [], req, true));
            }
            return res.json(responseData("GET_LIST", casinoList, req, true));
        } catch (error) {
            console.log("error", error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }
}