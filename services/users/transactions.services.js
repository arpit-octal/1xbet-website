const User = require("../../models/user.model");
const Activity = require("../../models/activity.model");
const Wallet = require("../../models/wallet.model");
const Transaction = require("../../models/transaction.model");
const Report = require("../../models/report.model");
const { responseData } = require("../../helpers/responseData");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const satelize = require('satelize');
const moment = require('moment')

module.exports = {
    transaction_create: async (req, res) => {
        try {

            let { password, amount, transactionType, user_id } = req.body
            const userId = user_id || req.user._id;
            let userExist = await User.findById(userId)
            if (!userExist) {
                return res.json(responseData("USER_DONT_EXIST", {}, req, false));
            }

            let passwordCheck = await bcrypt.compare(password, userExist.password);

            if (!passwordCheck) {
                return res.json(responseData("PASSWORD_PROVIDED_IS_NOT_CORRECT", {}, req, false));
            } else {

                if (amount === 0) {
                    return res.json(responseData("AMOUNT_CANT_BE_ZERO", {}, req, false));
                }

                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });

                await Transaction.create({
                    transactionType: transactionType,
                    userId: userId,
                    amount: amount,
                    realCutAmount: (transactionType == 'debit') ? - Math.abs(amount) : amount,
                    status: 'success',
                    ip: req.ip,
                    location: ispData ? ispData.country.en : null,
                    geolocation: {
                        type: 'Point',
                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                    },
                    userAgent: req.get('User-Agent')
                })

                let walletExist = await Wallet.findOne({
                    userId: ObjectId(userId)
                })

                if (!walletExist) {

                    if (transactionType == 'credit') {
                        await Wallet.create({
                            transactionType: transactionType,
                            userId: userId,
                            balance: amount,
                            oldBalance: 000,
                            newBalance: amount,
                            status: false,
                            isDeleted: false
                        })
                    } else {
                        return res.json(responseData("INVALID_TRANSACTION_TYPE_CANT_BE_DEBIT_FIRST_TIME", {}, req, false));
                    }

                } else {

                    let oldBalance = null
                    let newBalance = null

                    if (transactionType == 'credit') {

                        oldBalance = walletExist.newBalance
                        newBalance = walletExist.newBalance + amount

                    } else if (transactionType == 'debit') {

                        oldBalance = walletExist.newBalance
                        newBalance = walletExist.newBalance - amount

                    }

                    await Wallet.findByIdAndUpdate({
                        _id: ObjectId(walletExist)
                    },
                        {
                            $set: {
                                transactionType: transactionType,
                                userId: userId,
                                balance: amount,
                                oldBalance: oldBalance,
                                newBalance: newBalance
                            }
                        })

                }

                return res.json(responseData("TRANSACTION_SUCCESSFULLY_DONE", {}, req, true));

            }


        } catch (error) {
            return res.status(422).json(responseData(error.message, {}, req, false));
        }
    },
    transaction_logs: async (req, res) => {
        try {

            let {
                transactionType,
                start_date,
                end_date
            } = req.query

            const user_id = req.user._id;

            let matchFilter = {}
            matchFilter.userId = ObjectId(user_id);
            let dateFilter = {}
            if (start_date) {
                const fromDate = moment(new Date(start_date)).utc().startOf('day')
                dateFilter = {
                    ...dateFilter,
                    "$gte": new Date(fromDate),
                }
            }

            if (end_date) {
                const endDate = moment(new Date(end_date)).utc().endOf("day")
                dateFilter = {
                    ...dateFilter,
                    "$lte": new Date(endDate),
                }
            }

            if (end_date || start_date) {
                dateFilter = { "createdAt": dateFilter }
                matchFilter = dateFilter
            }


            matchFilter.forBet = 0;
            matchFilter.forCasinoBet = 0;
            matchFilter.forCasino = { $ne: 1 };
            matchFilter.forCommission = { $ne: 1 };
            if (transactionType) matchFilter.transactionType = transactionType;

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Transaction.countDocuments(matchFilter);

            let queryResponse = await Transaction.aggregate([
                {
                    $match: matchFilter
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
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'userData'
                    }
                },
                {
                    $unwind: {
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
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'createdByData'
                    }
                },
                {
                    $unwind: {
                        path: '$createdByData',
                        preserveNullAndEmptyArrays: true,
                    }
                },
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

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
    transaction_bet_logs: async (req, res) => {
        try {

            let {
                transactionType,
                start_date,
                end_date
            } = req.query

            const user_id = req.user._id;

            let matchFilter = {
                $and: [
                    { $or: [{ isDeclared: true, forBet: 1 }, { forBet: 0 }] },
                    // { $or: [ {  } ] }
                ]
            };

            matchFilter.userId = ObjectId(user_id);

            let dateFilter = {}
            if (start_date) {
                const fromDate = moment(new Date(start_date)).utc().startOf('day')
                dateFilter = {
                    ...dateFilter,
                    "$gte": new Date(fromDate),
                }
            }

            if (end_date) {
                const endDate = moment(new Date(end_date)).utc().endOf("day")
                dateFilter = {
                    ...dateFilter,
                    "$lte": new Date(endDate),
                }
            }

            if (end_date || start_date) {
                dateFilter = { "createdAt": dateFilter }
                matchFilter = dateFilter
            }


            matchFilter.forCasino = { $ne: 1 };
            // matchFilter.isDeclared = { $or: [ { sale: true }, { price : { $lt : 5 } } ] };
            if (transactionType) matchFilter.transactionType = transactionType;

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Transaction.countDocuments(matchFilter);

            let queryResponse = await Transaction.aggregate([
                {
                    $match: {
                        ...matchFilter,
                        forCommission: { $ne: 1 },
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
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'userData'
                    }
                },
                {
                    $unwind: {
                        path: '$userData',
                        preserveNullAndEmptyArrays: true,
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        let: {
                            addr: '$createdBy'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$addr'] }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    userType: 1,
                                    username: 1
                                }
                            }
                        ],
                        as: 'createdByData'
                    }
                },
                {
                    $unwind: {
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
                                    $expr: { $lte: ['$createdAt', '$$addr'] }, //uniqueId
                                    ...matchFilter,
                                    // forCommission:1
                                }
                            },
                            { $group: { _id: null, sum: { $sum: "$realCutAmount" } } },
                            // {
                            //     $limit: 1
                            // },
                            {
                                $project: {
                                    _id: 1,
                                    sum: 1
                                }
                            }
                        ],
                        as: 'sumData'
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "gameType": 1,
                        "transactionType": 1,
                        "userId": 1,
                        "createdBy": 1,
                        "amount": 1,
                        "realCutAmount": 1,
                        "status": 1,
                        "remark": 1,
                        "geolocation": 1,
                        "realAmount": 1,
                        "forBet": 1,
                        "forCasino": 1,
                        "forCasinoBet": 1,
                        "betId": 1,
                        "eventType": 1,
                        "matchName": 1,
                        "eventId": 1,
                        "betType": 1,
                        "gameName": 1,
                        "runnerName": 1,
                        "selectionId": 1,
                        "isDeclared": true,
                        "owner": 1,
                        "sub_owner": 1,
                        "admin": 1,
                        "super_admin": 1,
                        "sub_admin": 1,
                        "super_senior": 1,
                        "super_agent": 1,
                        "agent": 1,
                        "betFaireType": 1,
                        "commission": 1,
                        "createdAt": 1,
                        "uniqueId": 1,
                        "userData": "$userData",
                        "newBalance": "$sumData.sum"// {$sum: "$sumData.sum"} //
                    }
                }
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)

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