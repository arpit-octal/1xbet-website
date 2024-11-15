const User = require("../../models/user.model");
const Message = require("../../models/message.model");
const { responseData } = require("../../helpers/responseData");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const moment = require('moment');

module.exports = {
    getOne: async(req,res) => {
        try {
            
            let {
                messageId
            } = req.query

            let messageQuery = await Message.findById({_id:ObjectId(messageId)})

            return res.json(responseData("MESSAGE_GET", messageQuery, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    getList: async(req,res) => {
        try {
            const {type} = req.query;
            let searchObj = {}
            let time = new Date(moment().format("YYYY-MM-DD 00:00:00"))
            time = new Date(moment(time).subtract(5.5, 'hours'))
            searchObj.msgDate = { $gte: time }
            searchObj.type = {$in:['user','all','hyper','important']}
            searchObj.status = "open";
            if(req.query?.domain && req.query?.domain !="localhost"){
                searchObj.domain = req.query?.domain;
            }

            let queryResponse = await Message.aggregate([
                {
                    $match:{
                        ...searchObj
                    }
                },
                {
                    $sort:{ msgDate:1 }
                },
                { 
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$createdBy'
                        },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: [ '$_id', '$$addr'] }
                                }
                            },
                            {
                                $project:{
                                    _id:1,
                                    userType:1,
                                    username:1
                                }
                            }
                        ],
                        as: 'createdByData'
                    }
                },
                {
                    $unwind:{
                        path: '$createdByData',
                        preserveNullAndEmptyArrays: true,
                    }
                },
            ])

            return res.json(responseData("GET_LIST", queryResponse, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
}