const Tournament = require("../../models/tournament.model");
const Match = require("../../models/match.model");
const Fancy = require("../../models/fancy.model");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { responseData } = require('../../helpers/responseData');
const { ObjectId } = require('mongodb');
const moment = require("moment");
module.exports = {
    get_tournament_list: async (req, res) => {
        try {
            const {
                keyword,
            } = req.query

            let regexFilter = {}

            if(keyword){
                regexFilter = { 
                    $or: [
                        { 'gameType': { $regex: keyword, $options: 'i' } },
                        { 'seriesName': { $regex: keyword, $options: 'i' } }
                    ] 
                }    
            }

            regexFilter.isDeleted = false;

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Tournament.countDocuments(regexFilter);

            let queryResponse = await Tournament.aggregate([
                {
                    $match:regexFilter
                },
                { $sort:{createdAt:1} },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                }
            ])

            let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

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
    get_series_list: async (req, res) => {
        try {
            let {
                keyword,
            } = req.query

            let regexFilter = {};
            let matchFilter = {};
            matchFilter.status={$in:['active','in_play']};
            if(keyword){
                matchFilter = {
                    $or: [
                        { 'gameType': { $regex: keyword, $options: 'i' } },
                        { 'eventId': { $regex: keyword, $options: 'i' } },
                        { 'marketId': { $regex: keyword, $options: 'i' } },
                        { 'eventName': { $regex: keyword, $options: 'i' } },
                    ] 
                }
            }

            regexFilter.gameType = (req?.query?.gameType)?req?.query?.gameType:'cricket';
            regexFilter.status ='active';
            regexFilter.seriesId =  {
                "$in": await Match.distinct('seriesId',matchFilter)
            };

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Tournament.countDocuments(regexFilter);

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
                                    $expr: { $eq: [ '$seriesId', '$$addr'] },
                                    ...matchFilter
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
                                                $expr: { $eq: [ '$eventId', '$$addr'] },
                                                status:'open',
                                                isDeleted:false
                                            }
                                        },
                                        {
                                            $project:{
                                                _id:1,
                                                matchId:1,
                                                fancyName:1,
                                                status:1,
                                            }
                                        },
                                        { $sort:{eventDateTime:1} }
                                    ],
                                    as: 'fancyList'
                                }
                            },
                            {
                                $project:{
                                    _id:1,
                                    eventId:1,
                                    marketId:1,
                                    centralizedId:1,
                                    bookmakerMarketId:1,
                                    bookmakerCentralizedId:1,
                                    eventName:1,
                                    eventDateTime:1,
                                    status:1,
                                    eventType:1,
                                    premiumFancy:1,
                                    matchOdds:1,
                                    bookMaker:1,
                                    fancy:1,
                                    'runners': '$jsonData',
                                    'bookmakerRunners': '$jsonBookmakerData',
                                    'fancyList':"$fancyList",
                                    'matchSetting':"$matchSetting",
                                    adsContent:1,
                                    adsStatus:1
                                }
                            },
                            { $sort:{eventDateTime:1} }
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
                    $match:regexFilter
                },
                { $sort:{createdAt:1} },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                }
            ]);

            let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST_TOURNAMENT", responseCreate, req, true));

        } catch (error) {
            console.log('error',error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    block_market: async(req,res) => {
        try {
           
            const {
                eventId,seriesId,
            } =req.body;

            if (!eventId && !seriesId) { return res.json(responseData("eventId or seriesId field is required", [], req, false)); }
            let id = req.params.id
            const updateData ={};
            if (req.body?.matchOdds) updateData.matchOdds=req.body?.matchOdds;
            if (req.body?.bookMaker) updateData.bookMaker=req.body?.bookMaker;
            if (req.body?.premiumFancy) updateData.premiumFancy=req.body?.premiumFancy;
            if (req.body?.fancy) updateData.fancy=req.body?.fancy;
            let filterType = (eventId)?{eventId}:{seriesId};
            console.log('filterType',filterType)
            let query = await Match.updateMany(filterType,
                        {
                            $set:updateData
                        },
                        { upsert: true, returnOriginal: false });

            if(seriesId)
            {
                await Tournament.updateMany({
                    seriesId
                    },
                    {
                        $set:updateData
                    },
                    { upsert: true, returnOriginal: false });
            }

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData(error.message, {}, req, false));
        }
    },
    update_status: async(req,res) => {
        try {
            
            let { status } = req.body
            let id = req.params.id

            let query = await Tournament.findByIdAndUpdate({
                _id:ObjectId(id)
            },
            {
                $set:{
                    status:status
                }
            },{ returnOriginal: false })

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    delete_all:async(req,res) => {

    }
}