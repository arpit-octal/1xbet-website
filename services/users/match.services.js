const Match = require("../../models/match.model");
const Fancy = require("../../models/fancy.model");
const SportBookPremiumFancy = require("../../models/sportBookPremiumFancy");
const Tournament = require("../../models/tournament.model");
const User = require("../../models/user.model");
const Report = require("../../models/report.model");
const GlobalLimitSetting = require("../../models/globalLimitSetting.model");

const Bet = require("../../models/bet.model");
const BetPosition = require("../../models/betPosition.model");

const SessionBet = require("../../models/sessionBet.model");
const CasinoBet = require("../../models/casinoBet.model");

const SportBook = require("../../models/sportBook.model");
const SportBookBet = require("../../models/sportsBookBet.model");

const Transaction = require("../../models/transaction.model");
const DeletedTransaction = require("../../models/deletedTransaction.model");
const ExposureTransaction = require("../../models/exposure.transaction.model");
const DeletedExposureTransaction = require("../../models/deletedExposure.transaction.model");
const globalSettings = require("../../models/globalLimitSetting.model");

const { getPaginateObj } = require('../../helpers/serviceHelper');

const { getAccessToken, betFairFormula, sessionFormula } = require('../../helpers/helper')
const { ObjectId } = require('mongodb');
const moment = require("moment");
const axios = require('axios').default;
const async = require('async');
const { triggerMethod } = require('../../helpers/socketWork');
const satelize = require('satelize');

const { responseData } = require("../../helpers/responseData");
const CasinoGames = require("../../models/casinoGames.model");

const BETFAIRODDS = "http://172.105.54.97:8085";

