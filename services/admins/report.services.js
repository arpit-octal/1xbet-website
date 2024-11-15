const Report = require("../../models/report.model");
const CasinoBet = require("../../models/casinoBet.model");
const Admin = require("../../models/user.model");
const Website = require("../../models/website.models");
const Activity = require("../../models/activity.model");
const Wallet = require("../../models/wallet.model");
const Transaction = require("../../models/transaction.model");
const { isEmpty } = require("lodash");
const { saveActivity,getPaginateObj } = require('../../helpers/serviceHelper');
const { responseData } = require("../../helpers/responseData");
const { ObjectId } = require("mongodb");
const moment = require("moment");

module.exports = {
  downline: async (req, res) => {
    try {

        let {
            start_date,
            end_date,
            keyword,
            sort_by,
            sort_type,
            status
        } = req.query

        const created_by = (req.query?.created_by)?req.query?.created_by:req?.user?._id;
        const userType = (req.query?.userType)?req.query?.userType:req.user?.userType;
        let matchFilter = {}
        let dateFilter = {}
        if(start_date){
            const fromDate = moment(new Date(start_date)).utc().startOf('day')
            dateFilter = {
                ...dateFilter,
                "$gte": new Date(fromDate),
            }
        }

        if(end_date){
            const endDate = moment(new Date(end_date)).utc().endOf("day")
            dateFilter = {
                ...dateFilter,
                "$lte": new Date(endDate),
            }
        }

        if(end_date || start_date){
            dateFilter =  {"createdAt" : dateFilter}
            matchFilter = dateFilter
        }
        
        if(created_by) matchFilter.createdById = ObjectId(created_by) 
        if(status) matchFilter.status = status;
        
        if(keyword){
            matchFilter.$or = [
                { 'firstName': { $regex: keyword, $options: 'i' } },
                { 'lastName': { $regex: keyword, $options: 'i' } },
                { 'username': { $regex: keyword, $options: 'i' } },
                { 'email': { $regex: keyword, $options: 'i' } },
            ] 
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Admin.countDocuments(matchFilter);
        
        let keyType;
        if(userType === "owner") {
            keyType = "subOwnerId"
        }
        
        if(userType === "sub_owner"){
            keyType = "superAdminId"
        }
        if(userType === "super_admin"){
            keyType = "adminId"
        }
        if(userType === "admin"){
            keyType = "subAdminId"
        }
        if(userType === "sub_admin"){
            keyType = "superSeniorId"
        }
        if(userType === "senior_super"){
            keyType = "superAgentId"
        }
        if(userType === "super_agent"){
            keyType = "agentId"
        }
        if(userType === "agent"){
            keyType = "userId"
        }

        let queryResponse = await Admin.aggregate([
                {
                    $match:matchFilter
                },
                {
                    $lookup:{
                    from: 'reports',
                    as: "reportData",
                    let: {
                        addr: '$_id',
                    },
                    pipeline: [
                            { 
                                $match: { 
                                    $and: [
                                        {$expr: { $eq: [ "$"+keyType, '$$addr'] }},
                                        {reportType:{$ne:"Casino"}}
                                    ]
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    realAmount: { $sum: "$amount"},
                                    amount: { $sum: "$realAmount"},
                                    commission: { $sum: "$commission"},
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$reportData"
                },
                // {
                //     $lookup: {
                //             from: 'reports',
                //             let: {
                //                 addr: '$_id'
                //             },
                //             pipeline: [
                //                 {
                //                     $match: { 
                //                         $expr: { $eq: [ "$"+keyType, '$$addr'] },
                //                         reportType:{$ne:"Casino"}
                //                     }
                //                 },
                //                 { $sort:{reportGenerateDate:-1} },
                //             ],
                //             as: 'userDownlineData'
                //     }
                // },
                // {
                //     $unwind:{
                //         path: '$userDownlineData',
                //         preserveNullAndEmptyArrays: true,
                //     }
                // },
                // {
                //     $group:{_id:'$_id.state', city:{$first:'$_id.city'},  numberOfzipcode:{$first:'$numberOfzipcodes'}}
                // }
                // {
                //     $lookup:{
                //         from: 'users',
                //         as: "userDownlineData",
                //         let: {
                //             addr: '$_id',
                //         },
                //         pipeline: [
                //             { 
                //                 $match: { 
                //                     $and: [
                //                         {$expr: { $eq: [ '$userType', "user"] }},
                //                         {$expr: { $eq: [ "$"+keyType, '$$addr'] }}
                //                     ]
                //                 }
                //             },
                //             {
                //                 $lookup:{
                //                     from: 'reports',
                //                     as: "reportData2",
                //                     let: {
                //                         addr: '$userId',
                //                     },
                //                     pipeline: [
                //                         { 
                //                             $match: { 
                //                                 $and: [
                //                                     {$expr: { $eq: [ "$$addr", '$$addr'] }}
                //                                 ]
                //                             }
                //                         },
                //                         {
                //                             $group: {
                //                                 _id: null,
                //                                 realAmount: { $sum: "$amount"},
                //                                 amount: { $sum: "$realAmount"},
                //                                 commission: { $sum: "$commission"},
                //                             }
                //                         }
                //                     ]
                //                 }
                //             },
                //             {
                //                 $unwind: "$reportData2"
                //             },
                //             {
                //                 $project:{
                //                     _id:1,
                //                     username:1,
                //                     stake:"$reportData2",
                //                     stakeAmount:"$reportData2.realAmount",
                //                 }
                //             }
                //         ]
                //     }
                // },
                {
                $sort: {[sort_by || "createdAt"]: sort_type || -1},
            },
            {
                $skip: startIndex
            },
            {
                $limit: limit
            },
            {
                $project:{
                    userType:1,
                    email:1,
                    phone:1,
                    username:1,
                    firstName:1,
                    lastName:1,
                    totalCoins:1,
                    website:1,
                    createdById:1,
                    createdBy:1,
                    timeZone:1,
                    exposureLimit:1,
                    availableLimit:1,
                    creditReference:1, 
                    status:1,
                    playerBalance:1,
                    stake:"$reportData",
                    stakeAmount:"$reportData.realAmount",
                    // userDownlineData:"$userDownlineData"
                }
            }
        ]);

        let sumData = await Admin.aggregate([
            {
                $match:matchFilter
            },
            {
                $lookup:{
                from: 'reports',
                as: "reportData",
                let: {
                    addr: '$_id',
                },
                pipeline: [
                        { 
                            $match: { 
                                $and: [
                                    {$expr: { $eq: [ "$"+keyType, '$$addr'] }},
                                    {reportType:{$ne:"Casino"}}
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                realAmount: { $sum: "$amount"},
                                amount: { $sum: "$realAmount"},
                                commission: { $sum: "$commission"},
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$reportData"
            },
            {
            $sort: {[sort_by || "createdAt"]: sort_type || -1},
        },
        {
            $skip: startIndex
        },
        {
            $limit: limit
        },
        {
            $project:{
                userType:1,
                email:1,
                phone:1,
                username:1,
                firstName:1,
                lastName:1,
                totalCoins:1,
                website:1,
                createdById:1,
                createdBy:1,
                timeZone:1,
                exposureLimit:1,
                availableLimit:1,
                creditReference:1, 
                status:1,
                playerBalance:1,
                stake:"$reportData",
                stakeAmount:"$reportData.realAmount",
                // userDownlineData:"$userDownlineData"
            }
        },
        {
            $group: {
                _id: null,
                stakeAmount: {$sum: "$stakeAmount"},
                PlayerPL: {$sum: "$stake.amount"},
                commission: {$sum: "$stake.commission"},
            }
        }
    ]);

        let paginateObj = await getPaginateObj(queryResponse.length,limit,page,startIndex,endIndex)

        let responseCreate = {
            data: queryResponse,
            count: queryResponse.length,
            sumData: sumData[0],
            ...paginateObj
        }

      return res.json(responseData("GET_LIST", responseCreate, req, true));

    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  market: async (req, res) => {
    try {
      let { fromPeriod, toPeriod, filterByDay } = req.query;

      const created_by = req?.user?._id;
      const matchPlayerFilter ={};
      let changeIntype = req?.user?.userType;
      if(changeIntype === 'agent'){
          matchPlayerFilter.agentId =  ObjectId(created_by);
      }else if(changeIntype === 'super_agent'){
          matchPlayerFilter.superAgentId =  ObjectId(created_by);
      }else if(changeIntype === 'senior_super'){
          matchPlayerFilter.superSeniorId =  ObjectId(created_by);
      }else if(changeIntype === 'sub_admin'){
          matchPlayerFilter.subAdminId =  ObjectId(created_by);
      }else if(changeIntype === 'super_admin'){
          matchPlayerFilter.superAdminId =  ObjectId(created_by);
      }else if(changeIntype === 'admin'){
          matchPlayerFilter.adminId =  ObjectId(created_by);
      }else if(changeIntype === 'sub_owner'){
          matchPlayerFilter.subOwnerId =  ObjectId(created_by);
      }else if(changeIntype === 'owner'){
          matchPlayerFilter.ownerId =  ObjectId(created_by);
      }else{
          matchPlayerFilter.ownerId =  "-1";
      }

      let searchObj = {...matchPlayerFilter};

      if(fromPeriod){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = new Date(fromPeriod)
        // console.log("fromPeriod", fromPeriod)
        searchObj.reportGenerateDate = {$gte: fromPeriod}
      }
      if(toPeriod){
        toPeriod = moment(toPeriod).format("MM-DD-YYYY")
        toPeriod = new Date(toPeriod)
        toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
        toPeriod = new Date(toPeriod)
        searchObj.reportGenerateDate = {$lt: toPeriod}
      }
      if(filterByDay === "today"){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = moment().startOf('day')
        fromPeriod = new Date(fromPeriod)
        searchObj.reportGenerateDate = {$gte: fromPeriod}
      }
      if(filterByDay === "yesterday"){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = moment().startOf('day')
        fromPeriod = moment(fromPeriod).subtract(1,'day')
        fromPeriod = new Date(fromPeriod)
        searchObj.reportGenerateDate = {$gte: fromPeriod}
      }

      // searchObj.userId = req?.user._id;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await Report.countDocuments(searchObj);

      let queryResponse = await Report.aggregate([
          {
              $match:{
                  ...searchObj
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
                  as: 'owner'
              }
          },
          {
              $unwind:{
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
                  as: 'sub_owner'
              }
          },
          {
              $unwind:{
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
                  as: 'admin'
              }
          },
          {
              $unwind:{
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
                  as: 'super_admin'
              }
          },
          {
              $unwind:{
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
                  as: 'sub_admin'
              }
          },
          {
              $unwind:{
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
                  as: 'super_senior'
              }
          },
          {
              $unwind:{
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
                  as: 'super_agent'
              }
          },
          {
              $unwind:{
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
                  as: 'agent'
              }
          },
          {
              $unwind:{
                  path: '$agent',
                  preserveNullAndEmptyArrays: true,
              }
          },
          {
            $sort: {["reportGenerateDate"]:-1},
          },
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
          ...paginateObj
      }

      return res.json(responseData("GET_LIST", responseCreate, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  casino: async (req, res) => {
    try {
      let { fromPeriod, toPeriod, filterByDay } = req.query;

      const created_by = req?.user?._id;
      const matchPlayerFilter ={};
      let changeIntype = req?.user?.userType;
      if(changeIntype === 'agent'){
          matchPlayerFilter.agentId =  ObjectId(created_by);
      }else if(changeIntype === 'super_agent'){
          matchPlayerFilter.superAgentId =  ObjectId(created_by);
      }else if(changeIntype === 'senior_super'){
          matchPlayerFilter.superSeniorId =  ObjectId(created_by);
      }else if(changeIntype === 'sub_admin'){
          matchPlayerFilter.subAdminId =  ObjectId(created_by);
      }else if(changeIntype === 'super_admin'){
          matchPlayerFilter.superAdminId =  ObjectId(created_by);
      }else if(changeIntype === 'admin'){
          matchPlayerFilter.adminId =  ObjectId(created_by);
      }else if(changeIntype === 'sub_owner'){
          matchPlayerFilter.subOwnerId =  ObjectId(created_by);
      }else if(changeIntype === 'owner'){
          matchPlayerFilter.ownerId =  ObjectId(created_by);
      }else{
          matchPlayerFilter.ownerId =  "-1";
      }

      let searchObj = {...matchPlayerFilter};

      if(fromPeriod){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = new Date(fromPeriod)
        // console.log("fromPeriod", fromPeriod)
        searchObj.timeInserted = {$gte: fromPeriod}
      }
      if(toPeriod){
        toPeriod = moment(toPeriod).format("MM-DD-YYYY")
        toPeriod = new Date(toPeriod)
        toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
        toPeriod = new Date(toPeriod)
        searchObj.timeInserted = {$lt: toPeriod}
      }
      if(filterByDay === "today"){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = moment().startOf('day')
        fromPeriod = new Date(fromPeriod)
        searchObj.timeInserted = {$gte: fromPeriod}
      }
      if(filterByDay === "yesterday"){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = moment().startOf('day')
        fromPeriod = moment(fromPeriod).subtract(1,'day')
        fromPeriod = new Date(fromPeriod)
        searchObj.timeInserted = {$gte: fromPeriod}
      }

      // searchObj.userId = req?.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await CasinoBet.countDocuments(searchObj);

      let queryResponse = await CasinoBet.aggregate([
          {
              $match:{
                  ...searchObj
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
                  as: 'owner'
              }
          },
          {
              $unwind:{
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
                  as: 'sub_owner'
              }
          },
          {
              $unwind:{
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
                  as: 'admin'
              }
          },
          {
              $unwind:{
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
                  as: 'super_admin'
              }
          },
          {
              $unwind:{
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
                  as: 'sub_admin'
              }
          },
          {
              $unwind:{
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
                  as: 'super_senior'
              }
          },
          {
              $unwind:{
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
                  as: 'super_agent'
              }
          },
          {
              $unwind:{
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
                  as: 'agent'
              }
          },
          {
              $unwind:{
                  path: '$agent',
                  preserveNullAndEmptyArrays: true,
              }
          },
          {
              $skip: startIndex
          },
          {
              $limit: limit
          },
          {
              $sort: {["timeInserted"]:-1},
          }
      ]);

      let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

      let responseCreate = {
          data: queryResponse,
          count: queryResponse.length,
          ...paginateObj
      }

      return res.json(responseData("GET_LIST", responseCreate, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  casino_date_pl: async (req, res) => {
    try {
      let { fromPeriod, toPeriod, filterByDay } = req.query;
    
      const created_by = req?.user?._id;
      const matchPlayerFilter ={};
      let changeIntype = req?.user?.userType;
      if(changeIntype === 'agent'){
          matchPlayerFilter.agentId =  ObjectId(created_by);
      }else if(changeIntype === 'super_agent'){
          matchPlayerFilter.superAgentId =  ObjectId(created_by);
      }else if(changeIntype === 'senior_super'){
          matchPlayerFilter.superSeniorId =  ObjectId(created_by);
      }else if(changeIntype === 'sub_admin'){
          matchPlayerFilter.subAdminId =  ObjectId(created_by);
      }else if(changeIntype === 'super_admin'){
          matchPlayerFilter.superAdminId =  ObjectId(created_by);
      }else if(changeIntype === 'admin'){
          matchPlayerFilter.adminId =  ObjectId(created_by);
      }else if(changeIntype === 'sub_owner'){
          matchPlayerFilter.subOwnerId =  ObjectId(created_by);
      }else if(changeIntype === 'owner'){
          matchPlayerFilter.ownerId =  ObjectId(created_by);
      }else{
          matchPlayerFilter.ownerId =  "-1";
      }

      let searchObj = {...matchPlayerFilter};
      if(toPeriod)
      {
        searchObj.timeInsertedDate = moment(toPeriod).format("YYYY-MM-DD");
      }else{
        searchObj.timeInsertedDate = moment().format("YYYY-MM-DD");
      }
      
    //   console.log('searchObj',searchObj)

      let queryResponse = await CasinoBet.aggregate([
            {
                $match:{
                    ...searchObj
                }
            },
            {
                $group: {
                    _id: null,
                    playerPL: { $sum: "$playerPL"},
                    betAmount: { $sum: "$betAmount"},
                }
            },
            {
                $project:{
                    _id:1,
                    playerPL:1,
                    betAmount:1,
                    "date":searchObj.timeInsertedDate
                }
            }
      ]);

      return res.json(responseData("GET_LIST", queryResponse, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  casino_pl: async (req, res) => {
    try {

      let {
          start_date,
          end_date,
          keyword,
          sort_by,
          sort_type,
          status
      } = req.query

      const created_by = (req.query?.created_by)?req.query?.created_by:req?.user?._id;
    //   const matchPlayerFilter ={};
    //   let changeIntype = req?.user?.userType;
    //   if(changeIntype === 'agent'){
    //       matchPlayerFilter.agentId =  ObjectId(created_by);
    //   }else if(changeIntype === 'super_agent'){
    //       matchPlayerFilter.superAgentId =  ObjectId(created_by);
    //   }else if(changeIntype === 'senior_super'){
    //       matchPlayerFilter.superSeniorId =  ObjectId(created_by);
    //   }else if(changeIntype === 'sub_admin'){
    //       matchPlayerFilter.subAdminId =  ObjectId(created_by);
    //   }else if(changeIntype === 'super_admin'){
    //       matchPlayerFilter.superAdminId =  ObjectId(created_by);
    //   }else if(changeIntype === 'admin'){
    //       matchPlayerFilter.adminId =  ObjectId(created_by);
    //   }else if(changeIntype === 'sub_owner'){
    //       matchPlayerFilter.subOwnerId =  ObjectId(created_by);
    //   }else if(changeIntype === 'owner'){
    //       matchPlayerFilter.ownerId =  ObjectId(created_by);
    //   }else{
    //       matchPlayerFilter.ownerId =  "-1";
    //   }
    
      const userType = (req.query?.userType)?req.query?.userType:req.user?.userType;
      let matchFilter = {}
      let dateFilter = {}
      if(start_date){
          const fromDate = moment(new Date(start_date)).utc().startOf('day')
          dateFilter = {
              ...dateFilter,
              "$gte": new Date(fromDate),
          }
      }

      if(end_date){
          const endDate = moment(new Date(end_date)).utc().endOf("day")
          dateFilter = {
              ...dateFilter,
              "$lte": new Date(endDate),
          }
      }

      if(end_date || start_date){
          dateFilter =  {"createdAt" : dateFilter}
          matchFilter = dateFilter
      }
      
      if(created_by) matchFilter.createdById = ObjectId(created_by) 
      if(status) matchFilter.status = status;
      
      if(keyword){
          matchFilter.$or = [
              { 'firstName': { $regex: keyword, $options: 'i' } },
              { 'lastName': { $regex: keyword, $options: 'i' } },
              { 'username': { $regex: keyword, $options: 'i' } },
              { 'email': { $regex: keyword, $options: 'i' } },
          ] 
      }

    //   console.log(matchFilter)

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await Admin.countDocuments(matchFilter);
      
      let keyType;
        if(userType === "owner") {
            keyType = "subOwnerId"
        }
        
        if(userType === "sub_owner"){
            keyType = "superAdminId"
        }
        if(userType === "super_admin"){
            keyType = "adminId"
        }
        if(userType === "admin"){
            keyType = "subAdminId"
        }
        if(userType === "sub_admin"){
            keyType = "superSeniorId"
        }
        if(userType === "senior_super"){
            keyType = "superAgentId"
        }
        if(userType === "super_agent"){
            keyType = "agentId"
        }
        if(userType === "agent"){
            keyType = "userId"
        }

        let queryResponse = await Admin.aggregate([
            {
                $match:matchFilter
            },
            {
                    $lookup:{
                    from: 'reports',
                    as: "reportData",
                    let: {
                        addr: '$_id',
                    },
                    pipeline: [
                            { 
                                $match: { 
                                    $and: [
                                        {$expr: { $eq: [ "$"+keyType, '$$addr'] }},
                                        {reportType:"Casino"}
                                    ]
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    realAmount: { $sum: "$amount"},
                                    amount: { $sum: "$realAmount"},
                                    commission: { $sum: "$commission"},
                                    realCutAmount: { $sum: "$realCutAmount"},
                                    betAmount: { $sum: "$betAmount"},
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$reportData"
                },
                {
                    $lookup:{
                        from: 'users',
                        as: "userDownlineData",
                        let: {
                            addr: '$_id',
                        },
                        pipeline: [
                            { 
                                $match: { 
                                    $and: [
                                        {$expr: { $eq: [ '$userType', "user"] }},
                                        {$expr: { $eq: [ "$"+keyType, '$$addr'] }}
                                    ]
                                }
                            },
                            {
                                $lookup:{
                                    from: 'reports',
                                    as: "reportData2",
                                    let: {
                                        addr: '$userId',
                                    },
                                    pipeline: [
                                        { 
                                            $match: { 
                                                $and: [
                                                    {$expr: { $eq: [ "$$addr", '$$addr'] }}
                                                ]
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                realAmount: { $sum: "$amount"},
                                                amount: { $sum: "$realAmount"},
                                                commission: { $sum: "$commission"},
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $unwind: "$reportData2"
                            },
                            {
                                $project:{
                                    _id:1,
                                    username:1,
                                    stake:"$reportData2",
                                    stakeAmount:"$reportData2.realAmount",
                                }
                            }
                        ]
                    }
                },
                {
                $sort: {[sort_by || "createdAt"]: sort_type || -1},
            },
            {
                $skip: startIndex
            },
            {
                $limit: limit
            },
            {
                $project:{
                    userType:1,
                    email:1,
                    phone:1,
                    username:1,
                    firstName:1,
                    lastName:1,
                    totalCoins:1,
                    website:1,
                    createdById:1,
                    createdBy:1,
                    timeZone:1,
                    exposureLimit:1,
                    availableLimit:1,
                    creditReference:1, 
                    status:1,
                    playerBalance:1,
                    stake:"$reportData",
                    stakeAmount:"$reportData.realAmount",
                    userDownlineData:"$userDownlineData"
                }
            }
        ]);

        let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

        let responseCreate = {
            data: queryResponse,
            count: queryResponse.length,
            ...paginateObj
        }

      return res.json(responseData("GET_LIST", responseCreate, req, true));

    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  casino_data: async (req, res) => {
    try {
        let { fromPeriod, toPeriod, filterByDay, keyword } = req.query;
        let regexFilter = {};
        let searchObj = {};
        let casinoTotalTransactionFilterBased = {
            gameType: "casino",
            transactionType: "debit",
            casinoBetStatus: {$in: ['result', 'bet']}
        }
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.page_size, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let total;
        if(keyword){
            regexFilter.$or = [
                { 'userDetails.username': { $regex: keyword, $options: 'i' } },
                { 'gameDetails.game_name': { $regex: keyword, $options: 'i' } }
            ]
        }
        if (fromPeriod) {
            fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
            fromPeriod = new Date(fromPeriod)
            searchObj.createdAt = { $gte: fromPeriod }
            casinoTotalTransactionFilterBased.createdAt = { $gte: fromPeriod }
        }
        if (toPeriod) {
            toPeriod = moment(toPeriod).format("MM-DD-YYYY")
            toPeriod = new Date(toPeriod)
            toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
            toPeriod = new Date(toPeriod)
            searchObj.createdAt = { $lt: toPeriod }
            casinoTotalTransactionFilterBased.createdAt = { $lt: toPeriod }
        }
        if(fromPeriod && toPeriod){
            searchObj.createdAt = { $gte: fromPeriod, $lt: toPeriod }
            casinoTotalTransactionFilterBased.createdAt = { $gte: fromPeriod, $lt: toPeriod }
        }
        if (filterByDay === "today") {
            fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
            fromPeriod = moment().startOf('day')
            fromPeriod = new Date(fromPeriod)
            searchObj.createdAt = { $gte: fromPeriod }
            casinoTotalTransactionFilterBased.createdAt = { $gte: fromPeriod }
        }
        if (filterByDay === "yesterday") {
            fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
            fromPeriod = moment().startOf('day')
            fromPeriod = moment(fromPeriod).subtract(1, 'day')
            fromPeriod = new Date(fromPeriod)
            searchObj.createdAt = { $gte: fromPeriod }
            casinoTotalTransactionFilterBased.createdAt = { $gte: fromPeriod }
        }
        total = await CasinoBet.aggregate([{
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
            $lookup: {
                from: 'users',
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
                pipeline: [{
                    $project: {
                        username: 1
                    }
                }]
            }
        },
        {
            $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true}
        },
        {
            $match: regexFilter
        },{
            $count: "totalCount"
        }]);
        total = total[0]?.totalCount
        let matchResponse = await CasinoBet.aggregate([
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
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                    pipeline: [{
                        $project: {
                            username: 1
                        }
                    }]
                }
            },
            {
                $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true}
            },
            {
                $match: regexFilter
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: startIndex
            },
            {
                $limit: limit
            },
            
        ])
        let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)
        var currentDate = new Date();

            // Extract the year and month
            var currentYear = currentDate.getFullYear();
            var currentMonth = currentDate.getMonth() + 1; // Note: Months are zero-based, so we add 1

            if(currentMonth != 10 && currentMonth != 11 && currentMonth != 12) {
                currentMonth = '0' + currentMonth;
            }

            // Build the start date for the current month
            var startDate = new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`);

            // Build the start date for the next month
            var nextMonth = currentMonth == 12 ? '01' : Number(currentMonth) + 1;

            if(nextMonth != 10 && nextMonth != 11 && nextMonth != 12) {
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
                        casinoBetStatus: {$in: ['result', 'bet']}
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount"}
                    }
                }
            ])
            const casinoBetsTransactionsFilterBased = await Transaction.aggregate([
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
                    $match: casinoTotalTransactionFilterBased
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount"}
                    }
                }
            ])
        let responseCreate = {
            casinoLimit: process.env.CASINO_AMOUNT_LIMIT,
            casinoLimitUsed: casinoBets[0]?.totalAmount || 0,
            casinoLimitUsedFilterBased: casinoBetsTransactionsFilterBased[0]?.totalAmount || 0,
            data: matchResponse,
            count: matchResponse.length,
            ...paginateObj
        }
        return res.json(responseData("GET_LIST", responseCreate, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
};
