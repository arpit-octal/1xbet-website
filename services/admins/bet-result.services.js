const Match = require("../../models/match.model");
const Tournament = require("../../models/tournament.model");
const User = require("../../models/user.model");
const Bet = require("../../models/bet.model");
const BetPosition = require("../../models/betPosition.model");
const SessionBet = require("../../models/sessionBet.model");
const SportBook = require("../../models/sportBook.model");
const SportBookBet = require("../../models/sportsBookBet.model");
const Fancy = require("../../models/fancy.model");
const SportBookPremiumFancy = require("../../models/sportBookPremiumFancy");
const Transaction = require("../../models/transaction.model");
const DeletedTransaction = require("../../models/deletedTransaction.model");
const Report = require("../../models/report.model");
const DeletedReport = require("../../models/deletedReport.model");

const { responseData } = require('../../helpers/responseData');
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { getAccessToken, betFairLayFormulaProfit, betFairLayFormulaLose, betFairBackFormulaProfit, betFairBackFormulaLose, bookmakerRealRate } = require('../../helpers/helper')
const { ObjectId } = require('mongodb');
const moment = require("moment");
const axios = require('axios').default;
const async = require('async');

module.exports = {

    fancy: async (req, res) => {
        try {

            let { decisionRun, selectionId, marketId, eventId } = req.body;
            if (!eventId) {
                return res.json(responseData("eventId required", {}, req, false));
            }

            if (!decisionRun) {
                return res.json(responseData("decisionRun required", {}, req, false));
            }

            if (!marketId) {
                return res.json(responseData("marketId required", {}, req, false));
            }

            if (!selectionId) {
                return res.json(responseData("selectionId required", {}, req, false));
            }
            console.log('req?.post?.decisionRun', selectionId, decisionRun);
            // "pending","active",
            const previousBet = await SessionBet.aggregate([
                {
                    $match: { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] } }
                }
            ]);

            const UserData = await User.aggregate([
                {
                    $match: { _id: { $in: await SessionBet.distinct('userId', { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] } }) } }
                },
                {
                    $project: {
                        _id: { "$toString": "$_id" },
                        commission: 1,
                        agentId: 1,
                        userId: "$_id"
                    }
                }
            ]);

            const deletedTransactions = await Transaction.find({ eventId, marketId })

            await DeletedTransaction.insertMany(deletedTransactions)

            await Transaction.deleteMany({ eventId, marketId });

            const runBetPosition = [];
            const agentCommissionData = [];
            const previousBets = previousBet ? previousBet : [];
            const BetIds = [];
            previousBets && previousBets.map((item) => {
                // console.log('item',item)
                BetIds.push(item?._id)
                const bhav = item?.bhav / 100;
                const betType = item?.type;
                const userId = item?.userID;
                // console.log('decisionRun < item.betRun && betType',item, decisionRun, item.betRun, betType, selectionId)
                let position;
                let betAmount;
                if (decisionRun >= item.betRun && betType == 'Yes') {
                    position = Number(item.amount * bhav).toFixed(2);
                }

                if (decisionRun < item.betRun && betType == 'No') {
                    position = Math.abs(item.amount);
                }

                if (decisionRun >= item.betRun && betType == 'No') {
                    position = Number(-1 * (item.amount * bhav)).toFixed(2);
                }

                if (decisionRun < item.betRun && betType == 'Yes') {
                    position = Number(-1 * item.amount).toFixed(2);
                }

                if (runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId) == -1) {
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);
                    runBetPosition.push({ ...item, position });

                } else {

                    const index = runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId);
                    oldPosition = (runBetPosition[index].position > 0) ? Math.abs(runBetPosition[index].position) : -Math.abs(runBetPosition[index].position);
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);

                    oldPosition += position;

                    runBetPosition[index].position = oldPosition;

                    betAmount = Math.abs(runBetPosition[index].amount);
                    runBetPosition[index].amount += betAmount;
                }

                // console.log('position',position, runBetPosition)

            });

            if (BetIds && BetIds.length > 0) {
                runBetPosition && runBetPosition.map((item, i) => {
                    delete runBetPosition[i]._id
                    delete runBetPosition[i].createdAt;
                    delete runBetPosition[i].updatedAt;
                    console.log('item.position', item.position)
                    // console.log('runBetPosition[i]------',runBetPosition[i])
                    let amount = 0;
                    const uData = UserData.find((e) => e._id == item?.userID);
                    const commissionPer = (uData?.commission) ? uData?.commission : 0;
                    if (item.position > 0) {
                        runBetPosition[i].commission = Math.abs(commissionPer / 100) * Math.abs(item.position);
                    } else {
                        runBetPosition[i].commission = 0;
                    }

                    if (runBetPosition[i].commission > 0) {
                        agentCommissionData.push({
                            transactionType: "credit",
                            ownerId: item?.ownerId,
                            subOwnerId: item?.subOwnerId,
                            adminId: item?.adminId,
                            superAdminId: item?.superAdminId,
                            subAdminId: item?.subAdminId,
                            superSeniorId: item?.superSeniorId,
                            superAgentId: item?.superAgentId,
                            agentId: item?.agentId,
                            userId: item?.agentId,
                            commissionBy: uData?.userId,
                            eventId: item?.eventId,
                            matchName: item?.matchName,
                            selectionId: item?.selectionId,
                            marketId: item?.marketId,
                            runnerName: item?.fancyName + ' - Commission',
                            fancyName: item?.fancyName,
                            clientName: item?.clientName,
                            amount: Math.abs(runBetPosition[i].commission),
                            realCutAmount: Math.abs(runBetPosition[i].commission),
                            status: 'success',
                            ip: item?.ip,
                            location: item?.ip,
                            geolocation: item?.ip,
                            userAgent: item?.ip,
                            betType: item?.type,
                            gameName: item?.matchName,
                            remark: "Commission",
                            forBet: 1,
                            forCommission: 1,
                            isDeclared: true,
                            betFaireType: "fancy"
                        });

                        agentCommissionData.push({
                            transactionType: "debit",
                            ownerId: item?.ownerId,
                            subOwnerId: item?.subOwnerId,
                            adminId: item?.adminId,
                            superAdminId: item?.superAdminId,
                            subAdminId: item?.subAdminId,
                            superSeniorId: item?.superSeniorId,
                            superAgentId: item?.superAgentId,
                            agentId: item?.agentId,
                            userId: item?.userId,
                            eventId: item?.eventId,
                            matchName: item?.matchName,
                            selectionId: item?.selectionId,
                            marketId: item?.marketId,
                            runnerName: item?.fancyName + ' - Commission',
                            fancyName: item?.fancyName,
                            clientName: item?.clientName,
                            amount: Math.abs(runBetPosition[i].commission),
                            realCutAmount: -Math.abs(runBetPosition[i].commission),
                            status: 'success',
                            ip: item?.ip,
                            location: item?.ip,
                            geolocation: item?.ip,
                            userAgent: item?.ip,
                            betType: item?.type,
                            gameName: item?.matchName,
                            remark: "Commission",
                            forBet: 1,
                            forCommission: 1,
                            isDeclared: true,
                            betFaireType: "fancy"
                        });
                    }

                    if (item.position > 0) {
                        runBetPosition[i].transactionType = "credit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = Math.abs(item.position);
                        runBetPosition[i].realAmount = Math.abs(item.position);
                    } else {
                        runBetPosition[i].transactionType = "debit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = - Math.abs(item.position);
                        runBetPosition[i].realAmount = - Math.abs(item.position);
                    }

                    runBetPosition[i].remark = "";
                    runBetPosition[i].userId = uData?.userId;
                    runBetPosition[i].forCommission = 0;
                    runBetPosition[i].isDeclared = true;
                    runBetPosition[i].reportType = 'fancy';
                    runBetPosition[i].betFaireType = 'fancy';
                    runBetPosition[i].reportGenerateDate = moment().format("MM-DD-YYYY");
                    runBetPosition[i].status = 'success';
                    runBetPosition[i].reportName = item?.matchName;
                    runBetPosition[i].matchName = item?.matchName;
                    runBetPosition[i].ip = "Central Panel";
                    runBetPosition[i].gameName = item?.matchName;
                    runBetPosition[i].runnerName = item?.fancyName;
                    runBetPosition[i].decisionRun = decisionRun;
                    runBetPosition[i].eventType = item?.eventType;
                    runBetPosition[i].forBet = 1;
                    runBetPosition[i].betAmount = item?.amount;
                });

                const deletedTransactions = await Transaction.find({ eventId, marketId })

                await DeletedTransaction.insertMany(deletedTransactions)

                await Transaction.deleteMany({ eventId, marketId });

                if (agentCommissionData && agentCommissionData.length > 0) {
                    await Transaction.insertMany(agentCommissionData);
                }

                if (runBetPosition && runBetPosition.length > 0) {
                    await Transaction.insertMany(runBetPosition);
                }

                // report generate
                const deleteReports = await Report.find({ marketId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ marketId });
                await Report.insertMany(runBetPosition);
            }

            await SessionBet.updateMany({
                _id: { $in: BetIds },
            },
                {
                    $set: {
                        isDeclared: true,
                        status: "completed",
                        decisionRun: decisionRun,
                        ip: "Central Panel"
                    }
                });

            await Fancy.findOneAndUpdate({
                selectionId,
                eventId
            },
                {
                    $set: { isDeclared: true, decisionRun, status: "close" }
                },
                { returnOriginal: false });

            return res.json(responseData("fancyResult", {}, req, true));

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    premiumFancy: async (req, res) => {
        // try {

        //     let { decision, selectionId, marketId, eventId } = req.body;
        //     if (!eventId) {
        //         return res.json(responseData("eventId required", {}, req, false));
        //     }

        //     if (!decision) {
        //         return res.json(responseData("decision required", {}, req, false));
        //     }

        //     if (!marketId) {
        //         return res.json(responseData("marketId required", {}, req, false));
        //     }

        //     if (!selectionId) {
        //         return res.json(responseData("selectionId required", {}, req, false));
        //     }
        //     // "pending","active",
        //     const previousBet = await SessionBet.aggregate([
        //         {
        //             $match: { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] } }
        //         }
        //     ]);

        //     const UserData = await User.aggregate([
        //         {
        //             $match: { _id: { $in: await SessionBet.distinct('userId', { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] } }) } }
        //         },
        //         {
        //             $project: {
        //                 _id: { "$toString": "$_id" },
        //                 commission: 1,
        //                 agentId: 1,
        //                 userId: "$_id"
        //             }
        //         }
        //     ]);

        //     await Transaction.deleteMany({ eventId, marketId });

        //     const runBetPosition = [];
        //     const agentCommissionData = [];
        //     const previousBets = previousBet ? previousBet : [];
        //     const BetIds = [];
        //     previousBets && previousBets.map((item) => {
        //         // console.log('item',item)
        //         BetIds.push(item?._id)
        //         const bhav = item?.bhav / 100;
        //         const betType = item?.type;
        //         const userId = item?.userID;
        //         // console.log('decision < item.betRun && betType',item, decision, item.betRun, betType, selectionId)
        //         let position;
        //         let betAmount;
        //         if (decision >= item.betRun && betType == 'Yes') {
        //             position = Number(item.amount * bhav).toFixed(2);
        //         }

        //         if (decision < item.betRun && betType == 'No') {
        //             position = Math.abs(item.amount);
        //         }

        //         if (decision >= item.betRun && betType == 'No') {
        //             position = Number(-1 * (item.amount * bhav)).toFixed(2);
        //         }

        //         if (decision < item.betRun && betType == 'Yes') {
        //             position = Number(-1 * item.amount).toFixed(2);
        //         }

        //         if (runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId) == -1) {
        //             position = (position > 0) ? Math.abs(position) : -Math.abs(position);
        //             runBetPosition.push({ ...item, position });

        //         } else {

        //             const index = runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId);
        //             oldPosition = (runBetPosition[index].position > 0) ? Math.abs(runBetPosition[index].position) : -Math.abs(runBetPosition[index].position);
        //             position = (position > 0) ? Math.abs(position) : -Math.abs(position);

        //             oldPosition += position;

        //             runBetPosition[index].position = oldPosition;

        //             betAmount = Math.abs(runBetPosition[index].amount);
        //             runBetPosition[index].amount += betAmount;
        //         }

        //         // console.log('position',position, runBetPosition)

        //     });

        //     if (BetIds && BetIds.length > 0) {
        //         runBetPosition && runBetPosition.map((item, i) => {
        //             delete runBetPosition[i]._id
        //             delete runBetPosition[i].createdAt;
        //             delete runBetPosition[i].updatedAt;
        //             console.log('item.position', item.position)
        //             // console.log('runBetPosition[i]------',runBetPosition[i])
        //             let amount = 0;
        //             const uData = UserData.find((e) => e._id == item?.userID);
        //             const commissionPer = (uData?.commission) ? uData?.commission : 0;
        //             if (item.position > 0) {
        //                 runBetPosition[i].commission = Math.abs(commissionPer / 100) * Math.abs(item.position);
        //             } else {
        //                 runBetPosition[i].commission = 0;
        //             }

        //             if (runBetPosition[i].commission > 0) {
        //                 agentCommissionData.push({
        //                     transactionType: "credit",
        //                     ownerId: item?.ownerId,
        //                     subOwnerId: item?.subOwnerId,
        //                     adminId: item?.adminId,
        //                     superAdminId: item?.superAdminId,
        //                     subAdminId: item?.subAdminId,
        //                     superSeniorId: item?.superSeniorId,
        //                     superAgentId: item?.superAgentId,
        //                     agentId: item?.agentId,
        //                     userId: item?.agentId,
        //                     commissionBy: uData?.userId,
        //                     eventId: item?.eventId,
        //                     matchName: item?.matchName,
        //                     selectionId: item?.selectionId,
        //                     marketId: item?.marketId,
        //                     runnerName: item?.fancyName + ' - Commission',
        //                     fancyName: item?.fancyName,
        //                     clientName: item?.clientName,
        //                     amount: Math.abs(runBetPosition[i].commission),
        //                     realCutAmount: Math.abs(runBetPosition[i].commission),
        //                     status: 'success',
        //                     ip: item?.ip,
        //                     location: item?.ip,
        //                     geolocation: item?.ip,
        //                     userAgent: item?.ip,
        //                     betType: item?.type,
        //                     gameName: item?.matchName,
        //                     remark: "Commission",
        //                     forBet: 1,
        //                     forCommission: 1,
        //                     isDeclared: true,
        //                     betFaireType: "fancy"
        //                 });

        //                 agentCommissionData.push({
        //                     transactionType: "debit",
        //                     ownerId: item?.ownerId,
        //                     subOwnerId: item?.subOwnerId,
        //                     adminId: item?.adminId,
        //                     superAdminId: item?.superAdminId,
        //                     subAdminId: item?.subAdminId,
        //                     superSeniorId: item?.superSeniorId,
        //                     superAgentId: item?.superAgentId,
        //                     agentId: item?.agentId,
        //                     userId: item?.userId,
        //                     eventId: item?.eventId,
        //                     matchName: item?.matchName,
        //                     selectionId: item?.selectionId,
        //                     marketId: item?.marketId,
        //                     runnerName: item?.fancyName + ' - Commission',
        //                     fancyName: item?.fancyName,
        //                     clientName: item?.clientName,
        //                     amount: Math.abs(runBetPosition[i].commission),
        //                     realCutAmount: -Math.abs(runBetPosition[i].commission),
        //                     status: 'success',
        //                     ip: item?.ip,
        //                     location: item?.ip,
        //                     geolocation: item?.ip,
        //                     userAgent: item?.ip,
        //                     betType: item?.type,
        //                     gameName: item?.matchName,
        //                     remark: "Commission",
        //                     forBet: 1,
        //                     forCommission: 1,
        //                     isDeclared: true,
        //                     betFaireType: "fancy"
        //                 });
        //             }

        //             if (item.position > 0) {
        //                 runBetPosition[i].transactionType = "credit";
        //                 runBetPosition[i].amount = Math.abs(item.position);
        //                 runBetPosition[i].realCutAmount = Math.abs(item.position);
        //                 runBetPosition[i].realAmount = Math.abs(item.position);
        //             } else {
        //                 runBetPosition[i].transactionType = "debit";
        //                 runBetPosition[i].amount = Math.abs(item.position);
        //                 runBetPosition[i].realCutAmount = - Math.abs(item.position);
        //                 runBetPosition[i].realAmount = - Math.abs(item.position);
        //             }

        //             runBetPosition[i].remark = "";
        //             runBetPosition[i].userId = uData?.userId;
        //             runBetPosition[i].forCommission = 0;
        //             runBetPosition[i].isDeclared = true;
        //             runBetPosition[i].reportType = 'fancy';
        //             runBetPosition[i].betFaireType = 'fancy';
        //             runBetPosition[i].reportGenerateDate = moment().format("MM-DD-YYYY");
        //             runBetPosition[i].status = 'success';
        //             runBetPosition[i].reportName = item?.matchName;
        //             runBetPosition[i].matchName = item?.matchName;
        //             runBetPosition[i].ip = "Central Panel";
        //             runBetPosition[i].gameName = item?.matchName;
        //             runBetPosition[i].runnerName = item?.fancyName;
        //             runBetPosition[i].decision = decision[0];
        //             runBetPosition[i].eventType = item?.eventType;
        //             runBetPosition[i].forBet = 1;
        //             runBetPosition[i].betAmount = item?.amount;
        //         });

        //         await Transaction.deleteMany({ eventId, marketId });

        //         if (agentCommissionData && agentCommissionData.length > 0) {
        //             await Transaction.insertMany(agentCommissionData);
        //         }

        //         if (runBetPosition && runBetPosition.length > 0) {
        //             await Transaction.insertMany(runBetPosition);
        //         }

        //         // report generate
        //         await Report.deleteMany({ marketId });
        //         await Report.insertMany(runBetPosition);
        //     }

        //     await SessionBet.updateMany({
        //         _id: { $in: BetIds },
        //     },
        //         {
        //             $set: {
        //                 isDeclared: true,
        //                 status: "completed",
        //                 decision: decision[0],
        //                 ip: "Central Panel"
        //             }
        //         });

        //     await SportBookPremiumFancy.findOneAndUpdate({
        //         selectionId,
        //         eventId
        //     },
        //         {
        //             $set: { isDeclared: true, wonSelectionId: decision[0], status: "close" }
        //         },
        //         { returnOriginal: false });

        //     return res.json(responseData("fancyResult", {}, req, true));

        // }
        try {

            let { decision, marketId, selectionId, eventId } = req.body;
            let wonSelectionId = decision[0]
            if (!eventId) {
                return res.json(responseData("eventId required", {}, req, false));
            }

            if (!wonSelectionId) {
                return res.json(responseData("wonSelectionId required", {}, req, false));
            }

            if (!marketId) {
                return res.json(responseData("marketId required", {}, req, false));
            }

            // console.log('req?.post?.decisionRun', selectionId, decisionRun);
            // "pending","active",
            const previousBet = await SessionBet.aggregate([
                {
                    $match: { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] } }
                }
            ]);

            const deletedTransactions = await Transaction.find({ eventId, marketId })

            await DeletedTransaction.insertMany(deletedTransactions)

            await Transaction.deleteMany({ eventId, marketId });

            const runBetPosition = [];
            const previousBets = previousBet ? previousBet : [];
            const BetIds = [];
            previousBets && previousBets.map((item) => {
                BetIds.push(item?._id)
                const bhav = item?.bhav;
                const betType = item?.type;
                const userId = item?.userID;
                const selectionId = item?.selectionId;
                // console.log('decisionRun < item.betRun && betType',item, decisionRun, item.betRun, betType, selectionId)
                let position = 0;
                let betAmount;
                if (selectionId == wonSelectionId) {
                    position = Math.abs(item?.profitAmount);
                } else if (selectionId != wonSelectionId) {
                    position = - Math.abs(item?.loseAmount);
                }

                if (runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId) == -1) {
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);
                    runBetPosition.push({ ...item, position });

                } else {

                    const index = runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId);
                    oldPosition = (runBetPosition[index].position > 0) ? Math.abs(runBetPosition[index].position) : -Math.abs(runBetPosition[index].position);
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);

                    oldPosition += position;

                    runBetPosition[index].position = oldPosition;
                }

                // console.log('position',position, runBetPosition)

            });

            if (BetIds && BetIds.length > 0) {
                runBetPosition && runBetPosition.map((item, i) => {
                    delete runBetPosition[i]._id
                    delete runBetPosition[i].createdAt;
                    delete runBetPosition[i].updatedAt;
                    // console.log('item.position', item.position)
                    // console.log('runBetPosition[i]------',runBetPosition[i])
                    let amount = 0;

                    if (item.position > 0) {
                        runBetPosition[i].transactionType = "credit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = Math.abs(item.position);
                        runBetPosition[i].realAmount = Math.abs(item.position);
                    } else {
                        runBetPosition[i].transactionType = "debit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = - Math.abs(item.position);
                        runBetPosition[i].realAmount = - Math.abs(item.position);
                    }

                    runBetPosition[i].remark = item?.matchName + " || Premiun fancy ";
                    // runBetPosition[i].userId = uData?.userId;
                    runBetPosition[i].forCommission = 0;
                    runBetPosition[i].isDeclared = true;
                    runBetPosition[i].reportType = 'betfair';
                    runBetPosition[i].betFaireType = 'betfair';
                    runBetPosition[i].reportGenerateDate = moment().format("MM-DD-YYYY");
                    runBetPosition[i].status = 'success';
                    runBetPosition[i].reportName = item?.matchName;
                    runBetPosition[i].matchName = item?.matchName;
                    runBetPosition[i].ip = "Central Panel";
                    runBetPosition[i].gameName = item?.matchName;
                    runBetPosition[i].runnerName = item?.fancyName;
                    runBetPosition[i].winner = wonSelectionId;
                    runBetPosition[i].eventType = item?.eventType;
                    runBetPosition[i].forBet = 1;
                    runBetPosition[i].betAmount = item?.amount;
                });

                const deletedTransactions = await Transaction.find({ eventId, marketId })

                await DeletedTransaction.insertMany(deletedTransactions)

                await Transaction.deleteMany({ eventId, marketId });
                await Transaction.insertMany(runBetPosition);

                // report generate
                const deleteReports = await Report.find({ marketId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ marketId });
                await Report.insertMany(runBetPosition);
            }

            await SessionBet.updateMany({
                _id: { $in: BetIds },
            },
                {
                    $set: {
                        isDeclared: true,
                        status: "completed",
                        decision: wonSelectionId,
                        ip: "Central Panel"
                    }
                });

            await SportBookPremiumFancy.findOneAndUpdate({
                marketId,
                eventId
            },
                {
                    $set: { isDeclared: true, wonSelectionId: wonSelectionId, status: "completed" }
                },
                { returnOriginal: false });

            return res.json(responseData("BetFairResult", {}, req, true));

        }
        catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    betFair: async (req, res) => {
        try {

            let { wonSelectionId, marketId, eventId } = req.body;
            if (!eventId) {
                return res.json(responseData("eventId required", {}, req, false));
            }

            if (!wonSelectionId) {
                return res.json(responseData("wonSelectionId required", {}, req, false));
            }

            if (!marketId) {
                return res.json(responseData("marketId required", {}, req, false));
            }

            // console.log('req?.post?.decisionRun', selectionId, decisionRun);
            // "pending","active",
            const previousBet = await Bet.aggregate([
                {
                    $match: { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] }, betFaireType: "betfair" }
                }
            ]);

            const deletedTransactions = await Transaction.find({ eventId, marketId })

            await DeletedTransaction.insertMany(deletedTransactions)

            await Transaction.deleteMany({ eventId, marketId });

            const runBetPosition = [];
            const previousBets = previousBet ? previousBet : [];
            const BetIds = [];
            previousBets && previousBets.map((item) => {
                BetIds.push(item?._id)
                const bhav = item?.bhav;
                const betType = item?.type;
                const userId = item?.userID;
                const selectionId = item?.selectionId;
                // console.log('decisionRun < item.betRun && betType',item, decisionRun, item.betRun, betType, selectionId)
                let position = 0;
                let betAmount;
                // if (selectionId == wonSelectionId) {
                //     position = Math.abs(item?.profitAmount);
                // } else if (selectionId != wonSelectionId) {
                //     position = - Math.abs(item?.loseAmount);
                // }
                if (selectionId == wonSelectionId) {
                    if(betType == 'back') {
                        position = Math.abs(item?.profitAmount);
                    } else {
                        position = - Math.abs(item?.loseAmount);
                    }
                } else if (selectionId != wonSelectionId) {
                    if(betType == 'back') {
                        position = - Math.abs(item?.amount);
                    } else {
                        position = Math.abs(item?.amount);
                    }
                }

                if (runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId) == -1) {
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);
                    runBetPosition.push({ ...item, position });

                } else {

                    const index = runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId);
                    oldPosition = (runBetPosition[index].position > 0) ? Math.abs(runBetPosition[index].position) : -Math.abs(runBetPosition[index].position);
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);

                    oldPosition += position;

                    runBetPosition[index].position = oldPosition;
                }

                // console.log('position',position, runBetPosition)

            });

            if (BetIds && BetIds.length > 0) {
                runBetPosition && runBetPosition.map((item, i) => {
                    delete runBetPosition[i]._id
                    delete runBetPosition[i].createdAt;
                    delete runBetPosition[i].updatedAt;
                    // console.log('item.position', item.position)
                    // console.log('runBetPosition[i]------',runBetPosition[i])
                    let amount = 0;

                    if (item.position > 0) {
                        runBetPosition[i].transactionType = "credit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = Math.abs(item.position);
                        runBetPosition[i].realAmount = Math.abs(item.position);
                    } else {
                        runBetPosition[i].transactionType = "debit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = - Math.abs(item.position);
                        runBetPosition[i].realAmount = - Math.abs(item.position);
                    }

                    runBetPosition[i].remark = item?.matchName + " || Match Odds ";
                    // runBetPosition[i].userId = uData?.userId;
                    runBetPosition[i].forCommission = 0;
                    runBetPosition[i].isDeclared = true;
                    runBetPosition[i].reportType = 'betfair';
                    runBetPosition[i].betFaireType = 'betfair';
                    runBetPosition[i].reportGenerateDate = moment().format("MM-DD-YYYY");
                    runBetPosition[i].status = 'success';
                    runBetPosition[i].reportName = item?.matchName;
                    runBetPosition[i].matchName = item?.matchName;
                    runBetPosition[i].ip = "Central Panel";
                    runBetPosition[i].gameName = item?.matchName;
                    runBetPosition[i].runnerName = item?.fancyName;
                    runBetPosition[i].winner = wonSelectionId;
                    runBetPosition[i].eventType = item?.eventType;
                    runBetPosition[i].forBet = 1;
                    runBetPosition[i].betAmount = item?.amount;
                });

                const deletedTransactions = await Transaction.find({ eventId, marketId })

                await DeletedTransaction.insertMany(deletedTransactions)

                await Transaction.deleteMany({ eventId, marketId });
                await Transaction.insertMany(runBetPosition);

                // report generate
                const deleteReports = await Report.find({ marketId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ marketId });
                await Report.insertMany(runBetPosition);
            }

            await Bet.updateMany({
                _id: { $in: BetIds },
            },
                {
                    $set: {
                        isDeclared: true,
                        status: "completed",
                        teamSelectionWin: wonSelectionId,
                        ip: "Central Panel"
                    }
                });

            await Match.findOneAndUpdate({
                marketId,
                eventId
            },
                {
                    $set: { isDeclared: true, isBetFairDeclared: true, status: "completed" }
                },
                { returnOriginal: false });

            return res.json(responseData("BetFairResult", {}, req, true));

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    bookmaker: async (req, res) => {
        try {

            let { wonSelectionId, marketId, eventId } = req.body;
            if (!eventId) {
                return res.json(responseData("eventId required", {}, req, false));
            }

            if (!wonSelectionId) {
                return res.json(responseData("wonSelectionId required", {}, req, false));
            }

            if (!marketId) {
                return res.json(responseData("marketId required", {}, req, false));
            }

            // console.log('req?.post?.decisionRun', selectionId, decisionRun);
            // "pending","active",
            const previousBet = await Bet.aggregate([
                {
                    $match: { eventId, marketId, isDeleted: false, status: { $in: ["pending", "active", "completed"] }, betFaireType: "bookmaker" }
                }
            ]);

            const deletedTransactions = await Transaction.find({ eventId, marketId })

            await DeletedTransaction.insertMany(deletedTransactions)

            await Transaction.deleteMany({ eventId, marketId });

            const runBetPosition = [];
            const previousBets = previousBet ? previousBet : [];
            const BetIds = [];
            previousBets && previousBets.map((item) => {
                BetIds.push(item?._id)
                const bhav = item?.bhav;
                const betType = item?.type;
                const userId = item?.userID;
                const selectionId = item?.selectionId;
                // console.log('decisionRun < item.betRun && betType',item, decisionRun, item.betRun, betType, selectionId)
                let position = 0;
                let betAmount;
                if (selectionId == wonSelectionId) {
                    position = Math.abs(item?.profitAmount);
                } else if (selectionId != wonSelectionId) {
                    position = - Math.abs(item?.loseAmount);
                }

                if (runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId) == -1) {
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);
                    runBetPosition.push({ ...item, position });

                } else {

                    const index = runBetPosition.findIndex((a) => a.userId == userId && a.marketId == marketId && a.eventId == eventId);
                    oldPosition = (runBetPosition[index].position > 0) ? Math.abs(runBetPosition[index].position) : -Math.abs(runBetPosition[index].position);
                    position = (position > 0) ? Math.abs(position) : -Math.abs(position);

                    oldPosition += position;

                    runBetPosition[index].position = oldPosition;
                }

                // console.log('position',position, runBetPosition)

            });

            if (BetIds && BetIds.length > 0) {
                runBetPosition && runBetPosition.map((item, i) => {
                    delete runBetPosition[i]._id
                    delete runBetPosition[i].createdAt;
                    delete runBetPosition[i].updatedAt;
                    // console.log('item.position', item.position)
                    // console.log('runBetPosition[i]------',runBetPosition[i])
                    let amount = 0;

                    if (item.position > 0) {
                        runBetPosition[i].transactionType = "credit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = Math.abs(item.position);
                        runBetPosition[i].realAmount = Math.abs(item.position);
                    } else {
                        runBetPosition[i].transactionType = "debit";
                        runBetPosition[i].amount = Math.abs(item.position);
                        runBetPosition[i].realCutAmount = - Math.abs(item.position);
                        runBetPosition[i].realAmount = - Math.abs(item.position);
                    }

                    runBetPosition[i].remark = item?.matchName + " || Bookmaker ";
                    // runBetPosition[i].userId = uData?.userId;
                    runBetPosition[i].forCommission = 0;
                    runBetPosition[i].isDeclared = true;
                    runBetPosition[i].reportType = 'betfair';
                    runBetPosition[i].betFaireType = 'betfair';
                    runBetPosition[i].reportGenerateDate = moment().format("MM-DD-YYYY");
                    runBetPosition[i].status = 'success';
                    runBetPosition[i].reportName = item?.matchName;
                    runBetPosition[i].matchName = item?.matchName;
                    runBetPosition[i].ip = "Central Panel";
                    runBetPosition[i].gameName = item?.matchName;
                    runBetPosition[i].runnerName = item?.fancyName;
                    runBetPosition[i].winner = wonSelectionId;
                    runBetPosition[i].eventType = item?.eventType;
                    runBetPosition[i].forBet = 1;
                    runBetPosition[i].betAmount = item?.amount;
                });

                const deletedTransactions = await Transaction.find({ eventId, marketId })

                await DeletedTransaction.insertMany(deletedTransactions)

                await Transaction.deleteMany({ eventId, marketId });
                await Transaction.insertMany(runBetPosition);

                // report generate
                const deleteReports = await Report.find({ marketId })
                await DeletedReport.insertMany(deleteReports)
                await Report.deleteMany({ marketId });
                await Report.insertMany(runBetPosition);
            }

            await Bet.updateMany({
                _id: { $in: BetIds },
            },
                {
                    $set: {
                        isDeclared: true,
                        status: "completed",
                        teamSelectionWin: wonSelectionId,
                        ip: "Central Panel"
                    }
                });

            await Match.findOneAndUpdate({
                marketId,
                eventId
            },
                {
                    $set: { isDeclared: true, isBetFairDeclared: true, status: "completed" }
                },
                { returnOriginal: false });

            return res.json(responseData("bookmakerResult", {}, req, true));

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
}