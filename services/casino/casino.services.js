const User = require('../../models/user.model')
const CasinoBet = require('../../models/casinoBet.model')
const Transaction = require('../../models/transaction.model')
var fs = require('fs');
const { isEmpty } = require('lodash');
const responseData = require('../../helpers/responseData');
const { finished } = require('stream');
const { triggerMethod } = require('../../helpers/socketWork');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
const crypto = require('crypto');

module.exports = {
    casino_webhook: async (req, res) => {
        try {
            const userBalance = await User.findOne({ username: req.body.username })
            console.log("userBalance",userBalance)
            const alreadyExists = await CasinoBet.findOne({ roundId: req.body.roundId })
            console.log("userBalance",userBalance)
            let updatedBalance
            if (!isEmpty(alreadyExists)) {
                if (alreadyExists.finished == 1) {
                    updatedBalance = userBalance.totalCoins
                    logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    return res.json({
                        "code": 0,
                        "error": false,
                        "message": "Success",
                        "data": {
                            "username": req.body.username,
                            "userBalance": updatedBalance
                        }
                    })
                } else {
                    // if (req.body.action == 'win') {
                    updatedBalance = userBalance.totalCoins + Number(req.body.bal)
                    // } else {
                    //     updatedBalance = userBalance.totalCoins - Number(req.body.bal)
                    // }
                    const updateObj = {
                        status: req.body.action,
                        ...req.body
                    }
                    const updateDoc = await CasinoBet.findOneAndUpdate({ _id: alreadyExists._id }, { $set: updateObj }, { new: true })
                    if (!isEmpty(updateDoc)) {
                        let transactionObj = {
                            gameType: 'casino',
                            userId: userBalance._id,
                            amount: req.body.bal,
                            status: 'success',
                            eventType: '-1',
                            oldBalance: userBalance.totalCoins,
                            newBalance: updatedBalance
                        }
                        // if (req.body.action == 'win') {
                        transactionObj.transactionType = 'credit'
                        transactionObj.realCutAmount = req.body.bal
                        // } else {
                        //     transactionObj.transactionType = 'debit'
                        //     transactionObj.realCutAmount = -Math.abs(req.body.bal)
                        // }
                        await Transaction.create(transactionObj)
                        const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, { $set: { totalCoins: updatedBalance } }, { new: true })
                        if (!isEmpty(updatedUser)) {
                            triggerMethod.coinUpdate({ user_id: userBalance._id });
                            logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                            return res.json({
                                "code": 0,
                                "error": false,
                                "message": "Success",
                                "data": {
                                    "username": req.body.username,
                                    "userBalance": updatedUser.totalCoins
                                }
                            })
                        } else {
                            logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                            return res.json({
                                "code": 0,
                                "error": true,
                                "message": "ERROR_OCCUR!"
                            })
                        }
                    } else {
                        logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        return res.json({
                            "code": 0,
                            "error": true,
                            "message": "ERROR_OCCUR!"
                        })
                    }
                }
            } else {
                updatedBalance = userBalance.totalCoins - Number(req.body.bal)
                const Bet = await CasinoBet.create(req.body)
                if (!isEmpty(Bet)) {
                    const transactionObj = {
                        gameType: 'casino',
                        transactionType: 'debit',
                        userId: userBalance._id,
                        amount: req.body.bal,
                        status: 'success',
                        eventType: '-1',
                        realCutAmount: -Math.abs(req.body.bal),
                        oldBalance: userBalance.totalCoins,
                        newBalance: updatedBalance
                    }
                    await Transaction.create(transactionObj)
                    const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, { $set: { totalCoins: updatedBalance } }, { new: true })
                    if (!isEmpty(updatedUser)) {
                        triggerMethod.coinUpdate({ user_id: userBalance._id });
                        logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        return res.json({
                            "code": 0,
                            "error": false,
                            "message": "Success",
                            "data": {
                                "username": req.body.username,
                                "userBalance": updatedUser.totalCoins
                            }
                        })
                    } else {
                        logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        return res.json({
                            "code": 0,
                            "error": true,
                            "message": "ERROR_OCCUR!"
                        })
                    }
                } else {
                    logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    return res.json({
                        "code": 0,
                        "error": true,
                        "message": "ERROR_OCCUR!"
                    })
                }

            }
        } catch (error) {
            console.log('casino webhook', error);
            logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
            console.log('error', error);
            return res.json({
                "code": 0,
                "error": true,
                "message": "ERROR_OCCUR!"
            })
        }
    },
    casino_webhook_balance: async (req, res) => {
        try {
            const userBalance = await User.findOne({ username: req.body.username })
            if (!isEmpty(userBalance)) {
                return res.json({
                    "code": 0,
                    "error": false,
                    "message": "Success",
                    "data": {
                        "username": req.body.username,
                        "userBalance": userBalance.totalCoins
                    }
                })
            } else {
                return res.json({
                    "code": 0,
                    "error": true,
                    "message": "ERROR_OCCUR!"
                })
            }

        } catch (error) {
            console.log('casino webhook balance', error);
            console.log('error', error);
            return res.json({
                "code": 0,
                "error": true,
                "message": "ERROR_OCCUR!"
            });
        }
    },
    // new casino APIs
    casino_balance: async (req, res) => {
        // return res.json({
        //     "balance": 0,
        //     "status": "OP_SUCCESS"
        // })
        try {
            const publicKey = fs.readFileSync('gap_public_key.pem', 'utf8');
            const isVerifiedSignature = verifySignature(req.body, req.headers.signature, publicKey)
            if(!isVerifiedSignature){
                return res.json({
                    "balance": 0,
                    "status": "OP_INVALID_SIGNATURE"
                })
            }
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
                        casinoBetStatus: "result"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount"}
                    }
                }
            ])

            console.log('casinoBets: ', casinoBets);
            if(casinoBets[0]?.totalAmount >= process.env.CASINO_AMOUNT_LIMIT){
                return res.json({
                    "balance": 0,
                    "status": "OP_SUCCESS"
                })
            } else {
                const { userId, token, operatorId } = req.body
                // console.log('req.body===>>>>', req.body);

                const userDetails = await User.findOne({ casinoToken: token })
                if (!isEmpty(userDetails)) {
                    logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    return res.json({
                        "balance": userDetails.totalCoins,
                        "status": "OP_SUCCESS"
                    })
                } else {
                    logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    return res.json({
                        "balance": null,
                        "status": "OP_USER_NOT_FOUND"
                    })
                }
            }

        } catch (error) {
            // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
            console.log('3333333333333333333', req.body);
            console.log('error', error);
            return res.json({
                "balance": null,
                "status": "OP_GENERAL_ERROR"
            });
        }
    },
    casino_bet_request: async (req, res) => {
        // return res.json({
        //     "balance": 0,
        //     "status": "OP_SUCCESS"
        // })
        try {
            const publicKey = fs.readFileSync('gap_public_key.pem', 'utf8');
            const isVerifiedSignature = verifySignature(req.body, req.headers.signature, publicKey)
            if(!isVerifiedSignature){
                return res.json({
                    "balance": 0,
                    "status": "OP_INVALID_SIGNATURE"
                })
            }
            const { operatorId, token, userId, reqId, transactionId, gameId, roundId, debitAmount, betType } = req.body
            console.log("req.body",req.body)

            

            const userBalance = await User.findOne({ _id: userId, casinoToken: token })
            console.log("userBalance.totalCoins",userBalance?.totalCoins)
            if(!operatorId || !token || !userId || !reqId || !transactionId || !gameId || !roundId || !betType){
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_INVALID_PARAMS"
                }) 
            }
            if(Number(debitAmount) < 0) {
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_ERROR_NEGATIVE_DEBIT_AMOUNT"
                })
            }

            if(userBalance?.totalCoins < Number(debitAmount)) {
                console.log("if condition")
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_INSUFFICIENT_FUNDS"
                })
            }

            const findObj = {
                operatorId,
                operatorToken: token,
                userId,
                reqId,
                transactionId,
                gameId,
                roundId,
                amount: debitAmount,
                betAmount: debitAmount,
                betType,
                status: 'bet'
            }

            const duplicateBet = await CasinoBet.findOne(findObj)
            if(!isEmpty(duplicateBet)){
                console.log("Duplicate Bet Placed")
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_DUPLICATE_TRANSACTION"
                })
            }

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

            console.log("casinoBets:----------------------->",casinoBets)

            console.log("userBalance.totalCoins < Number(debitAmount)",typeof userBalance?.totalCoins,Number(debitAmount),userBalance.totalCoins < Number(debitAmount))

            if(casinoBets[0]?.totalAmount + Number(debitAmount) > process.env.CASINO_AMOUNT_LIMIT) {
                console.log("else if condition")
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_GENERAL_ERROR"
                })
            } else {
                const casinoBetCreateObj = {
                    operatorId,
                    operatorToken: token,
                    userId,
                    reqId,
                    transactionId,
                    gameId,
                    roundId,
                    amount: debitAmount,
                    betAmount: debitAmount,
                    betType,
                    status: 'bet'
                }
    
                // let casinoBet;
    
                const updatedBalance = userBalance.totalCoins - Number(debitAmount)
    
                console.log('updatedBalance========', updatedBalance)
    
                // const alreadyExists = await CasinoBet.findOne({ operatorToken: token })
                // if (!isEmpty(alreadyExists)) {
                //     casinoBet = await CasinoBet.findOneAndUpdate({ _id: alreadyExists._id }, { $set: casinoBetCreateObj }, { new: true })
                // } else {
                const casinoBet = await CasinoBet.create(casinoBetCreateObj)
                // }
                if (!isEmpty(casinoBet)) {
                    const transactionObj = {
                        gameType: 'casino',
                        transactionType: 'debit',
                        userId,
                        amount: debitAmount,
                        status: 'success',
                        eventType: '-1',
                        realCutAmount: -Math.abs(debitAmount),
                        oldBalance: userBalance.totalCoins,
                        newBalance: updatedBalance,
                        casinoBetTransactionId: transactionId
                    }
                    await Transaction.create(transactionObj)
                    const updatedUser = await User.findOneAndUpdate({ casinoToken: token }, { $set: { totalCoins: updatedBalance } }, { new: true })
                    if (!isEmpty(updatedUser)) {
                        triggerMethod.coinUpdate({ user_id: userId });
                        console.log('444444444444444444444444', req.body);
                        logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        return res.json({
                            "balance": updatedBalance,
                            "status": "OP_SUCCESS"
                        })
                    } else {
                        console.log('5555555555555555555555555555555', req.body);
                        logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        return res.json({
                            "balance": 'Ln269',
                            "status": "OP_GENERAL_ERROR"
                        });
                    }
                } else {
                    console.log('666666666666666666666666666666666', req.body);
                    logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    return res.json({
                        "balance": 'Ln276',
                        "status": "OP_GENERAL_ERROR"
                    });
                }
            }

        } catch (error) {
            console.log('777777777777777777777777777777', req.body);
            logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
            console.log('error', error);
            return res.json({
                "balance": 'Ln285',
                "status": "OP_GENERAL_ERROR"
            });
        }
    },
    casino_result_request: async (req, res) => {
        // return res.json({
        //     "balance": 0,
        //     "status": "OP_SUCCESS"
        // })
        try {
            const publicKey = fs.readFileSync('gap_public_key.pem', 'utf8');
            const isVerifiedSignature = verifySignature(req.body, req.headers.signature, publicKey)
            if(!isVerifiedSignature){
                return res.json({
                    "balance": 0,
                    "status": "OP_INVALID_SIGNATURE"
                })
            }
            const { operatorId, token, userId, reqId, transactionId, gameId, roundId, creditAmount, betType } = req.body
            const userBalance = await User.findOne({ _id: userId }) //casinoToken: token

            if(!operatorId || !token || !userId || !reqId || !transactionId || !gameId || !roundId || !betType){
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_INVALID_PARAMS"
                }) 
            }

            const updatedBalance = userBalance?.totalCoins + Number(creditAmount)

            console.log("updatedBalance",updatedBalance)

            const alreadyExists = await CasinoBet.findOne({ operatorToken: token, transactionId, userId, operatorId, gameId, roundId })
            if (!isEmpty(alreadyExists)) {
                if(alreadyExists?.amount == creditAmount && alreadyExists?.status == 'result'){
                    console.log("Duplicate Win")
                    return res.json({
                        "balance": userBalance?.totalCoins,
                        "status": "OP_DUPLICATE_TRANSACTION"
                    })
                }
                if(alreadyExists?.status == 'rollback'){
                    console.log("Already Rollback")
                    return res.json({
                        "balance": userBalance?.totalCoins,
                        "status": "OP_ERROR_TRANSACTION_INVALID"
                    })
                }
                const casinoBetUpdateObj = {
                    amount: creditAmount,
                    status: 'result'
                }
    
                if(creditAmount == 0){
                    casinoBetUpdateObj.profitLossAmount =  alreadyExists.profitLossAmount - alreadyExists.betAmount
                } else {
                    casinoBetUpdateObj.profitLossAmount =  Number(creditAmount) - alreadyExists.betAmount
                }
                const casinoBet = await CasinoBet.findOneAndUpdate({ _id: alreadyExists._id }, { $set: casinoBetUpdateObj }, { new: true })
                if (!isEmpty(casinoBet)) {
                    const transactionObj = {
                        gameType: 'casino',
                        transactionType: 'credit',
                        userId,
                        amount: creditAmount,
                        status: 'success',
                        eventType: '-1',
                        realCutAmount: Math.abs(creditAmount),
                        oldBalance: userBalance.totalCoins,
                        newBalance: updatedBalance,
                        casinoBetTransactionId: transactionId
                    }
                    await Transaction.create(transactionObj)
                    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { totalCoins: updatedBalance } }, { new: true })
                    if (!isEmpty(updatedUser)) {
                        triggerMethod.coinUpdate({ user_id: userId });
                        // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        console.log('8888888888888888888888888', req.body);
                        return res.json({
                            "balance": updatedBalance,
                            "status": "OP_SUCCESS"
                        })
                    } else {
                        // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        console.log('9999999999999999999999999999999999', req.body);
                        return res.json({
                            "balance": null,
                            "status": "OP_GENERAL_ERROR"
                        });
                    }
                } else {
                    // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    console.log('100000000000000000000000000', req.body);
                    return res.json({
                        "balance": null,
                        "status": "OP_GENERAL_ERROR"
                    });
                }
            } else {
                console.log('1111111111111122222222222222222', req.body);
                return res.json({
                    "balance": null,
                    "status": "OP_TRANSACTION_NOT_FOUND"
                });
            }
        } catch (error) {
            console.log('222222222222222222223333333333333333', req.body);
            // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
            console.log('error', error);
            return res.json({
                "balance": null,
                "status": "OP_GENERAL_ERROR"
            });
        }
    },
    casino_rollback_request: async (req, res) => {
        // return res.json({
        //     "balance": 0,
        //     "status": "OP_SUCCESS"
        // })
        try {
            const publicKey = fs.readFileSync('gap_public_key.pem', 'utf8');
            const isVerifiedSignature = verifySignature(req.body, req.headers.signature, publicKey)
            if(!isVerifiedSignature){
                return res.json({
                    "balance": 0,
                    "status": "OP_INVALID_SIGNATURE"
                })
            }
            const { operatorId, token, userId, reqId, transactionId, gameId, roundId, rollbackAmount, betType } = req.body
            const userBalance = await User.findOne({ _id: userId }) //casinoToken: token

            if(!operatorId || !token || !userId || !reqId || !transactionId || !gameId || !roundId || !betType){
                return res.json({
                    "balance": userBalance?.totalCoins,
                    "status": "OP_INVALID_PARAMS"
                }) 
            }

            
            const alreadyExists = await CasinoBet.findOne({ operatorToken: token, transactionId, userId, operatorId, gameId, roundId })
            if (!isEmpty(alreadyExists)) {
                let updatedBalance;
                const casinoBetUpdateObj = {
                    status: 'rollback',
                    amount: 0,
                    profitLossAmount: 0
                }
                const transactionObj = {
                    gameType: 'casino',
                    userId,
                    status: 'success',
                    eventType: '-1',
                    oldBalance: userBalance.totalCoins,
                    casinoBetTransactionId: transactionId
                }
                if(alreadyExists?.status == 'bet'){
                    updatedBalance = Number(rollbackAmount)
                    transactionObj.transactionType = 'credit'
                    transactionObj.amount = Number(rollbackAmount)
                    transactionObj.realCutAmount =  Number(rollbackAmount) 
                    transactionObj.newBalance =  userBalance.totalCoins + Number(rollbackAmount) 
                } else if(alreadyExists?.status == 'result') {
                    if(alreadyExists?.amount == 0){
                        updatedBalance = userBalance.totalCoins + Number(alreadyExists?.betAmount)
                        transactionObj.transactionType = 'credit'
                        transactionObj.amount = Number(alreadyExists?.betAmount)
                        transactionObj.realCutAmount =  Number(alreadyExists?.betAmount) 
                        transactionObj.newBalance =  userBalance.totalCoins + Number(alreadyExists?.betAmount) 
                    } else {
                        updatedBalance = userBalance.totalCoins - Number(alreadyExists?.profitLossAmount)
                        transactionObj.transactionType = 'debit'
                        transactionObj.amount = Number(alreadyExists?.profitLossAmount)
                        transactionObj.realCutAmount =  -Number(alreadyExists?.profitLossAmount) 
                        transactionObj.newBalance =  userBalance.totalCoins - Number(alreadyExists?.profitLossAmount)
                    }
                } else {
                    return res.json({
                        "balance": userBalance?.totalCoins,
                        "status": "OP_DUPLICATE_TRANSACTION"
                    }) 
                }
                const casinoBet = await CasinoBet.findOneAndUpdate({ _id: alreadyExists._id }, { $set: casinoBetUpdateObj }, { new: true })
                if (!isEmpty(casinoBet)) {
                    
                    await Transaction.create(transactionObj)
                    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { totalCoins: updatedBalance } }, { new: true })
                    if (!isEmpty(updatedUser)) {
                        triggerMethod.coinUpdate({ user_id: userId });
                        // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        console.log('33333333333333334444444444444', req.body);
                        return res.json({
                            "balance": updatedUser?.totalCoins,
                            "status": "OP_SUCCESS"
                        })
                    } else {
                        // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                        console.log('44444444444444445555555555555555', req.body);
                        return res.json({
                            "balance": null,
                            "status": "OP_GENERAL_ERROR"
                        });
                    }
                } else {
                    // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
                    console.log('5555555555555555566666666666666666', req.body);
                    return res.json({
                        "balance": null,
                        "status": "OP_GENERAL_ERROR"
                    });
                }
            } else {
                console.log('777777777777777778888888888888888888888', req.body);
                return res.json({
                    "balance": null,
                    "status": "OP_TRANSACTION_NOT_FOUND"
                });
            }
        } catch (error) {
            console.log('88888888888888888999999999999999999', req.body);
            // logFile.write(JSON.stringify({ createdTime: new Date(Date.now()), ...req.body }) + "\n");
            console.log('error', error);
            return res.json({
                "balance": null,
                "status": "OP_GENERAL_ERROR"
            });
        }
    },
}

function verifySignature(payload, signature, publicKey) {
    const publicKeyBuffer = Buffer.from(publicKey, 'utf8');
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(JSON.stringify(payload));
    const isVerified = verifier.verify(publicKeyBuffer, signature, 'base64');
    return isVerified;
}