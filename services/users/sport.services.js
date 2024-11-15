const Sport = require("../../models/sport.model");
const Match = require("../../models/match.model");
const Tournament = require("../../models/tournament.model");
const multiMarket = require("../../models/multiMarket.model");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { responseData } = require('../../helpers/responseData');
const { ObjectId } = require('mongodb');
const moment = require("moment");

const {
    deleteRedisCache,
    getData,
    setData,
    deleteData,
} = require("../../helpers/redisHelper");
const { REDIS_CACHE_TTL } = process.env;

module.exports = {
    get_sports: async (req, res) => {
        try {

            let {
                keyword,
                userId
            } = req.query;

            // console.log('req?.user?._id',req?.query?.userId)

            let inPlay = await Match.aggregate([
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
                    $match: {
                        // eventDateTime:{ $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) },
                        status: 'in_play'
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
                        seriesId: 1,
                        eventType: 1,
                        tournament: 1,
                        venue: 1,
                        timeZone: 1,
                        marketCount: 1,
                        runners: "$jsonData",
                        multi_market: 1,
                        matchSetting: 1,
                        fancyList: "$fancyList",
                        scoreId: 1,
                        channel: 1,
                        gameType: 1,
                        sport_setting: "$sport_setting"
                    }
                },
                { $sort: { eventDateTime: 1 } }
            ]);

            let matchRegexFilter = {
                $and: [
                    { eventDateTime: { $gte: new Date(moment().utc().subtract(1, 'days').format("YYYY-MM-DD 23:59:00")) } },
                    { eventDateTime: { $lte: new Date(moment().utc().format("YYYY-MM-DD 23:59:00")) } },
                    { status: 'active' }
                ]
            }

            let toDay = await Match.aggregate([

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
                    $match: matchRegexFilter
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
                        seriesId: 1,
                        eventType: 1,
                        tournament: 1,
                        multi_market: 1,
                        gameType: 1,
                    }
                },
                { $sort: { eventDateTime: 1 } }
            ]);

            let matchRegexTFilter = {
                $and: [
                    { eventDateTime: { $gte: new Date(moment().utc().format("YYYY-MM-DD 23:59:00")) } },
                    { eventDateTime: { $lte: new Date(moment().utc().add(1, 'days').format("YYYY-MM-DD 23:59:00")) } },
                    { status: 'active' }
                ]
            }

            let tomorrow = await Match.aggregate([
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
                    },
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
                    $match: matchRegexTFilter
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
                        seriesId: 1,
                        eventType: 1,
                        tournament: 1,
                        multi_market: 1,
                        gameType: 1,
                    }
                },
                { $sort: { eventDateTime: 1 } }
            ]);

            return res.json(responseData("GET_LIST_SPORT", { inPlay, toDay, tomorrow }, req, true));

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_mobile_sports: async (req, res) => {
        try {

            let {
                keyword,
                userId,
                type
            } = req.query;

            let matchRegexFilter = {
                $and: [
                    { status: 'active' },
                    { eventDateTime: { $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD 23:59:00")) } },
                    { eventDateTime: { $lte: new Date(moment().format("YYYY-MM-DD 23:59:00")) } },
                ]
            }

            let matchRegexTFilter = {
                $and: [
                    { status: 'active' },
                    { eventDateTime: { $gte: new Date(moment().format("YYYY-MM-DD 23:59:00")) } },
                    { eventDateTime: { $lte: new Date(moment().add(1, 'days').format("YYYY-MM-DD 23:59:00")) } },
                ]
            }

            let inPlay = [];
            let toDay = [];
            let tomorrow = [];

            if (type == 'inplay') {
                // await deleteData(`inPlay`);
                let inplay;
                // let allRecords_Cache = await getData(`inPlay`).catch((err) => {
                //     if (err) console.error('error--',err)
                // });
                // if(allRecords_Cache){
                //     console.log('tt2',1)
                //     inplay = JSON.parse(allRecords_Cache);
                // }
                // else{
                //     console.log('tt2',2)
                //     inplay = await Match.aggregate([
                //     {
                //         $lookup: {
                //                 from: 'multi_markets',
                //                 let: {
                //                     addr: '$eventId'
                //                 },
                //                 pipeline: [
                //                     {
                //                         $match: {
                //                             $expr: { $eq: [ '$eventId', '$$addr'] },
                //                             createdBy:ObjectId(req?.query?.userId)
                //                         }
                //                     },
                //                     {
                //                         $project:{
                //                             createdBy:1,
                //                             eventId:1
                //                         }
                //                     }
                //                 ],
                //                 as: 'multi_market'
                //         }
                //     },
                //     {
                //         $match:{
                //             // eventDateTime:{ $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) },
                //             status:'in_play'
                //         }
                //     },
                //     {
                //         $project:{
                //             _id:1,
                //             eventId:1,
                //             marketId:1,
                //             centralizedId:1,
                //             bookmakerMarketId:1,
                //             bookmakerCentralizedId:1,
                //             eventName:1,
                //             eventDateTime:1,
                //             status:1,
                //             seriesId:1,
                //             eventType:1,
                //             tournament:1,
                //             venue:1,
                //             timeZone:1,
                //             marketCount:1,
                //             // fancyList:{$size:"$fancyList"},
                //             // multi_market:{$size:"$multi_market"},
                //             scoreId:1,
                //             gameType:1,
                //             channel:1,
                //         }
                //     },
                //     { $sort:{eventDateTime:1} }
                //     ]);
                //     // await deleteRedisCache('inPlay');
                //     await setData(`inPlay`, inplay);
                // }
                inplay = await Match.aggregate([
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
                        $match: {
                            // eventDateTime:{ $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) },
                            status: 'in_play'
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
                            seriesId: 1,
                            eventType: 1,
                            tournament: 1,
                            venue: 1,
                            timeZone: 1,
                            marketCount: 1,
                            // fancyList:{$size:"$fancyList"},
                            // multi_market:{$size:"$multi_market"},
                            scoreId: 1,
                            gameType: 1,
                            channel: 1,
                        }
                    },
                    { $sort: { eventDateTime: 1 } }
                ]);
                return res.json(responseData("GET_LIST_SPORT", { inplay, toDay, tomorrow }, req, true));

            } else if (type == 'today') {
                await deleteData(`today`);
                let today;
                let allRecords_Cache = await getData(`today`).catch((err) => {
                    if (err) console.error('error--', err)
                });
                if (allRecords_Cache) {
                    // console.log('tt2',1)
                    today = JSON.parse(allRecords_Cache);
                }
                else {
                    // console.log('tt2',2)
                    today = await Match.aggregate([

                        {
                            $match: matchRegexFilter
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
                                seriesId: 1,
                                eventType: 1,
                                tournament: 1,
                                gameType: 1,
                            }
                        },
                        { $sort: { eventDateTime: 1 } }
                    ]);
                    // await deleteRedisCache('inPlay');
                    await setData(`today`, today);
                }
                return res.json(responseData("GET_LIST_SPORT", { inPlay, today, tomorrow }, req, true));

            } else if (type == 'tomorrow') {
                await deleteData(`tomorrow`);
                let tomorrow;
                let allRecords_Cache = await getData(`tomorrow`).catch((err) => {
                    if (err) console.error('error--', err)
                });
                if (allRecords_Cache) {
                    // console.log('tt2',1)
                    tomorrow = JSON.parse(allRecords_Cache);
                }
                else {
                    // console.log('tt2',2)
                    tomorrow = await Match.aggregate([

                        {
                            $match: matchRegexTFilter
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
                                seriesId: 1,
                                eventType: 1,
                                tournament: 1,
                                gameType: 1,
                            }
                        },
                        { $sort: { eventDateTime: 1 } }
                    ]);
                    // await deleteRedisCache('inPlay');
                    await setData(`tomorrow`, tomorrow);
                }
                return res.json(responseData("GET_LIST_SPORT", { inPlay, toDay, tomorrow }, req, true));
            } else {
                inPlay = await Match.aggregate([
                    {
                        $lookup:
                        {
                            from: "fancies",
                            localField: "eventId",
                            foreignField: "eventId",
                            as: "fancyList"
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
                        $match: {
                            // eventDateTime:{ $gte: new Date(moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")) },
                            status: 'in_play'
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
                            seriesId: 1,
                            eventType: 1,
                            tournament: 1,
                            venue: 1,
                            timeZone: 1,
                            marketCount: 1,
                            fancyList: { $size: "$fancyList" },
                            multi_market: { $size: "$multi_market" },
                            scoreId: 1,
                            gameType: 1,
                            channel: 1,
                        }
                    },
                    { $sort: { eventDateTime: 1 } }
                ]);

                toDay = await Match.aggregate([

                    {
                        $match: matchRegexFilter
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
                            seriesId: 1,
                            eventType: 1,
                            tournament: 1,
                            gameType: 1,
                        }
                    },
                    { $sort: { eventDateTime: 1 } }
                ]);

                tomorrow = await Match.aggregate([

                    {
                        $match: matchRegexTFilter
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
                            seriesId: 1,
                            eventType: 1,
                            tournament: 1,
                            gameType: 1,
                        }
                    },
                    { $sort: { eventDateTime: 1 } }
                ]);

                return res.json(responseData("GET_LIST_SPORT", { inPlay, toDay, tomorrow }, req, true));
            }

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_sport_list: async (req, res) => {
        try {
            let regexFilter = { status: "active", betfairId: { $in: [1, 2, 4] } }

            let queryResponse = await Sport.aggregate([
                {
                    $match: regexFilter
                },
                { $sort: { createdAt: 1 } }
            ])

            return res.json(responseData("GET_LIST_SPORT", queryResponse, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    set_multi_market: async (req, res) => {
        try {
            let {
                eventId
            } = req.body;

            let matchExist = await Match.findOne({
                eventId
            });

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            if (!eventId) {
                return res.json(responseData("invalid event", {}, req, false));
            }

            let matchMarketExist = await multiMarket.findOne({
                eventId,
                createdBy: ObjectId(req.user._id)
            });

            if (matchMarketExist?._id) {
                // await multiMarket.delete(req, res);
                const deleteDataApi = await multiMarket.deleteOne({
                    eventId,
                    createdBy: ObjectId(req.user._id)
                });
                // console.log('matchMarketExist?._id',deleteData)
                return res.json(responseData("removed", { deleteData: deleteDataApi }, req, true));

            } else {

                const resp = await multiMarket.create({
                    createdBy: ObjectId(req.user._id),
                    eventId
                });
                return res.json(responseData("added", resp, req, true));
            }

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_multi_market: async (req, res) => {
        try {

            let regexFilter = {}

            regexFilter.status = { $in: ['active', 'in_play'] };
            regexFilter.eventId = {
                "$in": await multiMarket.distinct('eventId', { createdBy: ObjectId(req.user._id) })
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
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    inplay_match_count: async (req, res) => {
        try {

            const cricketInplayCount = await Match.countDocuments({ gameType: "cricket", status: ["in_play", "active"] })
            const soccerInplayCount = await Match.countDocuments({ gameType: "soccer", status: ["in_play", "active"] })
            const tennisInplayCount = await Match.countDocuments({ gameType: "tennis", status: ["in_play", "active"] })

            var resObj = {
                cricketInplayCount,
                soccerInplayCount,
                tennisInplayCount
            }

            return res.json(responseData("GET_LIST", resObj, req, true));

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }
}