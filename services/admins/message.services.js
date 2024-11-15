const User = require("../../models/user.model");
const Message = require("../../models/message.model");
const { responseData } = require("../../helpers/responseData");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const moment = require('moment');

module.exports = {
    create: async(req,res) => {
        try {

            let {
                msgDate,
                domain,
                title,
                message,
                type
            } = req.body;

            console.log('req.body',req.body)

            const user_id = req.user._id;
            var resp;
            if(type && type==='important')
            {
                let messageQuery = await Message.findOne({type:"important"})
                if(messageQuery?._id)
                {   
                    resp = await Message.findByIdAndUpdate({
                        _id:ObjectId(messageQuery._id)
                    },
                    {
                        $set:{message:message, isImportant:true}
                    },
                    { returnOriginal:false })

                }else{
                    resp = await Message.create({
                        createdBy: ObjectId(user_id),
                        title:title,
                        domain:domain,
                        message:message,
                        msgDate:msgDate,
                        status: 'open',
                        type: "important",
                        isImportant:true
                    });
                }
                
            }else{
                resp = await Message.create({
                    createdBy: ObjectId(user_id),
                    title:title,
                    domain:domain,
                    message:message,
                    msgDate:msgDate,
                    status: 'open',
                    type: type || "user",
                });
            }

            return res.json(responseData("MESSAGE_CREATED", resp, req, true));
        
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
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
    update: async(req,res) => {
        try {
            
            let {
                messageId,
                title,
                message,
                msgDate,
                status,
            } = req.body

            let updateObj = {}

            if(title)updateObj.title=title;
            if(message)updateObj.message=message;
            if(msgDate)updateObj.msgDate=msgDate;
            if(status)updateObj.status=status;

            let messageQuery = await Message.findByIdAndUpdate({
                _id:ObjectId(messageId)
            },
            {
                $set:updateObj
            },
            { returnOriginal:false })

            return res.json(responseData("MESSAGE_UPDATE", messageQuery, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    statusUpdate: async(req,res) => {
        try {
            
            let {
                messageId,
                status,
            } = req.body

            let updateObj = {};
            if(status)updateObj.status=status;

            if(messageId && status && messageId.length>0)
            {
                if(status =="delete")
                {
                    await Message.deleteMany({ _id: { $in: messageId } });

                }else{
                    await Message.updateMany({ _id: { $in: messageId } },
                        {
                            $set:updateObj
                        });
                }

                return res.json(responseData("MESSAGE_UPDATE", {}, req, true));
            }else{
                return res.json(responseData("MESSAGE_UPDATE_FALLS", {}, req, true));
            }

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    getList: async(req,res) => {
        try {
            
            let {
                status,
                type
            } = req.query

            let senderId = req.user._id
            let searchObj = {}
            if(status){
                searchObj.status = status
            }            
            // if(type)searchObj.type = type
            if(type && type=='user')
            {
                searchObj.type ={$in:['user','downline','all']}
            }else{
                searchObj.type =type
            }
            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Message.countDocuments({
                createdBy:ObjectId(senderId),
                ...searchObj
            });

            let queryResponse = await Message.aggregate([
                {
                    $match:{
                        createdBy:ObjectId(senderId),
                        ...searchObj
                    }
                },
                {
                    $sort:{ createdAt:-1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
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

            let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    getImportant: async(req,res) => {
        try {
            
            let messageQuery = await Message.findOne({type:"important"})

            return res.json(responseData("MESSAGE_GET", messageQuery, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    getDownline: async(req,res) => {
        try {
            const {type} = req.query;
            let searchObj= {type: {$in:["downline","all"]}}
            searchObj.domain = req.query?.domain;
            // if(req.query?.domain && req.query?.domain !="localhost"){
            //     searchObj.domain = req.query?.domain;
            // }
            let messageQuery = await Message.find({ ...searchObj })

            return res.json(responseData("MESSAGE_GET", messageQuery, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
}