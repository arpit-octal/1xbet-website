const User = require("../../models/user.model");
const Wallet = require("../../models/wallet.model");
const Sport = require("../../models/sport.model");
const Transaction = require("../../models/transaction.model");
const Report = require("../../models/report.model");
const { responseData } = require("../../helpers/responseData");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const satelize = require('satelize');
const async = require('async');
const moment = require('moment');
const {triggerMethod}=require('../../helpers/socketWork');



module.exports = {
    transaction_create:async(req,res) => {
        try {

            let { password, transactionInsert} = req.body

            let userExist = await User.findById(req.user._id)
            if(!userExist){
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }

            let checkLimit = await Sport.findOne({betfairId:"8"});

            if(checkLimit?.status =="inActive")
            {
                return res.json(responseData("DEPOSIT_WITHDRAW_IS_LOCKED", {}, req, false));     
            }

            if(userExist.status === 'locked'){
                return res.json(responseData("USER_IS_LOCKED", {}, req, false));
            }

            let passwordCheck = await bcrypt.compare(password, userExist.password);

            if(!passwordCheck){
                return res.json(responseData("PASSWORD_PROVIDED_IS_NOT_CORRECT", {}, req, false));
            }

            if(transactionInsert.length == 0){
                return res.json(responseData("NO_TRANSACTION_TO_BE_MADE", {}, req, false));
            }

            // ip of req.user.ip
            let ispData = null;
            const ipAddress =(process.env.IP=='CLIVE')?req.ip:'111.93.58.10';
            // console.log('ipAddress------',ipAddress)
            satelize.satelize({ip:ipAddress}, function(err, payload) {
                ispData = payload
            });

            let errorArray = [];
            let successArray = [];
            let userCoinExist = userExist.totalCoins;

            let senderTransactionArray = [];
            let amountSent = 0;

            let oldSenderBalance = req.user.totalCoins;
            let newSenderBalance = req.user.totalCoins;

            async.eachSeries(transactionInsert,(item,callback) => {
                User.findByIdAndUpdate({_id:ObjectId(item.user_id)},{$set:{creditReference:item?.creditReference}})
                .then(userData => {
                    if(userData){
                        if(item.amount>0)
                        {
                                //@note D -> credit
                                if(item.dw_type == 'D' && userCoinExist >= item.amount){

                                    let oldBalance = Math.abs(userData.totalCoins);
                                    let newBalance = Math.abs(userData.totalCoins) + Math.abs(item.amount);

                                    // triggerMethod.coinUpdate({user_id:item.user_id, newBalance});

                                    Transaction.create({
                                        transactionType: 'credit',
                                        userId: item.user_id,
                                        createdBy:req.user._id,
                                        amount: item.amount,
                                        realCutAmount: Math.abs(item.amount),
                                        oldBalance,
                                        newBalance,
                                        status: 'success',
                                        ip:req.ip,
                                        location:ispData?ispData.country.en:null,
                                        geolocation:{
                                            type:'Point',
                                            coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                                        },
                                        userAgent:req.get('User-Agent'),
                                        remark:item.remarks,
                                        realAmount:1,
                                        forBet:0,
                                        marketId:"",
                                        eventId:"",
                                        betType:"",
                                        isDeclared:true
                                    })
                                    .then(data => {
                                        
                                        User.findOneAndUpdate({
                                            _id:ObjectId(item.user_id)
                                        },
                                        {
                                            $inc:{
                                                totalCoins:item.amount
                                            }
                                        })
                                        .then(userData => {
            
                                            Wallet.findOne({userId:ObjectId(item.user_id)})
                                            .then(walletData => {
                                                
                                                if(walletData){
                                                    
                                                    let oldBalance = Math.abs(walletData.newBalance)
                                                    let newBalance = Math.abs(walletData.newBalance) + Math.abs(item.amount)
                                                    amountSent = Math.abs(amountSent) + Math.abs(item.amount)

                                                    oldSenderBalance = Math.abs(newSenderBalance);
                                                    newSenderBalance = Math.abs(newSenderBalance) - Math.abs(item.amount);

                                                    senderTransactionArray.push({
                                                        transactionType: 'debit',
                                                        userId: req.user._id,
                                                        createdBy:req.user._id,
                                                        amount: Math.abs(item.amount),
                                                        realCutAmount: - Math.abs(item.amount),
                                                        oldBalance:Math.abs(oldSenderBalance),
                                                        newBalance:Math.abs(newSenderBalance),
                                                        status: 'success',
                                                        ip:req.ip,
                                                        location:ispData?ispData.country.en:null,
                                                        geolocation:{
                                                            type:'Point',
                                                            coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                                                        },
                                                        userAgent:req.get('User-Agent'),
                                                        remark:item.remarks,
                                                        realAmount:1,
                                                        forBet:0,
                                                        marketId:"",
                                                        eventId:"",
                                                        betType:"",
                                                        isDeclared:true
                                                    })
            
                                                    Wallet.findByIdAndUpdate({
                                                        _id:ObjectId(walletData._id)
                                                    },
                                                    {
                                                        $set:{
                                                            transactionType: 'credit',
                                                            balance: item.amount,
                                                            oldBalance: Math.abs(oldBalance),
                                                            newBalance: Math.abs(newBalance)
                                                        }
                                                    })
                                                    .then(data => {
                                                        userCoinExist = userCoinExist - item.amount
                                                        
                                                        successArray.push({
                                                            user_id:item.user_id,
                                                            username:userData.username,
                                                            amount:item.amount,
                                                            dw_type:item.dw_type,
                                                            failed:false,
                                                            message:'Transaction made with success'
                                                        })
                                                        callback(null)
                                                    })
                                                    .catch(error => {
                                                        callback(error)
                                                    })
            
                                                }else{
            
                                                    let oldBalance = 000;
                                                    let newBalance = Math.abs(item.amount);
                                                    amountSent = Math.abs(amountSent) + Math.abs(item.amount)

                                                    oldSenderBalance = Math.abs(newSenderBalance);
                                                    newSenderBalance = Math.abs(newSenderBalance) - Math.abs(item.amount);

                                                    senderTransactionArray.push({
                                                        transactionType: 'debit',
                                                        userId: req.user._id,
                                                        createdBy:req.user._id,
                                                        amount: Math.abs(item.amount),
                                                        realCutAmount: - Math.abs(item.amount),
                                                        oldBalance:Math.abs(oldSenderBalance),
                                                        newBalance:Math.abs(newSenderBalance),  
                                                        status: 'success',
                                                        ip:req.ip,
                                                        location:ispData?ispData.country.en:null,
                                                        geolocation:{
                                                            type:'Point',
                                                            coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                                                        },
                                                        userAgent:req.get('User-Agent'),
                                                        remark:item.remarks,
                                                        realAmount:1,
                                                        forBet:0,
                                                        marketId:"",
                                                        eventId:"",
                                                        betType:"",
                                                        isDeclared:true
                                                    })
            
                                                    Wallet.create({
                                                        transactionType: 'credit',
                                                        userId: item.user_id,
                                                        balance: item.amount,
                                                        oldBalance: Math.abs(oldBalance),
                                                        newBalance: Math.abs(newBalance),
                                                        status: false,
                                                        isDeleted: false
                                                    })
                                                    .then(data => {
                                                        userCoinExist = userCoinExist - item.amount
                                                        
                                                        successArray.push({
                                                            user_id:item.user_id,
                                                            username:userData.username,
                                                            amount:item.amount,
                                                            dw_type:item.dw_type,
                                                            failed:false,
                                                            message:'Transaction made with success'
                                                        })
                                                        callback(null)
                                                    })
                                                    .catch(error => {
                                                        callback(error)
                                                    })
                                                }
            
                                            })
                                            .catch(error => {
                                                callback(error)
                                            })
            
                                        })
                                        .catch(error => {
                                            callback(error)
                                        })
                                    })
                                    .catch(error => {
                                        callback(error)
                                    })

                                }else if(item.dw_type == 'W' && item.amount <= userData.totalCoins){
                                    //@note W -> debit

                                    let oldBalance = Math.abs(userData.totalCoins);
                                    let newBalance = Math.abs(userData.totalCoins) - Math.abs(item.amount);

                                    // triggerMethod.coinUpdate({user_id:item.user_id, newBalance});

                                    Transaction.create({
                                        transactionType: 'debit',
                                        userId: item.user_id,
                                        createdBy:req.user._id,
                                        amount: Math.abs(item.amount),
                                        realCutAmount: - Math.abs(item.amount),
                                        oldBalance,
                                        newBalance,
                                        status: 'success',
                                        ip:req.ip,
                                        location:ispData?ispData.country.en:null,
                                        geolocation:{
                                            type:'Point',
                                            coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                                        },
                                        userAgent:req.get('User-Agent'),
                                        remark:item.remarks,
                                        realAmount:1,
                                        forBet:0,
                                        marketId:"",
                                        eventId:"",
                                        betType:"",
                                        isDeclared:true
                                    })
                                    .then(Transactiondata => {
                                        User.findOneAndUpdate({
                                            _id:ObjectId(item.user_id)
                                        },
                                        {
                                            $inc:{
                                                totalCoins:-item.amount
                                            }
                                        })
                                        .then(userData => {

                                            senderTransactionArray.push({
                                                transactionType: 'credit',
                                                userId: req.user._id,
                                                createdBy:req.user._id,
                                                amount: Math.abs(item.amount),
                                                realCutAmount: Math.abs(item.amount),
                                                status: 'success',
                                                ip:req.ip,
                                                location:ispData?ispData.country.en:null,
                                                geolocation:{
                                                    type:'Point',
                                                    coordinates:[ispData?ispData.longitude:null,ispData?ispData.latitude:null]
                                                },
                                                userAgent:req.get('User-Agent'),
                                                remark:item.remarks,
                                                realAmount:1,
                                                forBet:0,
                                                marketId:"",
                                                eventId:"",
                                                betType:"",
                                                isDeclared:true
                                            })
                                            callback(null)
                                        })
                                        .catch(error => {
                                            callback(error)
                                        })
                                    })
                                    .catch(error => {
                                        callback(error)
                                    })

                                }else{

                                    User.findById(item.user_id)
                                    .then(userData => {

                                        errorArray.push({
                                            user_id:item.user_id,
                                            username:userData.username,
                                            amount:item.amount,
                                            dw_type:item.dw_type,
                                            failed:true,
                                            message:'Coin related Error'
                                        })
                                        
                                        callback(null);
                                    })
                                    .catch(error => {
                                        callback(error)
                                    })
                                }
                        }else{
                                callback(null);
                        }
                    }else{

                        errorArray.push({
                            user_id:item.user_id,
                            username:'User not found',
                            amount:item.amount,
                            dw_type:item.dw_type,
                            failed:true,
                            message:'User related Error Not Found'
                        })
                        callback(null);
                    }
                })
                .catch(error => {
                    callback(error)
                })

            },async (error,result ) => {

                await User.findByIdAndUpdate({_id:req.user._id},{$set:{totalCoins:userCoinExist}});

                if(error){
                    return res.json(responseData("TRANSACTION_FAILED_IN_MID_WAY", {
                        errorResponse:errorArray,
                        successResponse:successArray
                    }, req, false));
                }
                
                if(senderTransactionArray && senderTransactionArray.length>0)
                {
                    await Transaction.insertMany(senderTransactionArray);
                    triggerMethod.coinUpdate({user_id:req.user._id});
                    senderTransactionArray.map((item,i)=>{
                        triggerMethod.coinUpdate({user_id:item?.userId});
                    });

                    return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", {
                        errorResponse:errorArray,
                        successResponse:successArray
                    }, req, true));

                }else{

                    return res.json(responseData("TRANSACTION_FAILED", {
                        errorResponse:errorArray,
                        successResponse:successArray
                    }, req, false));
                    
                }             

            })
   
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    check_limit:async(req,res) => {
        try {

            let queryResponse = await Sport.findOne({betfairId:"8"})

            return res.json(responseData("LIMIT", queryResponse, req, true));
        
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    transaction_logs:async(req,res) => {
        try {

            let {
                transactionType,
                start_date,
                end_date
            } = req.query

            let user_id = null

            if(req.query.user_id){
                user_id = req.query.user_id
            }else{
                user_id = req.user._id;
            }

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

            const user = await User.findOne({_id:ObjectId(user_id)})
            matchFilter.userId = ObjectId(user_id);

            if(user?.userType =="user")
            {
                
                matchFilter.forCasino= { $ne:1};
                matchFilter.forCasinoBet = 0;
                matchFilter.forBet = 0;

            }
            
            
            if(transactionType) matchFilter.transactionType = transactionType;
            // console.log('matchFilter',matchFilter)

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Transaction.countDocuments(matchFilter);
            let queryResponse = await Transaction.aggregate([
                {
                    $match:matchFilter
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
                            addr: '$userId'
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
                        as: 'userData'
                    }
                },
                {
                    $unwind:{
                        path: '$userData',
                        preserveNullAndEmptyArrays: true,
                    }
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
                { 
                    $lookup: {
                        from: 'transactions',
                        let: {
                            addr: '$createdAt'
                        },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $lte: [ '$createdAt', '$$addr'] }, //uniqueId
                                    ...matchFilter
                                }
                            },
                            { $group: { _id : null, sum : { $sum: "$realCutAmount" } } },
                            {
                                $project:{
                                    _id:1,
                                    sum:1
                                }
                            }
                        ],
                        as: 'sumData'
                    }
                },
                {
                    $project:{
                        "_id":1,
                        "gameType":1,
                        "transactionType":1,
                        "userId":1,
                        "createdBy":1,
                        "amount":1,
                        "realCutAmount":1,
                        "status": 1,
                        "remark": 1,
                        "geolocation": 1,
                        "realAmount": 1,
                        "forBet": 1,
                        "forCasino": 1,
                        "forCasinoBet": 1,
                        "betId": 1,
                        "eventType":1,
                        "matchName": 1,
                        "eventId":1,
                        "betType":1,
                        "gameName":1,
                        "runnerName":1,
                        "selectionId":1,
                        "isDeclared": true,
                        "owner":1,
                        "sub_owner":1,
                        "admin":1,
                        "super_admin":1,
                        "sub_admin":1,
                        "super_senior":1,
                        "super_agent":1,
                        "agent":1,
                        "betFaireType": 1,
                        "commission":1,
                        "createdAt":1,
                        "userData":"$userData",
                        "newBalance":"$sumData.sum"
                    }
                }
            ]);

            let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("TRANSACTION_LIST", responseCreate, req, true));
        
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    transaction_bet_logs:async(req,res) => {
        try {

            let {
                transactionType,
                start_date,
                end_date
            } = req.query

            let user_id = null

            if(req.query.user_id){
                user_id = req.query.user_id
            }else{
                user_id = req.user._id;
            }

            // let matchFilter = {}
            let matchFilter = {
                $and: [
                    { $or: [ { isDeclared: true, forBet : 1 }, { forBet: 0} ] },
                    // { $or: [ {  } ] }
                ]
            };
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

            matchFilter.userId = ObjectId(user_id);
            matchFilter.forCasino= { $ne:1};
            // if(transactionType) matchFilter.transactionType = transactionType;

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Transaction.countDocuments(matchFilter);

            let queryResponse = await Transaction.aggregate([
                {
                    $match:matchFilter
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
                            addr: '$userId'
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
                        as: 'userData'
                    }
                },
                {
                    $unwind:{
                        path: '$userData',
                        preserveNullAndEmptyArrays: true,
                    }
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
                { 
                    $lookup: {
                        from: 'transactions',
                        let: {
                            addr: '$createdAt'
                        },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $lte: [ '$createdAt', '$$addr'] }, //uniqueId
                                    ...matchFilter
                                }
                            },
                            { $group: { _id : null, sum : { $sum: "$realCutAmount" } } },
                            {
                                $project:{
                                    _id:1,
                                    sum:1
                                }
                            }
                        ],
                        as: 'sumData'
                    }
                },
                {
                    $project:{
                        "_id":1,
                        "gameType":1,
                        "transactionType":1,
                        "userId":1,
                        "createdBy":1,
                        "amount":1,
                        "realCutAmount":1,
                        "status": 1,
                        "remark": 1,
                        "geolocation": 1,
                        "realAmount": 1,
                        "forBet": 1,
                        "forCasino": 1,
                        "forCasinoBet": 1,
                        "betId": 1,
                        "eventType":1,
                        "matchName": 1,
                        "eventId":1,
                        "betType":1,
                        "gameName":1,
                        "runnerName":1,
                        "selectionId":1,
                        "isDeclared": true,
                        "owner":1,
                        "sub_owner":1,
                        "admin":1,
                        "super_admin":1,
                        "sub_admin":1,
                        "super_senior":1,
                        "super_agent":1,
                        "agent":1,
                        "betFaireType": 1,
                        "commission":1,
                        "createdAt":1,
                        "userData":"$userData",
                        "newBalance":"$sumData.sum"
                    }
                }
            ]);

            let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)

            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("TRANSACTION_LIST", responseCreate, req, true));
        
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    }
}