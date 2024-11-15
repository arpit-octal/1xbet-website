const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
var axios = require("axios").default;
var qs = require('qs');
const moment = require("moment");
const { responseData } = require('../../helpers/responseData');
const Transaction = require("../../models/transaction.model");
const CasinoBet = require("../../models/casinoBet.model");
const User = require("../../models/user.model");
const { ObjectId } = require('mongodb');
const async = require('async');

router.all("/callback", express.raw({ type: 'application/json' }), async (req, res) => {
    // //console.log('webhook call====>>>::::');
    // setTimeout(async function(){
        let respData = { "status": true, "message": "webhook call", "data": [] };
        console.log('webhook call====>>>::::1-----', req.body);
        console.log('webhook call====>>>::::2-----', req.query);

        res.status(200).json(respData);
        // req.body?.message: '{"action":"getBalance","userId":"lokuuserm12"}',
        // if (req.body?.message) {
        //     let tempData = JSON.parse(req.body?.message);
        //     // //console.log('tempData-------', req.body?.message, tempData?.action);
        //     if (tempData?.action == "getBalance") {
        //         const username = tempData?.userId;
        //         const userExist = await User.distinct('_id', { username: username });
        //         const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //         //console.log('username', userId, username);
        //         const totalAMT = await Transaction.aggregate([
        //             {
        //                 $match: { userId, forCasinoBet: 0 }
        //             },
        //             {
        //                 $group: {
        //                     _id: null,
        //                     totalAmount: { $sum: "$realCutAmount" }
        //                 }
        //             }
        //         ]);
        //         let amountValue = totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0;
        //         respData = {
        //             "status": "0000",
        //             "userId": username,
        //             "balance": amountValue,
        //             "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //         };
        //         //console.log('getBalance', respData);
        //         res.status(200).json(respData);
        //     } else if (tempData?.action == "bet") {
        //         // const userExist = await User.findOne({username:tempData?.txns?.userId});
        //         // const userId = userExist?._id || 0;
        //         const matchArrIns = [];
        //         const balanceArr = [];
        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(betData => {
        //                     if (betData || matchArrIns.findIndex((a) => a.selectionId == txnId) != -1) {
        //                         //console.log('bet platformTxId', txnId)
        //                         callback(null)
        //                     } else {
        //                         User.findOne({ username: item.userId })
        //                             .then(idata => {
        //                                 if (idata) {
        //                                     //console.log('bet platformTxId', 1)
        //                                     balanceArr.push({ amount: -Math.abs(item.betAmount) })
        //                                     // //console.log('`item.userId`',2)
        //                                     let userId = idata._id;
        //                                     let ownerId = idata.ownerId;
        //                                     let subOwnerId = idata.subOwnerId;
        //                                     let adminId = idata.adminId;
        //                                     let superAdminId = idata.superAdminId;
        //                                     let subAdminId = idata.subAdminId;
        //                                     let superSeniorId = idata.superSeniorId;
        //                                     let superAgentId = idata.superAgentId;
        //                                     let agentId = idata.agentId;
        //                                     let marketDataToBeUpdated = {
        //                                         selectionId: txnId,
        //                                         platformTxId: txnId,
        //                                         userId,
        //                                         ownerId,
        //                                         subOwnerId,
        //                                         adminId,
        //                                         superAdminId,
        //                                         subAdminId,
        //                                         superSeniorId,
        //                                         superAgentId,
        //                                         agentId,
        //                                         eventType: '-1',
        //                                         // gameInfo:item.gameInfo,
        //                                         roundId: item.roundId,
        //                                         casinoBetId: item.roundId,
        //                                         profitAmount: item.betAmount,
        //                                         loseAmount: -Math.abs(item.betAmount),
        //                                         transactionType: "debit",
        //                                         realCutAmount: -Math.abs(item.betAmount),
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(item.betAmount),
        //                                         platform: item.platform,
        //                                         casinoName: item.gameName,
        //                                         matchName: item.gameName,
        //                                         gameCode: item.gameCode,
        //                                         currency: item.currency,
        //                                         clientName: item.userId,
        //                                         gameType: "casino",
        //                                         runnerName: item?.platform,
        //                                         reportName: item?.gameName,
        //                                         gameName: item.gameName,
        //                                         eventType: -1,
        //                                         timeInserted: new Date(item.betTime),
        //                                         timeInsertedDate: moment(item?.betTime).format("YYYY-MM-DD"),
        //                                         isDeclared: false,
        //                                         forBet: 1,
        //                                     }
        //                                     matchArrIns.push(marketDataToBeUpdated);

        //                                     callback(null)
        //                                 } else {
        //                                     // //console.log('`item.userId`',3)
        //                                     callback(null)
        //                                 }
        //                             }).catch(error => {
        //                                 // //console.log('`item.userId`',4)
        //                                 callback(error)
        //                             })
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('bet', respData);
        //                 res.status(200).json(respData);
        //             }

        //             let finalBetAmount = 0;
        //             await balanceArr.map((amt, i) => {
        //                 finalBetAmount += Math.abs(amt.amount);
        //             })
        //             //console.log('bet Place', balanceArr, finalBetAmount)
        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             // //console.log('userId', userId, userIdValue)

        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             const amount = totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0;


        //             if (amount > 0 && amount >= finalBetAmount) {

        //                 await CasinoBet.insertMany(matchArrIns);
        //                 await Transaction.insertMany(matchArrIns);

        //                 const totalAMT2 = await Transaction.aggregate([
        //                     {
        //                         $match: { userId, forCasinoBet: 0 }
        //                     },
        //                     {
        //                         $group: {
        //                             _id: null,
        //                             totalAmount: { $sum: "$realCutAmount" }
        //                         }
        //                     }
        //                 ]);

        //                 respData = {
        //                     "status": "0000",
        //                     "balance": totalAMT2.length > 0 ? totalAMT2[0].totalAmount.toFixed(2) : 0,
        //                     "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //                 };

        //             } else {

        //                 respData = {
        //                     "status": "1018",
        //                     "balance": amount,
        //                     "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //                 }
        //             }
        //             //console.log('bet', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "settle") {
        //         const matchArrIns = [];
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             // //console.log('item',item);
        //             userIdValue = item.userId;
        //             let platFormRealTxnId = (item?.refPlatformTxId && item?.refPlatformTxId != null) ? `${item.platform}-${item.refPlatformTxId}` : `${item.platform}-${item.platformTxId}`;
        //             //console.log('result', item?.settleType, platFormRealTxnId)
        //             if (item?.settleType == "roundId") {
        //                 //console.log('settle roundId', item?.settleType)
        //                 platFormRealTxnId = `${item.platform}-${item.roundId}`;
        //             }
        //             const realWinAmount = item.winAmount;
        //             const realBetAmount = item.betAmount;
        //             const result = (realWinAmount > realBetAmount) ? Math.abs(Math.abs(realWinAmount) - Math.abs(realBetAmount)) : -Math.abs(Math.abs(realBetAmount) - Math.abs(realWinAmount));
        //             //console.log('result', result, platFormRealTxnId)
        //             // return true
        //             CasinoBet.findOne({ platformTxId: platFormRealTxnId })
        //                 .then(async betData => {
        //                     if (betData) {
        //                         // "updateTime":"2023-04-14T20:21:02.661+08:00","roundId":"Mexico-04-GA559640024",
        //                         await CasinoBet.findOneAndUpdate({
        //                             platformTxId: platFormRealTxnId
        //                         },
        //                             {
        //                                 $set: {
        //                                     isDeclared: true,
        //                                     status: "completed",
        //                                     loseAmount: (item.winAmount > item.betAmount) ? 0 : Math.abs(item.betAmount) - Math.abs(item.winAmount),
        //                                     transactionType: (item.winAmount > item.betAmount) ? "credit" : "debit",
        //                                     realWinAmount: item.winAmount,
        //                                     turnover: item.winLoss,
        //                                     settleStatus: item.status,
        //                                     betAmount: Math.abs(item.betAmount),
        //                                     amount: Math.abs(result),
        //                                 }
        //                             });
        //                         await Transaction.findOneAndUpdate({
        //                             selectionId: platFormRealTxnId
        //                         },
        //                             {
        //                                 $set: {
        //                                     isDeclared: true,
        //                                     status: "completed",
        //                                     loseAmount: (item.winAmount > item.betAmount) ? 0 : Math.abs(item.betAmount) - Math.abs(item.winAmount),
        //                                     transactionType: (item.winAmount > item.betAmount) ? "credit" : "debit",
        //                                     realCutAmount: result,
        //                                     playerPL: result,
        //                                     realWinAmount: item.winAmount,
        //                                     turnover: item.winLoss,
        //                                     settleStatus: item.status,
        //                                     betAmount: Math.abs(item.betAmount),
        //                                     amount: Math.abs(result),
        //                                 }
        //                             });
        //                         callback(null)
        //                     } else {
        //                         callback(null)
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             // //console.log('userId',userId, userIdValue)
        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             respData = {
        //                 "status": "0000",
        //                 "balance": totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };
        //             //console.log('settle', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "resettle") {
        //         const matchArrIns = [];
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             // //console.log('`${item.platform}-${item.platformTxId}`',{platformTxId:`${item.platform}-${item.platformTxId}`});
        //             // //console.log('`item.userId`',`${item.userId}`)
        //             // {"gameType":"LIVE","gameName":"BaccaratClassic","gameCode":"MX-LIVE-001","userId":"lokuuserm12","platform":"SEXYBCRT","platformTxId":"BAC-260035748","refPlatformTxId":null,"settleType":"platformTxId","updateTime":"2023-04-14T20:21:02.661+08:00","roundId":"Mexico-04-GA559640024","betType":"Player","betTime":"2023-04-14T20:20:44.852+08:00","txTime":"2023-04-14T20:20:44.852+08:00","turnover":5,"betAmount":5,"winAmount":0,"gameInfo":{"result":["D08","S10","","C09","C10",""],"roundStartTime":"04/14/2023 20:20:26.575","winner":"BANKER","ip":"111.93.58.10","odds":-1.0,"streamerId":"","tableId":4,"dealerDomain":"Mexico","winLoss":-5.0,"status":"LOSE"}}
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;

        //             const realWinAmount = item.winAmount;
        //             const realBetAmount = item.betAmount;
        //             const result = (realWinAmount > realBetAmount) ? Math.abs(Math.abs(realWinAmount) - Math.abs(realBetAmount)) : -Math.abs(Math.abs(realBetAmount) - Math.abs(realWinAmount));

        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(async betData => {
        //                     if (betData) {
        //                         // "updateTime":"2023-04-14T20:21:02.661+08:00","roundId":"Mexico-04-GA559640024",
        //                         await CasinoBet.findOneAndUpdate({
        //                             platformTxId: txnId
        //                         },
        //                             {
        //                                 $set: {
        //                                     isDeclared: true,
        //                                     status: "completed",
        //                                     loseAmount: (item.winAmount > item.betAmount) ? 0 : Math.abs(item.betAmount) - Math.abs(item.winAmount),
        //                                     transactionType: (item.winAmount > item.betAmount) ? "credit" : "debit",
        //                                     realWinAmount: item.winAmount,
        //                                     turnover: item.winLoss,
        //                                     settleStatus: item.status,
        //                                     betAmount: Math.abs(item.betAmount),
        //                                     amount: Math.abs(result),
        //                                 }
        //                             });
        //                         await Transaction.findOneAndUpdate({
        //                             selectionId: txnId
        //                         },
        //                             {
        //                                 $set: {
        //                                     isDeclared: true,
        //                                     status: "completed",
        //                                     loseAmount: (item.winAmount > item.betAmount) ? 0 : Math.abs(item.betAmount) - Math.abs(item.winAmount),
        //                                     transactionType: (item.winAmount > item.betAmount) ? "credit" : "debit",
        //                                     realCutAmount: result,
        //                                     playerPL: result,
        //                                     realWinAmount: item.winAmount,
        //                                     turnover: item.winLoss,
        //                                     settleStatus: item.status,
        //                                     betAmount: Math.abs(item.betAmount),
        //                                     amount: Math.abs(result),
        //                                 }
        //                             });
        //                         callback(null)
        //                     } else {
        //                         callback(null)
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('settle', respData);
        //                 res.status(200).json(respData);
        //             }
        //             respData = {
        //                 "status": "0000",
        //                 "desc": "Success"
        //             };
        //             //console.log('resettle', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "voidBet") {
        //         const tempArr = [];
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             tempArr.push(txnId);
        //             callback(null);
        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('settle', respData);
        //                 res.status(200).json(respData);
        //             }
        //             //console.log('tempArr0----', tempArr)
        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "voided",
        //                 }
        //             });
        //             await Transaction.deleteMany({ selectionId: { $in: tempArr } });
        //             respData = {
        //                 "status": "0000",
        //                 "desc": "Success"
        //             };
        //             //console.log('voidBet', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "voidSettle") {
        //         const tempArr = [];
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             tempArr.push(txnId);
        //             callback(null);
        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('settle', respData);
        //                 res.status(200).json(respData);
        //             }
        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "voided",
        //                 }
        //             });
        //             await Transaction.deleteMany({ selectionId: { $in: tempArr } });
        //             respData = {
        //                 "status": "0000",
        //                 "desc": "Success"
        //             };
        //             //console.log('voidSettle', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "cancelBet") {
        //         const tempArr = [];
        //         const matchArrIns = [];
        //         const balanceArr=[];
        //         let userIdValue;
        //         let CasinoBetExist = await CasinoBet.distinct('platformTxId',{});
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             //console.log('txnId---', txnId)
        //             tempArr.push(txnId);
        //             userIdValue = item.userId;
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(betData => {
        //                     if (betData || CasinoBetExist.findIndex((a)=>a==txnId) != -1) {
        //                         callback(null)
        //                     } else {
        //                         User.findOne({ username: item.userId })
        //                             .then(idata => {
        //                                 if (idata) {
        //                                     item.betAmount = (item.betAmount) ? item.betAmount : 0;
        //                                     //console.log('cancelBet `item.userId`', item.betAmount);
        //                                     balanceArr.push({ amount: -Math.abs(item.betAmount) })
        //                                     let userId = idata._id;
        //                                     let ownerId = idata.ownerId;
        //                                     let subOwnerId = idata.subOwnerId;
        //                                     let adminId = idata.adminId;
        //                                     let superAdminId = idata.superAdminId;
        //                                     let subAdminId = idata.subAdminId;
        //                                     let superSeniorId = idata.superSeniorId;
        //                                     let superAgentId = idata.superAgentId;
        //                                     let agentId = idata.agentId;
        //                                     let marketDataToBeUpdated = {
        //                                         selectionId: txnId,
        //                                         platformTxId: txnId,
        //                                         userId,
        //                                         ownerId,
        //                                         subOwnerId,
        //                                         adminId,
        //                                         superAdminId,
        //                                         subAdminId,
        //                                         superSeniorId,
        //                                         superAgentId,
        //                                         agentId,
        //                                         eventType: '-1',
        //                                         // gameInfo:item.gameInfo,
        //                                         roundId: item.roundId,
        //                                         casinoBetId: item.roundId,
        //                                         profitAmount: item.betAmount,
        //                                         loseAmount: -Math.abs(item.betAmount),
        //                                         transactionType: "debit",
        //                                         realCutAmount: -Math.abs(item.betAmount),
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(item.betAmount),
        //                                         platform: item.platform,
        //                                         casinoName: item.gameName,
        //                                         matchName: item.gameName,
        //                                         gameCode: item.gameCode,
        //                                         currency: item.currency || "MYR",
        //                                         clientName: item.userId,
        //                                         gameType: "casino",
        //                                         runnerName: item?.platform,
        //                                         reportName: item?.gameName,
        //                                         gameName: item.gameName,
        //                                         eventType: -1,
        //                                         timeInserted: new Date(moment().format("YYYY-MM-DD")),
        //                                         timeInsertedDate: moment().format("YYYY-MM-DD"),
        //                                         isDeclared: true,
        //                                         forBet: 1,
        //                                         status: "cancelled"
        //                                     }
        //                                     if(CasinoBetExist.findIndex((a)=>a==txnId) != -1 || matchArrIns.findIndex((a)=>a.platformTxId==txnId) != -1)
        //                                     {
        //                                         callback(null)

        //                                     }else{
        //                                         matchArrIns.push(marketDataToBeUpdated);
        //                                         callback(null)
        //                                     }
        //                                 } else {
        //                                     // //console.log('`item.userId`',3)
        //                                     callback(null)
        //                                 }
        //                             }).catch(error => {
        //                                 // //console.log('`item.userId`',4)
        //                                 callback(error)
        //                             })
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });
        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('cancelBet', respData);
        //                 res.status(200).json(respData);
        //             }

        //             let finalBetAmount = 0;
        //             await balanceArr.map((amt, i) => {
        //                 finalBetAmount += Math.abs(amt.amount);
        //             })
        //             //console.log('bet Place', balanceArr, finalBetAmount)
        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             const amount = totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0;
        //             //console.log('totalAMT[0].totalAmount', amount,totalAMT[0].totalAmount);
                    
        //             if (amount > 0 && amount >= finalBetAmount && matchArrIns && matchArrIns.length > 0){
        //                 await CasinoBet.insertMany(matchArrIns);
        //             }

        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "cancelled",
        //                 }
        //             });

        //             await Transaction.deleteMany({ selectionId: { $in: tempArr } });

        //             // //console.log('userId',userId, userIdValue)
        //             const totalAMT2 = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             respData = {
        //                 "status": "0000",
        //                 "balance": totalAMT2.length > 0 ? totalAMT2[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };
        //             //console.log('cancelBet', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "give") {
        //         const matchArrIns = [];

        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             // //console.log('`${item.promotionTxId}-${item.promotionId}`', { platformTxId: `${item.promotionTxId}-${item.promotionId}` });
        //             // //console.log('`item.userId`',`${item.userId}`)
        //             Transaction.findOne({ selectionId: `${item.promotionTxId}-${item.promotionId}` })
        //                 .then(betData => {
        //                     if (betData || matchArrIns.findIndex((a) => a.selectionId == `${item.platform}-${item.platformTxId}`) != -1) {
        //                         //console.log('bet selectionId', `${item.promotionTxId}-${item.platformTxId}`)
        //                         callback(null)
        //                     } else {
        //                         User.findOne({ username: item.userId })
        //                             .then(idata => {
        //                                 if (idata) {
        //                                     //console.log('bet selectionId', 1)

        //                                     // //console.log('`item.userId`',2)
        //                                     let userId = idata._id;
        //                                     let ownerId = idata.ownerId;
        //                                     let subOwnerId = idata.subOwnerId;
        //                                     let adminId = idata.adminId;
        //                                     let superAdminId = idata.superAdminId;
        //                                     let subAdminId = idata.subAdminId;
        //                                     let superSeniorId = idata.superSeniorId;
        //                                     let superAgentId = idata.superAgentId;
        //                                     let agentId = idata.agentId;
        //                                     let marketDataToBeUpdated = {
        //                                         selectionId: `${item.promotionTxId}-${item.promotionId}`,
        //                                         platformTxId: `${item.promotionTxId}-${item.promotionId}`,
        //                                         userId,
        //                                         ownerId,
        //                                         subOwnerId,
        //                                         adminId,
        //                                         superAdminId,
        //                                         subAdminId,
        //                                         superSeniorId,
        //                                         superAgentId,
        //                                         agentId,
        //                                         eventType: '-1',
        //                                         // gameInfo:item.gameInfo,
        //                                         roundId: item.roundId,
        //                                         casinoBetId: item.roundId,
        //                                         profitAmount: item.amount,
        //                                         loseAmount: 0,
        //                                         transactionType: "credit",
        //                                         realCutAmount: Math.abs(item.amount),
        //                                         betAmount: Math.abs(item.amount),
        //                                         amount: Math.abs(item.amount),
        //                                         platform: item.platform,
        //                                         casinoName: item.gameName,
        //                                         matchName: item.gameName,
        //                                         gameCode: item.gameCode,
        //                                         currency: item.currency,
        //                                         clientName: item.userId,
        //                                         gameType: "casino",
        //                                         runnerName: item?.platform,
        //                                         reportName: item?.gameName,
        //                                         gameName: item.gameName,
        //                                         eventType: -1,
        //                                         timeInserted: new Date(item.betTime),
        //                                         remark: "Promotion amount",
        //                                         timeInsertedDate: moment(item?.betTime).format("YYYY-MM-DD"),

        //                                     }
        //                                     matchArrIns.push(marketDataToBeUpdated);

        //                                     callback(null)
        //                                 } else {
        //                                     // //console.log('`item.userId`',3)
        //                                     callback(null)
        //                                 }
        //                             }).catch(error => {
        //                                 // //console.log('`item.userId`',4)
        //                                 callback(error)
        //                             })
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });
        //         }, async (error) => {

        //             await Transaction.insertMany(matchArrIns);

        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);

        //             respData = {
        //                 "status": "0000",
        //                 "balance": totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };
        //             //console.log('give respData-->', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "adjustBet") {

        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(async betData => {
        //                     if (betData) {
        //                         await CasinoBet.findOneAndUpdate({
        //                             platformTxId: txnId
        //                         },
        //                             {
        //                                 $set: {
        //                                     realCutAmount: -Math.abs(item.betAmount),
        //                                     betAmount: Math.abs(item.betAmount),

        //                                 }
        //                             });
        //                         await Transaction.findOneAndUpdate({
        //                             selectionId: txnId
        //                         },
        //                             {
        //                                 $set: {
        //                                     realCutAmount: -Math.abs(item.betAmount),
        //                                     betAmount: Math.abs(item.betAmount),
        //                                     amount: Math.abs(item.betAmount),
        //                                 }
        //                             });
        //                         callback(null)
        //                     } else {
        //                         callback(null)
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {

        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);

        //             respData = {
        //                 "status": "0000",
        //                 "balance": totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };


        //             //console.log('bet', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "unvoidBet") {
        //         const matchArrIns = [];
        //         const tempArr = [];
        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(betData => {
        //                     if (betData || matchArrIns.findIndex((a) => a.selectionId == txnId) != -1) {
        //                         // //console.log('item',betData)
        //                         delete betData?._doc._id
        //                         delete betData?._doc.createdAt;
        //                         delete betData?._doc.updatedAt;
        //                         delete betData?._doc.status;
        //                         matchArrIns.push({ ...betData?._doc, selectionId: betData?._doc?.platformTxId });
        //                         // //console.log(matchArrIns);
        //                         // return true;
        //                         tempArr.push(txnId);
        //                         callback(null)
        //                     } else {
        //                         callback(null)
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('betNSettle', respData);
        //                 res.status(200).json(respData);
        //             }

        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "active",
        //                 }
        //             });
        //             (matchArrIns && matchArrIns.length > 0) && await Transaction.insertMany(matchArrIns);
        //             respData = {
        //                 "status": "0000",
        //                 "desc": ""
        //             };
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "unvoidSettle") {
        //         const matchArrIns = [];
        //         const tempArr = [];
        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(betData => {
        //                     if (betData || matchArrIns.findIndex((a) => a.selectionId == txnId) != -1) {
        //                         // //console.log('item',betData)
        //                         delete betData?._doc._id
        //                         delete betData?._doc.createdAt;
        //                         delete betData?._doc.updatedAt;
        //                         delete betData?._doc.status;
        //                         matchArrIns.push({ ...betData?._doc, selectionId: betData?._doc?.platformTxId, realCutAmount:(betData?._doc?.amount>0)?Math.abs(betData?._doc?.amount):-Math.abs(betData?._doc?.amount)});
        //                         // //console.log(matchArrIns);
        //                         // return true;
        //                         tempArr.push(txnId);
        //                         callback(null)
        //                     } else {
        //                         callback(null)
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('betNSettle', respData);
        //                 res.status(200).json(respData);
        //             }

        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "active",
        //                 }
        //             });
        //             (matchArrIns && matchArrIns.length > 0) && await Transaction.insertMany(matchArrIns);
        //             respData = {
        //                 "status": "0000",
        //                 "desc": ""
        //             };
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "unsettle") {
        //         const tempArr = [];
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             tempArr.push(txnId);
        //             Transaction.updateMany({ selectionId: { $in: txnId } }, {
        //                 $set: {
        //                     realCutAmount: -Math.abs(item.betAmount),
        //                 }
        //             }).then(updateData => {
        //                 callback(null)
        //             }).catch(error => {
        //                 // //console.log('`item.userId`',4)
        //                 callback(error)
        //             })

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('unsettle', respData);
        //                 res.status(200).json(respData);
        //             }
        //             //console.log('tempArr0----', tempArr)
        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "suspend",
        //                 }
        //             });
        //             respData = {
        //                 "status": "0000",
        //                 "desc": "Success"
        //             };
        //             //console.log('unsettle', respData);
        //             res.status(200).json(respData);
        //         });

        //     } else if (tempData?.action == "freeSpin" || tempData?.action == "refund") {
        //         const matchArrIns = [];
        //         const balanceArr = [];
        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             const realWinAmount = item.winAmount;
        //             const realBetAmount = item.betAmount;
        //             const result = (realWinAmount > realBetAmount) ? Math.abs(Math.abs(realWinAmount) - Math.abs(realBetAmount)) : -Math.abs(Math.abs(realBetAmount) - Math.abs(realWinAmount));

        //             CasinoBet.findOne({ platformTxId: `${item.platform}-${item.platformTxId}` })
        //                 .then(betData => {
        //                     if (betData || matchArrIns.findIndex((a) => a.selectionId == `${item.platform}-${item.platformTxId}`) != -1) {
        //                         //console.log('bet platformTxId', `${item.platform}-${item.platformTxId}`)
        //                         callback(null)
        //                     } else {
        //                         User.findOne({ username: item.userId })
        //                             .then(idata => {
        //                                 if (idata) {
        //                                     //console.log('bet platformTxId', 1)
        //                                     balanceArr.push({ amount: -Math.abs(item.betAmount) })
        //                                     // //console.log('`item.userId`',2)
        //                                     let userId = idata._id;
        //                                     let ownerId = idata.ownerId;
        //                                     let subOwnerId = idata.subOwnerId;
        //                                     let adminId = idata.adminId;
        //                                     let superAdminId = idata.superAdminId;
        //                                     let subAdminId = idata.subAdminId;
        //                                     let superSeniorId = idata.superSeniorId;
        //                                     let superAgentId = idata.superAgentId;
        //                                     let agentId = idata.agentId;
        //                                     let marketDataToBeUpdated = {
        //                                         selectionId: `${item.platform}-${item.platformTxId}`,
        //                                         platformTxId: `${item.platform}-${item.platformTxId}`,
        //                                         userId,
        //                                         ownerId,
        //                                         subOwnerId,
        //                                         adminId,
        //                                         superAdminId,
        //                                         subAdminId,
        //                                         superSeniorId,
        //                                         superAgentId,
        //                                         agentId,
        //                                         eventType: '-1',
        //                                         // gameInfo:item.gameInfo,
        //                                         roundId: item.roundId,
        //                                         casinoBetId: item.roundId,
        //                                         profitAmount: item.betAmount,
        //                                         status: "completed",
        //                                         loseAmount: (item.winAmount > item.betAmount) ? 0 : Math.abs(item.betAmount) - Math.abs(item.winAmount),
        //                                         transactionType: (item.winAmount > item.betAmount) ? "credit" : "debit",
        //                                         realCutAmount: result,
        //                                         playerPL: result,
        //                                         realWinAmount: item.winAmount,
        //                                         turnover: item.winAmount,
        //                                         settleStatus: item.status,
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(result),
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(item.betAmount),
        //                                         platform: item.platform,
        //                                         casinoName: item.gameName,
        //                                         matchName: item.gameName,
        //                                         gameCode: item.gameCode,
        //                                         currency: item.currency,
        //                                         clientName: item.userId,
        //                                         gameType: "casino",
        //                                         runnerName: item?.platform,
        //                                         reportName: item?.gameName,
        //                                         gameName: item.gameName,
        //                                         eventType: -1,
        //                                         timeInserted: new Date(item.betTime),
        //                                         timeInsertedDate: moment(item?.betTime).format("YYYY-MM-DD"),
        //                                         isDeclared: true,
        //                                         forBet: 1,
        //                                     }
        //                                     matchArrIns.push(marketDataToBeUpdated);
        //                                     callback(null)
        //                                 } else {
        //                                     // //console.log('`item.userId`',3)
        //                                     callback(null)
        //                                 }
        //                             }).catch(error => {
        //                                 // //console.log('`item.userId`',4)
        //                                 callback(error)
        //                             })
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('bet', respData);
        //                 res.status(200).json(respData);
        //             }

        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             // //console.log('userId', userId, userIdValue)

        //             await CasinoBet.insertMany(matchArrIns);
        //             await Transaction.insertMany(matchArrIns);

        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);

        //             respData = {
        //                 "status": "0000",
        //                 "balance": totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "betNSettle") {
        //         const matchArrIns = [];
        //         const balanceArr = [];
        //         let userIdValue;
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             userIdValue = item.userId;
        //             const realWinAmount = item.winAmount;
        //             const realBetAmount = item.betAmount;
        //             const result = (realWinAmount > realBetAmount) ? Math.abs(Math.abs(realWinAmount) - Math.abs(realBetAmount)) : -Math.abs(Math.abs(realBetAmount) - Math.abs(realWinAmount));
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             //console.log('bet platformTxId', txnId)
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(betData => {
        //                     if (betData) {
        //                         callback(null)
        //                     } else {
        //                         User.findOne({ username: item.userId })
        //                             .then(idata => {
        //                                 if (idata) {
        //                                     // //console.log('bet platformTxId', 1)
        //                                     balanceArr.push({ amount: -Math.abs(item.requireAmount) })
        //                                     // //console.log('`item.userId`',2)
        //                                     let userId = idata._id;
        //                                     let ownerId = idata.ownerId;
        //                                     let subOwnerId = idata.subOwnerId;
        //                                     let adminId = idata.adminId;
        //                                     let superAdminId = idata.superAdminId;
        //                                     let subAdminId = idata.subAdminId;
        //                                     let superSeniorId = idata.superSeniorId;
        //                                     let superAgentId = idata.superAgentId;
        //                                     let agentId = idata.agentId;
        //                                     let marketDataToBeUpdated = {
        //                                         selectionId: txnId,
        //                                         platformTxId: txnId,
        //                                         userId,
        //                                         ownerId,
        //                                         subOwnerId,
        //                                         adminId,
        //                                         superAdminId,
        //                                         subAdminId,
        //                                         superSeniorId,
        //                                         superAgentId,
        //                                         agentId,
        //                                         eventType: '-1',
        //                                         // gameInfo:item.gameInfo,
        //                                         roundId: item.roundId,
        //                                         casinoBetId: item.roundId,
        //                                         profitAmount: item.betAmount,
        //                                         status: "completed",
        //                                         loseAmount: (item.winAmount > item.betAmount) ? 0 : Math.abs(item.betAmount) - Math.abs(item.winAmount),
        //                                         transactionType: (item.winAmount > item.betAmount) ? "credit" : "debit",
        //                                         realCutAmount: result,
        //                                         playerPL: result,
        //                                         realWinAmount: item.winAmount,
        //                                         turnover: item.winAmount,
        //                                         settleStatus: item.status,
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(result),
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(item.betAmount),
        //                                         platform: item.platform,
        //                                         casinoName: item.gameName,
        //                                         matchName: item.gameName,
        //                                         gameCode: item.gameCode,
        //                                         currency: item.currency,
        //                                         clientName: item.userId,
        //                                         gameType: "casino",
        //                                         runnerName: item?.platform,
        //                                         reportName: item?.gameName,
        //                                         gameName: item.gameName,
        //                                         eventType: -1,
        //                                         timeInserted: new Date(item.betTime),
        //                                         timeInsertedDate: moment(item?.betTime).format("YYYY-MM-DD"),
        //                                         isDeclared: true,
        //                                         forBet: 1,
        //                                     }
        //                                     if(matchArrIns.findIndex((a)=>a.platformTxId==txnId) != -1)
        //                                     {
        //                                         callback(null)

        //                                     }else{
        //                                         matchArrIns.push(marketDataToBeUpdated);
        //                                         callback(null)
        //                                     }
        //                                 } else {
        //                                     // //console.log('`item.userId`',3)
        //                                     callback(null)
        //                                 }
        //                             }).catch(error => {
        //                                 // //console.log('`item.userId`',4)
        //                                 callback(error)
        //                             })
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });

        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('betNSettle', respData);
        //                 res.status(200).json(respData);
        //             }

        //             let finalBetAmount = 0;
        //             await balanceArr.map((amt, i) => {
        //                 finalBetAmount += Math.abs(amt.amount);
        //             })
        //             //console.log('bet', balanceArr, finalBetAmount)
        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
                    
        //             //console.log('userId matchArrIns', matchArrIns)

        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             const amount = totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0;

        //             if(amount >= finalBetAmount && amount >0 && matchArrIns && matchArrIns.length>0)
        //             {
        //                 const NewArr=[];
        //                 let CasinoBetExistN = await CasinoBet.distinct('platformTxId',{userId});
        //                 await matchArrIns.map((item)=>{
        //                     if(CasinoBetExistN.findIndex((a)=>a==item.platformTxId) == -1 && NewArr.findIndex((a)=>a.platformTxId==item.platformTxId) == -1)
        //                     {
        //                         NewArr.push(item);
        //                     }
        //                 });
        //                 if(NewArr && NewArr.length>0)
        //                 {
        //                     //console.log('userId NewArrNewArrNewArrNewArrNewArr', NewArr)
        //                     await CasinoBet.insertMany(NewArr);
        //                     await Transaction.insertMany(NewArr);
        //                 }
        //             }

        //             const totalAMT2 = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);

        //             respData = {
        //                 "status": (amount >= finalBetAmount)?"0000":(!matchArrIns)?"0000":"1018",
        //                 "balance": totalAMT2.length > 0 ? totalAMT2[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };                    
        //             //console.log('betNSettle', respData);
        //             res.status(200).json(respData);
        //         });
        //     } else if (tempData?.action == "cancelBetNSettle") {
        //         const tempArr = [];
        //         const matchArrIns = [];
        //         const balanceArr=[];
        //         let userIdValue;
        //         let CasinoBetExist = await CasinoBet.distinct('platformTxId',{});
        //         async.eachSeries(tempData?.txns, (item, callback) => {
        //             const txnId = ((item.platform == "JILI" && item.gameCode=="JILI-TABLE-005") || item.platform == "LUCKYPOKER" || item.platform == "PP" || item.platform == "PT") ? `${item.platform}-${item.roundId}` : `${item.platform}-${item.platformTxId}`;
        //             //console.log('txnId---', txnId)
        //             tempArr.push(txnId);
        //             userIdValue = item.userId;
        //             CasinoBet.findOne({ platformTxId: txnId })
        //                 .then(betData => {
        //                     if (betData || CasinoBetExist.findIndex((a)=>a==txnId) != -1) {
        //                         callback(null)
        //                     } else {
        //                         User.findOne({ username: item.userId })
        //                             .then(idata => {
        //                                 if (idata) {
        //                                     item.betAmount = (item.betAmount) ? item.betAmount : 0;
        //                                     //console.log('cancelBet `item.userId`', item.betAmount);
        //                                     balanceArr.push({ amount: -Math.abs(item.betAmount) })
        //                                     let userId = idata._id;
        //                                     let ownerId = idata.ownerId;
        //                                     let subOwnerId = idata.subOwnerId;
        //                                     let adminId = idata.adminId;
        //                                     let superAdminId = idata.superAdminId;
        //                                     let subAdminId = idata.subAdminId;
        //                                     let superSeniorId = idata.superSeniorId;
        //                                     let superAgentId = idata.superAgentId;
        //                                     let agentId = idata.agentId;
        //                                     let marketDataToBeUpdated = {
        //                                         selectionId: txnId,
        //                                         platformTxId: txnId,
        //                                         userId,
        //                                         ownerId,
        //                                         subOwnerId,
        //                                         adminId,
        //                                         superAdminId,
        //                                         subAdminId,
        //                                         superSeniorId,
        //                                         superAgentId,
        //                                         agentId,
        //                                         eventType: '-1',
        //                                         // gameInfo:item.gameInfo,
        //                                         roundId: item.roundId,
        //                                         casinoBetId: item.roundId,
        //                                         profitAmount: item.betAmount,
        //                                         loseAmount: -Math.abs(item.betAmount),
        //                                         transactionType: "debit",
        //                                         realCutAmount: -Math.abs(item.betAmount),
        //                                         betAmount: Math.abs(item.betAmount),
        //                                         amount: Math.abs(item.betAmount),
        //                                         platform: item.platform,
        //                                         casinoName: item.gameName,
        //                                         matchName: item.gameName,
        //                                         gameCode: item.gameCode,
        //                                         currency: item.currency || "MYR",
        //                                         clientName: item.userId,
        //                                         gameType: "casino",
        //                                         runnerName: item?.platform,
        //                                         reportName: item?.gameName,
        //                                         gameName: item.gameName,
        //                                         eventType: -1,
        //                                         timeInserted: new Date(moment().format("YYYY-MM-DD")),
        //                                         timeInsertedDate: moment().format("YYYY-MM-DD"),
        //                                         isDeclared: true,
        //                                         forBet: 1,
        //                                         status: "cancelled"
        //                                     }
        //                                     if(CasinoBetExist.findIndex((a)=>a==txnId) != -1 || matchArrIns.findIndex((a)=>a.platformTxId==txnId) != -1)
        //                                     {
        //                                         callback(null)

        //                                     }else{
        //                                         matchArrIns.push(marketDataToBeUpdated);
        //                                         callback(null)
        //                                     }
        //                                 } else {
        //                                     // //console.log('`item.userId`',3)
        //                                     callback(null)
        //                                 }
        //                             }).catch(error => {
        //                                 // //console.log('`item.userId`',4)
        //                                 callback(error)
        //                             })
        //                     }
        //                 }).catch(error => {
        //                     // //console.log('`item.userId`',5)
        //                     callback(error)
        //                 });
        //         }, async (error) => {
        //             if (error) {
        //                 respData = {
        //                     "status": "1000",
        //                     "desc": error
        //                 };
        //                 //console.log('cancelBet', respData);
        //                 res.status(200).json(respData);
        //             }

        //             let finalBetAmount = 0;
        //             await balanceArr.map((amt, i) => {
        //                 finalBetAmount += Math.abs(amt.amount);
        //             })
        //             //console.log('bet Place', balanceArr, finalBetAmount)
        //             const userExist = await User.distinct('_id', { username: userIdValue });
        //             const userId = (userExist && userExist.length > 0) ? userExist[0] : 0;
        //             const totalAMT = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             const amount = totalAMT.length > 0 ? totalAMT[0].totalAmount.toFixed(2) : 0;
        //             //console.log('totalAMT[0].totalAmount', amount,totalAMT[0].totalAmount);
        //             //console.log('userId cancelBetNSettle matchArrIns', matchArrIns)
        //             if (amount > 0 && amount >= finalBetAmount && matchArrIns && matchArrIns.length > 0){
        //                 await CasinoBet.insertMany(matchArrIns);
        //             }

        //             await Transaction.deleteMany({ selectionId: { $in: tempArr } });

        //             await CasinoBet.updateMany({ platformTxId: { $in: tempArr } }, {
        //                 $set: {
        //                     status: "cancelled",
        //                 }
        //             });

        //             // //console.log('userId',userId, userIdValue)
        //             const totalAMT2 = await Transaction.aggregate([
        //                 {
        //                     $match: { userId, forCasinoBet: 0 }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,
        //                         totalAmount: { $sum: "$realCutAmount" }
        //                     }
        //                 }
        //             ]);
        //             respData = {
        //                 "status": "0000",
        //                 "balance": totalAMT2.length > 0 ? totalAMT2[0].totalAmount.toFixed(2) : 0,
        //                 "balanceTs": `${moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS")}+00:00`
        //             };
        //             //console.log('cancelBetNSettle', respData);
        //             res.status(200).json(respData);
        //         });
        //     }
        // }
    // }, 1000);

});

module.exports = router;