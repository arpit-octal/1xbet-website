const { responseData } = require('../../helpers/responseData');
const { gsStatus, categoryType } = require("../../helpers/helper")
const Tournament = require("../../models/tournament.model");
const Match = require("../../models/match.model");
const Fancy = require("../../models/fancy.model");
const FancySet = require("../../models/fancySet.model");
const CasinoBet = require("../../models/casinoBet.model");
const User = require("../../models/user.model");
const globalSettings = require("../../models/globalLimitSetting.model");
const axios = require('axios').default;
const moment = require("moment");
var qs = require('qs');
const async = require('async');
const { ObjectId } = require('mongodb');
const { triggerMethod } = require('../../helpers/socketWork');
const BETFAIRODDS = "http://172.105.54.97:8085";
const Transaction = require("../../models/transaction.model");
const DeletedTransaction = require("../../models/deletedTransaction.model");
const Bet = require('../../models/bet.model');
const SessionBet = require('../../models/sessionBet.model');
const BetPosition = require('../../models/betPosition.model');
const SportBookBet = require('../../models/sportsBookBet.model');
const Report = require('../../models/report.model');
const DeletedReport = require('../../models/deletedReport.model');


module.exports = {

    beForeInPlayUpdate: async (req, res) => {
        try {
            // console.log('sdsad',moment().utc().add('60','minutes').format("YYYY-MM-DD HH:mm:ss"))
            // let matchExist2 = await Match.distinct('eventId', {
            //     status: { $in: ['completed', 'in_play'] },
            //     eventName: { $regex: "T10", $options: 'i' },
            //     eventDateTime: { $gte: new Date(moment().add('-10', 'minutes').format("YYYY-MM-DD HH:mm:ss")) },
            // })

            // if (matchExist2) {
            //     await Match.updateMany({ eventId: { $in: matchExist2 } }, { $set: { isBetFairDeclared: false, status: "active" } });
            // }

            // console.log('matchExist',matchExist2)

            // const t10Match = await Match.distinct('eventId', {
            //     status: { $in: ["in_play", "active", "pending"] },
            //     isBetFairDeclared: false,
            //     eventName: { $regex: "T10", $options: 'i' },
            // });

            let matchExist = await Match.distinct('marketId', {
                // eventId: { $nin: t10Match },
                status: { $in: ["active", "pending"] },
                isBetFairDeclared: false,
                eventDateTime: { $lte: new Date(moment().add(process.env.MATCH_BEFORE_IN_PLAY_TIME, 'minutes').format("YYYY-MM-DD HH:mm:ss")) },
                // eventDateTime: { $lte: new Date(moment().format("YYYY-MM-DD HH:mm:ss")) },
            });
            if (!matchExist) {
                //  console.log('MATCH_DONT_EXIST',MATCH_DONT_EXIST);
                return true;
            }
            async.eachSeries(matchExist, (marketId, callback) => {
                Match.findOneAndUpdate({ marketId }, { $set: { status: "in_play" } })
                    .then(async response => {
                        callback(null);
                    }).catch(error => {
                        // // console.log('error---------mm',error);
                        callback(error)
                    });
                // console.log('eventId', match?.eventId)
                // axios({
                //     method: 'get',
                //     url: `${BETFAIRODDS}/api/GetMarketOdds?market_id=${marketId}`
                // })
                //     .then(async response => {
                //         // console.log('response', response)
                //         await Match.findOneAndUpdate({ marketId }, { $set: { status: "in_play", isTvOn: (response.data && response.data[0] && response.data[0].inplay) ? true : false } });
                //         callback(null);
                //     }).catch(error => {
                //         // // console.log('error---------mm',error);
                //         callback(error)
                //     });

            }, async (error) => {
                if (error) {
                    // console.log('getBetFairSocketData error---------', error);
                }
                // console.log('done fancy all');
            });

            // await Match.updateMany({ eventId: { $in: matchExist } }, { $set: { status: "in_play" } });

        } catch (error) {
            (error) && console.log('ERROR_OCCUR ------', error)
        }
    },

    setExposer: async (req, res) => {
        try {

            let userExist = await User.distinct('_id', { userType: "user", exposure: { $gte: 0 } });

            if (!userExist) {
                // console.log('"TR_DONT_EXIST"',"TR_DONT_EXIST");
                return true;
            }

            async.eachSeries(userExist, (user, callback) => {

                let matchPattern = {
                    isDeclared: false,
                    forBet: 1
                };
                matchPattern.userId = ObjectId(user);

                Transaction.aggregate([
                    {
                        $match: matchPattern
                    },
                    {
                        $group: {
                            _id: null,
                            totalExposureAmount: { $sum: "$realCutAmount" }
                        }
                    }
                ])
                    .then(totalExposure => {
                        Transaction.aggregate([
                            {
                                $match: { userId: ObjectId(user), forCasinoBet: 0 }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalAmount: { $sum: "$realCutAmount" }
                                }
                            }
                        ]).then(totalAMT => {

                            User.findOneAndUpdate({
                                _id: ObjectId(user)
                            },
                                {
                                    $set: {
                                        exposure: totalExposure.length > 0 ? Math.abs(totalExposure[0].totalExposureAmount) : 0,
                                        totalCoins: totalAMT.length > 0 ? totalAMT[0].totalAmount : 0,
                                    }
                                }).then(udata => {
                                    callback(null)
                                })
                                .catch(error => {
                                    callback(error)
                                });

                        })
                            .catch(error => {
                                callback(error)
                            });

                    })
                    .catch(error => {
                        callback(error)
                    });

            }, async (error) => {
                (error) && console.log('error', error);
                // triggerMethod.refreshPage({"status":true});
            });

        } catch (error) {
            console.log('error', error)
        }
    },

    //fancy and bookmaker
    getFancyData: async (req, res) => {
        try {
            // // console.log('fdasda','111');
            let matchExist = await Match.find({
                status: { $in: ['in_play', 'active'] },
                eventType: 4,
                isBetFairDeclared: false
            });
            // console.log("matchExist", matchExist);
            async.eachSeries(matchExist, (match, callback) => {
                // console.log('eventId',match?.eventId)
                const eventId = match?.eventId;
                axios({
                    method: 'get',
                    url: `${BETFAIRODDS}/api/GetSession?eventid=${eventId}`
                })
                    .then(async response => {
                        // console.log('response.data ------------------------', response.data)
                        if (response.data) {
                            const respData = await response.data.map((resp, i) => {
                                return {
                                    "eventId": eventId,
                                    "mid": `${eventId}S${resp.SelectionId}`,
                                    "selectionId": resp?.SelectionId,
                                    "ip": 1,
                                    "mi": `${eventId}S${resp.SelectionId}`,
                                    "ms": gsStatus(resp?.GameStatus),
                                    "eid": resp?.SelectionId,
                                    "grt": null,
                                    "fancyName": resp?.RunnerName,
                                    "name": resp?.RunnerName,
                                    "min": Math.abs(resp?.min),
                                    "max": Math.abs(resp?.max),
                                    "categoryType": Math.abs(resp?.ballsess),
                                    "rt": [
                                        {
                                            "ri": resp?.SelectionId,
                                            "rt": Math.abs(resp?.LayPrice1),
                                            "bv": 0,
                                            "pr": 1,
                                            "af": 0,
                                            "ib": false,
                                            "pt": Math.abs(resp?.LaySize1)
                                        },
                                        {
                                            "ri": resp?.SelectionId,
                                            "rt": Math.abs(resp?.BackPrice1),
                                            "bv": 0,
                                            "pr": 1,
                                            "af": 0,
                                            "ib": true,
                                            "pt": Math.abs(resp?.BackSize1)
                                        }
                                    ]
                                }
                            })
                            triggerMethod.betFairFancy({ result: respData, eventId: eventId });
                            callback(null)

                        } else {
                            triggerMethod.betFairFancy([]);
                            callback(null)
                        }

                    }).catch(error => {
                        // // console.log('error---------mm',error);
                        callback(error)
                    });

            }, async (error) => {
                // console.log('error---------mm', error);
                // console.log('done fancy all');
            });

        } catch (error) {
            // console.log('ERROR_OCCUR ------',error)
        }
    },
    getPremiumFancyData: async (req, res) => {
        try {
            let matchExist = await Match.find({
                status: { $in: ['in_play', 'active'] },
                eventType: 4,
                isBetFairDeclared: false
            });
            async.eachSeries(matchExist, (match, callback) => {
                const eventId = Number(match?.eventId);
                axios({
                    method: 'get',
                    url: `${BETFAIRODDS}/api/getoctalcricket`
                })
                    .then(async response => {
                        if (response.data) {
                            const isPremiumAvailable = await response.data.filter((item) => {
                                if (item.Id === eventId && item.isPremium) {
                                    return item
                                }
                            })
                            if (isPremiumAvailable?.length > 0) {
                                axios({
                                    method: 'get',
                                    url: `http://213.219.37.190/test.php?eventId=${isPremiumAvailable[0].exEventId}`
                                })
                                    .then(async responsePremiumFancy => {
                                        const respData = await responsePremiumFancy.data.map((resp, i) => {
                                            return {
                                                "eventId": eventId,
                                                "mid": `${eventId}S${resp.oddsData.runners[0].selectionId}`,
                                                "selectionId": resp.oddsData.runners[0].selectionId,
                                                "ip": 1,
                                                "mi": `${eventId}S${resp.oddsData.runners[0].selectionId}`,
                                                "ms": gsStatus(resp.oddsData.runners[0].status),
                                                "eid": resp.oddsData.runners[0].selectionId,
                                                "grt": null,
                                                "fancyName": resp?.marketName,
                                                "name": resp?.marketName,
                                                "min": Math.abs(resp?.min),
                                                "max": Math.abs(resp?.max),
                                                "categoryType": 1,
                                                "rt": [
                                                    {
                                                        "ri": resp.oddsData.runners[0].selectionId,
                                                        "rt": Math.abs(resp.oddsData.runners[0].price.lay[0].price),
                                                        "bv": 0,
                                                        "pr": 1,
                                                        "af": 0,
                                                        "ib": false,
                                                        "pt": Math.abs(resp.oddsData.runners[0].price.lay[0].size)
                                                    },
                                                    {
                                                        "ri": resp.oddsData.runners[0].selectionId,
                                                        "rt": Math.abs(resp.oddsData.runners[0].price.back[0].price),
                                                        "bv": 0,
                                                        "pr": 1,
                                                        "af": 0,
                                                        "ib": true,
                                                        "pt": Math.abs(resp.oddsData.runners[0].price.back[0].size)
                                                    }
                                                ]
                                            }
                                        })
                                        triggerMethod.betFairPremiumFancy({ result: respData, eventId: eventId });
                                        callback(null)
                                    }).catch(error => {
                                        callback(error)
                                    });

                            } else {
                                triggerMethod.betFairPremiumFancy([]);
                                callback(null)
                            }

                        } else {
                            triggerMethod.betFairPremiumFancy([]);
                            callback(null)
                        }

                    }).catch(error => {
                        callback(error)
                    });

            }, async (error) => {
                // console.log('error---------mm', error);
            });

        } catch (error) {
            // console.log('ERROR_OCCUR ------', error)
        }
    },

    getBetFairSocketData: async (req, res) => {
        try {


            let matchExist = await Match.find({
                status: { $in: ["in_play", "active"] }
            });

            if (!matchExist) {
                // console.log('MATCH_DONT_EXIST',MATCH_DONT_EXIST);
                return true;
            }
            // // console.log('matchExist',matchExist);
            async.eachSeries(matchExist, (match, callback) => {
                // console.log('eventId', match?.eventId)
                const eventId = match?.marketId;
                axios({
                    method: 'get',
                    url: `${BETFAIRODDS}/api/GetMarketOdds?market_id=${eventId}`
                })
                    .then(async response => {

                        if (response.data && response.data[0] && response.data[0].status !== 'CLOSED') {
                            const respData = await response.data.map((resp, i) => {

                                const temp = [];
                                // console.log('inner-----------', response.data);

                                resp.runners && resp.runners.map((inner, i) => {
                                    // console.log('inner-----------', inner);

                                    if (inner?.ex?.availableToBack && inner?.ex?.availableToBack.length > 0) {
                                        (inner?.ex?.availableToBack[0]) && temp.push({
                                            "ri": inner?.selectionId,
                                            "runnerName": inner?.runner,
                                            "rt": inner?.ex?.availableToBack[0]?.price,
                                            "bv": inner?.ex?.availableToBack[0]?.size,
                                            "ib": true
                                        });

                                        (inner?.ex?.availableToBack[1]) && temp.push({
                                            "ri": inner?.selectionId,
                                            "runnerName": inner?.runner,
                                            "rt": inner?.ex?.availableToBack[1]?.price,
                                            "bv": inner?.ex?.availableToBack[1]?.size,
                                            "ib": true
                                        });

                                        (inner?.ex?.availableToBack[2]) && temp.push({
                                            "ri": inner?.selectionId,
                                            "runnerName": inner?.runner,
                                            "rt": inner?.ex?.availableToBack[2]?.price,
                                            "bv": inner?.ex?.availableToBack[2]?.size,
                                            "ib": true
                                        });
                                    }

                                    if (inner?.ex?.availableToLay && inner?.ex?.availableToLay.length > 0) {
                                        (inner?.ex?.availableToLay[0]) && temp.push({
                                            "ri": inner?.selectionId,
                                            "runnerName": inner?.runner,
                                            "rt": inner?.ex?.availableToLay[0]?.price,
                                            "bv": inner?.ex?.availableToLay[0]?.size,
                                            "ib": false
                                        });

                                        (inner?.ex?.availableToLay[1]) && temp.push({
                                            "ri": inner?.selectionId,
                                            "runnerName": inner?.runner,
                                            "rt": inner?.ex?.availableToLay[1]?.price,
                                            "bv": inner?.ex?.availableToLay[1]?.size,
                                            "ib": false
                                        });

                                        (inner?.ex?.availableToLay[2]) && temp.push({
                                            "ri": inner?.selectionId,
                                            "runnerName": inner?.runner,
                                            "rt": inner?.ex?.availableToLay[2]?.price,
                                            "bv": inner?.ex?.availableToLay[2]?.size,
                                            "ib": false
                                        });
                                    }
                                });

                                return {
                                    "eventId": resp?.eventid,
                                    "bmi": resp?.marketId,
                                    "mi": resp?.marketId,
                                    "ms": gsStatus(resp?.status),
                                    "totalMatched": resp?.totalMatched || 0,
                                    "rt": temp
                                }
                            });
                            // console.log('respData', respData)
                            triggerMethod.getBetFairOdds({ result: respData });
                            callback(null)
                        } else {
                            callback(null)
                        }

                    }).catch(error => {
                        // // console.log('error---------mm',error);
                        callback(error)
                    });

            }, async (error) => {
                if (error) {
                    // console.log('getBetFairSocketData error---------', error);
                }
                // console.log('done fancy all');
            });

        } catch (error) {
            // console.log('ERROR_OCCUR ------',error)
        }
    },

    // updateActiveMatch: async (req, res) => {
    //     try {

    //         let matchExist = await Match.distinct('eventId', {
    //             status: { $ne: 'in_play' },
    //             eventDateTime: { $gt: new Date(moment().format("YYYY-MM-DD HH:mm:ss")), $lt: new Date(moment().add('48', 'hours').format("YYYY-MM-DD HH:mm:ss")) },
    //         });

    //         if (!matchExist) {
    //             console.log('MATCH_DONT_EXIST', MATCH_DONT_EXIST);
    //             return true;
    //         }

    //         console.log('matchExist-----', matchExist)

    //         const data = await Match.updateMany({ eventId: { $in: matchExist } }, { $set: { status: "active" } });

    //         // console.log('data--',data)

    //         // const matchArrIns = [];
    //         // async.eachSeries(matchExist,(match,callback) => {
    //         //     if(match?.eventId){
    //         //         let updateData={};
    //         //         updateData.status = "active";
    //         //         Match.findByIdAndUpdate({
    //         //             _id:ObjectId(match?._id)
    //         //         },
    //         //         {
    //         //             $set:updateData
    //         //         },
    //         //         { returnOriginal: false }).then(item => {
    //         //             callback(null)
    //         //         }).catch(error => {
    //         //             callback(error)
    //         //         });
    //         //     }else{
    //         //         callback(null)
    //         //     }

    //         // },async (error) => {
    //         //         (error) && console.log('error -------',error)
    //         //         console.log('done updateCentralID all');
    //         // });

    //     } catch (error) {
    //         console.log('ERROR_OCCUR - SAVE_BOOKMAKER_DATA', error);
    //     }
    // }

    //Auto result declare
    autoResultDeclare: async (req, res) => {
        try {

            const matchList = await Match.find({ status: "in_play" }).select({ eventId: 1, marketId: 1 })
            async.eachSeries(matchList, (match, callback) => {
                let marketId = match.marketId
                let eventId = match.eventId
                let wonSelectionId = ''

                axios({
                    method: 'get',
                    url: `http://172.105.54.97:8085/api/betfair/getresultmarket?market_id=${marketId}`
                }).then(async (response) => {
                    if (response?.data && response?.data[0]?.status === 'CLOSED') {
                        const winner = response?.data[0]?.runners.filter((item) => {
                            return item?.status === 'WINNER'
                        })

                        if (winner.length > 0) {
                            wonSelectionId = winner[0].selectionId

                            if (!eventId) {
                                return res.json(responseData("eventId required", {}, req, false));
                            }

                            if (!wonSelectionId) {
                                return res.json(responseData("wonSelectionId required", {}, req, false));
                            }

                            if (!marketId) {
                                return res.json(responseData("marketId required", {}, req, false));
                            }

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
                                const betType = item?.betType;
                                const userId = item?.userID;
                                const selectionId = item?.selectionId;
                                // console.log('decisionRun < item.betRun && betType',item, decisionRun, item.betRun, betType, selectionId)
                                let position = 0;
                                let betAmount;
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
                                    $set: { isDeclared: true, isBetFairDeclared: true, status: "completed", winner: wonSelectionId }
                                },
                                { returnOriginal: false });

                            callback(null)
                        } else {
                            // const query = await Match.findOneAndUpdate({
                            //     eventId
                            // },
                            //     {
                            //         $set: { status: 'abounded', isBetFairDeclared: true }
                            //     },
                            //     { returnOriginal: false });

                            // await Transaction.deleteMany({ eventId });
                            // await Report.deleteMany({ eventId });

                            // await SessionBet.deleteMany({ eventId });
                            // await Bet.deleteMany({ eventId });
                            // await BetPosition.deleteMany({ eventId });
                            // await SportBookBet.deleteMany({ eventId });

                            callback(null)
                        }

                    } else {
                        callback(null)
                    }
                })
                    .catch((err) => {
                        console.log("err:", err)
                    })
            }, async (error) => {

                if (error) {
                    console.log("ERROR_OCCUR_IN_AUTO_RESULT", error);
                } else {
                    console.log("AUTO_RESULT_DECLARED")
                }
            })

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    rollbackCasinoAmount: async (req, res) => {
        try {
            const today = new Date();
            const eightHourAgo = new Date(today);
            eightHourAgo.setHours(today.getHours() - 8);
            const casinoBet = await CasinoBet.find({createdAt: { $lte: eightHourAgo}, status: 'bet'})
            async.eachSeries(casinoBet, async (bet, callback) => {
                // console.log("bet?.userId",bet?.userId)
                const userDetails = await User.findOne({ _id: bet?.userId })
                const userUpdatedBalance = userDetails?.totalCoins + Number(bet.betAmount)

                //console.log("tester",Math.abs(Number(bet?.betAmount || 0)),userUpdatedBalance)

                const transactionObj = {
                    gameType: 'casino',
                    transactionType: 'credit',
                    userId: userDetails?._id,
                    amount: Number(bet?.betAmount) || 0,
                    status: 'success',
                    eventType: '-1',
                    realCutAmount: Math.abs(Number(bet?.betAmount)) || 0,
                    oldBalance: Number(userDetails?.totalCoins),
                    newBalance: Number(userUpdatedBalance)
                }
                console.log("rollback--------->")
                console.log("transactionObj",transactionObj,bet)
                await Transaction.create(transactionObj)
                await User.findOneAndUpdate({ _id: userDetails._id }, { $set: { totalCoins: userUpdatedBalance } })
                await CasinoBet.findOneAndUpdate({ _id: bet._id }, { $set: { status: 'rollback', amount: 0, profitLossAmount: 0 }})
                //callback(null)
            }, async (error) => {
                if (error) {
                    console.log("ERROR_OCCUR_IN_AUTO_RESULT", error);
                } else {
                    console.log("CASINO_ROLLBACK_DONE")
                }
            })

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }
}