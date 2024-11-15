const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
var axios = require("axios").default;
var qs = require('qs');
const apiPath = 'https://tttint.onlinegames22.com/';
const liveApiPath = 'https://api.onlinegames22.com/';
const agent = 'cricinfotech';
const cert = 'md4It4TXGn3xTUxRZ1d';
const javaAgent = 'javaexch';
const javaCert = '4ButmmSYxVe3KKRYKlJ';
const ninexAgent = '9exchenge';
const ninexCert = 'vvrjdmp1YW3J4Rwn2xx';
const betxAgent = 'cricinfotechsingel1';
const betxPrefix = 'uc1';
const betxCert = 'eKclsAqmtUuWYww65ia';



const { verifyToken } = require("../../middlewares/verifyToken");
const { verifyAdminToken } = require("../../middlewares/verifyToken");
const Transaction = require("../../models/transaction.model");
const CasinoTransaction = require("../../models/casinoTransaction.model");

const User = require("../../models/user.model");
const { makeid } = require("../../helpers/helper");
const { triggerMethod } = require('../../helpers/socketWork');
const { responseData } = require('../../helpers/responseData');

const satelize = require('satelize');
const async = require('async');
const { ObjectId } = require('mongodb');

router.post("/login", [verifyToken], async (req, res) => {
    try {

        const userId = req.user._id;
        const platform = (req.body?.platForm) ? req.body?.platForm : '';
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;

        // console.log('agentValue, certValue-----------', agentValue, certValue, livePath)

        var data = qs.stringify({
            'cert': certValue,
            'agentId': agentValue,
            'userId': userExist?.aeCasinoUserId,
            'platform': platform,
        });

        // console.log('data',data)
        var config = {
            method: 'post',
            url: `${livePath}wallet/login`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(function (response) {
            // console.log('response------',response);
            res.status(200).json({ "status": true, "message": "success", "data": response.data })
        }).catch(function (error) {
            console.log('error------------', error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        console.log('error9', error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});

router.post("/doLoginAndLaunchGame", [verifyToken], async (req, res) => {
    try {
        const userId = req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        var data = qs.stringify({

            'cert': certValue,
            'agentId': agentValue,
            'userId': userExist?.aeCasinoUserId,
            'platform': (req.body?.platForm) ? req.body?.platForm : 'SEXYBCRT',
            'gameCode': (req.body?.gameCode) ? req.body?.gameCode : 'MX-LIVE-002',
            'gameType': (req.body?.gameType) ? req.body?.gameType : 'LIVE',
        });

        var config = {
            method: 'post',
            url: `${livePath}wallet/doLoginAndLaunchGame`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(function (response) {
            // console.log('response------mm',response.data);
            res.status(200).json({ "status": true, "message": "success", "data": response.data })
        }).catch(function (error) {
            (error) && console.log('error------------', error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        console.log('error9', error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});



router.post("/withdraw", [verifyToken], async (req, res) => {
    try {
        const userId = (req?.body?.userId) ? req?.body?.userId : req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        let isLive = true;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "bdbaji365.live" || userExist?.domain == "playbets365.live" || userExist?.domain == "1xbets.pro" || userExist?.domain == "betx365.ca" || userExist?.domain == "winx247.live" || userExist?.domain == "bazi-365.live" || userExist?.domain == "maza247.bet") {

            certValue = betxCert;
            agentValue = betxAgent;
            livePath = liveApiPath;
            isLive = true;
        }

        // console.log('agentValue, certValue-----------', agentValue, certValue)
        const amount = (req?.body?.amount) ? req?.body?.amount : 0;
        if (amount > 0) {
            const request = {
                'cert': certValue,
                'agentId': agentValue,
                'userId': userExist?.aeCasinoUserId,
                'txCode': `txn${makeid(10)}`,
                'withdrawType': '1',
                'transferAmount': amount
            };
            // console.log(request,'----------request')
            var data = qs.stringify(request);
            var config = {
                method: 'post',
                url: `${livePath}wallet/withdraw`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'charset': 'UTF-8'
                },
                data: data
            };

            axios(config).then(async function (response) {
                // console.log('response------',response);
                if (response.data?.status == '0000' && response.data?.amount && response.data?.amount > 0) {
                    let ispData = null;
                    let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                    satelize.satelize({ ip: ipAddress }, function (err, payload) {
                        ispData = payload
                    });
                    await Transaction.create({
                        transactionType: 'credit',
                        userId: userId,
                        amount: Math.abs(response.data?.amount),
                        realCutAmount: Math.abs(response.data?.amount),
                        forCasino: 1,
                        status: 'success',
                        ip: req.ip,
                        location: ispData ? ispData.country.en : null,
                        geolocation: {
                            type: 'Point',
                            coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                        },
                        userAgent: req.get('User-Agent')
                    });

                    await CasinoTransaction.create({
                        transactionType: 'debit',
                        userId: userId,
                        amount: Math.abs(response.data?.amount),
                        realCutAmount: -Math.abs(response.data?.amount),
                        status: 'success',
                        ip: req.ip,
                        location: ispData ? ispData.country.en : null,
                        geolocation: {
                            type: 'Point',
                            coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                        },
                        userAgent: req.get('User-Agent')
                    });
                    triggerMethod.coinUpdate({ user_id: userId });
                    res.status(200).json({ "status": true, "message": "success", "data": response.data })

                } else {
                    triggerMethod.coinUpdate({ user_id: userId });
                    res.status(200).json({ "status": true, "message": "success", "data": response.data })
                }

            }).catch(function (error) {
                console.log('error------------', error);
                res.status(200).json({ "status": false, "message": error, "data": {} })
            });

        } else {
            return res.json(responseData("success", {}, req, true));
        }

    } catch (error) {
        // console.log('error9',error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});

router.post("/agent-withdraw", [verifyAdminToken], async (req, res) => {
    try {
        const userId = (req?.body?.userId) ? req?.body?.userId : req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "bdbaji365.live" || userExist?.domain == "playbets365.live" || userExist?.domain == "1xbets.pro" || userExist?.domain == "betx365.ca" || userExist?.domain == "winx247.live" || userExist?.domain == "bazi-365.live" || userExist?.domain == "maza247.bet") {

            certValue = betxCert;
            agentValue = betxAgent;
            livePath = liveApiPath;
            isLive = true;
        }

        // console.log('agentValue, certValue-----------', agentValue, certValue);

        const amount = (req?.body?.amount) ? req?.body?.amount : 0;
        if (amount > 0) {
            const request = {
                'cert': certValue,
                'agentId': agentValue,
                'userId': userExist?.aeCasinoUserId,
                'txCode': `txn${makeid(10)}`,
                'withdrawType': '1',
                'transferAmount': Math.abs(amount)
            };
            // console.log(request,'----------request')
            var data = qs.stringify(request);
            var config = {
                method: 'post',
                url: `${livePath}wallet/withdraw`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'charset': 'UTF-8'
                },
                data: data
            };

            axios(config).then(async function (response) {
                // console.log('response------',response);
                if (response.data?.status == '0000' && response.data?.amount && response.data?.amount > 0) {
                    let ispData = null;
                    let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                    satelize.satelize({ ip: ipAddress }, function (err, payload) {
                        ispData = payload
                    });
                    await Transaction.create({
                        transactionType: 'credit',
                        userId: userId,
                        amount: Math.abs(response.data?.amount),
                        realCutAmount: Math.abs(response.data?.amount),
                        forCasino: 1,
                        status: 'success',
                        ip: req.ip,
                        location: ispData ? ispData.country.en : null,
                        geolocation: {
                            type: 'Point',
                            coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                        },
                        userAgent: req.get('User-Agent')
                    });

                    await CasinoTransaction.create({
                        transactionType: 'debit',
                        userId: userId,
                        amount: Math.abs(response.data?.amount),
                        realCutAmount: -Math.abs(response.data?.amount),
                        status: 'success',
                        ip: req.ip,
                        location: ispData ? ispData.country.en : null,
                        geolocation: {
                            type: 'Point',
                            coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                        },
                        userAgent: req.get('User-Agent')
                    });
                    triggerMethod.coinUpdate({ user_id: userId });
                    res.status(200).json({ "status": true, "message": "success", "data": response.data })

                } else {
                    triggerMethod.coinUpdate({ user_id: userId });
                    res.status(200).json({ "status": true, "message": "success", "data": response.data })
                }

            }).catch(function (error) {
                console.log('error------------', error);
                res.status(200).json({ "status": false, "message": error, "data": {} })
            });

        } else {
            return res.json(responseData("Success", {}, req, false));
        }

    } catch (error) {
        console.log('error9', error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});

router.post("/get-awc-balance", [verifyToken], async (req, res) => {
    try {

        // return res.json(responseData("USER_DONT_EXIST", {}, req, false));

        const userId = req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        }

        // console.log('agentValue, certValue-----------', agentValue, certValue);
        const request = {
            'cert': certValue,
            'agentId': agentValue,
            'userIds': userExist?.aeCasinoUserId
        };
        // console.log(request,'----------request')
        var data = qs.stringify(request);
        var config = {
            method: 'post',
            url: `${livePath}wallet/getBalance`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(async function (response) {
            // console.log('response------',response);
            if (response.data?.status == '0000' && response.data?.results && response.data?.results[0]) {
                const balance = response.data?.results[0].balance;
                await CasinoTransaction.deleteMany({ userId: userExist?._id });
                let ispData = null;
                let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
                satelize.satelize({ ip: ipAddress }, function (err, payload) {
                    ispData = payload
                });
                await CasinoTransaction.create({
                    transactionType: 'credit',
                    userId: userExist?._id,
                    amount: Math.abs(balance),
                    realCutAmount: -Math.abs(balance),
                    status: 'success',
                    ip: req.ip,
                    location: ispData ? ispData.country.en : null,
                    geolocation: {
                        type: 'Point',
                        coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
                    },
                    userAgent: req.get('User-Agent')
                });
                triggerMethod.coinUpdate({ user_id: userId });
                res.status(200).json({ "status": true, "message": "success", "data": { balance } })
            } else {
                triggerMethod.coinUpdate({ user_id: userId });
                res.status(200).json({ "status": true, "message": "success", "data": response.data })
            }

        }).catch(function (error) {
            // console.log('error------------',error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        console.log('error9', error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});

router.post("/update-bet-limit", [verifyToken], async (req, res) => {
    try {
        const userId = (req.query?.userId) ? req.query?.userId : req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        }

        // console.log('agentValue, certValue-----------', agentValue, certValue);

        const request = {
            'cert': certValue,
            'agentId': agentValue,
            'userId': userExist?.aeCasinoUserId,
            'betLimit': '{"SEXYBCRT":{"LIVE":{"limitId":[140101]}},"VENUS":{"LIVE":{"limitId":[140101]}},"HORSEBOOK":{"LIVE":{"minbet":10,"maxbet":500,"maxBetSumPerHorse":5000,"minorMinbet":10,"minorMaxbet":100,"minorMaxBetSumPerHorse":500}},"PP":{"LIVE":{"limitId":["G1"]}},"SV388":{"LIVE":{"maxbet":1000,"minbet":1,"mindraw":1,"matchlimit":1000,"maxdraw":100}}}',
        };
        // console.log(request,'----------request')
        var data = qs.stringify(request);
        var config = {
            method: 'post',
            url: `${livePath}wallet/updateBetLimit`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(async function (response) {
            // console.log('response------',response);
            if (response.data?.status == '0000') {
                res.status(200).json({ "status": true, "message": "success", "data": response.data })
            } else {
                res.status(200).json({ "status": true, "message": "failed", "data": response.data })
            }

        }).catch(function (error) {
            // console.log('error------------',error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        // console.log('error9',error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});

router.get("/transaction-list", [verifyAdminToken], async (req, res) => {
    try {

        const userId = (req?.body?.userId) ? req?.body?.userId : req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "bdbaji365.live" || userExist?.domain == "playbets365.live" || userExist?.domain == "1xbets.pro" || userExist?.domain == "betx365.ca" || userExist?.domain == "winx247.live" || userExist?.domain == "bazi-365.live" || userExist?.domain == "maza247.bet") {

            certValue = betxCert;
            agentValue = betxAgent;
            livePath = liveApiPath;
            isLive = true;
        }
        const request = {
            'cert': certValue,
            'agentId': agentValue,
            'timeFrom': '2023-01-19T19:00:30+08:00',
            'platform': 'SEXYBCRT'
        };
        // console.log(request,'----------request')
        var data = qs.stringify(request);
        var config = {
            method: 'post',
            url: `${livePath}fetch/gzip/getTransactionByUpdateDate`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(async function (response) {
            // console.log('response------',response);
            if (response.data?.status == '0000') {
                res.status(200).json({ "status": true, "message": "success", "data": response.data })
            } else {
                res.status(200).json({ "status": true, "message": "failed", "data": response.data })
            }

        }).catch(function (error) {
            // console.log('error------------',error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        // console.log('error9',error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
});

router.get("/transaction-history", [verifyAdminToken], async (req, res) => {
    try {

        const userData = await User.aggregate([
            {
                $match: {
                    username: req.query?.userId
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "bdbaji365.live" || userExist?.domain == "playbets365.live" || userExist?.domain == "1xbets.pro" || userExist?.domain == "betx365.ca" || userExist?.domain == "winx247.live" || userExist?.domain == "bazi-365.live" || userExist?.domain == "maza247.bet") {

            certValue = betxCert;
            agentValue = betxAgent;
            livePath = liveApiPath;
            isLive = true;
        }

        const request = {
            'cert': certValue,
            'agentId': agentValue,
            'userId': req.query?.userId,
            'platform': req.query?.platform,
            'platformTxId': req.query?.platformTxId.replace(`${req.query?.platform}-`, '')
        };
        console.log(request, '----------requestmmmmmmmmmm')
        var data = qs.stringify(request);
        var config = {
            method: 'post',
            url: `${livePath}wallet/getTransactionHistoryResult`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(async function (response) {
            // console.log('response------',response);
            if (response.data?.status == '0000') {
                res.status(200).json({ "status": true, "message": "success", "data": response.data })
            } else {
                res.status(200).json({ "status": true, "message": "failed", "data": response.data })
            }

        }).catch(function (error) {
            // console.log('error------------',error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        // console.log('error9',error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
});

// client
router.get("/client-transaction-history", [verifyToken], async (req, res) => {
    try {

        const userId = (req?.body?.userId) ? req?.body?.userId : req.user._id;
        const userData = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "subOwnerId",
                    "foreignField": "_id",
                    "as": "subOwnerData"
                }
            },
            {
                $unwind: {
                    path: '$subOwnerData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    aeCasinoUserId: 1,
                    _id: 1,
                    subOwnerId: 1,
                    email: 1,
                    userId: 1,
                    username: 1,
                    "domain": "$subOwnerData.website"
                }
            }
        ]);

        let userExist = (userData && userData.length > 0) ? userData[0] : false;
        if (!userExist || !userExist?.domain) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }

        let certValue = cert;
        let agentValue = agent;
        let livePath = liveApiPath;
        if (userExist?.domain == "javaexch.com") {
            certValue = javaCert;
            agentValue = javaAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "9exchenge.live") {

            certValue = ninexCert;
            agentValue = ninexAgent;
            livePath = liveApiPath;
        } else if (userExist?.domain == "bdbaji365.live" || userExist?.domain == "playbets365.live" || userExist?.domain == "1xbets.pro" || userExist?.domain == "betx365.ca" || userExist?.domain == "winx247.live" || userExist?.domain == "bazi-365.live" || userExist?.domain == "maza247.bet") {

            certValue = betxCert;
            agentValue = betxAgent;
            livePath = liveApiPath;
            isLive = true;
        }

        const request = {
            'cert': certValue,
            'agentId': agentValue,
            'userId': req.user.username,
            'platform': req.query?.platform,
            'platformTxId': req.query?.platformTxId
        };
        console.log(request, '----------request')
        var data = qs.stringify(request);
        var config = {
            method: 'post',
            url: `${livePath}wallet/getTransactionHistoryResult`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset': 'UTF-8'
            },
            data: data
        };

        axios(config).then(async function (response) {
            // console.log('response------',response);
            if (response.data?.status == '0000') {
                res.status(200).json({ "status": true, "message": "success", "data": response.data })
            } else {
                res.status(200).json({ "status": true, "message": "failed", "data": response.data })
            }

        }).catch(function (error) {
            // console.log('error------------',error);
            res.status(200).json({ "status": false, "message": error, "data": {} })
        });

    } catch (error) {
        // console.log('error9',error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
});

router.post("/gameList", [verifyToken], async (req, res) => {
    try {
        const userId = req.user._id;
        let userExist = await User.findById(userId)
        if (!userExist) {
            return res.json(responseData("USER_DONT_EXIST", {}, req, false));
        }
        var data = JSON.stringify({
            "op": "oc91",
            "prod": req.body?.prod || "146",
            "type": req.body?.type || "5",
            "mem": "lokuuser2",
            "pass": "Abc123",
            "sign": "ZoxHM4L7SBd44LDnlE1ZlRgF5wgP1SK8"
        });

        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.easytogo123.com/getgamelist',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                res.status(200).json({ "status": true, "message": "success", "data": response.data?.data })
            })
            .catch(function (error) {
                res.status(200).json({ "status": false, "message": error, "data": {} })
            });

    } catch (error) {
        console.log('error9', error);
        return res.json(responseData("ERROR_OCCUR", error, req, false));
    }

});

module.exports = router;