module.exports = {
    get_match_list: async (req, res) => {
        try {

            let regexFilter = {}

            regexFilter.gameType = (req?.query?.gameType) ? req?.query?.gameType : 'cricket';
            if (req?.query?.seriesId) {
                regexFilter.seriesId = req?.query?.seriesId
            }

            if (req?.query?.status) {
                regexFilter.status = req?.query?.status;
            } else {
                regexFilter.status = { $in: ['active', 'in_play'] };
            }

            //eventName:{$regex: "T10", $options: 'i' }

            // regexFilter.eventDateTime = { $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) }

            let queryResponse = await Match.aggregate([
                {
                    $lookup: {
                        from: 'sports',
                        let: {
                            addr: '$eventType'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$betfairId', '$$addr'] },
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    betfairId: 1,
                                    status: 1
                                }
                            }
                        ],
                        as: 'sport_setting'
                    }
                },
                {
                    $unwind: {
                        path: '$sport_setting',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $lookup: {
                        from: 'tournaments',
                        let: {
                            addr: '$seriesId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    status: 'active',
                                    $expr: { $eq: ['$seriesId', '$$addr'] },
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
                        from: 'multi_markets',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    createdBy: ObjectId(req?.query?.userId)
                                }
                            },
                            {
                                $project: {
                                    createdBy: 1,
                                    eventId: 1
                                }
                            }
                        ],
                        as: 'multi_market'
                    }
                },
                {
                    $unwind: {
                        path: '$multi_market',
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
                                    status: 'open',
                                    isDeleted: false
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    matchId: 1,
                                    selectionId: 1,
                                    fancyName: 1,
                                    eventId: 1,
                                    marketId: 1,
                                    centralizedId: 1,
                                    status: 1,
                                    eventType: 1
                                }
                            },
                            { $sort: { eventDateTime: 1 } }
                        ],
                        as: 'fancyList'
                    }
                },
                {
                    $match: regexFilter
                },
                { $sort: { eventDateTime: 1 } },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'centralizedId': '$centralizedId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'bookmakerCentralizedId': '$bookmakerCentralizedId',
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
                        'runners': '$jsonData',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'status': '$status',
                        'eventType': "$eventType",
                        'seriesName': "$tournament.seriesName",
                        "multiMarket": "$multi_market",
                        "matchSetting": "$matchSetting",
                        "fancyList": "$fancyList",
                        "scoreId": "$scoreId",
                        "channel": "$channel",
                        "sport_setting": "$sport_setting"
                    }
                }
            ]);

            return res.json(responseData("GET_LIST_MATCH", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_mobile_match_list: async (req, res) => {
        try {

            let regexFilter = {}

            regexFilter.gameType = (req?.query?.gameType) ? req?.query?.gameType : 'cricket';
            if (req?.query?.seriesId) {
                regexFilter.seriesId = req?.query?.seriesId
            }

            regexFilter.status = { $in: ['active', 'in_play'] };

            // regexFilter.eventDateTime = { $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) }

            let queryResponse;
            queryResponse = await Match.aggregate([
                // {
                //     $lookup: {
                //             from: 'multi_markets',
                //             let: {
                //                 addr: '$eventId'
                //             },
                //             pipeline: [
                //                 {
                //                     $match: {
                //                         $expr: { $eq: [ '$eventId', '$$addr'] },
                //                         createdBy:ObjectId(req?.query?.userId)
                //                     }
                //                 },
                //                 {
                //                     $project:{
                //                         createdBy:1,
                //                         eventId:1
                //                     }
                //                 }
                //             ],
                //             as: 'multi_market'
                //     }
                // },
                {
                    $match: regexFilter
                },
                { $sort: { eventDateTime: 1 } },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'centralizedId': '$centralizedId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'bookmakerCentralizedId': '$bookmakerCentralizedId',
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
                        'runners': '$jsonData',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'status': '$status',
                        'eventType': "$eventType",
                        'seriesName': "$tournament.seriesName",
                        "matchSetting": "$matchSetting",
                        // "fancyList":{$size:"$fancyList"},
                        // "multi_market":{$size:"$multi_market"},
                        "scoreId": "$scoreId",
                        "channel": "$channel",
                    }
                }
            ]);

            // await deleteData(`sorts_${regexFilter.gameType}`);
            // let allRecords_Cache = await getData(`sorts_${regexFilter.gameType}`).catch((err) => {
            //     if (err) console.error('error--',err)
            // });
            // if(allRecords_Cache){
            //     console.log('get_mobile_match_list',1)
            //     queryResponse = JSON.parse(allRecords_Cache);
            // }
            // else{
            //     console.log('get_mobile_match_list',2);
            //     queryResponse = await Match.aggregate([
            //         // {
            //         //     $lookup: {
            //         //             from: 'multi_markets',
            //         //             let: {
            //         //                 addr: '$eventId'
            //         //             },
            //         //             pipeline: [
            //         //                 {
            //         //                     $match: {
            //         //                         $expr: { $eq: [ '$eventId', '$$addr'] },
            //         //                         createdBy:ObjectId(req?.query?.userId)
            //         //                     }
            //         //                 },
            //         //                 {
            //         //                     $project:{
            //         //                         createdBy:1,
            //         //                         eventId:1
            //         //                     }
            //         //                 }
            //         //             ],
            //         //             as: 'multi_market'
            //         //     }
            //         // },
            //         {
            //             $match:regexFilter
            //         },
            //         { $sort:{eventDateTime:1} },
            //         {
            //             $project:{
            //                 '_id':'$_id',
            //                 'gameType': '$gameType',
            //                 'tournamentId':'$tournamentId',
            //                 'seriesId': '$seriesId',
            //                 'eventId': '$eventId',
            //                 'marketId': '$marketId',
            //                 'centralizedId': '$centralizedId',
            //                 'bookmakerMarketId': '$bookmakerMarketId',
            //                 'bookmakerCentralizedId': '$bookmakerCentralizedId',
            //                 'match': '$match',
            //                 'matchOdds': '$matchOdds',
            //                 'premiumFancy': '$premiumFancy',
            //                 'bookMaker': '$bookMaker',
            //                 'fancy': '$fancy',
            //                 'isMarketDataDelayed': '$isMarketDataDelayed',
            //                 'eventName': '$eventName',
            //                 'countryCode': '$countryCode',
            //                 'venue': '$venue',
            //                 'timeZone': '$timeZone',
            //                 'eventDateTime': '$eventDateTime',
            //                 'marketCount': '$marketCount',
            //                 'runners': '$jsonData',
            //                 'bookmakerRunners': '$jsonBookmakerData',
            //                 'status':'$status',
            //                 'eventType':"$eventType",
            //                 'seriesName':"$tournament.seriesName",
            //                 "matchSetting":"$matchSetting",
            //                 // "fancyList":{$size:"$fancyList"},
            //                 // "multi_market":{$size:"$multi_market"},
            //                 "scoreId":"$scoreId",
            //                 "channel":"$channel",
            //             }
            //         }
            //     ]);
            //     await setData(`sorts_${regexFilter.gameType}`, queryResponse);
            // }
            return res.json(responseData("GET_LIST_MATCH", queryResponse, req, true));

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    search_list: async (req, res) => {
        try {

            let regexFilter = {}

            // regexFilter.gameType = (req?.query?.gameType)?req?.query?.gameType:'cricket';
            // if(req?.query?.seriesId){
            //     regexFilter.seriesId = req?.query?.seriesId
            // }
            if (req?.query?.keyword) {
                regexFilter = {
                    $or: [
                        // { 'gameType': { $regex: req?.query?.keyword, $options: 'i' } },
                        // { 'eventId': { $regex: req?.query?.keyword, $options: 'i' } },
                        // { 'marketId': { $regex: req?.query?.keyword, $options: 'i' } },
                        { 'eventName': { $regex: req?.query?.keyword, $options: 'i' } },
                    ]
                }
            }

            regexFilter.status = { $in: ['active', 'in_play'] };

            // regexFilter.eventDateTime = { $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) }

            let queryResponse = await Match.aggregate([
                {
                    $lookup: {
                        from: 'tournaments',
                        let: {
                            addr: '$seriesId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    status: 'active',
                                    $expr: { $eq: ['$seriesId', '$$addr'] },
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
                    $match: regexFilter
                },
                { $sort: { eventDateTime: 1 } },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'centralizedId': '$centralizedId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'bookmakerCentralizedId': '$bookmakerCentralizedId',
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
                        'runners': '$jsonData',
                        'bookmakerRunners': '$jsonBookmakerData',
                        'status': '$status',
                        'eventType': "$eventType",
                        'seriesName': "$tournament.seriesName",
                        "matchSetting": "$matchSetting"
                    }
                }
            ]);

            return res.json(responseData("GET_LIST_MATCH", queryResponse, req, true));

        } catch (error) {
            // // console.log('error',error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_series_list: async (req, res) => {
        try {
            let {
                keyword,
            } = req.query

            let regexFilter = {};

            regexFilter.gameType = (req?.query?.gameType) ? req?.query?.gameType : 'cricket';
            regexFilter.status = 'active';
            regexFilter.seriesId = {
                "$in": await Match.distinct('seriesId', { eventDateTime: { $gte: new Date(moment().utc().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) }, status: { $in: ['active', 'in_play'] } })
            };

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

            let queryResponse = await Tournament.aggregate([
                {
                    $lookup: {
                        from: 'matches',
                        let: {
                            addr: '$seriesId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$seriesId', '$$addr'] },
                                    eventDateTime: { $gte: new Date(moment().utc().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) },
                                    status: { $in: ['active', 'in_play'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    eventId: 1,
                                    marketId: 1,
                                    centralizedId: 1,
                                    bookmakerMarketId: 1,
                                    bookmakerCentralizedId: 1,
                                    eventName: 1,
                                    eventDateTime: 1,
                                    status: 1,
                                    eventType: 1
                                }
                            },
                            { $sort: { eventDateTime: 1 } }
                        ],
                        as: 'matchList'
                    }
                },
                // {
                //     $lookup: {
                //         from: "matches",
                //         localField: "seriesId",
                //         foreignField: "seriesId",
                //         as: "matchList"
                //     },
                // },
                {
                    $match: regexFilter
                },
                { $sort: { createdAt: 1 } }
            ]);

            return res.json(responseData("GET_LIST_TOURNAMENT", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_match_detail: async (req, res) => {
        try {
            let {
                eventId,
            } = req.query;

            if (!eventId) return res.json(responseData("INVALID", {}, req, false));

            // const response = await axios({
            //     method: 'get',
            //     // url: `${betFairOdds}/listEventsBySport/${sport}`
            //     url: `http://3.111.197.37:8001/`
            // });
            // let isTvOn = response.data.filter((item) => {
            //     return item.eventId == eventId
            // })
            // isTvOn = isTvOn.length > 0 ? true : false
            let isTvOn = false



            let matchData;
            let match = await Match.aggregate([
                {
                    $lookup: {
                        from: 'sports',
                        let: {
                            addr: '$eventType'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$betfairId', '$$addr'] },
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    betfairId: 1,
                                    status: 1
                                }
                            }
                        ],
                        as: 'sport_setting'
                    }
                },
                {
                    $unwind: {
                        path: '$sport_setting',
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
                                    status: 'open',
                                    isDeleted: false
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
                                    eventType: 1
                                }
                            },
                            { $sort: { categoryType: 1 } }
                        ],
                        as: 'fancyList'
                    }
                },
                {
                    $lookup: {
                        from: 'multi_markets',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    createdBy: ObjectId(req?.query?.userId)
                                }
                            },
                            {
                                $project: {
                                    createdBy: 1,
                                    eventId: 1
                                }
                            }
                        ],
                        as: 'multi_market'
                    }
                },
                {
                    $unwind: {
                        path: '$multi_market',
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $match: {
                        eventId
                    }
                },
                {
                    $addFields: {
                        isTvOn: isTvOn
                    }
                }
            ]);

            matchData = (match && match.length > 0) ? match[0] : match;
            if (matchData && matchData?.matchSetting && matchData?.matchSetting.length == 0) {
                matchData.matchSetting = await globalSettings.find({ sportType: matchData?.gameType });
            }
            return res.json(responseData("GET_LIST", matchData, req, true));

        } catch (error) {
            console.log('get_match_detail error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_match_fancy: async (req, res) => {
        try {
            let {
                eventId,
            } = req.query;

            if (!eventId) return res.json(responseData("INVALID", {}, req, false));

            let fancyList = await Fancy.find({ eventId, status: 'open', isDeleted: false }).sort({ "categoryType": 1 });

            return res.json(responseData("GET_LIST", fancyList, req, true));

        } catch (error) {
            // console.log(('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    fancy_bet_position: async (req, res) => {
        try {
            let {
                eventId,
            } = req.query;

            let matchExist = await Match.findOne({
                eventId
            });

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            const previousBet = await Transaction.aggregate([
                {
                    $match: { userId: req.user._id, isDeclared: false, eventId }
                },
                {
                    $group: {
                        _id: {
                            "selectionId": "$selectionId",
                            "eventId": "$eventId",
                            "fancyName": "$runnerName"
                        },
                        realCutAmount: { $sum: "$realCutAmount" }
                    }
                },
                {
                    $project: {
                        "selectionId": "$_id.selectionId",
                        "eventId": "$_id.eventId",
                        "position": "$realCutAmount",
                        "fancyName": "$_id.fancyName",
                    }
                }
            ]);

            return res.json(responseData("success", previousBet, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    sport_book_bet_position: async (req, res) => {
        try {
            let {
                eventId,
            } = req.query;

            let matchExist = await Match.findOne({
                eventId
            });

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            return res.json(responseData("success", [], req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    // get bet position
    get_bet_position: async (req, res) => {
        try {
            let {
                eventId,
            } = req.query;

            let matchExist = await Match.findOne({
                eventId
            });

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            const runBetPosition = [];
            const betFarPositionArray = [];

            const apiData = await BetPosition.aggregate([
                {
                    $match: { userId: req?.user._id, marketId: matchExist?.marketId }
                },
                { $project: { marketId: 1, selectionId: 1, positionProfitAmount: 1, positionLoseAmount: 1 } }
            ])
            apiData && apiData.map((item) => {
                // console.log('item---------',item);
                if (runBetPosition.findIndex((a) => a.selectionId == item.selectionId) == -1) {
                    runBetPosition.push({ selectionId: item.selectionId, positionLoseAmount: item?.positionLoseAmount, positionProfitAmount: item?.positionProfitAmount });

                } else {

                    const index = runBetPosition.findIndex((a) => a.selectionId == item.selectionId);
                    runBetPosition[index].positionLoseAmount += item?.positionLoseAmount;
                    runBetPosition[index].positionProfitAmount += item?.positionProfitAmount;
                }
            });

            runBetPosition && runBetPosition.map((item) => {
                // console.log('item---------',item);
                if (item.positionProfitAmount > item.positionLoseAmount) {
                    position = item.positionProfitAmount - item.positionLoseAmount;
                } else {
                    let losAmt = item.positionLoseAmount - item.positionProfitAmount;
                    position = -losAmt;
                }
                betFarPositionArray.push({ "selectionId": item.selectionId, position });
            });

            return res.json(responseData("BET_POSITION", { 'betFair': betFarPositionArray }, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_events_bet_position: async (req, res) => {
        try {

            let userExist = await User.findOne({
                _id: req.user._id
            })

            if (!userExist) {
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }
            // && req.body?.eventIds.length<=0
            if (!req.body?.eventIds) {
                return res.json(responseData("eventIds_invalid", {}, req, false));
            }
            const positionArray = [];
            async.eachSeries(req.body?.eventIds, (item, callback) => {
                callback(null)
            }, function (err) {
                if (err) {
                    // console.log('err-------------',err)
                    return res.json(responseData("ERROR_OCCUR", err, req, false));
                }
                if (positionArray && positionArray.length > 0) {
                    return res.json(responseData("BET_POSITION", positionArray, req, true));

                } else {
                    return res.json(responseData("INVALID", {}, req, false));
                }
            }
            );

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    check_bet_price: async (req, res) => {
        try {

            let userExist = await User.findOne({
                _id: req.user._id
            }, { betsBlocked: 1, betBlock: 1 });

            let matchExist = await Match.findOne({
                eventId: req.body?.eventId
            })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            if (!userExist) {
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }

            if (userExist?.betBlock) {
                return res.json(responseData("BET_BLOCK", {}, req, false));
            }

            let amountT = 0;
            amountT = Math.abs(req.body?.amount);
            const totalAMT = await Transaction.aggregate([
                {
                    $match: { userId: ObjectId(req.user._id), forCasinoBet: 0 }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            if (totalAMT && totalAMT.length > 0 && totalAMT[0].totalAmount > 0) {
                await User.findOneAndUpdate({
                    _id: ObjectId(req.user._id)
                },
                    {
                        $set: {
                            betBlock: true
                        }
                    });
                return res.json(responseData("Success", {}, req, true));
            } else {
                return res.json(responseData("COIN_DONT_EXIST", {}, req, false));
            }

        } catch (error) {
            // console.log(('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    // betfaire bet place
    place_bet: async (req, res) => {
        try {
            let {
                eventId,
                marketId,
                type
            } = req.body;
            type = (type) ? type : 'cricket'

            let matchExist = await Match.findOne({
                eventId,
                status: { $in: ['active', 'in_play'] }
            })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            if (!matchExist?.centralizedId) {
                return res.json(responseData("MARKET_DONT_EXIST", {}, req, false));
            }

            if (!req.body?.bet && req.body?.bet.length <= 0) {
                return res.json(responseData("MARKET_bet_array_invalid", {}, req, false));
            }

            let globalLimitSetting = await GlobalLimitSetting.find();

            await User.findOneAndUpdate({
                _id: ObjectId(req.user._id)
            },
                {
                    $set: {
                        betBlock: false
                    }
                });

            let matchedFlag = true;

            const fancyArray = [];
            const fancyPositionArray = [];

            const BetFairS1 = (matchExist?.jsonData && matchExist?.jsonData[0] && matchExist?.jsonData[0]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[0] && matchExist?.jsonData[0]?.SelectionId : null;
            const BetFairS2 = (matchExist?.jsonData && matchExist?.jsonData[1] && matchExist?.jsonData[1]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[1] && matchExist?.jsonData[1]?.SelectionId : null;
            const BetFairS3 = (matchExist?.jsonData && matchExist?.jsonData[2] && matchExist?.jsonData[2]?.SelectionId) ? matchExist?.jsonData && matchExist?.jsonData[2] && matchExist?.jsonData[2]?.SelectionId : null;

            var BetFairBackS1Data = await BetPosition.aggregate([
                {
                    $match: { userId: req?.user._id, marketId: matchExist?.marketId, selectionId: `${BetFairS1}` }
                },
                {
                    $group: {
                        _id: 0,
                        positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                        positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                    }
                },
                { $project: { _id: 0, selectionId: `${BetFairS1}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
            ]);
            if (BetFairBackS1Data && BetFairBackS1Data.length <= 0) {
                BetFairBackS1Data.push({ selectionId: `${BetFairS1}`, positionProfitAmount: 0, positionLoseAmount: 0 });
            }
            const BetFairBackS2Data = await BetPosition.aggregate([
                {
                    $match: { userId: req?.user._id, marketId: matchExist?.marketId, selectionId: `${BetFairS2}` }
                },
                {
                    $group: {
                        _id: 0,
                        positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                        positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                    }
                },
                { $project: { _id: 0, selectionId: `${BetFairS2}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
            ]);

            if (BetFairBackS2Data && BetFairBackS2Data.length <= 0) {
                BetFairBackS2Data.push({ selectionId: `${BetFairS2}`, positionProfitAmount: 0, positionLoseAmount: 0 });
            }
            const BetFairBackS3Data = await BetPosition.aggregate([
                {
                    $match: { userId: req?.user._id, marketId: matchExist?.marketId, selectionId: `${BetFairS3}` }
                },
                {
                    $group: {
                        _id: 0,
                        positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                        positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                    }
                },
                { $project: { _id: 0, selectionId: `${BetFairS3}`, positionProfitAmount: 1, positionLoseAmount: 1 } }
            ]);
            if (BetFairBackS3Data && BetFairBackS3Data.length <= 0) {
                BetFairBackS3Data.push({ selectionId: `${BetFairS3}`, positionProfitAmount: 0, positionLoseAmount: 0 });
            }

            let ispData = null;
            let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
            satelize.satelize({ ip: ipAddress }, function (err, payload) {
                ispData = payload
            });

            let userId = req.user._id;
            let ownerId = req?.user?.ownerId;
            let subOwnerId = req?.user?.subOwnerId;
            let adminId = req?.user?.adminId;
            let superAdminId = req?.user?.superAdminId;
            let subAdminId = req?.user?.subAdminId;
            let superSeniorId = req?.user?.superSeniorId;
            let superAgentId = req?.user?.superAgentId;
            let agentId = req?.user?.agentId;
            // let betPlaceTime = betPlaceTime;
            let matchName = matchExist?.eventName;
            let clientName = req.user?.username;
            let matchId = matchExist?._id;
            let tournamentId = matchExist?.tournamentId;
            let seriesId = matchExist?.seriesId;
            let betfairCentralizedId = matchExist?.centralizedId;
            let timeInserted = moment().utc().format("YYYY-MM-DD HH:mm:ss");

            const betFarPositionArray = [];

            async.eachSeries(req.body?.bet, (item, callback) => {
                let matchBetId = (new Date().getTime()).toString(36);

                let bhav = item.bhav;
                let amount = item.amount;
                let betType = item.betType;
                let teamName = item.teamName;
                let selectionId = item.selectionId;
                let betfairSelectionId = selectionId;

                let marketCode = bhav;

                if (matchExist?.matchSetting && matchExist?.matchSetting.find(({ btype, minAmount }) => btype == 'betFaire' && minAmount > amount)) {
                    return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));

                }

                if (!matchExist?.matchSetting && globalLimitSetting && globalLimitSetting.find(({ sportType, btype, minAmount }) => sportType == type && btype == 'betFaire' && minAmount > amount)) {
                    triggerMethod.coinUpdate({ user_id: req.user._id });
                    return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));
                }

                if (bhav > 0) {
                    const finalAppRate = bhav;

                    // console.log(('finalAppRate',finalAppRate)

                    let profitAmount;
                    let loseAmount;
                    if (betType == 'back') {
                        profitAmount = betFairFormula(amount, finalAppRate);
                        loseAmount = amount;
                    } else if (betType == 'lay') {
                        profitAmount = amount;
                        loseAmount = betFairFormula(amount, finalAppRate);
                    } else {
                        return res.json(responseData("INVALID_REQUEST", {}, req, false));
                    }

                    let InsertArr = {
                        userId,
                        ipAddress: req.ip,
                        ownerId,
                        subOwnerId,
                        adminId,
                        superAdminId,
                        subAdminId,
                        superSeniorId,
                        superAgentId,
                        agentId,
                        matchName,
                        matchBetId,
                        matchId,
                        tournamentId,
                        seriesId,
                        eventId,
                        clientName,
                        marketId,
                        betfairSelectionId,
                        selectionId,
                        betType,
                        amount,
                        bhav: finalAppRate,
                        timeInserted,
                        teamName,
                        profitAmount,
                        loseAmount,
                        isMatched: true,
                        eventType: matchExist?.eventType
                    }
                    fancyArray.push(InsertArr);

                    let InsertArrS1 = {
                        userId,
                        matchBetId,
                        matchId,
                        seriesId,
                        eventId,
                        marketId,
                        selectionId: BetFairS1,
                        betType,
                        amount,
                        bhav: finalAppRate
                    }

                    let InsertArrS2 = {
                        userId,
                        matchBetId,
                        matchId,
                        seriesId,
                        eventId,
                        marketId,
                        selectionId: BetFairS2,
                        betType,
                        amount,
                        bhav: finalAppRate
                    }

                    let InsertArrS3 = {
                        userId,
                        matchBetId,
                        matchId,
                        seriesId,
                        eventId,
                        marketId,
                        selectionId: BetFairS3,
                        betType,
                        amount,
                        bhav: finalAppRate
                    }

                    if (betType == 'lay') {
                        if (BetFairS1 == selectionId) {
                            InsertArrS1.positionProfitAmount = 0;
                            InsertArrS1.positionLoseAmount = loseAmount;
                            fancyPositionArray.push(InsertArrS1);

                            InsertArrS2.positionProfitAmount = profitAmount;
                            InsertArrS2.positionLoseAmount = 0;
                            InsertArrS3.positionProfitAmount = profitAmount;
                            InsertArrS3.positionLoseAmount = 0;

                            fancyPositionArray.push(InsertArrS2);

                            if (BetFairS3) {
                                fancyPositionArray.push(InsertArrS3);
                            }
                        }

                        if (BetFairS2 == selectionId) {
                            InsertArrS2.positionProfitAmount = 0;
                            InsertArrS2.positionLoseAmount = loseAmount;

                            fancyPositionArray.push(InsertArrS2);

                            InsertArrS1.positionProfitAmount = profitAmount;
                            InsertArrS1.positionLoseAmount = 0;
                            InsertArrS3.positionProfitAmount = profitAmount;
                            InsertArrS3.positionLoseAmount = 0;

                            fancyPositionArray.push(InsertArrS1);

                            if (BetFairS3) {
                                fancyPositionArray.push(InsertArrS3);
                            }
                        }

                        if (BetFairS3 && BetFairS3 == selectionId) {
                            InsertArrS3.positionProfitAmount = 0;
                            InsertArrS3.positionLoseAmount = loseAmount;

                            fancyPositionArray.push(InsertArrS3);

                            InsertArrS1.positionProfitAmount = profitAmount;
                            InsertArrS1.positionLoseAmount = 0;
                            InsertArrS2.positionProfitAmount = profitAmount;
                            InsertArrS2.positionLoseAmount = 0;

                            fancyPositionArray.push(InsertArrS1);
                            fancyPositionArray.push(InsertArrS2);
                        }

                    } else {

                        if (BetFairS1 == selectionId) {
                            InsertArrS1.positionProfitAmount = profitAmount;
                            InsertArrS1.positionLoseAmount = 0;
                            fancyPositionArray.push(InsertArrS1);


                            InsertArrS2.positionProfitAmount = 0;
                            InsertArrS2.positionLoseAmount = loseAmount;
                            InsertArrS3.positionProfitAmount = 0;
                            InsertArrS3.positionLoseAmount = loseAmount;

                            fancyPositionArray.push(InsertArrS2);

                            if (BetFairS3) {
                                fancyPositionArray.push(InsertArrS3);
                            }
                        }

                        if (BetFairS2 == selectionId) {
                            InsertArrS2.positionProfitAmount = profitAmount;
                            InsertArrS2.positionLoseAmount = 0;

                            fancyPositionArray.push(InsertArrS2);

                            InsertArrS1.positionProfitAmount = 0;
                            InsertArrS1.positionLoseAmount = loseAmount;
                            InsertArrS3.positionProfitAmount = 0;
                            InsertArrS3.positionLoseAmount = loseAmount;

                            fancyPositionArray.push(InsertArrS1);

                            if (BetFairS3) {
                                fancyPositionArray.push(InsertArrS3);
                            }
                        }

                        if (BetFairS3 && BetFairS3 == selectionId) {
                            InsertArrS3.positionProfitAmount = profitAmount;
                            InsertArrS3.positionLoseAmount = 0;

                            fancyPositionArray.push(InsertArrS3);

                            InsertArrS1.positionProfitAmount = 0;
                            InsertArrS1.positionLoseAmount = loseAmount;
                            InsertArrS2.positionProfitAmount = 0;
                            InsertArrS2.positionLoseAmount = loseAmount;

                            fancyPositionArray.push(InsertArrS1);
                            fancyPositionArray.push(InsertArrS2);
                        }
                    }

                    if (betType == 'lay') {

                        if (BetFairS1 == selectionId) {
                            BetFairBackS1Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS1Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            BetFairBackS2Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS2Data[0]['positionLoseAmount'] += Math.abs(0);

                            if (BetFairS3) {
                                BetFairBackS3Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                                BetFairBackS3Data[0]['positionLoseAmount'] += Math.abs(0);

                            }

                        }

                        if (BetFairS2 == selectionId) {
                            BetFairBackS2Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS2Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            BetFairBackS1Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS1Data[0]['positionLoseAmount'] += Math.abs(0);

                            if (BetFairS3) {
                                BetFairBackS3Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                                BetFairBackS3Data[0]['positionLoseAmount'] += Math.abs(0);

                            }

                        }


                        if (BetFairS3 == selectionId) {
                            BetFairBackS3Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS3Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            BetFairBackS1Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS1Data[0]['positionLoseAmount'] += Math.abs(0);

                            BetFairBackS2Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS2Data[0]['positionLoseAmount'] += Math.abs(0);

                        }
                    } else {

                        if (BetFairS1 == selectionId) {
                            BetFairBackS1Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS1Data[0]['positionLoseAmount'] += Math.abs(0);

                            BetFairBackS2Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS2Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            if (BetFairS3) {
                                BetFairBackS3Data[0]['positionProfitAmount'] += Math.abs(0);
                                BetFairBackS3Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            }

                        }

                        if (BetFairS2 == selectionId) {
                            BetFairBackS2Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS2Data[0]['positionLoseAmount'] += Math.abs(0);

                            BetFairBackS1Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS1Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            if (BetFairS3) {
                                BetFairBackS3Data[0]['positionProfitAmount'] += Math.abs(0);
                                BetFairBackS3Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            }

                        }


                        if (BetFairS3 == selectionId) {
                            BetFairBackS3Data[0]['positionProfitAmount'] += Math.abs(profitAmount);
                            BetFairBackS3Data[0]['positionLoseAmount'] += Math.abs(0);

                            BetFairBackS1Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS1Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                            BetFairBackS2Data[0]['positionProfitAmount'] += Math.abs(0);
                            BetFairBackS2Data[0]['positionLoseAmount'] += Math.abs(loseAmount);

                        }
                    }
                    callback(null)
                } else {
                    matchedFlag = false;
                    return res.json(responseData("INVALID_PlACE_BET", { matchedFlag, marketCode, marketOddsData }, req, false));
                }

            },
                async function (err) {
                    if (err) {
                        // console.log(('err--------------------',err)
                        return res.json(responseData("ERROR_OCCUR", err, req, false));
                    }

                    if (!matchedFlag) {
                        return res.json(responseData("INVALID_PlACE_BET", { matchedFlag }, req, false));
                    }

                    if (BetFairBackS1Data && BetFairBackS1Data.length) {
                        let position;
                        if (BetFairBackS1Data[0].positionProfitAmount > BetFairBackS1Data[0].positionLoseAmount) {
                            position = BetFairBackS1Data[0].positionProfitAmount - BetFairBackS1Data[0].positionLoseAmount;
                        } else {
                            let losAmt = BetFairBackS1Data[0].positionLoseAmount - BetFairBackS1Data[0].positionProfitAmount;
                            position = - losAmt;
                        }

                        betFarPositionArray.push({ "selectionId": BetFairS1, position });
                    }

                    if (BetFairBackS2Data && BetFairBackS2Data.length) {
                        let position;
                        if (BetFairBackS2Data[0].positionProfitAmount > BetFairBackS2Data[0].positionLoseAmount) {
                            position = BetFairBackS2Data[0].positionProfitAmount - BetFairBackS2Data[0].positionLoseAmount;
                        } else {
                            let losAmt = BetFairBackS2Data[0].positionLoseAmount - BetFairBackS2Data[0].positionProfitAmount;
                            position = -losAmt;
                        }

                        betFarPositionArray.push({ "selectionId": BetFairS2, position });
                    }

                    if (BetFairS3 && BetFairBackS3Data && BetFairBackS3Data.length) {
                        let position;
                        if (BetFairBackS3Data[0].positionProfitAmount > BetFairBackS3Data[0].positionLoseAmount) {
                            position = BetFairBackS3Data[0].positionProfitAmount - BetFairBackS3Data[0].positionLoseAmount;
                        } else {
                            let losAmt = BetFairBackS3Data[0].positionLoseAmount - BetFairBackS3Data[0].positionProfitAmount;
                            position = -losAmt;
                        }

                        betFarPositionArray.push({ "selectionId": BetFairS3, position });
                    }

                    // console.log('betFarPositionArray--',betFarPositionArray);
                    const maxLossAmountData = (Math.min(...betFarPositionArray.map(item => item.position)) > 0) ? 0 : Math.min(...betFarPositionArray.map(item => item.position));

                    const totalAMT = await Transaction.aggregate([
                        {
                            $match: { userId: ObjectId(req.user._id), forCasinoBet: 0, marketId: { $ne: marketId } }
                        },
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: "$realCutAmount" }
                            }
                        }
                    ]);
                    // return true;
                    // console.log(('totalAMT[0].totalAmount >=Math.abs(maxLossAmountData)',totalAMT[0].totalAmount, Math.abs(maxLossAmountData))
                    if (totalAMT.length > 0 && totalAMT[0].totalAmount > 0 && totalAMT[0].totalAmount >= Math.abs(maxLossAmountData)) {
                        await BetPosition.insertMany(fancyPositionArray);
                        await Bet.insertMany(fancyArray);

                        const deletedExposureTransaction = await ExposureTransaction.find({ userId: req.user._id, marketId, eventId })
                        await DeletedExposureTransaction.insertMany(deletedExposureTransaction);
                        await ExposureTransaction.deleteMany({ userId: req.user._id, marketId, eventId });
                        const deletedTransactions = await Transaction.find({ userId: req.user._id, marketId, eventId })
                        await DeletedTransaction.insertMany(deletedTransactions)
                        await Transaction.deleteMany({ userId: req.user._id, marketId, eventId });
                        await Transaction.create({
                            transactionType: "debit",
                            ownerId,
                            subOwnerId,
                            adminId,
                            superAdminId,
                            subAdminId,
                            superSeniorId,
                            superAgentId,
                            agentId,
                            userId: req.user._id,
                            amount: (maxLossAmountData > 0) ? 0 : Math.abs(maxLossAmountData),
                            realCutAmount: (maxLossAmountData > 0) ? 0 : -Math.abs(maxLossAmountData),
                            status: 'success',
                            ip: req.ip,
                            location: ispData ? ispData.country.en : null,
                            geolocation: {
                                type: 'Point',
                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                            },
                            userAgent: req.get('User-Agent'),
                            eventId,
                            marketId,
                            gameName: matchName,
                            matchName,
                            forBet: 1,
                        });

                        await ExposureTransaction.create({
                            transactionType: "debit",
                            ownerId,
                            subOwnerId,
                            adminId,
                            superAdminId,
                            subAdminId,
                            superSeniorId,
                            superAgentId,
                            agentId,
                            userId: req.user._id,
                            amount: (maxLossAmountData > 0) ? 0 : -Math.abs(maxLossAmountData),
                            status: 'success',
                            ip: req.ip,
                            location: ispData ? ispData.country.en : null,
                            geolocation: {
                                type: 'Point',
                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                            },
                            userAgent: req.get('User-Agent'),
                            eventId,
                            marketId,
                            gameName: matchName,
                            forBet: 1,
                        });

                        triggerMethod.coinUpdate({ user_id: req.user._id });
                        return res.json(responseData("PlACE_BET", { matchedFlag }, req, true));

                    } else {
                        return res.json(responseData("COIN_DONT_EXIST", {}, req, false));
                    }

                }
            );



        } catch (error) {
            // console.log(('error---------------mmm',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    // bookmaker bet
    bookmaker_place_bet: async (req, res) => {
        try {
            let {
                eventId,
                marketId,
                selectionId,
                bhav,
                amount,
                oddsType,
                betType,
                betPlaceTime,
                teamName,
                type
            } = req.body;

            // console.log('req.body-----',req.body);

            triggerMethod.coinUpdate({ user_id: req.user._id });

            let matchExist = await Match.findOne({
                eventId
            })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let userExist = await User.findOne({
                _id: req.user._id
            })

            if (!userExist) {
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }

            await User.findOneAndUpdate({
                _id: ObjectId(req.user._id)
            },
                {
                    $set: {
                        betBlock: false
                    }
                });

            if (!matchExist?.bookmakerCentralizedId) {
                return res.json(responseData("MARKET_DONT_EXIST", {}, req, false));
            }

            let globalLimitSetting = await GlobalLimitSetting.find();

            if (matchExist?.matchSetting && matchExist?.matchSetting.find(({ btype, minAmount }) => btype == 'bookmaker' && minAmount > amount)) {
                return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));

            }

            if (!matchExist?.matchSetting && globalLimitSetting && globalLimitSetting.find(({ sportType, btype, minAmount }) => sportType == type && btype == 'bookmaker' && minAmount > amount)) {
                return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));
            }

            let finalAppRate = bhav;
            let userId = req.user._id;
            let ownerId = req?.user?.ownerId;
            let subOwnerId = req?.user?.subOwnerId;
            let adminId = req?.user?.adminId;
            let superAdminId = req?.user?.superAdminId;
            let subAdminId = req?.user?.subAdminId;
            let superSeniorId = req?.user?.superSeniorId;
            let superAgentId = req?.user?.superAgentId;
            let agentId = req?.user?.agentId;
            // let betPlaceTime = betPlaceTime;
            let matchName = matchExist?.eventName;
            let clientName = userExist?.username;
            let matchBetId = (new Date().getTime()).toString(36);
            let matchId = matchExist?._id;
            let tournamentId = matchExist?.tournamentId;
            let seriesId = matchExist?.seriesId;
            let bookmakerMarketId = matchExist?.bookmakerMarketId;
            let bookmakerCentralizedId = matchExist?.bookmakerCentralizedId;
            let bookmakerSelectionId = selectionId;
            let timeInserted = moment().utc().format("YYYY-MM-DD HH:mm:ss");

            if (bhav > 0) {

                const BetFairS1 = (matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[0] && matchExist?.jsonBookmakerData[0]?.selectionID) ? matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[0] && matchExist?.jsonBookmakerData[0]?.selectionID : null;
                const BetFairS2 = (matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[1] && matchExist?.jsonBookmakerData[1]?.selectionID) ? matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[1] && matchExist?.jsonBookmakerData[1]?.selectionID : null;
                const BetFairS3 = (matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[2] && matchExist?.jsonBookmakerData[2]?.selectionID) ? matchExist?.jsonBookmakerData && matchExist?.jsonBookmakerData[2] && matchExist?.jsonBookmakerData[2]?.selectionID : null;

                let profitAmount;
                let loseAmount;
                if (betType == 'back') {
                    profitAmount = betFairFormula(amount, finalAppRate);
                    loseAmount = amount;
                } else if (betType == 'lay') {
                    profitAmount = amount;
                    loseAmount = betFairFormula(amount, finalAppRate);
                } else {
                    return res.json(responseData("INVALID_REQUEST", {}, req, false));
                }

                let amountT = 0;

                if (req.body?.betType == 'back') {
                    amountT = req.body?.amount;

                } else if (req.body?.betType == 'lay') {

                    amountT = betFairFormula(req.body?.amount, req.body?.bhav);
                }

                const totalAMT = await Transaction.aggregate([
                    {
                        $match: { userId: ObjectId(req.user._id), forCasinoBet: 0, }
                    },
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: "$realCutAmount" }
                        }
                    }
                ]);
                // let totalAmount = totalAMT.length > 0 ? Math.abs(totalAMT[0].totalAmount) : 0;
                let totalAmount = (totalAMT.length > 0) ? totalAMT[0].totalAmount : 0;
                if (amountT > totalAmount) {
                    return res.json(responseData("COIN_DONT_EXIST", {}, req, false));
                }

                await Bet.create({
                    userId,
                    ipAddress: req.ip,
                    ownerId,
                    subOwnerId,
                    adminId,
                    superAdminId,
                    subAdminId,
                    superSeniorId,
                    superAgentId,
                    agentId,
                    matchName,
                    matchBetId,
                    matchId,
                    tournamentId,
                    seriesId,
                    eventId,
                    clientName,
                    marketId: bookmakerMarketId,
                    bookmakerSelectionId,
                    selectionId,
                    betType,
                    amount,
                    bhav: finalAppRate,
                    timeInserted,
                    teamName,
                    profitAmount,
                    loseAmount,
                    bookmakerCentralizedId,
                    betFaireType: "bookmaker",
                    eventType: matchExist?.eventType
                });

                const fancyPositionArray = [];

                let InsertArrS1 = {
                    userId,
                    matchBetId,
                    matchId,
                    seriesId,
                    eventId,
                    marketId: bookmakerMarketId,
                    bookmakerSelectionId: BetFairS1,
                    selectionId: BetFairS1,
                    betType,
                    amount,
                    bhav: finalAppRate
                }

                let InsertArrS2 = {
                    userId,
                    matchBetId,
                    matchId,
                    seriesId,
                    eventId,
                    marketId: bookmakerMarketId,
                    bookmakerSelectionId: BetFairS2,
                    selectionId: BetFairS2,
                    betType,
                    amount,
                    bhav: finalAppRate
                }

                let InsertArrS3 = {
                    userId,
                    matchBetId,
                    matchId,
                    seriesId,
                    eventId,
                    marketId: bookmakerMarketId,
                    bookmakerSelectionId: BetFairS3,
                    selectionId: BetFairS3,
                    betType,
                    amount,
                    bhav: finalAppRate
                }

                if (betType == 'lay') {
                    if (BetFairS1 == selectionId) {
                        InsertArrS1.positionProfitAmount = 0;
                        InsertArrS1.positionLoseAmount = loseAmount;
                        fancyPositionArray.push(InsertArrS1);

                        InsertArrS2.positionProfitAmount = profitAmount;
                        InsertArrS2.positionLoseAmount = 0;
                        InsertArrS3.positionProfitAmount = profitAmount;
                        InsertArrS3.positionLoseAmount = 0;

                        fancyPositionArray.push(InsertArrS2);

                        if (BetFairS3) {
                            fancyPositionArray.push(InsertArrS3);
                        }
                    }

                    if (BetFairS2 == selectionId) {
                        InsertArrS2.positionProfitAmount = 0;
                        InsertArrS2.positionLoseAmount = loseAmount;

                        fancyPositionArray.push(InsertArrS2);

                        InsertArrS1.positionProfitAmount = profitAmount;
                        InsertArrS1.positionLoseAmount = 0;
                        InsertArrS3.positionProfitAmount = profitAmount;
                        InsertArrS3.positionLoseAmount = 0;

                        fancyPositionArray.push(InsertArrS1);

                        if (BetFairS3) {
                            fancyPositionArray.push(InsertArrS3);
                        }
                    }

                    if (BetFairS3 && BetFairS3 == selectionId) {
                        InsertArrS3.positionProfitAmount = 0;
                        InsertArrS3.positionLoseAmount = loseAmount;

                        fancyPositionArray.push(InsertArrS3);

                        InsertArrS1.positionProfitAmount = profitAmount;
                        InsertArrS1.positionLoseAmount = 0;
                        InsertArrS2.positionProfitAmount = profitAmount;
                        InsertArrS2.positionLoseAmount = 0;

                        fancyPositionArray.push(InsertArrS1);
                        fancyPositionArray.push(InsertArrS2);
                    }

                } else {

                    if (BetFairS1 == selectionId) {
                        InsertArrS1.positionProfitAmount = profitAmount;
                        InsertArrS1.positionLoseAmount = 0;
                        fancyPositionArray.push(InsertArrS1);

                        InsertArrS2.positionProfitAmount = 0;
                        InsertArrS2.positionLoseAmount = loseAmount;
                        InsertArrS3.positionProfitAmount = 0;
                        InsertArrS3.positionLoseAmount = loseAmount;

                        fancyPositionArray.push(InsertArrS2);

                        if (BetFairS3) {
                            fancyPositionArray.push(InsertArrS3);
                        }
                    }

                    if (BetFairS2 == selectionId) {
                        InsertArrS2.positionProfitAmount = profitAmount;
                        InsertArrS2.positionLoseAmount = 0;

                        fancyPositionArray.push(InsertArrS2);

                        InsertArrS1.positionProfitAmount = 0;
                        InsertArrS1.positionLoseAmount = loseAmount;
                        InsertArrS3.positionProfitAmount = 0;
                        InsertArrS3.positionLoseAmount = loseAmount;

                        fancyPositionArray.push(InsertArrS1);

                        if (BetFairS3) {
                            fancyPositionArray.push(InsertArrS3);
                        }
                    }

                    if (BetFairS3 && BetFairS3 == selectionId) {
                        InsertArrS3.positionProfitAmount = profitAmount;
                        InsertArrS3.positionLoseAmount = 0;

                        fancyPositionArray.push(InsertArrS3);

                        InsertArrS1.positionProfitAmount = 0;
                        InsertArrS1.positionLoseAmount = loseAmount;
                        InsertArrS2.positionProfitAmount = 0;
                        InsertArrS2.positionLoseAmount = loseAmount;

                        fancyPositionArray.push(InsertArrS1);
                        fancyPositionArray.push(InsertArrS2);
                    }
                }

                await BetPosition.insertMany(fancyPositionArray);

                const runBetPosition = [];

                const BetFairS1Data = await BetPosition.aggregate([
                    {
                        $match: { userId: req?.user._id, marketId: `${bookmakerMarketId}`, selectionId: `${BetFairS1}` }
                    },
                    {
                        $group: {
                            _id: 0,
                            positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                            positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                        }
                    },
                    { $project: { _id: 0, selectionId: `${BetFairS1}`, positionLoseAmount: 1, positionProfitAmount: 1 } }
                ]);

                const BetFairS2Data = await BetPosition.aggregate([
                    {
                        $match: { userId: req?.user._id, marketId: `${bookmakerMarketId}`, selectionId: `${BetFairS2}` }
                    },
                    {
                        $group: {
                            _id: 0,
                            positionLoseAmount: { $sum: { "$toDouble": "$positionLoseAmount" } },
                            positionProfitAmount: { $sum: { "$toDouble": "$positionProfitAmount" } },
                        }
                    },
                    { $project: { _id: 0, selectionId: `${BetFairS2}`, positionLoseAmount: 1, positionProfitAmount: 1 } }
                ]);

                if (Math.abs(BetFairS1Data[0].positionProfitAmount) > Math.abs(BetFairS1Data[0].positionLoseAmount)) {
                    runBetPosition.push({ 'position': Math.abs(BetFairS1Data[0].positionProfitAmount) - Math.abs(BetFairS1Data[0].positionLoseAmount) });
                } else {
                    let losAmt = Math.abs(BetFairS1Data[0].positionLoseAmount) - Math.abs(BetFairS1Data[0].positionProfitAmount);
                    runBetPosition.push({ 'position': -losAmt });
                }
                if (Math.abs(BetFairS2Data[0].positionProfitAmount) > Math.abs(BetFairS2Data[0].positionLoseAmount)) {
                    runBetPosition.push({ 'position': Math.abs(BetFairS2Data[0].positionProfitAmount) - Math.abs(BetFairS2Data[0].positionLoseAmount) });
                } else {
                    let losAmt = Math.abs(BetFairS2Data[0].positionLoseAmount) - Math.abs(BetFairS2Data[0].positionProfitAmount);
                    runBetPosition.push({ 'position': -losAmt });
                }

                maxLossAmount = Math.min(...runBetPosition.map(item => item.position));

                const deletedExposureTransaction = await ExposureTransaction.find({ userId: req.user._id, marketId: `${bookmakerMarketId}`, eventId })
                await DeletedExposureTransaction.insertMany(deletedExposureTransaction);
                await ExposureTransaction.deleteMany({ userId: req.user._id, marketId: `${bookmakerMarketId}`, eventId });

                const deletedTransactions = await Transaction.find({ userId: req.user._id, marketId: `${bookmakerMarketId}`, eventId })
                await DeletedTransaction.insertMany(deletedTransactions)
                await Transaction.deleteMany({ userId: req.user._id, marketId: `${bookmakerMarketId}`, eventId });

                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });

                await Transaction.create({
                    transactionType: "debit",
                    ownerId,
                    subOwnerId,
                    adminId,
                    superAdminId,
                    subAdminId,
                    superSeniorId,
                    superAgentId,
                    agentId,
                    userId: req.user._id,
                    amount: (maxLossAmount > 0) ? 0 : Math.abs(maxLossAmount),
                    realCutAmount: (maxLossAmount > 0) ? 0 : - Math.abs(maxLossAmount),
                    status: 'success',
                    ip: req.ip,
                    location: ispData ? ispData.country.en : null,
                    geolocation: {
                        type: 'Point',
                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                    },
                    userAgent: req.get('User-Agent'),
                    eventId,
                    marketId: `${bookmakerMarketId}`,
                    betType,
                    gameName: matchName,
                    runnerName: teamName,
                    selectionId,
                    forBet: 1,
                    betFaireType: "bookmaker",
                    betId: matchBetId
                });

                await ExposureTransaction.create({
                    transactionType: "debit",
                    ownerId,
                    subOwnerId,
                    adminId,
                    superAdminId,
                    subAdminId,
                    superSeniorId,
                    superAgentId,
                    agentId,
                    userId: req.user._id,
                    amount: (maxLossAmount > 0) ? 0 : -Math.abs(maxLossAmount),
                    status: 'success',
                    ip: req.ip,
                    location: ispData ? ispData.country.en : null,
                    geolocation: {
                        type: 'Point',
                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                    },
                    userAgent: req.get('User-Agent'),
                    eventId,
                    marketId: `${bookmakerMarketId}`,
                    betType,
                    gameName: matchName,
                    runnerName: teamName,
                    selectionId,
                    forBet: 1,
                    betFaireType: "bookmaker",
                    betId: matchBetId
                });

                triggerMethod.coinUpdate({ user_id: req.user._id });
                return res.json(responseData("PlACE_BET", {}, req, true));

            } else {
                return res.json(responseData("INVALID_PlACE_BET", {}, req, false));
            }

        } catch (error) {
            // console.log(('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    // fancy
    fancy_place_bet: async (req, res) => {
        try {

            let {
                eventId,
                centralizedId,
                bhav,
                amount,
                betType,
                betPlaceTime,
                fancyName,
                exceptAny,
                betRun
            } = req.body;

            let selectionId = `${req.body?.selectionId}`;

            let runnerName = req.body?.runnerName || "The Bet";

            triggerMethod.coinUpdate({ user_id: req.user._id });

            let matchExist = await Match.findOne({
                eventId,
                status: { $in: ['active', 'in_play'] }
            });

            //return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let marketId = (req.body?.marketId) ? req.body?.marketId : matchExist?.marketId;

            await User.findOneAndUpdate({
                _id: ObjectId(req.user._id)
            },
                {
                    $set: {
                        betBlock: false
                    }
                });

            let globalLimitSetting = await GlobalLimitSetting.find();

            if (matchExist?.matchSetting && matchExist?.matchSetting.find(({ type, minAmount }) => type == 'fancy' && minAmount > amount)) {
                return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));
            }

            if (!matchExist?.matchSetting && globalLimitSetting && globalLimitSetting.find(({ type, minAmount }) => type == 'fancy' && minAmount > amount)) {
                return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));
            }

            const apiPath = `${BETFAIRODDS}/api/GetSession?eventid=${eventId}`;

            const returnData = await axios({
                method: 'get',
                url: apiPath,
            }).then(function (response) {
                return response.data;
            })
                .catch(function (error) {
                    // console.log(error);
                    return false
                    // return res.json(responseData("ERROR_OCCUR", error, req, false));
                });
            // console.log("returnData", returnData);
            if (returnData && returnData?.length > 0) {
                let marketMatchFancyOdds = returnData.find(({ SelectionId }) => SelectionId == selectionId);
                //console.log("marketMatchFancyOdds 8888888888888888", marketMatchFancyOdds);
                if (marketMatchFancyOdds && marketMatchFancyOdds?.GameStatus == "" && ((betType == 'No' && marketMatchFancyOdds?.LaySize1 == bhav && marketMatchFancyOdds?.LayPrice1 == betRun) || (betType == 'Yes' && marketMatchFancyOdds?.BackSize1 == bhav && marketMatchFancyOdds?.BackPrice1 == betRun))) {
                    //console.log("marketMatchFancyOdds", marketMatchFancyOdds);

                    let FancyExist = await Fancy.findOne({
                        eventId, selectionId
                    });

                    if (!FancyExist) {
                        await Fancy.create({
                            tournamentId: ObjectId(matchExist.tournamentId),
                            matchId: ObjectId(matchExist._id),
                            matchName: matchExist.eventName,
                            seriesId: matchExist.seriesId,
                            eventId: matchExist.eventId,
                            marketId: `${matchExist?.eventId}S${marketMatchFancyOdds.SelectionId}`,
                            centralizedId: `${matchExist?.eventId}S${marketMatchFancyOdds.SelectionId}`,
                            selectionId: marketMatchFancyOdds.SelectionId,
                            fancyId: marketMatchFancyOdds.SelectionId,
                            fancyName: marketMatchFancyOdds.RunnerName,
                            eventDateTime: matchExist.eventDateTime,
                            marketCount: marketMatchFancyOdds.sr_no,
                            jsonData: marketMatchFancyOdds,
                            marketType: marketMatchFancyOdds?.ballsess,
                            categoryType: marketMatchFancyOdds?.ballsess,
                            status: "open",
                            isDeleted: false,
                            runnerName: marketMatchFancyOdds?.RunnerName,
                        });
                    }

                    finalAppRate = bhav;
                    if (betType == 'No') {
                        finalAppRate = marketMatchFancyOdds?.LaySize1;

                    } else if (betType == 'Yes') {
                        finalAppRate = marketMatchFancyOdds?.BackSize1;

                    } else {

                        triggerMethod.coinUpdate({ user_id: req.user._id });
                        return res.json(responseData("INVALID_REQUEST", {}, req, false));

                    }
                    let profitAmount;
                    let loseAmount;
                    let position;

                    if (betType == 'Yes') {
                        profitAmount = sessionFormula(amount, finalAppRate);
                        loseAmount = amount;
                        position = loseAmount;

                    } else if (betType == 'No') {
                        profitAmount = amount;
                        loseAmount = sessionFormula(amount, finalAppRate);
                        position = loseAmount;
                    } else {
                        triggerMethod.coinUpdate({ user_id: req.user._id });
                        return res.json(responseData("INVALID_REQUEST", {}, req, false));
                    }

                    let sessionBetId = (new Date().getTime()).toString(36);
                    let userId = req.user._id;
                    let ownerId = req?.user?.ownerId;
                    let subOwnerId = req?.user?.subOwnerId;
                    let adminId = req?.user?.adminId;
                    let superAdminId = req?.user?.superAdminId;
                    let subAdminId = req?.user?.subAdminId;
                    let superSeniorId = req?.user?.superSeniorId;
                    let superAgentId = req?.user?.superAgentId;
                    let agentId = req?.user?.agentId;
                    let matchName = matchExist?.eventName;
                    let clientName = req.user?.username;
                    // let matchBetId = marketMatchFancyOdds?.appBetID;
                    let matchBetId = (new Date().getTime()).toString(36);
                    let matchId = matchExist?._id;
                    let tournamentId = matchExist?.tournamentId;
                    let seriesId = matchExist?.seriesId;

                    let timeInserted = moment().utc().format("YYYY-MM-DD HH:mm:ss");

                    const insertArray = {
                        userId,
                        userID: userId,
                        ipAddress: req.ip,
                        ownerId,
                        subOwnerId,
                        adminId,
                        superAdminId,
                        subAdminId,
                        superSeniorId,
                        superAgentId,
                        agentId,
                        matchName,
                        matchBetId,
                        matchId,
                        tournamentId,
                        seriesId,
                        eventId,
                        clientName,
                        marketId: `${eventId}S${selectionId}`,
                        selectionId,
                        type: betType,
                        amount,
                        bhav: finalAppRate,
                        timeInserted,
                        profitAmount,
                        loseAmount,
                        centralizedId,
                        runnerName,
                        betRun,
                        fancyName,
                        sessionBetId,
                        eventType: matchExist?.eventType
                    };

                    let ispData = null;
                    let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                    satelize.satelize({ ip: ipAddress }, function (err, payload) {
                        ispData = payload
                    });

                    const totalAMT = await Transaction.aggregate([
                        {
                            $match: { userId: ObjectId(req.user._id), forCasinoBet: 0 }
                        },
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: "$realCutAmount" }
                            }
                        }
                    ]);
                    let realCutAmount = - Math.abs(loseAmount);

                    if (totalAMT.length > 0 && totalAMT[0].totalAmount > 0 && totalAMT[0].totalAmount >= Math.abs(realCutAmount)) {
                        await Transaction.create({
                            transactionType: "debit",
                            ownerId,
                            subOwnerId,
                            adminId,
                            superAdminId,
                            subAdminId,
                            superSeniorId,
                            superAgentId,
                            agentId,
                            userId: req.user._id,
                            realCutAmount: -Math.abs(loseAmount),
                            amount: Math.abs(loseAmount),
                            status: 'success',
                            ip: req.ip,
                            location: ispData ? ispData.country.en : null,
                            geolocation: {
                                type: 'Point',
                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                            },
                            userAgent: req.get('User-Agent'),
                            eventId,
                            marketId: `${eventId}S${selectionId}`,
                            betType,
                            gameName: matchExist?.eventName,
                            matchName: matchExist?.eventName,
                            gameName: fancyName,
                            runnerName: fancyName,
                            selectionId,
                            forBet: 1,
                            betId: matchBetId,
                            betFaireType: 'fancy'
                        });

                        await ExposureTransaction.create({
                            transactionType: "debit",
                            ownerId,
                            subOwnerId,
                            adminId,
                            superAdminId,
                            subAdminId,
                            superSeniorId,
                            superAgentId,
                            agentId,
                            userId: req.user._id,
                            amount: Math.abs(loseAmount),
                            status: 'success',
                            ip: req.ip,
                            location: ispData ? ispData.country.en : null,
                            geolocation: {
                                type: 'Point',
                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                            },
                            userAgent: req.get('User-Agent'),
                            eventId,
                            marketId: `${eventId}S${selectionId}`,
                            betType,
                            gameName: fancyName,
                            runnerName,
                            selectionId,
                            forBet: 1,
                            betId: matchBetId
                        });

                        if (betType == 'No') {
                            insertArray.lossRunRange = betRun;
                            insertArray.profitRunRange = betRun - 1;
                        } else {
                            insertArray.lossRunRange = betRun - 1;
                            insertArray.profitRunRange = betRun;
                        }

                        await SessionBet.create(insertArray);

                        triggerMethod.coinUpdate({ user_id: req.user._id });

                        return res.json(responseData("PlACE_BET", {}, req, true));

                    } else {
                        return res.json(responseData("COIN_DONT_EXIST111", {}, req, false));
                    }

                } else {
                    triggerMethod.coinUpdate({ user_id: req.user._id });
                    return res.json(responseData("INVALID_PlACE_BET", {}, req, false));
                }
            } else {
                triggerMethod.coinUpdate({ user_id: req.user._id });
                return res.json(responseData("MARKET_CLOSED", {}, req, false));
            }

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    // premium fancy
    premium_fancy_place_bet: async (req, res) => {
        try {

            let {
                eventId,
                centralizedId,
                bhav,
                amount,
                betType,
                betPlaceTime,
                fancyName,
                exceptAny,
                betRun
            } = req.body;

            let selectionId = `${req.body?.selectionId}`;

            let runnerName = req.body?.runnerName || "The Bet";

            triggerMethod.coinUpdate({ user_id: req.user._id });

            let matchExist = await Match.findOne({
                eventId,
                status: { $in: ['active', 'in_play'] }
            });

            //return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let marketId = (req.body?.marketId) ? req.body?.marketId : matchExist?.marketId;

            await User.findOneAndUpdate({
                _id: ObjectId(req.user._id)
            },
                {
                    $set: {
                        betBlock: false
                    }
                });

            let globalLimitSetting = await GlobalLimitSetting.find();

            if (matchExist?.matchSetting && matchExist?.matchSetting.find(({ type, minAmount }) => type == 'sportBook' && minAmount > amount)) {
                return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));
            }

            if (!matchExist?.matchSetting && globalLimitSetting && globalLimitSetting.find(({ type, minAmount }) => type == 'sportBook' && minAmount > amount)) {
                return res.json(responseData("MINIMUM_AMOUNT", {}, req, false));
            }

            const apiPath = `${BETFAIRODDS}/api/getoctalcricket`;

            const data = await axios({
                method: 'get',
                url: apiPath,
            })

            if (data.data?.length > 0) {
                const isPremiumAvailable = await data.data.filter((item) => {
                    if (item.Id == eventId && item.isPremium) {
                        return item
                    }
                })
                if (isPremiumAvailable?.length > 0) {
                    axios({
                        method: 'get',
                        url: `http://213.219.37.190/test.php?eventId=${isPremiumAvailable[0].exEventId}`
                    })
                        .then(async returnData => {
                            if (returnData.data && returnData.data?.length > 0) {
                                let marketMatchPremiumFancyOdds = returnData.data.find(({ marketId }) => marketId == req.body.marketId.split('S')[0]);
                                const runnerData = marketMatchPremiumFancyOdds?.oddsData?.runners?.filter((item) => req.body.marketId.split('S')[1] == item.selectionId)
                                if (marketMatchPremiumFancyOdds && runnerData[0].status !== "" && ((betType == 'No' && runnerData[0].price.lay[0].price == bhav && runnerData[0].price.lay[0].price == betRun) || (betType == 'Yes' && runnerData[0].price.back[0].price == bhav && runnerData[0].price.back[0].price == betRun))) {
                                    let PremiumFancyExist = await SportBookPremiumFancy.findOne({
                                        eventId, selectionId
                                    });

                                    if (!PremiumFancyExist) {
                                        await SportBookPremiumFancy.create({
                                            tournamentId: ObjectId(matchExist.tournamentId),
                                            matchId: ObjectId(matchExist._id),
                                            matchName: matchExist.eventName,
                                            seriesId: matchExist.seriesId,
                                            eventId: matchExist.eventId,
                                            marketId: `${matchExist?.eventId}S${marketMatchPremiumFancyOdds.marketId}`,
                                            selectionId: runnerData[0].selectionId,
                                            premiumFancyId: runnerData[0].selectionId,
                                            fancySelectionId: runnerData[0].selectionId,
                                            centralizedId: `${matchExist?.eventId}S${marketMatchPremiumFancyOdds.marketId}`,
                                            premiumFancyName: marketMatchPremiumFancyOdds.marketName,
                                            eventDateTime: matchExist.eventDateTime,
                                            // marketCount: marketMatchPremiumFancyOdds.sr_no,
                                            jsonData: marketMatchPremiumFancyOdds,
                                            marketType: '1',
                                            categoryType: '1',
                                            status: "open",
                                            isDeleted: false,
                                            runnerName: req.body.runnerName,
                                        });
                                    }

                                    finalAppRate = bhav;
                                    // if (betType == 'No') {
                                    //     finalAppRate = runnerData[0].price.lay[0].size;

                                    // } else if (betType == 'Yes') {
                                    //     finalAppRate = runnerData[0].price.back[0].size;

                                    // } else {

                                    //     triggerMethod.coinUpdate({ user_id: req.user._id });
                                    //     return res.json(responseData("INVALID_REQUEST", {}, req, false));

                                    // }
                                    let profitAmount;
                                    let loseAmount;
                                    let position;

                                    if (betType == 'Yes') {
                                        profitAmount = betFairFormula(amount, finalAppRate);
                                        loseAmount = amount;
                                        position = loseAmount;

                                    } else if (betType == 'No') {
                                        profitAmount = amount;
                                        loseAmount = betFairFormula(amount, finalAppRate);
                                        position = loseAmount;
                                    } else {
                                        triggerMethod.coinUpdate({ user_id: req.user._id });
                                        return res.json(responseData("INVALID_REQUEST", {}, req, false));
                                    }

                                    let sessionBetId = (new Date().getTime()).toString(36);
                                    let userId = req.user._id;
                                    let ownerId = req?.user?.ownerId;
                                    let subOwnerId = req?.user?.subOwnerId;
                                    let adminId = req?.user?.adminId;
                                    let superAdminId = req?.user?.superAdminId;
                                    let subAdminId = req?.user?.subAdminId;
                                    let superSeniorId = req?.user?.superSeniorId;
                                    let superAgentId = req?.user?.superAgentId;
                                    let agentId = req?.user?.agentId;
                                    let matchName = matchExist?.eventName;
                                    let clientName = req.user?.username;
                                    // let matchBetId = marketMatchPremiumFancyOdds?.appBetID;
                                    let matchBetId = (new Date().getTime()).toString(36);
                                    let matchId = matchExist?._id;
                                    let tournamentId = matchExist?.tournamentId;
                                    let seriesId = matchExist?.seriesId;

                                    let timeInserted = moment().utc().format("YYYY-MM-DD HH:mm:ss");

                                    const insertArray = {
                                        userId,
                                        userID: userId,
                                        ipAddress: req.ip,
                                        ownerId,
                                        subOwnerId,
                                        adminId,
                                        superAdminId,
                                        subAdminId,
                                        superSeniorId,
                                        superAgentId,
                                        agentId,
                                        matchName,
                                        matchBetId,
                                        matchId,
                                        tournamentId,
                                        seriesId,
                                        eventId,
                                        clientName,
                                        marketId: `${eventId}S${marketMatchPremiumFancyOdds.marketId}`,
                                        selectionId,
                                        type: betType,
                                        amount,
                                        bhav: finalAppRate,
                                        timeInserted,
                                        profitAmount,
                                        loseAmount,
                                        centralizedId,
                                        runnerName,
                                        betRun,
                                        fancyName,
                                        sessionBetId,
                                        eventType: matchExist?.eventType
                                    };

                                    let ispData = null;
                                    let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                                    satelize.satelize({ ip: ipAddress }, function (err, payload) {
                                        ispData = payload
                                    });

                                    const totalAMT = await Transaction.aggregate([
                                        {
                                            $match: { userId: ObjectId(req.user._id), forCasinoBet: 0 }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                totalAmount: { $sum: "$realCutAmount" }
                                            }
                                        }
                                    ]);
                                    let realCutAmount = - Math.abs(loseAmount);

                                    if (totalAMT.length > 0 && totalAMT[0].totalAmount > 0 && totalAMT[0].totalAmount >= Math.abs(realCutAmount)) {
                                        await Transaction.create({
                                            transactionType: "debit",
                                            ownerId,
                                            subOwnerId,
                                            adminId,
                                            superAdminId,
                                            subAdminId,
                                            superSeniorId,
                                            superAgentId,
                                            agentId,
                                            userId: req.user._id,
                                            realCutAmount: -Math.abs(loseAmount),
                                            amount: Math.abs(loseAmount),
                                            status: 'success',
                                            ip: req.ip,
                                            location: ispData ? ispData.country.en : null,
                                            geolocation: {
                                                type: 'Point',
                                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                            },
                                            userAgent: req.get('User-Agent'),
                                            eventId,
                                            marketId: `${eventId}S${marketMatchPremiumFancyOdds.marketId}`,
                                            betType,
                                            gameName: matchExist?.eventName,
                                            matchName: matchExist?.eventName,
                                            gameName: fancyName,
                                            runnerName: fancyName,
                                            selectionId,
                                            forBet: 1,
                                            betId: matchBetId,
                                            betFaireType: 'sportBook'
                                        });

                                        await ExposureTransaction.create({
                                            transactionType: "debit",
                                            ownerId,
                                            subOwnerId,
                                            adminId,
                                            superAdminId,
                                            subAdminId,
                                            superSeniorId,
                                            superAgentId,
                                            agentId,
                                            userId: req.user._id,
                                            amount: Math.abs(loseAmount),
                                            status: 'success',
                                            ip: req.ip,
                                            location: ispData ? ispData.country.en : null,
                                            geolocation: {
                                                type: 'Point',
                                                coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                                            },
                                            userAgent: req.get('User-Agent'),
                                            eventId,
                                            marketId: `${eventId}S${marketMatchPremiumFancyOdds.marketId}`,
                                            betType,
                                            gameName: fancyName,
                                            runnerName,
                                            selectionId,
                                            forBet: 1,
                                            betId: matchBetId
                                        });

                                        if (betType == 'No') {
                                            insertArray.lossRunRange = betRun;
                                            insertArray.profitRunRange = betRun - 1;
                                        } else {
                                            insertArray.lossRunRange = betRun - 1;
                                            insertArray.profitRunRange = betRun;
                                        }

                                        await SessionBet.create(insertArray);

                                        triggerMethod.coinUpdate({ user_id: req.user._id });

                                        return res.json(responseData("PlACE_BET", {}, req, true));

                                    } else {
                                        return res.json(responseData("COIN_DONT_EXIST111", {}, req, false));
                                    }

                                } else {
                                    triggerMethod.coinUpdate({ user_id: req.user._id });
                                    return res.json(responseData("INVALID_PlACE_BET", {}, req, false));
                                }
                            } else {
                                triggerMethod.coinUpdate({ user_id: req.user._id });
                                return res.json(responseData("MARKET_CLOSED", {}, req, false));
                            }
                        }).catch(error => {
                            console.log('error', error)
                            return false
                        });
                } else {
                    return false
                }

            }
        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    events_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.isMatched = true;
            searchObj.isDeclared = false;
            searchObj.eventId = req?.query?.eventId;
            searchObj.betFaireType = { $in: ["betFair", "betfair"] };
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            let matched = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
                {
                    $sort: { timeInserted: -1 }
                }
            ]);
            searchObj.isMatched = false;
            let unMatched = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
                {
                    $sort: { timeInserted: -1 }
                }
            ]);

            const BetFairBet = { matched, unMatched };

            const BookmakerBet = await Bet.aggregate([
                {
                    $match: {
                        eventId: req?.query?.eventId,
                        betFaireType: "bookmaker",
                        userId: req?.user._id,
                        isDeclared: false,
                        status: { $in: ["upcoming", "in_play", "delay", "pending", "active"] }
                    }
                },
                {
                    $sort: { timeInserted: -1 }
                }
            ]);

            const FancyBet = await SessionBet.aggregate([
                {
                    $match: {
                        userId: req?.user._id,
                        eventId: req?.query?.eventId,
                        status: { $in: ["upcoming", "in_play", "delay", "pending", "active"] }
                    }
                },
                {
                    $sort: { timeInserted: -1 }
                }
            ]);

            const SporBooksBet = await SportBookBet.aggregate([
                {
                    $match: {
                        userId: req?.user._id,
                        eventId: req?.query?.eventId,
                        status: { $in: ["upcoming", "in_play", "delay", "pending", "active"] }
                    }
                },
                {
                    $sort: { timeInserted: -1 }
                }
            ]);

            return res.json(responseData("BET_LIST", { BetFairBet, BookmakerBet, FancyBet, SporBooksBet }, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    my_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.isMatched = true;
            searchObj.isDeclared = false;
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            if (req?.query?.eventId) {
                searchObj.eventId = req?.query?.eventId;
            }

            let matched = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);
            searchObj.isMatched = false;
            let unMatched = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", { matched, unMatched }, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    my_bookmaker_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.betFaireType = "bookmaker";
            searchObj.isBookmakerDeclared = false;
            if (req?.query?.eventId) {
                searchObj.eventId = req?.query?.eventId;
            }

            let matched = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);
            return res.json(responseData("BET_LIST", matched, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    my_fancy_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            let matched = await SessionBet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", matched, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    my_sport_book_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.isDeclared = false;
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            let matched = await SportBookBet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", matched, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    get_current_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.isMatched = true;
            searchObj.isDeclared = false;
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            let queryResponse = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    get_mobile_current_bets: async (req, res) => {
        try {

            const userId = (req?.user._id) ? req?.user._id : '6388578e7a91deeadb91bbd7';
            const SportBookBetB = await SportBookBet.distinct('eventId', { userId: ObjectId(userId), isDeclared: false, status: { $in: ['pending', 'active'] } });
            const SessionBetB = await SessionBet.distinct('eventId', { userId: ObjectId(userId), isDeclared: false, status: { $in: ['pending', 'active'] } });
            const BetB = await Bet.distinct('eventId', { userId: ObjectId(userId), isDeclared: false, status: { $in: ['pending', 'active'] } });
            let eventId = [...new Set([...SportBookBetB, ...SessionBetB, ...BetB])];
            // console.log('eventId',eventId);
            let regexFilter = {
                "eventId": { $in: eventId },
                "status": { $in: ["upcoming", "in_play", "delay", "pending", "active"] },
            };
            let queryResponse = await Match.aggregate([
                {
                    $lookup: {
                        from: 'tournaments',
                        let: {
                            addr: '$seriesId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    status: 'active',
                                    $expr: { $eq: ['$seriesId', '$$addr'] },
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
                        from: 'bets',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    userId: ObjectId(userId),
                                    isDeclared: false,
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    betFaireType: 'betfair',
                                    status: { $in: ['pending', 'active'] }
                                }
                            },
                            { $sort: { eventDateTime: 1 } },
                            {
                                $project: {
                                    "_id": 1,
                                    "matchBetId": 1,
                                    "seriesId": 1,
                                    "eventId": 1,
                                    "clientName": 1,
                                    "userId": 1,
                                    "marketId": 1,
                                    "selectionId": 1,
                                    "betType": 1,
                                    "amount": 1,
                                    "bhav": 1,
                                    "timeInserted": 1,
                                    "profitAmount": 1,
                                    "loseAmount": 1,
                                    "isMatched": 1,
                                    "teamName": 1
                                }
                            }
                        ],
                        as: 'betList'
                    }
                },
                // {
                //     $lookup: {
                //         from: 'bets',
                //         let: {
                //             addr: '$eventId'
                //         },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     userId:ObjectId(userId),
                //                     isDeclared:false,
                //                     $expr: { $eq: [ '$eventId', '$$addr'] },
                //                     betFaireType:'bookmaker',
                //                     status:{$in:['pending','active']}
                //                 }
                //             },
                //             { $sort:{eventDateTime:1} },
                //             {
                //                 $project:{
                //                     "_id": 1,
                //                     "matchBetId": 1,
                //                     "seriesId":1,
                //                     "eventId": 1,
                //                     "clientName": 1,
                //                     "userId": 1,
                //                     "marketId": 1,
                //                     "selectionId": 1,
                //                     "betType": 1,
                //                     "amount": 1,
                //                     "bhav": 1,
                //                     "timeInserted":1,
                //                     "profitAmount":1,
                //                     "loseAmount":1,
                //                     "isMatched":1,
                //                     "teamName":1
                //                 }
                //             }
                //         ],
                //         as: 'bookmakerList'
                //     }
                // },
                {
                    $lookup: {
                        from: 'sports_book_bets',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    userId: ObjectId(userId),
                                    isDeclared: false,
                                    status: { $in: ['pending', 'active'] }
                                }
                            },
                            { $sort: { eventDateTime: 1 } },
                            {
                                $project: {
                                    "_id": 1,
                                    "matchBetId": 1,
                                    "seriesId": 1,
                                    "eventId": 1,
                                    "clientName": 1,
                                    "userId": 1,
                                    "marketId": 1,
                                    "selectionId": 1,
                                    "betType": 1,
                                    "amount": 1,
                                    "bhav": 1,
                                    "timeInserted": 1,
                                    "profitAmount": 1,
                                    "loseAmount": 1,
                                    "isMatched": 1,
                                    "fancyName": 1,
                                }
                            }
                        ],
                        as: 'sportBookBetList'
                    }
                },
                {
                    $lookup: {
                        from: 'session_bets',
                        let: {
                            addr: '$eventId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$eventId', '$$addr'] },
                                    userId: ObjectId(userId),
                                    isDeclared: false,
                                    status: { $in: ['pending', 'active'] }
                                }
                            },
                            { $sort: { eventDateTime: 1 } },
                            {
                                $project: {
                                    "_id": 1,
                                    "sessionBetId": 1,
                                    "seriesId": 1,
                                    "eventId": 1,
                                    "clientName": 1,
                                    "userId": 1,
                                    "marketId": 1,
                                    "selectionId": 1,
                                    "betType": 1,
                                    "amount": 1,
                                    "bhav": 1,
                                    "timeInserted": 1,
                                    "profitAmount": 1,
                                    "loseAmount": 1,
                                    "isMatched": 1,
                                    "teamName": 1,
                                    "fancyName": 1,
                                    "type": 1,
                                    "betRun": 1
                                }
                            }
                        ],
                        as: 'sessionBetList'
                    }
                },
                {
                    $match: regexFilter
                },
                { $sort: { eventDateTime: -1 } },
                {
                    $project: {
                        '_id': '$_id',
                        'gameType': '$gameType',
                        'tournamentId': '$tournamentId',
                        'seriesId': '$seriesId',
                        'eventId': '$eventId',
                        'marketId': '$marketId',
                        'centralizedId': '$centralizedId',
                        'bookmakerMarketId': '$bookmakerMarketId',
                        'bookmakerCentralizedId': '$bookmakerCentralizedId',
                        'isMarketDataDelayed': '$isMarketDataDelayed',
                        'eventName': '$eventName',
                        'countryCode': '$countryCode',
                        'venue': '$venue',
                        'timeZone': '$timeZone',
                        'eventDateTime': '$eventDateTime',
                        'status': '$status',
                        'eventType': "$eventType",
                        'seriesName': "$tournament.seriesName",
                        'betList': "$betList",
                        // 'bookmakerList':"$bookmakerList",
                        'sessionBetList': "$sessionBetList",
                        'sportBookBetList': "$sportBookBetList"
                    }
                }
            ]);

            return res.json(responseData("BET_LIST", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    get_current_match_group_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.eventId = req?.query?.eventId;
            searchObj.isMatched = true;
            searchObj.isDeclared = false;
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            let queryResponse = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    get_current_unmatch_group_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            if (req?.query?.eventId) {
                searchObj.eventId = req?.query?.eventId;
            }
            searchObj.isMatched = false;
            searchObj.isDeclared = false;
            searchObj.status = { $in: ["upcoming", "in_play", "delay", "pending", "active"] };

            let queryResponse = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    get_current_match_bets: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.eventId = req?.query?.eventId;
            searchObj.isMatched = true;
            searchObj.isDeclared = false;
            searchObj.status = { $in: ["pending", "active"] };

            let queryResponse = await Bet.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
            ]);

            return res.json(responseData("BET_LIST", queryResponse, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    clear_unmatched_bet: async (req, res) => {
        try {

            let searchObj = {}

            searchObj.userId = req?.user._id;
            searchObj.isMatched = false;

            if (req?.query?.matchBetId) {
                searchObj.matchBetId = req?.query?.matchBetId;
            }

            await Bet.deleteMany(searchObj);

            return res.json(responseData("UNMATCHED_BET_CLEARED", {}, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    bet_history: async (req, res) => {
        try {

            const { betType, status } = req.query;
            let { fromPeriod, toPeriod, filterByDay } = req.query;

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let searchObj;
            let total;
            if (betType && betType === "casino") {
                searchObj = {
                    userId: ObjectId(req.user._id)
                }
            } else {
                searchObj = {
                    userId: ObjectId(req.user._id),
                }
                if (status) {
                    searchObj.status = status;
                } else if (betType && (betType === "betfair" || betType === "betFair")) {
                    searchObj.status = "completed";
                }
            }

            let queryResponse;

            if (fromPeriod) {
                fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                fromPeriod = new Date(fromPeriod)
                // console.log("fromPeriod", fromPeriod)
                searchObj.timeInserted = { $gte: fromPeriod }
            }

            if (toPeriod) {
                toPeriod = moment(toPeriod).format("MM-DD-YYYY")
                toPeriod = new Date(toPeriod)
                toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
                toPeriod = new Date(toPeriod)
                searchObj.timeInserted = { $lt: toPeriod }
            }

            if (filterByDay === "today") {
                fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                fromPeriod = moment().startOf('day')
                fromPeriod = new Date(fromPeriod)
                searchObj.timeInserted = { $gte: fromPeriod }
            }

            if (filterByDay === "yesterday") {
                fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                fromPeriod = moment().startOf('day')
                fromPeriod = moment(fromPeriod).subtract(1, 'day')
                fromPeriod = new Date(fromPeriod)
                searchObj.timeInserted = { $gte: fromPeriod }
            }

            if (betType && betType === "casino") {
                queryResponse = await CasinoBet.aggregate([{
                    $match: searchObj,
                },
                {
                    $lookup: {
                        from: "casino_games",
                        localField: "gameId",
                        foreignField: "game_id",
                        as: "gameDetails",
                        pipeline: [
                            {
                                $project:{
                                    game_name: 1,
                                    game_id: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },]);
                total = await CasinoBet.countDocuments(searchObj);
            }

            if (betType && betType === "sportBook") {
                queryResponse = await SportBookBet.aggregate([{
                    $match: { ...searchObj, status: "completed" },
                },
                {
                    $sort: { timeInserted: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },]);

                total = await SportBookBet.countDocuments({ ...searchObj, status: "completed" });
            }

            if (betType && betType === "fancy") {
                queryResponse = await SessionBet.aggregate([{
                    $match: { ...searchObj, status: "completed" },
                }, {
                    $sort: { timeInserted: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },]);
                total = await SessionBet.countDocuments({ ...searchObj, status: "completed" });
            }

            if (betType && betType === "bookmaker") {
                searchObj.betFaireType = betType;
                searchObj.isBookmakerDeclared = true;
            }
            if (betType && (betType === "betfair" || betType === "betFair")) {
                searchObj.betFaireType = { $in: ["betFair", "betfair"] };
            }

            var queryPattern = [
                {
                    $match: searchObj,
                },
                {
                    $sort: { timeInserted: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
            ];

            if (betType !== "casino" && betType !== "fancy" && betType !== "sportBook") {
                queryResponse = await Bet.aggregate(queryPattern);
                total = await Bet.countDocuments(searchObj);
            }

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj
            }

            return res.json(responseData("BET_LIST", responseCreate, req, true));

        } catch (error) {
            // console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    profit_loss: async (req, res) => {
        try {
            let { fromPeriod, toPeriod, filterByDay, betType } = req.query;

            // return res.json(responseData("ERROR_OCCUR", "", req, false));

            let regexFilter = {};
            let searchObj = {};
            const userId = ObjectId(req?.user._id)
            searchObj.userId = ObjectId(req?.user._id);
            betType = (betType === "sportBook") ? "sportbook" : betType;
            if (betType === 'bookmaker') {
                searchObj.reportType = "bookmaker";

            } else if (betType === 'betFair' || betType === 'betfair') {
                searchObj.reportType = { $in: ["betFair", "betfair"] };
            } else if (betType === 'sportbook' || betType === 'fancy') {
                searchObj.reportType = betType;
            }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            let total;
            if (betType === "casino") {
                if (fromPeriod) {
                    fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                    fromPeriod = new Date(fromPeriod)
                    searchObj.createdAt = { $gte: fromPeriod }
                }
                if (toPeriod) {
                    toPeriod = moment(toPeriod).format("MM-DD-YYYY")
                    toPeriod = new Date(toPeriod)
                    toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
                    toPeriod = new Date(toPeriod)
                    searchObj.createdAt = { $lt: toPeriod }
                }
                if(fromPeriod && toPeriod){
                    searchObj.createdAt = { $gte: fromPeriod, $lt: toPeriod }
                }
                if (filterByDay === "today") {
                    fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                    fromPeriod = moment().startOf('day')
                    fromPeriod = new Date(fromPeriod)
                    searchObj.createdAt = { $gte: fromPeriod }
                }
                if (filterByDay === "yesterday") {
                    fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                    fromPeriod = moment().startOf('day')
                    fromPeriod = moment(fromPeriod).subtract(1, 'day')
                    fromPeriod = new Date(fromPeriod)
                    searchObj.createdAt = { $gte: fromPeriod }
                }
                total = await CasinoBet.countDocuments(searchObj);
            } else {

                regexFilter.eventId = { $in: await Report.distinct('eventId', searchObj) }
                fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                fromPeriod = moment().startOf('day')
                fromPeriod = new Date(fromPeriod)
                regexFilter.eventDateTime = { $gte: fromPeriod }
                if (fromPeriod) {
                    fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                    fromPeriod = new Date(fromPeriod)
                    // console.log("fromPeriod", fromPeriod)
                    regexFilter.eventDateTime = { $gte: fromPeriod }
                }
                if (toPeriod) {
                    toPeriod = moment(toPeriod).format("MM-DD-YYYY")
                    toPeriod = new Date(toPeriod)
                    toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
                    toPeriod = new Date(toPeriod)
                    regexFilter.eventDateTime = { $lt: toPeriod }
                }
                if (filterByDay === "today") {
                    fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                    fromPeriod = moment().startOf('day')
                    fromPeriod = new Date(fromPeriod)
                    regexFilter.eventDateTime = { $gte: fromPeriod }
                }
                if (filterByDay === "yesterday") {
                    fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
                    fromPeriod = moment().startOf('day')
                    fromPeriod = moment(fromPeriod).subtract(1, 'day')
                    fromPeriod = new Date(fromPeriod)
                    regexFilter.eventDateTime = { $gte: fromPeriod }
                }
                total = await Match.countDocuments(regexFilter);
            }
            // // console.log('searchObj-----------',searchObj)

            let matchResponse;
            // fancy OR betFair OR bookmaker OR sportbook
            if (betType == 'bookmaker') {
                matchResponse = [];

                // await Match.aggregate([
                //     {
                //         $lookup: {
                //                 from: 'tournaments',
                //                 let: {
                //                     addr: '$seriesId'
                //                 },
                //                 pipeline: [
                //                     {
                //                         $match: {
                //                             status:'active',
                //                             $expr: { $eq: [ '$seriesId', '$$addr'] },

                //                         }
                //                     },
                //                     {
                //                         $project:{
                //                             _id:1,
                //                             seriesId:1,
                //                             seriesName:1
                //                         }
                //                     },
                //                     { $sort:{eventDateTime:1} },
                //                 ],
                //                 as: 'tournament'
                //         }
                //     },
                //     {
                //         $unwind:{
                //             path: '$tournament',
                //             preserveNullAndEmptyArrays: true,
                //         }
                //     },
                //     {
                //         $lookup: {
                //                 from: 'bets',
                //                 let: {
                //                     addr: '$eventId'
                //                 },
                //                 pipeline: [
                //                     {
                //                         $match: {
                //                             userId:ObjectId(req?.user._id),
                //                             isDeclared:true,
                //                             $expr: { $eq: [ '$eventId', '$$addr'] },

                //                             betFaireType:"bookmaker",

                //                             userId:ObjectId(userId),
                //                             isDeclared:false,
                //                             $expr: { $eq: [ '$eventId', '$$addr'] },
                //                             betFaireType:'bookmaker',
                //                             status:{$in:['pending','active']}

                //                         }
                //                     },
                //                     {
                //                         $sort:{timeInserted:-1}
                //                     }
                //                 ],
                //                 as: 'bets_list'
                //         }
                //     },
                //     {
                //         $match:regexFilter
                //     },
                //     { $sort:{eventDateTime:1} },
                //     {
                //         $skip: startIndex
                //     },
                //     {
                //         $limit: limit
                //     },
                //     {
                //         $project:{
                //             '_id':'$_id',
                //             'gameType': '$gameType',
                //             'tournamentId':'$tournamentId',
                //             'seriesId': '$seriesId',
                //             'eventId': '$eventId',
                //             'marketId': '$marketId',
                //             'centralizedId': '$centralizedId',
                //             'bookmakerMarketId': '$bookmakerMarketId',
                //             'bookmakerCentralizedId': '$bookmakerCentralizedId',
                //             'isMarketDataDelayed': '$isMarketDataDelayed',
                //             'eventName': '$eventName',
                //             'countryCode': '$countryCode',
                //             'venue': '$venue',
                //             'timeZone': '$timeZone',
                //             'eventDateTime': '$eventDateTime',
                //             'status':'$status',
                //             'eventType':"$eventType",
                //             'seriesName':"$tournament.seriesName",
                //             "bets_list":"$bets_list"
                //         }
                //     }
                // ]);
            } else if (betType == 'sportbook') {
                matchResponse = await Match.aggregate([
                    {
                        $lookup: {
                            from: 'tournaments',
                            let: {
                                addr: '$seriesId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        status: 'active',
                                        $expr: { $eq: ['$seriesId', '$$addr'] },

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
                            from: 'sports_book_bets',
                            let: {
                                addr: '$marketId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$marketId', '$$addr'] },
                                        userId: ObjectId(req?.user._id),
                                        isDeclared: true
                                    }
                                },
                                {
                                    $sort: { timeInserted: -1 }
                                }
                            ],
                            as: 'bets_list'
                        }
                    },
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
                            'centralizedId': '$centralizedId',
                            'bookmakerMarketId': '$bookmakerMarketId',
                            'bookmakerCentralizedId': '$bookmakerCentralizedId',
                            'isMarketDataDelayed': '$isMarketDataDelayed',
                            'eventName': '$eventName',
                            'countryCode': '$countryCode',
                            'venue': '$venue',
                            'timeZone': '$timeZone',
                            'eventDateTime': '$eventDateTime',
                            'status': '$status',
                            'eventType': "$eventType",
                            'seriesName': "$tournament.seriesName",
                            "bets_list": "$bets_list"
                        }
                    }
                ]);
            } else if (betType == 'fancy') {
                matchResponse = await Match.aggregate([
                    {
                        $lookup: {
                            from: 'tournaments',
                            let: {
                                addr: '$seriesId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        status: 'active',
                                        $expr: { $eq: ['$seriesId', '$$addr'] },

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
                            from: 'session_bets',
                            let: {
                                addr: '$eventId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$eventId', '$$addr'] },
                                        userId: ObjectId(req?.user._id),
                                        isDeclared: true
                                    }
                                },
                                {
                                    $sort: { timeInserted: -1 }
                                }
                            ],
                            as: 'bets_list'
                        }
                    },
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
                            'centralizedId': '$centralizedId',
                            'bookmakerMarketId': '$bookmakerMarketId',
                            'bookmakerCentralizedId': '$bookmakerCentralizedId',
                            'isMarketDataDelayed': '$isMarketDataDelayed',
                            'eventName': '$eventName',
                            'countryCode': '$countryCode',
                            'venue': '$venue',
                            'timeZone': '$timeZone',
                            'eventDateTime': '$eventDateTime',
                            'status': '$status',
                            'eventType': "$eventType",
                            'seriesName': "$tournament.seriesName",
                            "bets_list": "$bets_list"
                        }
                    }
                ]);

            } else if (betType == "casino") {
                matchResponse = await CasinoBet.aggregate([
                    {
                        $match: searchObj
                    },
                    {
                        $lookup: {
                            from: 'casino_games',
                            localField: "gameId",
                            foreignField: "game_id",
                            as: "gameDetails",
                            pipeline: [{
                                $project: {
                                    game_name: 1
                                }
                            }]
                        }
                    },
                    {
                        $unwind: { path: '$gameDetails', preserveNullAndEmptyArrays: true}
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]);
            } else {
                matchResponse = await Match.aggregate([
                    {
                        $lookup: {
                            from: 'tournaments',
                            let: {
                                addr: '$seriesId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        status: 'active',
                                        $expr: { $eq: ['$seriesId', '$$addr'] },
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
                            from: 'bets',
                            let: {
                                addr: '$eventId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        userId: ObjectId(userId),
                                        // isDeclared: false,
                                        $expr: { $eq: ['$eventId', '$$addr'] },
                                        betFaireType: 'betfair',
                                        status: { $in: ['completed'] }
                                    }
                                },
                                {
                                    $sort: { timeInserted: -1 }
                                }
                            ],
                            as: 'bets_list'
                        }
                    },
                    {
                        $match: regexFilter
                    },
                    { $sort: { eventDateTime: -1 } },
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
                            'centralizedId': '$centralizedId',
                            'bookmakerMarketId': '$bookmakerMarketId',
                            'bookmakerCentralizedId': '$bookmakerCentralizedId',
                            'isMarketDataDelayed': '$isMarketDataDelayed',
                            'eventName': '$eventName',
                            'countryCode': '$countryCode',
                            'venue': '$venue',
                            'timeZone': '$timeZone',
                            'eventDateTime': '$eventDateTime',
                            'status': '$status',
                            'eventType': "$eventType",
                            'seriesName': "$tournament.seriesName",
                            "bets_list": "$bets_list"
                        }
                    }
                ]);
            }

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

            let responseCreate = {
                data: matchResponse,
                count: matchResponse.length,
                ...paginateObj
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));
        } catch (error) {
            console.log("error", error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }
}