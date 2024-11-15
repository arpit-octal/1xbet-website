const Sport = require("../../models/sport.model");
const Match = require("../../models/match.model");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { responseData } = require('../../helpers/responseData');
const { ObjectId } = require('mongodb');

module.exports = {
    get_sport_list: async (req, res) => {
        try {
            const {
                keyword,
            } = req.query

            let regexFilter = {}

            if(keyword){
                regexFilter = { 
                    $or: [
                        { 'name': { $regex: keyword, $options: 'i' } }
                    ]
                }
            }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Sport.countDocuments(regexFilter);

            let queryResponse = await Sport.aggregate([
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

            return res.json(responseData("GET_LIST_SPORT", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_sport_filter_list: async (req, res) => {
        try {
            

            let regexFilter = {}

            if(req.query?.sportType){
                regexFilter.eventType = req.query?.sportType
            }else{
                regexFilter.eventType = 4;
            }

            let matchData = await Match.aggregate([
                {
                    $match:regexFilter
                },
                { $sort:{createdAt:1} },
                {
                    $project: {
                        eventName:1,
                        eventId:1,
                    }
                }
            ]);

            return res.json(responseData("GET_LIST_SPORT", {matchData}, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    update_status: async(req,res) => {
        try {
            
            let { status } = req.body
            let id = req.params.id;
            let updateData={
                status:status
            }
            if (req.body?.banking) updateData.banking=req.body?.banking;
            if (req.body?.internationalMarket) updateData.internationalMarket=req.body?.internationalMarket;

            let query = await Sport.findByIdAndUpdate({
                _id:ObjectId(id)
            },
            {
                $set:updateData
            },{ upsert: true, returnOriginal: false })

            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }
}