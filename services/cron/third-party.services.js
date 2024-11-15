const { responseData } = require('../../helpers/responseData');
const Tournament = require("../../models/tournament.model");
const Match = require("../../models/match.model");
const User = require("../../models/user.model");
const CasinoBet = require("../../models/casinoBet.model");
const Fancy = require("../../models/fancy.model");
const FancySet = require("../../models/fancySet.model");
const SessionBet = require("../../models/sessionBet.model");
const moment = require("moment");
const axios = require('axios').default;
var qs = require('qs');
const async = require('async');
const { ObjectId } = require('mongodb');
const { triggerMethod } = require('../../helpers/socketWork');

const host = "https://central3.satsport248.com"
const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGlkIjoiOWJldCIsImRhdGV0aW1lIjoxNjc5NDk2Mzg3OTkxLCJpYXQiOjE2Nzk0OTYzODd9.iVj6j-gOfLFxcuBhY6XXjlpUG1ZGv9YbAwZt_W2qsGg"
const apiPath = 'https://tttint.onlinegames22.com/';
const agent = 'cricinfotech';
const cert = 'md4It4TXGn3xTUxRZ1d';


//@manish sir
// const betFairOdds = "http://139.144.6.99:8085";
const betFairOdds = "http://172.105.54.97:8085";

const Transaction = require('../../models/transaction.model');
const { gsStatus, categoryType } = require("../../helpers/helper");

module.exports = {
    soccer_tournament_match: async (req, res) => {
        try {

            let sport = 1;

            let matchExist = await Match.distinct('eventId');

            const response = await axios({
                method: 'get',
                // url: `${betFairHost}/listEventsBySport/${sport}`
                url: `http://170.187.254.122:7070/api/v2/octal/match-list?sport_id=${sport}`
            });

            let matchArrIns = [];
            let tournamentArr = []
            async.eachSeries(response.data, (item, callback) => {
                const gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';
                const eventType = (item.sport).toLowerCase() == 'cricket' ? "4" : (item.sport).toLowerCase() == 'tennis' ? "2" : (item.sport).toLowerCase() == "soccer" ? '1' : 'Invalid';
                const eventDateParsed = item.openDate;
                const competitionId = item.competitionId || "0";
                if (tournamentArr.findIndex((a) => a.seriesId == competitionId) == -1) {
                    tournamentArr.push({
                        gameType,
                        sportBetFairId: sport,
                        seriesId: item.competitionId || "0",
                        seriesName: item.competitionName || "Others",
                    })
                }

                if (matchExist.findIndex((a) => a == item.Id) == -1) {
                    axios({
                        method: 'get',
                        // url: `${betFairHost}/listMarkets/${item.Id}`
                        // url: `http://139.144.6.99:8085/api/geRunners?MarketID=${item.marketId}`
                        url: `http://172.105.54.97:8085/api/geRunners?MarketID=${item.marketId}`
                    }).then(marketData => {
                        let marketMatchOdds = marketData?.data && marketData?.data.find(({ marketName }) => marketName == 'Match Odds')
                        if (marketMatchOdds) {
                            const runners = marketMatchOdds.runners && marketMatchOdds.runners.map((lit, i) => {
                                return { "SelectionId": lit?.selectionId, "RunnerName": lit?.runnerName }
                            });
                            matchArrIns.push({
                                hasFancy: item.hasFancy,
                                seriesId: item.competitionId || "0",
                                eventId: item.Id,
                                eventName: item.name,
                                gameType,
                                countryCode: item.countryCode,
                                timeZone: item.timezone,
                                eventDateTime: new Date(eventDateParsed),
                                status: "pending",
                                eventType,
                                marketCount: runners.length,
                                marketId: marketMatchOdds.marketId,
                                centralizedId: item.Id,
                                MarketTime: new Date(eventDateParsed),
                                SuspendTime: new Date(eventDateParsed),
                                jsonData: runners,
                                totalMatched: marketMatchOdds.totalMatched,
                            });

                            callback(null);
                        } else {
                            callback(null);
                        }
                    })
                        .catch(error => {
                            callback(error)
                        })
                } else {
                    callback(null)
                }
            }, async (error) => {

                if (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }
                await Tournament.deleteMany({
                    sportBetFairId: sport
                });
                await Tournament.insertMany(tournamentArr);
                await Match.insertMany(matchArrIns);
                return res.json(responseData("GET_LIST_MATCH", matchArrIns, req, true));
            })

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    tennis_tournament_match: async (req, res) => {
        try {

            let sport = 2;

            let matchExist = await Match.distinct('eventId');

            const response = await axios({
                method: 'get',
                // url: `${betFairHost}/listEventsBySport/${sport}`
                url: `http://170.187.254.122:7070/api/v2/octal/match-list?sport_id=${sport}`
            });

            let matchArrIns = [];
            let tournamentArr = []

            async.eachSeries(response.data, (item, callback) => {
                const gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';
                const eventType = (item.sport).toLowerCase() == 'cricket' ? "4" : (item.sport).toLowerCase() == 'tennis' ? "2" : (item.sport).toLowerCase() == "soccer" ? '1' : 'Invalid';
                const eventDateParsed = item.openDate;
                const competitionId = item.competitionId || "0";
                if (tournamentArr.findIndex((a) => a.seriesId == competitionId) == -1) {
                    tournamentArr.push({
                        gameType,
                        sportBetFairId: sport,
                        seriesId: item.competitionId || "0",
                        seriesName: item.competitionName || "Others",
                    })
                }

                if (matchExist.findIndex((a) => a == item.Id) == -1) {
                    axios({
                        method: 'get',
                        // url: `${betFairHost}/listMarkets/${item.Id}`
                        // url: `http://139.144.6.99:8085/api/geRunners?MarketID=${item.marketId}`
                        url: `http://172.105.54.97:8085/api/geRunners?MarketID=${item.marketId}`
                    }).then(marketData => {
                        let marketMatchOdds = marketData?.data && marketData?.data?.find(({ marketName }) => marketName == 'Match Odds')
                        if (marketMatchOdds) {
                            const runners = marketMatchOdds.runners && marketMatchOdds.runners.map((lit, i) => {
                                return { "SelectionId": lit?.selectionId, "RunnerName": lit?.runnerName }
                            });
                            matchArrIns.push({
                                hasFancy: item.hasFancy,
                                seriesId: item.competitionId || "0",
                                eventId: item.Id,
                                eventName: item.name,
                                gameType,
                                countryCode: item.countryCode,
                                timeZone: item.timezone,
                                eventDateTime: new Date(eventDateParsed),
                                status: "pending",
                                eventType,
                                marketCount: runners.length,
                                marketId: marketMatchOdds.marketId,
                                centralizedId: item.Id,
                                MarketTime: new Date(eventDateParsed),
                                SuspendTime: new Date(eventDateParsed),
                                jsonData: runners,
                                totalMatched: marketMatchOdds.totalMatched,
                            });

                            callback(null);
                        } else {
                            callback(null);
                        }
                    })
                        .catch(error => {
                            callback(error)
                        })
                } else {
                    callback(null)
                }
            }, async (error) => {

                if (error) {
                    console.log('error:', error)
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }
                await Tournament.deleteMany({
                    sportBetFairId: sport
                });
                await Tournament.insertMany(tournamentArr);
                await Match.insertMany(matchArrIns);
                return res.json(responseData("GET_LIST_MATCH", matchArrIns, req, true));
            })

        } catch (error) {
            console.log('error---', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    cricket_tournament_match: async (req, res) => {
        try {

            let sport = 4;

            let matchExist = await Match.distinct('eventId');

            const response = await axios({
                method: 'get',
                // url: `${betFairOdds}/listEventsBySport/${sport}`
                url: `http://170.187.254.122:7070/api/v2/octal/match-list?sport_id=${sport}`
            });

            let matchArrIns = [];
            let tournamentArr = []

            async.eachSeries(response.data, (item, callback) => {
                const gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';
                const eventType = (item.sport).toLowerCase() == 'cricket' ? "4" : (item.sport).toLowerCase() == 'tennis' ? "2" : (item.sport).toLowerCase() == "1" ? 'soccer' : 'Invalid';
                const eventDateParsed = item.openDate;
                const competitionId = item.competitionId || "0";
                if (tournamentArr.findIndex((a) => a.seriesId == competitionId) == -1) {
                    tournamentArr.push({
                        gameType,
                        sportBetFairId: sport,
                        seriesId: item.competitionId || "0",
                        seriesName: item.competitionName || "Others",
                    })
                }

                if (matchExist.findIndex((a) => a == item.Id) == -1) {
                    axios({
                        method: 'get',
                        url: `http://172.105.54.97:8085/api/geRunners?MarketID=${item.marketId}`
                    }).then(marketData => {
                        let marketMatchOdds = marketData?.data && marketData?.data.find(({ marketName }) => marketName == 'Match Odds')
                        if (marketMatchOdds) {
                            const runners = marketMatchOdds.runners && marketMatchOdds.runners.map((lit, i) => {
                                return { "SelectionId": lit?.selectionId, "RunnerName": lit?.runnerName }
                            });
                            matchArrIns.push({
                                hasFancy: item.hasFancy,
                                seriesId: item.competitionId || "0",
                                eventId: item.Id,
                                eventName: item.name,
                                gameType,
                                countryCode: item.countryCode,
                                timeZone: item.timezone,
                                eventDateTime: new Date(eventDateParsed),
                                status: "pending",
                                eventType,
                                marketCount: runners.length,
                                marketId: marketMatchOdds.marketId,
                                centralizedId: item.Id,
                                MarketTime: new Date(eventDateParsed),
                                SuspendTime: new Date(eventDateParsed),
                                jsonData: runners,
                                totalMatched: marketMatchOdds.totalMatched,
                            });

                            callback(null);
                        } else {
                            callback(null);
                        }
                    })
                        .catch(error => {
                            callback(error)
                        })
                } else {
                    callback(null)
                }
            }, async (error) => {

                if (error) {
                    console.log('error---', error)
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }
                await Tournament.deleteMany({
                    sportBetFairId: sport
                });
                await Tournament.insertMany(tournamentArr);
                await Match.insertMany(matchArrIns);
                return res.json(responseData("GET_LIST_MATCH", matchArrIns, req, true));
            })

        } catch (error) {
            console.log('error---', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_tournament_list: async (req, res) => {
        try {
            return res.json(responseData("SUCCESS", {}, req, true));
            const {
                sport
            } = req.query

            await Tournament.deleteMany({
                sportBetFairId: sport
            });

            const response = await axios({
                method: 'post',
                url: `${betFairOdds}/api/getCompetitions?id=${sport}`,
            });

            let tournArrIns = []
            let gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';

            async.eachSeries(response.data, (item, callback) => {
                tournArrIns.push({
                    gameType: gameType,
                    sportBetFairId: sport,
                    seriesId: item.competition.Id,
                    seriesName: item.competition.name,
                })
                callback(null)
            }, async (error) => {

                if (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }
                const resp = await Tournament.insertMany(tournArrIns);

                return res.json(responseData("GET_LIST_TOURNAMENT", resp, req, true));
            })

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_match_list: async (req, res) => {
        try {
            const {
                seriesId
            } = req.query

            let tournamentExist = await Tournament.findOne({
                seriesId: seriesId
            })

            if (!tournamentExist) {
                return res.json(responseData("TOURNAMENT_DONT_EXIST", {}, req, false));
            }

            const bodyOption = {
                "access_token": access_token,
                "strEventTypeId": tournamentExist?.sportBetFairId,
                "strCompetitionId": seriesId
            };

            const matchData = await axios({
                method: 'post',
                url: `${host}/api/get_match_list`,
                data: bodyOption
            });

            let matchArrIns = [];

            async.eachSeries(matchData.data, (item, callback) => {

                Match.findOne({
                    seriesId: seriesId,
                    eventId: item.Event.Id
                })
                    .then(data => {
                        if (data) {

                            let bodyOption = {
                                'access_token': access_token,
                                "strEventID": item.Event.Id
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/get_market_list`,
                                data: bodyOption
                            })
                                .then(marketData => {

                                    marketData = marketData.data

                                    let marketMatchOdds = marketData.find(({ MarketName }) => MarketName == 'Match Odds');

                                    if (marketMatchOdds) {
                                        let bodyOption = {
                                            'access_token': access_token,
                                            "sport_id": "4",
                                            "event_id": item.Event.Id,
                                            "market_id": marketMatchOdds.MarketId,
                                            "tournament_id": seriesId
                                        };

                                        axios({
                                            method: 'post',
                                            url: `${host}/api/import_market`,
                                            data: bodyOption
                                        }).then(importMarketData => {

                                            // console.log('importMarketData?.data?.data?.centralID',item.Event.Id, importMarketData?.data?.data?.centralID)
                                            let str = item.Event.OpenDate;
                                            let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                                            let strMarketTime = marketMatchOdds?.Description.MarketTime;
                                            let MarketTimeParsed = parseInt(strMarketTime.replace(/[^0-9]/g, ""));

                                            let strSuspendTime = marketMatchOdds?.Description.SuspendTime;
                                            let SuspendTimeParsed = parseInt(strSuspendTime.replace(/[^0-9]/g, ""));

                                            let marketDataToBeUpdated = {
                                                gameType: tournamentExist.gameType,
                                                tournamentId: tournamentExist._id,
                                                eventName: item.Event.Name,
                                                countryCode: item.Event.CountryCode,
                                                venue: item.Event.Venue,
                                                timeZone: item.Event.Timezone,
                                                eventDateTime: new Date(eventDateParsed),
                                                marketCount: marketMatchOdds.Runners.length,
                                                marketId: marketMatchOdds.MarketId,
                                                centralizedId: importMarketData?.data?.data?.centralID,
                                                IsMarketDataDelayed: marketMatchOdds.IsMarketDataDelayed,
                                                MarketTime: new Date(MarketTimeParsed),
                                                SuspendTime: new Date(SuspendTimeParsed),
                                                jsonData: marketMatchOdds.Runners,
                                                status: "pending",
                                            }

                                            Match.updateOne({
                                                seriesId: data.seriesId,
                                                eventId: data.eventId
                                            }, {
                                                $set: marketDataToBeUpdated
                                            });

                                            let bodyOption = {
                                                'access_token': access_token,
                                                "strEventID": item.Event.Id,
                                                "strCompetitionId": tournamentExist.seriesId,
                                            }

                                            axios({
                                                method: 'post',
                                                url: `${host}/api/get_bookmaker_list`,
                                                data: bodyOption
                                            })
                                                .then(fancyData => {

                                                    if (fancyData?.data?.appdata && fancyData?.data?.appdata.length > 0) {
                                                        fancyData = fancyData?.data?.appdata
                                                        let marketMatchBookmakerOdds = fancyData.find(({ marketName, marketTypeName }) => marketName == "BOOKMAKER 0 SEC NO COMM" && marketTypeName === "MANUAL_ODDS");
                                                        // console.log('marketMatchBookmakerOdds',marketMatchBookmakerOdds);
                                                        if (marketMatchBookmakerOdds) {

                                                            let bodyOption = {
                                                                'access_token': access_token,
                                                                "sport_id": "4",
                                                                "event_id": item.Event.Id,
                                                                "market_id": marketMatchBookmakerOdds.marketID,
                                                                "tournament_id": data.seriesId
                                                            };

                                                            axios({
                                                                method: 'post',
                                                                url: `${host}/api/import_market`,
                                                                data: bodyOption
                                                            }).then(importBookmakerMarketData => {

                                                                // console.log('importBookmakerMarketData?.data?.data?.centralID',item.Event.Id, importBookmakerMarketData?.data?.data?.centralID)
                                                                let marketDataToBeUpdated = {
                                                                    bookmakerMarketId: marketMatchBookmakerOdds.marketID,
                                                                    jsonBookmakerData: marketMatchOdds.runner,
                                                                    bookmakerCentralizedId: importBookmakerMarketData?.data?.data?.centralID
                                                                }

                                                                Match.updateOne({
                                                                    seriesId: data.seriesId,
                                                                    eventId: data.eventId
                                                                }, {
                                                                    $set: marketDataToBeUpdated
                                                                })
                                                                    .then(resp => {
                                                                        callback(null)
                                                                    })
                                                                    .catch(error => {
                                                                        console.log('error0', error);
                                                                        callback(error)
                                                                    });
                                                            }).catch(error => {
                                                                console.log('error31111111', error);
                                                                callback(error)
                                                            });

                                                        } else {
                                                            callback(null)
                                                        }

                                                    } else {
                                                        callback(null)
                                                    }

                                                })
                                                .catch(error => {
                                                    console.log('error2', error);
                                                    callback(error)
                                                })
                                        }).catch(error => {
                                            console.log('error3111', error);
                                            callback(error)
                                        });

                                    } else {
                                        callback(null)
                                    }

                                })
                                .catch(error => {
                                    console.log('error3', error);
                                    callback(error)
                                })

                        } else {

                            let bodyOption = {
                                'access_token': access_token,
                                "strEventID": item.Event.Id
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/get_market_list`,
                                data: bodyOption
                            }).then(marketData => {

                                marketData = marketData.data

                                let marketMatchOdds = marketData.find(({ MarketName }) => MarketName == 'Match Odds')

                                if (marketMatchOdds) {

                                    let bodyMarketOption = {
                                        'access_token': access_token,
                                        "sport_id": "4",
                                        "event_id": item.Event.Id,
                                        "market_id": marketMatchOdds.MarketId,
                                        "tournament_id": seriesId
                                    };

                                    axios({
                                        method: 'post',
                                        url: `${host}/api/import_market`,
                                        data: bodyMarketOption
                                    }).then(importMarketData => {

                                        // console.log('insert importMarketData?.data?.data?.centralID',item.Event.Id, importMarketData?.data?.data?.centralID)

                                        let str = item.Event.OpenDate;
                                        let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                                        let strMarketTime = marketMatchOdds.Description.MarketTime;
                                        let MarketTimeParsed = parseInt(strMarketTime.replace(/[^0-9]/g, ""));

                                        let strSuspendTime = marketMatchOdds.Description.SuspendTime;
                                        let SuspendTimeParsed = parseInt(strSuspendTime.replace(/[^0-9]/g, ""));

                                        let marketDataToBeUpdated = {
                                            seriesId: seriesId,
                                            eventId: item.Event.Id,
                                            gameType: tournamentExist.gameType,
                                            tournamentId: tournamentExist._id,
                                            eventName: item.Event.Name,
                                            countryCode: item.Event.CountryCode,
                                            venue: item.Event.Venue,
                                            timeZone: item.Event.Timezone,
                                            eventDateTime: new Date(eventDateParsed),
                                            marketCount: marketMatchOdds.Runners.length,
                                            marketId: marketMatchOdds.MarketId,
                                            centralizedId: importMarketData?.data?.data?.centralID,
                                            IsMarketDataDelayed: marketMatchOdds.IsMarketDataDelayed,
                                            MarketTime: new Date(MarketTimeParsed),
                                            SuspendTime: new Date(SuspendTimeParsed),
                                            jsonData: marketMatchOdds.Runners,
                                            status: "active",
                                        }

                                        let bodyOption = {
                                            'access_token': access_token,
                                            "strEventID": item.Event.Id
                                        }

                                        axios({
                                            method: 'post',
                                            url: `${host}/api/get_bookmaker_list`,
                                            data: bodyOption
                                        })
                                            .then(fancyData => {
                                                fancyData = fancyData?.data?.appdata

                                                let marketMatchBookmakerOdds = fancyData.find(({ marketName, marketTypeName }) => marketName == "BOOKMAKER 0 SEC NO COMM" && marketTypeName === "MANUAL_ODDS");
                                                // console.log('marketMatchBookmakerOdds',marketMatchBookmakerOdds);
                                                if (marketMatchBookmakerOdds) {

                                                    let bodyOption = {
                                                        'access_token': access_token,
                                                        "sport_id": "4",
                                                        "event_id": item.Event.Id,
                                                        "market_id": marketMatchBookmakerOdds.marketID,
                                                        "tournament_id": seriesId
                                                    };

                                                    axios({
                                                        method: 'post',
                                                        url: `${host}/api/import_market`,
                                                        data: bodyOption
                                                    }).then(importBookmakerMarketData => {

                                                        // console.log('insert importBookmakerMarketData?.data?.data?.centralID',item.Event.Id, importBookmakerMarketData?.data?.data?.centralID)
                                                        marketDataToBeUpdated.bookmakerMarketId = marketMatchBookmakerOdds.marketID;
                                                        marketDataToBeUpdated.jsonBookmakerData = marketMatchBookmakerOdds.runner;
                                                        marketDataToBeUpdated.bookmakerCentralizedId = importBookmakerMarketData?.data?.data?.centralID;

                                                        matchArrIns.push(marketDataToBeUpdated);

                                                        callback(null)

                                                    }).catch(error => {
                                                        console.log('error5', error);
                                                        callback(error)
                                                    });

                                                } else {

                                                    marketDataToBeUpdated.bookmakerMarketId = null
                                                    marketDataToBeUpdated.jsonBookmakerData = null;
                                                    marketDataToBeUpdated.bookmakerCentralizedId = null;
                                                    matchArrIns.push(marketDataToBeUpdated)
                                                    callback(null)
                                                }
                                            })
                                            .catch(error => {
                                                console.log('error5', error);
                                                callback(error)
                                            })

                                    }).catch(error => {
                                        console.log('error5', error);
                                        callback(error)
                                    })
                                } else {
                                    callback(null)
                                }
                            })
                                .catch(error => {
                                    console.log('error6', error);
                                    callback(error)
                                })
                        }
                    })
                    .catch(error => {
                        console.log('error7', error);
                        callback(error)
                    })

            }, async (error) => {
                // console.log('matchArrIns',matchArrIns);
                await Match.insertMany(matchArrIns)

                if (error) {
                    // console.log('error8',error);
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                return res.json(responseData("GET_LIST_MATCH", matchData.data, req, true));
            })

        } catch (error) {
            console.log('error9', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_soccer_list: async (req, res) => {
        try {
            const {
                seriesId
            } = req.query

            let tournamentExist = await Tournament.findOne({
                seriesId: seriesId
            })

            if (!tournamentExist) {
                return res.json(responseData("TOURNAMENT_DONT_EXIST", {}, req, false));
            }

            bodyOption = {
                'access_token': access_token,
                'strEventTypeId': "1",
                "strCompetitionId": seriesId
            }

            const matchData = await axios({
                method: 'post',
                url: `${host}/api/get_match_list`,
                data: bodyOption
            });

            let matchArrIns = [];

            async.eachSeries(matchData.data, (item, callback) => {

                let bodyOption = {
                    'access_token': access_token,
                    "strEventID": item.Event.Id
                }

                axios({
                    method: 'post',
                    url: `${host}/api/get_market_list`,
                    data: bodyOption
                }).then(marketData => {

                    marketData = marketData.data

                    let marketMatchOdds = marketData.find(({ MarketName }) => MarketName == 'Match Odds')

                    if (marketMatchOdds) {

                        let bodyMarketOption = {
                            'access_token': access_token,
                            "sport_id": "1",
                            "event_id": item.Event.Id,
                            "market_id": marketMatchOdds.MarketId,
                            "tournament_id": seriesId
                        };

                        axios({
                            method: 'post',
                            url: `${host}/api/import_market`,
                            data: bodyMarketOption
                        }).then(importMarketData => {

                            console.log('insert importMarketData?.data?.data?.centralID', item.Event.Id, importMarketData?.data?.data?.centralID)

                            let str = item.Event.OpenDate;
                            let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                            let strMarketTime = marketMatchOdds.Description.MarketTime;
                            let MarketTimeParsed = parseInt(strMarketTime.replace(/[^0-9]/g, ""));

                            let strSuspendTime = marketMatchOdds.Description.SuspendTime;
                            let SuspendTimeParsed = parseInt(strSuspendTime.replace(/[^0-9]/g, ""));

                            let marketDataToBeUpdated = {
                                seriesId: seriesId,
                                eventId: item.Event.Id,
                                gameType: tournamentExist.gameType,
                                tournamentId: tournamentExist._id,
                                eventName: item.Event.Name,
                                countryCode: item.Event.CountryCode,
                                venue: item.Event.Venue,
                                timeZone: item.Event.Timezone,
                                eventDateTime: new Date(eventDateParsed),
                                marketCount: marketMatchOdds.Runners.length,
                                marketId: marketMatchOdds.MarketId,
                                centralizedId: importMarketData?.data?.data?.centralID,
                                IsMarketDataDelayed: marketMatchOdds.IsMarketDataDelayed,
                                MarketTime: new Date(MarketTimeParsed),
                                SuspendTime: new Date(SuspendTimeParsed),
                                jsonData: marketMatchOdds.Runners,
                                status: "active",
                                eventType: "1"
                            }

                            matchArrIns.push(marketDataToBeUpdated);

                            callback(null)

                        }).catch(error => {
                            console.log('error5', error);
                            callback(error)
                        })
                    } else {
                        callback(null)
                    }
                })
                    .catch(error => {
                        console.log('error6', error);
                        callback(error)
                    })

            }, async (error) => {
                // console.log('matchArrIns',matchArrIns);
                await Match.insertMany(matchArrIns)

                if (error) {
                    // console.log('error8',error);
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                return res.json(responseData("GET_LIST_MATCH", matchData.data, req, true));
            });

        } catch (error) {
            console.log('error9', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_tennis_list: async (req, res) => {
        try {
            const {
                seriesId
            } = req.query

            let tournamentExist = await Tournament.findOne({
                seriesId: seriesId
            })

            if (!tournamentExist) {
                return res.json(responseData("TOURNAMENT_DONT_EXIST", {}, req, false));
            }

            bodyOption = {
                'access_token': access_token,
                'strEventTypeId': "2",
                "strCompetitionId": seriesId
            }

            const matchData = await axios({
                method: 'post',
                url: `${host}/api/get_match_list`,
                data: bodyOption
            });

            let matchArrIns = [];

            async.eachSeries(matchData.data, (item, callback) => {

                let bodyOption = {
                    'access_token': access_token,
                    "strEventID": item.Event.Id
                }

                axios({
                    method: 'post',
                    url: `${host}/api/get_market_list`,
                    data: bodyOption
                }).then(marketData => {

                    marketData = marketData.data

                    let marketMatchOdds = marketData.find(({ MarketName }) => MarketName == 'Match Odds')

                    if (marketMatchOdds) {

                        let bodyMarketOption = {
                            'access_token': access_token,
                            "sport_id": "4",
                            "event_id": item.Event.Id,
                            "market_id": marketMatchOdds.MarketId,
                            "tournament_id": seriesId
                        };

                        axios({
                            method: 'post',
                            url: `${host}/api/import_market`,
                            data: bodyMarketOption
                        }).then(importMarketData => {

                            // console.log('insert importMarketData?.data?.data?.centralID',item.Event.Id, importMarketData?.data?.data?.centralID)

                            let str = item.Event.OpenDate;
                            let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                            let strMarketTime = marketMatchOdds.Description.MarketTime;
                            let MarketTimeParsed = parseInt(strMarketTime.replace(/[^0-9]/g, ""));

                            let strSuspendTime = marketMatchOdds.Description.SuspendTime;
                            let SuspendTimeParsed = parseInt(strSuspendTime.replace(/[^0-9]/g, ""));

                            let marketDataToBeUpdated = {
                                seriesId: seriesId,
                                eventId: item.Event.Id,
                                gameType: tournamentExist.gameType,
                                tournamentId: tournamentExist._id,
                                eventName: item.Event.Name,
                                countryCode: item.Event.CountryCode,
                                venue: item.Event.Venue,
                                timeZone: item.Event.Timezone,
                                eventDateTime: new Date(eventDateParsed),
                                marketCount: marketMatchOdds.Runners.length,
                                marketId: marketMatchOdds.MarketId,
                                centralizedId: importMarketData?.data?.data?.centralID,
                                IsMarketDataDelayed: marketMatchOdds.IsMarketDataDelayed,
                                MarketTime: new Date(MarketTimeParsed),
                                SuspendTime: new Date(SuspendTimeParsed),
                                jsonData: marketMatchOdds.Runners,
                                status: "active",
                                eventType: "2"
                            }

                            matchArrIns.push(marketDataToBeUpdated);

                            callback(null)

                        }).catch(error => {
                            console.log('error5', error);
                            callback(error)
                        })
                    } else {
                        callback(null)
                    }
                })
                    .catch(error => {
                        console.log('error6', error);
                        callback(error)
                    })

            }, async (error) => {
                // console.log('matchArrIns',matchArrIns);
                await Match.insertMany(matchArrIns)

                if (error) {
                    // console.log('error8',error);
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                return res.json(responseData("GET_LIST_MATCH", matchData.data, req, true));
            });

        } catch (error) {
            console.log('error9', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    save_match_bookmaker_list: async (req, res) => {
        try {

            const {
                eventId
            } = req.query

            let matchExist = await Match.findOne({
                eventId
            })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            if (req?.query?.type == "Diamond") {
                await Match.findOneAndUpdate({
                    eventId
                },
                    {
                        $set: { bookmakerType: "diamond" }
                    },
                    { returnOriginal: false });

                let bodyOption = {
                    'access_token': access_token,
                    'strEventID': eventId
                }

                axios({
                    method: 'post',
                    url: `https://apipro.in/V2/api?ApiType=bookmaker&event_id=${eventId}`,
                    data: bodyOption
                })
                    .then(response => {

                        const fancyData = JSON.parse(response.data?.data);
                        console.log('bookmaker t2', fancyData?.t2)
                        return res.json(responseData("NO_BOOKMAKER_DATA", {}, req, false));
                        // async.eachSeries(fancyData?.t3,(fancyDataItem,callback) => {
                        //     console.log('fancyDataItem',fancyDataItem)
                        //     fancyArray.push({
                        //         tournamentId: ObjectId(matchExist.tournamentId),
                        //         matchId: ObjectId(matchExist._id),
                        //         matchName: matchExist.eventName,
                        //         seriesId: matchExist.seriesId,
                        //         eventId: matchExist.eventId,
                        //         marketId: fancyDataItem.mid,
                        //         centralizedId:fancyDataItem.sid,
                        //         selectionId:fancyDataItem.sid,
                        //         fancyId: fancyDataItem.sid,
                        //         fancyName: fancyDataItem.nat,
                        //         eventDateTime: matchExist.eventDateTime,
                        //         marketCount: fancyDataItem.srno,
                        //         jsonData: fancyDataItem,
                        //         marketType: fancyDataItem?.marketType,
                        //         categoryType: fancyDataItem?.categoryType,
                        //         status: "open",
                        //         isDeleted: false,
                        //     });
                        //     callback(null)
                        // },async (error) => {

                        //     console.log('fancyArray',fancyArray);
                        //     if(error){

                        //         return res.json(responseData("ERROR_OCCUR", error, req, false));
                        //     }
                        //     if(fancyArray && fancyArray.length>0)
                        //     {
                        //         await Fancy.insertMany(fancyArray)
                        //         return res.json(responseData("SAVE_FANCY_DATA", fancyArray, req, true));
                        //     }else{
                        //         return res.json(responseData("NO_FANCY_DATA", { }, req, false));
                        //     }
                        // });

                    }).catch(error => {
                        console.log('error---------', error);
                        if (error) {
                            return res.json(responseData("ERROR_OCCUR", error, req, false));
                        }
                    });

            } else {

                await Match.findOneAndUpdate({
                    eventId
                },
                    {
                        $set: { bookmakerType: "betfair" }
                    },
                    { returnOriginal: false });

                // const isBookMaker = await axios({
                //     method: 'get',
                //     url: `${betxch}${matchExist?.marketId}/${matchExist?.marketId}`
                // })
                // .then(async response =>  {
                //     return (response.data?.market && response.data?.market.length>0)?true:false
                // });

                // const matchExistA = await matchExist?.jsonData.map((item, i)=>{
                //         return {
                //                 "selectionID": `B`+item?.SelectionId,
                //                 "runnerName": item?.RunnerName,
                //                 "handicap": item?.Handicap,
                //                 "sortPriority": item?.sortPriority
                //             };
                // });

                // if(isBookMaker && matchExistA && matchExistA.length>0)
                // {
                //     await Match.updateOne({
                //         eventId:eventId,
                //     },{
                //         $set:{
                //             bookmakerMarketId:`B${matchExist?.marketId}`,
                //             bookmakerCentralizedId:`B${matchExist?.marketId}`,
                //             jsonBookmakerData:matchExistA
                //         }
                //     });
                //     return res.json(responseData("SAVE_BOOKMAKER_DATA", {}, req, true));

                // }else{
                //     return res.json(responseData("NO_BOOKMAKER_DATA", { }, req, false));
                // }

                let bodyOption = {
                    'access_token': access_token,
                    'strEventID': eventId
                }

                const marketMatchBookmakerOdds = await axios({
                    method: 'post',
                    url: `${host}/api/get_bookmaker_list`,
                    data: bodyOption
                })
                    .then(fancyData => {

                        fancyData = fancyData?.data?.appdata

                        let marketMatchBookmakerOdd = fancyData.find(({ marketName, marketTypeName }) => marketName == "BOOKMAKER 0 SEC NO COMM" && marketTypeName === "MANUAL_ODDS");
                        // console.log('marketMatchBookmakerOdd--------------',marketMatchBookmakerOdd);
                        if (marketMatchBookmakerOdd) {

                            return marketMatchBookmakerOdd;

                        } else {
                            return false;
                            // res.json(responseData("NO_BOOKMAKER_DATA", { }, req, false));
                        }
                    })
                    .catch(error => {
                        if (error) {
                            return false;
                            // return res.json(responseData("ERROR_OCCUR", error, req, false));
                        }
                    });

                if (marketMatchBookmakerOdds) {
                    let nBodyOption = {
                        'access_token': access_token,
                        "sport_id": "4",
                        "event_id": eventId,
                        "market_id": marketMatchBookmakerOdds.marketID,
                        "tournament_id": matchExist?.seriesId
                    };

                    const updateData = await axios({
                        method: 'post',
                        url: `${host}/api/import_market`,
                        data: nBodyOption
                    }).then(importBookmakerMarketData => {

                        // console.log('insert importBookmakerMarketData?.data?.data?.centralID',eventId, importBookmakerMarketData?.data?.data?.centralID)

                        let updateData = {};
                        updateData.bookmakerMarketId = marketMatchBookmakerOdds.marketID;
                        updateData.jsonBookmakerData = marketMatchBookmakerOdds.runner;
                        updateData.bookmakerCentralizedId = importBookmakerMarketData?.data?.data?.centralID;
                        return updateData;

                    }).catch(error => {
                        if (error) {
                            console.log('error', error)
                            return {};
                        }
                    });

                    await Match.findByIdAndUpdate({
                        _id: ObjectId(matchExist?._id)
                    },
                        {
                            $set: updateData
                        },
                        { returnOriginal: false });

                    return res.json(responseData("SAVE_BOOKMAKER_DATA", updateData, req, true));

                } else {
                    return res.json(responseData("NO_BOOKMAKER_DATA", {}, req, false));
                }

            }

        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    save_fancy_list: async (req, res) => {
        try {

            const {
                seriesId,
            } = req.query

            let tournamentExist = await Tournament.findOne({
                seriesId: seriesId
            })

            if (!tournamentExist) {
                return res.json(responseData("TOURNAMENT_DONT_EXIST", {}, req, false));
            }

            let matchExist = await Match.find({ seriesId })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let bodyOption = {}
            let fancyArray = []

            async.eachSeries(matchExist, (item, callback) => {
                // console.log('item',item);
                bodyOption = {
                    'access_token': access_token,
                    'strEventID': item.eventId
                }
                // console.log({
                //     method: 'post',
                //     url: `${host}/api/get_fancy_list`,
                //     data: bodyOption
                // })
                axios({
                    method: 'post',
                    url: `${host}/api/get_fancy_list`,
                    data: bodyOption
                })
                    .then(fancyData => {

                        fancyData = fancyData.data.appdata;
                        // console.log('fancyData',fancyData)
                        if (fancyData && fancyData.length > 0) {
                            // console.log('fancyData inner',fancyData)
                            async.eachSeries(fancyData, (fancyDataItem, inCallback) => {

                                if (fancyDataItem.marketTypeName == 'SESSION') {

                                    Fancy.findOne({ marketId: fancyDataItem.marketID })
                                        .then(dataFancyExist => {

                                            let bodyFancyOption = {
                                                'access_token': access_token,
                                                "sport_id": "4",
                                                'match_id': item.eventId,
                                                'market_ids': `${fancyDataItem.marketID}`,
                                                'tournament_id': item?.seriesId
                                            }

                                            axios({
                                                method: 'post',
                                                url: `${host}/api/import_fancy_market`,
                                                data: bodyFancyOption
                                            }).then(importMarketData => {

                                                // console.log('insert ---- fancy importMarketData?.data?.data?.centralID',importMarketData?.data?.data[0]?.centralId);

                                                if (dataFancyExist) {

                                                    Fancy.findOneAndUpdate({
                                                        marketId: fancyDataItem.marketID
                                                    },
                                                        {
                                                            $set: {
                                                                marketId: fancyDataItem.marketID,
                                                                centralizedId: importMarketData?.data?.data[0]?.centralId,
                                                                selectionId: fancyDataItem?.runner[0]?.selectionID || null,
                                                                fancyId: fancyDataItem.marketID,
                                                                fancyName: fancyDataItem.marketName,
                                                                eventDateTime: item.eventDateTime,
                                                                marketCount: fancyDataItem.runner.length,
                                                                jsonData: fancyDataItem.runner,
                                                                marketType: fancyDataItem.marketType,
                                                                categoryType: fancyDataItem.categoryType,
                                                                status: "open",
                                                                isDeleted: false,
                                                            }
                                                        })
                                                        .then(data => {
                                                            inCallback(null)
                                                        })
                                                        .catch(error => {
                                                            inCallback(error)
                                                        })

                                                } else {

                                                    fancyArray.push({
                                                        tournamentId: ObjectId(tournamentExist._id),
                                                        matchId: ObjectId(item._id),
                                                        matchName: item.eventName,
                                                        seriesId: item.seriesId,
                                                        eventId: item.eventId,
                                                        marketId: fancyDataItem.marketID,
                                                        centralizedId: importMarketData?.data?.data[0]?.centralId,
                                                        selectionId: fancyDataItem?.runner[0]?.selectionID || null,
                                                        fancyId: fancyDataItem.marketID,
                                                        fancyName: fancyDataItem.marketName,
                                                        eventDateTime: item.eventDateTime,
                                                        marketCount: fancyDataItem.runner.length,
                                                        jsonData: fancyDataItem.runner,
                                                        marketType: fancyDataItem.marketType,
                                                        categoryType: fancyDataItem.categoryType,
                                                        status: "open",
                                                        isDeleted: false,
                                                    })
                                                    inCallback(null)
                                                }

                                            }).catch(error => {
                                                console.log('fancy error111', error);
                                                inCallback(error)
                                            })
                                        })
                                        .catch(error => {
                                            inCallback(error)
                                        })
                                } else {
                                    inCallback(null)
                                }
                            }, function (err) {
                                // console.log('fancyArray',fancyArray)
                                // console.log('all done!!!');
                                callback(null)
                            });
                        } else {
                            callback(null)
                        }
                    }).catch(error => {
                        console.log('error', error)
                        if (error) {
                            return res.json(responseData("ERROR_OCCUR", error, req, false));
                        }
                        callback(error)
                    })

            }, async (error) => {

                await Fancy.insertMany(fancyArray)

                if (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                return res.json(responseData("SAVE_FANCY_DATA", {}, req, true));
            })

        } catch (error) {
            console.log('error-------------', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    save_bookmaker_list: async (req, res) => {
        try {

            const {
                seriesId,
            } = req.query
            const sportType = (req.query?.sportType) ? req.query?.sportType : 4;
            let tournamentExist = await Tournament.findOne({
                seriesId: seriesId
            })

            if (!tournamentExist) {
                return res.json(responseData("TOURNAMENT_DONT_EXIST", {}, req, false));
            }

            let matchExist = await Match.find({ seriesId })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            async.eachSeries(matchExist, (item, callback) => {
                // console.log('item',item);
                let bodyOptionNew = {
                    'access_token': access_token,
                    'strEventID': item?.eventId
                }
                axios({
                    method: 'post',
                    url: `${host}/api/get_bookmaker_list`,
                    data: bodyOptionNew
                })
                    .then(bookmakerData => {

                        bookmakerData = bookmakerData.data.appdata;
                        let marketMatchBookmakerOdd = bookmakerData.find(({ marketName, marketTypeName }) => marketName == "BOOKMAKER 0 SEC NO COMM" && marketTypeName === "MANUAL_ODDS");
                        // console.log('marketMatchBookmakerOdd--------------',marketMatchBookmakerOdd);
                        if (marketMatchBookmakerOdd) {

                            let nBodyOption = {
                                'access_token': access_token,
                                "sport_id": sportType,
                                "event_id": item?.eventId,
                                "market_id": marketMatchBookmakerOdd.marketID,
                                "tournament_id": item?.seriesId
                            };

                            axios({
                                method: 'post',
                                url: `${host}/api/import_market`,
                                data: nBodyOption
                            }).then(importBookmakerMarketData => {

                                console.log('insert importBookmakerMarketData?.data?.data?.centralID', eventId, importBookmakerMarketData?.data?.data?.centralID)

                                let updateData = {};
                                updateData.bookmakerMarketId = importBookmakerMarketData?.marketID;
                                updateData.jsonBookmakerData = importBookmakerMarketData?.runner;
                                updateData.bookmakerCentralizedId = importBookmakerMarketData?.data?.data?.centralID;
                                Match.updateMany({
                                    eventId: item?.eventId
                                },
                                    {
                                        $set: updateData
                                    },
                                    { upsert: true, returnOriginal: false })
                                    .then(data => {
                                        callback(null)
                                    })
                                    .catch(error => {
                                        callback(error)
                                    })

                            }).catch(error => {
                                callback(null)
                            });
                        } else {
                            callback(null)
                        }
                    }).catch(error => {
                        callback(error)
                    })

            }, async (error) => {
                console.log('error', error)
                if (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }
                return res.json(responseData("SAVE_BOOKMAKER_DATA", {}, req, true));
            })

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_update_list: async (req, res) => {
        try {

            const {
                sport
            } = req.query

            const bodyOption = {
                'access_token': access_token,
                'strEventTypeId': sport
            }

            const response = await axios({
                method: 'post',
                url: `${host}/api/get_tournament_list`,
                data: bodyOption
            });

            let tournArrIns = []
            let gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';

            async.eachSeries(response.data, (item, callback) => {

                Tournament.findOne({ seriesId: item.Competition.Id })
                    .then(data => {
                        if (data) {

                            bodyOption = {
                                'access_token': access_token,
                                'strEventTypeId': sport,
                                "strCompetitionId": seriesId
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/get_match_list`,
                                data: bodyOption
                            })
                                .then(matchData => {
                                    if (matchData) {

                                        marketData = marketData.data

                                        let marketMatchOdds = marketData.find(({ MarketName }) => MarketName == 'Match Odds')

                                        let str = item.Event.OpenDate;
                                        let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                                        let strMarketTime = marketMatchOdds.Description.MarketTime;
                                        let MarketTimeParsed = parseInt(strMarketTime.replace(/[^0-9]/g, ""));

                                        let strSuspendTime = marketMatchOdds.Description.SuspendTime;
                                        let SuspendTimeParsed = parseInt(strSuspendTime.replace(/[^0-9]/g, ""));

                                        let marketDataToBeUpdated = {
                                            gameType: tournamentExist.gameType,
                                            tournamentId: tournamentExist._id,
                                            eventName: item.Event.Name,
                                            countryCode: item.Event.CountryCode,
                                            venue: item.Event.Venue,
                                            timeZone: item.Event.Timezone,
                                            eventDateTime: new Date(eventDateParsed),
                                            marketCount: marketMatchOdds.Runners.length,
                                            marketId: marketMatchOdds.MarketId,
                                            IsMarketDataDelayed: marketMatchOdds.IsMarketDataDelayed,
                                            MarketTime: new Date(MarketTimeParsed),
                                            SuspendTime: new Date(SuspendTimeParsed),
                                            jsonData: marketMatchOdds.Runners,
                                            status: "pending",
                                        }

                                        let bodyOption = {
                                            'access_token': access_token,
                                            "strEventID": item.Event.Id,
                                            "strCompetitionId": tournamentExist.seriesId,
                                        }

                                        axios({
                                            method: 'post',
                                            url: `${host}/api/get_bookmaker_list`,
                                            data: bodyOption
                                        })
                                            .then(fancyData => {
                                                fancyData = fancyData?.data?.appdata

                                                if (fancyData.length > 0) {

                                                    fancyData.forEach(element => {

                                                        if (element.marketTypeName == 'MANUAL_ODDS' && element.marketName == "BOOKMAKER 0 SEC NO COMM") {
                                                            marketDataToBeUpdated.bookmakerMarketId = element.marketID;
                                                        }
                                                    });

                                                    Match.updateOne({
                                                        seriesId: data.seriesId,
                                                        eventId: data.eventId
                                                    }, {
                                                        $set: marketDataToBeUpdated
                                                    })
                                                        .then(resp => {
                                                            callback(null)
                                                        })
                                                        .catch(error => {
                                                            callback(error)
                                                        })

                                                } else {

                                                    Match.updateOne({
                                                        seriesId: data.seriesId,
                                                        eventId: data.eventId
                                                    }, {
                                                        $set: marketDataToBeUpdated
                                                    })
                                                        .then(resp => {
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

                                    }
                                })
                                .catch(error => {
                                    callback(error)
                                })

                        }
                        else {

                            let bodyOption = {
                                'access_token': access_token,
                                "strEventID": item.Event.Id
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/get_market_list`,
                                data: bodyOption
                            })
                                .then(marketData => {

                                    marketData = marketData.data

                                    let marketMatchOdds = marketData.find(({ MarketName }) => MarketName == 'Match Odds')

                                    if (!marketMatchOdds) {

                                        let str = item.Event.OpenDate;
                                        let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                                        let strMarketTime = null;
                                        let MarketTimeParsed = null;

                                        let strSuspendTime = null;
                                        let SuspendTimeParsed = null;

                                        let marketDataToBeUpdated = {
                                            seriesId: seriesId,
                                            eventId: item.Event.Id,
                                            gameType: tournamentExist.gameType,
                                            tournamentId: tournamentExist._id,
                                            eventName: item.Event.Name,
                                            countryCode: item.Event.CountryCode,
                                            venue: item.Event.Venue,
                                            timeZone: item.Event.Timezone,
                                            eventDateTime: new Date(eventDateParsed),
                                            marketCount: null,
                                            marketId: null,
                                            IsMarketDataDelayed: null,
                                            MarketTime: null,
                                            SuspendTime: null,
                                            jsonData: null,
                                            status: "pending",
                                        }

                                        let bodyOption = {
                                            'access_token': access_token,
                                            "strEventID": item.Event.Id,
                                            "strCompetitionId": tournamentExist.seriesId,
                                        }

                                        axios({
                                            method: 'post',
                                            url: `${host}/api/get_bookmaker_list`,
                                            data: bodyOption
                                        })
                                            .then(fancyData => {
                                                fancyData = fancyData?.data?.appdata

                                                if (fancyData.length > 0) {

                                                    fancyData.forEach(element => {
                                                        if (element.marketTypeName == 'MANUAL_ODDS' && element.marketName == "BOOKMAKER 0 SEC NO COMM") {
                                                            marketDataToBeUpdated.bookmakerMarketId = element.marketID
                                                            matchArrIns.push(marketDataToBeUpdated)
                                                        }
                                                    });
                                                    callback(null)
                                                } else {

                                                    marketDataToBeUpdated.bookmakerMarketId = null
                                                    matchArrIns.push(marketDataToBeUpdated)
                                                    callback(null)

                                                }
                                            })
                                            .catch(error => {
                                                callback(error)
                                            })

                                    } else {

                                        tournArrIns.push({
                                            gameType: gameType,
                                            seriesId: item.Competition.Id,
                                            seriesName: item.Competition.Name,
                                        })

                                        objToBeused.push({
                                            seriesId: seriesId,
                                            eventId: item.Event.Id,
                                            gameType: tournamentExist.gameType,
                                            tournamentId: tournamentExist._id,
                                            eventName: item.Event.Name,
                                            countryCode: item.Event.CountryCode,
                                            venue: item.Event.Venue,
                                            timeZone: item.Event.Timezone,
                                            eventDateTime: new Date(eventDateParsed),
                                            // marketCount:marketMatchOdds.Runners.length,
                                            // marketId:marketMatchOdds.MarketId,
                                            // IsMarketDataDelayed:marketMatchOdds.IsMarketDataDelayed,
                                            MarketTime: new Date(MarketTimeParsed),
                                            SuspendTime: new Date(SuspendTimeParsed),
                                            // jsonData:marketMatchOdds.Runners,
                                            status: "pending",
                                        })

                                        // let str = item.Event.OpenDate;
                                        // let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                                        // let strMarketTime = marketMatchOdds.Description.MarketTime;
                                        // let MarketTimeParsed = parseInt(strMarketTime.replace(/[^0-9]/g, ""));

                                        // let strSuspendTime = marketMatchOdds.Description.SuspendTime;
                                        // let SuspendTimeParsed = parseInt(strSuspendTime.replace(/[^0-9]/g, ""));

                                        // let marketDataToBeUpdated = {
                                        //     seriesId:seriesId,
                                        //     eventId:item.Event.Id,
                                        //     gameType: tournamentExist.gameType,
                                        //     tournamentId: tournamentExist._id,
                                        //     eventName: item.Event.Name,
                                        //     countryCode: item.Event.CountryCode,
                                        //     venue: item.Event.Venue,
                                        //     timeZone: item.Event.Timezone,
                                        //     eventDateTime: new Date(eventDateParsed),
                                        //     marketCount:marketMatchOdds.Runners.length,
                                        //     marketId:marketMatchOdds.MarketId,
                                        //     IsMarketDataDelayed:marketMatchOdds.IsMarketDataDelayed,
                                        //     MarketTime:new Date(MarketTimeParsed),
                                        //     SuspendTime:new Date(SuspendTimeParsed),
                                        //     jsonData:marketMatchOdds.Runners,
                                        //     status: "pending",
                                        // }

                                        // let bodyOption = {
                                        //     'access_token': access_token,
                                        //     "strEventID": item.Event.Id,
                                        //     "strCompetitionId": tournamentExist.seriesId,
                                        // }

                                        // axios({
                                        //     method: 'post',
                                        //     url: `${host}/api/get_bookmaker_list`,
                                        //     data: bodyOption
                                        // })
                                        // .then(fancyData => {
                                        //     fancyData = fancyData?.data?.appdata

                                        //     if(fancyData.length > 0){

                                        //         fancyData.forEach(element => {
                                        //             if(element.marketTypeName == 'MANUAL_ODDS' && element.marketName == "BOOKMAKER 0 SEC NO COMM"){
                                        //                 marketDataToBeUpdated.bookmakerMarketId = element.marketID
                                        //                 matchArrIns.push(marketDataToBeUpdated)
                                        //             }
                                        //         });
                                        //         callback(null)
                                        //     }else{

                                        //         marketDataToBeUpdated.bookmakerMarketId = null
                                        //         matchArrIns.push(marketDataToBeUpdated)
                                        //         callback(null)

                                        //     }
                                        // })
                                        // .catch(error => {
                                        //     callback(error)
                                        // })
                                    }
                                })
                                .catch(error => {
                                    callback(error)
                                })

                        }
                    })
                    .catch(error => {
                        callback(error)
                    })

            }, async (error) => {

                if (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                await Tournament.insertMany(tournArrIns)

                return res.json(responseData("GET_LIST_TOURNAMENT", response.data, req, true));
            })

        } catch (error) {

        }
    },

    match_odds: async (req, res) => {
        try {

            if (req.query?.marketId) {
                axios({
                    method: 'get',
                    url: `${betFairOdds}/api/GetMarketOdds?market_id=${req.query?.marketId}`
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
                                    "eventId": resp?.eventId,
                                    "bmi": resp?.MarketId,
                                    "ip": 1,
                                    "mi": resp?.MarketId,
                                    "ms": gsStatus(resp?.Status),
                                    "eti": "4",
                                    "eid": resp?.version,
                                    "grt": resp?.update,
                                    "totalMatched": resp?.TotalMatched || 0,
                                    "numberOfRunners": resp?.NumberOfRunners,
                                    "NumberOfActiveRunners": resp?.NumberOfActiveRunners,
                                    "inPlay": resp?.inplay,
                                    "IsInPlay": resp?.IsInplay,
                                    "rt": temp
                                }
                            });

                            const data = (respData && respData.length > 0) ? respData[0] : [];

                            return res.json(responseData("success", data, req, true));

                        } else {
                            return res.json(responseData("false", [], req, false));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    live_match: async (req, res) => {
        try {

            axios({
                method: 'get',
                url: `https://ss247.life/api/8dac71c43808368b2ba1dbb7bfb6fd76bfaddaf4/streaminfo.php`,
                headers: {}
            })
                .then(function (response) {
                    const tempArr = (response.data?.data?.getMatches) ? response.data?.data?.getMatches : [];
                    if (tempArr) {
                        async.eachSeries(tempArr, (item, callback) => {
                            console.log('item?.MatchID', item?.Channel);
                            Match.updateOne({
                                eventId: item?.MatchID
                            }, {
                                $set: {
                                    channel: item?.Channel,
                                    status: "in_play"
                                }
                            })
                                .then(resp => {
                                    callback(null);
                                })
                                .catch(error => {
                                    console.log('error0', error);
                                    callback(error)
                                });
                        }, async (error) => {
                            console.log('error', error)
                            if (error) {
                                return res.json(responseData("ERROR_OCCUR", error, req, false));
                            }
                            return res.json(responseData("SAVE_DATA", {}, req, true));
                        })
                    } else {
                        return res.json(responseData("ERROR_OCCUR", "ERROR", req, false));
                    }
                })
                .catch(function (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                });

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    // cron set
    soccer_tournament_list: async (req, res) => {
        try {

            const sport = 1;
            const bodyOption = {
                'access_token': access_token,
                'strEventTypeId': sport
            }

            const response = await axios({
                method: 'post',
                url: `${host}/api/get_tournament_list`,
                data: bodyOption
            });

            let tournArrIns = []
            let gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';

            async.eachSeries(response.data, (item, callback) => {

                Tournament.findOne({ seriesId: item.Competition.Id })
                    .then(data => {
                        if (data) {
                            callback(null)
                        } else {
                            tournArrIns.push({
                                gameType: gameType,
                                sportBetFairId: sport,
                                seriesId: item.Competition.Id,
                                seriesName: item.Competition.Name,
                            })
                            callback(null)
                        }
                    })
                    .catch(error => {
                        callback(error)
                    })

            }, async (error) => {

                if (error) {
                    console.log('error -', error)
                }

                if (tournArrIns && tournArrIns.length > 0) {
                    await Tournament.insertMany(tournArrIns)
                }

                console.log('soccer_tournament_list done all -')
            })

        } catch (error) {
            console.log('error -', error)
        }
    },
    tennis_tournament_list: async (req, res) => {
        try {

            const sport = 2;
            const bodyOption = {
                'access_token': access_token,
                'strEventTypeId': sport
            }

            const response = await axios({
                method: 'post',
                url: `${host}/api/get_tournament_list`,
                data: bodyOption
            });

            let tournArrIns = []
            let gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';

            async.eachSeries(response.data, (item, callback) => {

                Tournament.findOne({ seriesId: item.Competition.Id })
                    .then(data => {
                        if (data) {
                            callback(null)
                        } else {
                            tournArrIns.push({
                                gameType: gameType,
                                sportBetFairId: sport,
                                seriesId: item.Competition.Id,
                                seriesName: item.Competition.Name,
                            })
                            callback(null)
                        }
                    })
                    .catch(error => {
                        callback(error)
                    })

            }, async (error) => {

                if (error) {
                    // console.log('error -',error)
                }

                if (tournArrIns && tournArrIns.length > 0) {
                    await Tournament.insertMany(tournArrIns)
                }

                console.log('tennis_tournament_list done all -')
            })

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    cricket_tournament_list: async (req, res) => {
        try {

            const sport = 4;
            const bodyOption = {
                'access_token': access_token,
                'strEventTypeId': sport,
                // "sourceID": "18"
            }

            const response = await axios({
                method: 'post',
                url: `${host}/api/get_tournament_list`,
                data: bodyOption
            });

            let tournArrIns = []
            let gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';

            async.eachSeries(response.data, (item, callback) => {

                Tournament.findOne({ seriesId: item.Competition.Id })
                    .then(data => {
                        if (data) {
                            callback(null)
                        } else {
                            tournArrIns.push({
                                gameType: gameType,
                                sportBetFairId: sport,
                                seriesId: item.Competition.Id,
                                seriesName: item.Competition.Name,
                            })
                            callback(null)
                        }
                    })
                    .catch(error => {
                        callback(error)
                    })

            }, async (error) => {

                // if(error){
                //     return res.json(responseData("ERROR_OCCUR", error, req, false));
                // }

                if (tournArrIns && tournArrIns.length > 0) {
                    await Tournament.insertMany(tournArrIns)
                }

                // return res.json(responseData("GET_LIST_TOURNAMENT", response.data, req, true));
            })

        } catch (error) {
            // return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    casino_transaction: async (req, res) => {
        try {

            try {
                const request = {
                    'cert': cert,
                    'agentId': agent,
                    'timeFrom': '2023-01-19T19:00:30+08:00',
                    'platform': 'SEXYBCRT'
                };
                // console.log(request,'----------request')
                var data = qs.stringify(request);
                var config = {
                    method: 'post',
                    url: `${apiPath}fetch/gzip/getTransactionByUpdateDate`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'charset': 'UTF-8'
                    },
                    data: data
                };
                const matchArrIns = [];
                axios(config).then(async function (response) {
                    // console.log('response------',response);
                    if (response.data?.status == '0000' && response.data?.transactions) {

                        async.eachSeries(response.data?.transactions, (item, callback) => {

                            CasinoBet.findOne({ platformTxId: item.platformTxId })
                                .then(data => {
                                    if (data) {
                                        callback(null)
                                    } else {

                                        User.findOne({ username: item.userId })
                                            .then(idata => {
                                                if (idata) {
                                                    let userId = idata._id;
                                                    let ownerId = idata.ownerId;
                                                    let subOwnerId = idata.subOwnerId;
                                                    let adminId = idata.adminId;
                                                    let superAdminId = idata.superAdminId;
                                                    let subAdminId = idata.subAdminId;
                                                    let superSeniorId = idata.superSeniorId;
                                                    let superAgentId = idata.superAgentId;
                                                    let agentId = idata.agentId;
                                                    let marketDataToBeUpdated = {
                                                        platformTxId: item.platformTxId,
                                                        userId,
                                                        ownerId,
                                                        subOwnerId,
                                                        adminId,
                                                        superAdminId,
                                                        subAdminId,
                                                        superSeniorId,
                                                        superAgentId,
                                                        agentId,
                                                        eventType: '-1',
                                                        gameInfo: item.gameInfo,
                                                        roundId: item.roundId,
                                                        casinoBetId: item.roundId,
                                                        profitAmount: item.winAmount,
                                                        loseAmount: (item.realWinAmount > item.realBetAmount) ? 0 : item.turnover,
                                                        realCutAmount: item.realBetAmount,
                                                        playerPL: (item.realWinAmount > item.realBetAmount) ? item.turnover : -Math.abs(item.turnover),
                                                        realWinAmount: item.realWinAmount,
                                                        turnover: item.turnover,
                                                        settleStatus: item.settleStatus,
                                                        betAmount: item.realBetAmount,
                                                        amount: item.betAmount,
                                                        platform: item.platform,
                                                        casinoName: item.gameName,
                                                        gameCode: item.gameCode,
                                                        currency: item.currency,
                                                        profitAmount: item.winAmount,
                                                        profitAmount: item.winAmount,
                                                        clientName: item.userId,
                                                        gameType: item.gameType,
                                                        jackpotWinAmount: item.jackpotWinAmount,
                                                        jackpotBetAmount: item.jackpotBetAmount,
                                                        timeInserted: new Date(item.txTime),
                                                        status: "active",
                                                    }

                                                    matchArrIns.push(marketDataToBeUpdated);

                                                    callback(null)
                                                } else {
                                                    callback(null)
                                                }
                                            }).catch(error => {
                                                callback(error)
                                            })
                                    }
                                }).catch(error => {
                                    callback(error)
                                })

                        }, async (error) => {
                            console.log('matchArrIns-------------', matchArrIns);
                            if (error) {
                                console.log('error8', error);
                                return res.json(responseData("ERROR_OCCUR", error, req, false));
                            }
                            await CasinoBet.insertMany(matchArrIns)
                            res.status(200).json({ "status": true, "message": "success", "data": response.data })
                        });
                    } else {
                        res.status(200).json({ "status": true, "message": "failed", "data": response.data })
                    }

                }).catch(function (error) {
                    // console.log('error------------',error);
                    res.status(200).json({ "status": false, "message": error, "data": {} })
                });

            } catch (error) {
                console.log('error9', error);
                return res.json(responseData("ERROR_OCCUR", error, req, false));
            }

        } catch (error) {
            console.log('error8', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    diamond_api: async (req, res) => {
        try {

            try {
                const request = {
                    'cert': cert,
                    'agentId': agent,
                    'timeFrom': '2023-01-19T19:00:30+08:00',
                    'platform': 'SEXYBCRT'
                };
                // console.log(request,'----------request')
                var data = qs.stringify(request);
                var config = {
                    method: 'post',
                    url: `${apiPath}fetch/gzip/getTransactionByUpdateDate`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'charset': 'UTF-8'
                    },
                    data: data
                };
                const matchArrIns = [];
                axios(config).then(async function (response) {
                    // console.log('response------',response);
                    if (response.data?.status == '0000' && response.data?.transactions) {

                        async.eachSeries(response.data?.transactions, (item, callback) => {

                            CasinoBet.findOne({ platformTxId: item.platformTxId })
                                .then(data => {
                                    if (data) {
                                        callback(null)
                                    } else {

                                        User.findOne({ username: item.userId })
                                            .then(idata => {
                                                if (idata) {
                                                    let userId = idata._id;
                                                    let ownerId = idata.ownerId;
                                                    let subOwnerId = idata.subOwnerId;
                                                    let adminId = idata.adminId;
                                                    let superAdminId = idata.superAdminId;
                                                    let subAdminId = idata.subAdminId;
                                                    let superSeniorId = idata.superSeniorId;
                                                    let superAgentId = idata.superAgentId;
                                                    let agentId = idata.agentId;
                                                    let marketDataToBeUpdated = {
                                                        platformTxId: item.platformTxId,
                                                        userId,
                                                        ownerId,
                                                        subOwnerId,
                                                        adminId,
                                                        superAdminId,
                                                        subAdminId,
                                                        superSeniorId,
                                                        superAgentId,
                                                        agentId,
                                                        eventType: '-1',
                                                        gameInfo: item.gameInfo,
                                                        roundId: item.roundId,
                                                        casinoBetId: item.roundId,
                                                        profitAmount: item.winAmount,
                                                        loseAmount: (item.realWinAmount > item.realBetAmount) ? 0 : item.turnover,
                                                        realCutAmount: item.realBetAmount,
                                                        playerPL: (item.realWinAmount > item.realBetAmount) ? item.turnover : -Math.abs(item.turnover),
                                                        realWinAmount: item.realWinAmount,
                                                        turnover: item.turnover,
                                                        settleStatus: item.settleStatus,
                                                        betAmount: item.realBetAmount,
                                                        amount: item.betAmount,
                                                        platform: item.platform,
                                                        casinoName: item.gameName,
                                                        gameCode: item.gameCode,
                                                        currency: item.currency,
                                                        profitAmount: item.winAmount,
                                                        profitAmount: item.winAmount,
                                                        clientName: item.userId,
                                                        gameType: item.gameType,
                                                        jackpotWinAmount: item.jackpotWinAmount,
                                                        jackpotBetAmount: item.jackpotBetAmount,
                                                        timeInserted: new Date(item.txTime),
                                                        status: "active",
                                                    }

                                                    matchArrIns.push(marketDataToBeUpdated);

                                                    callback(null)
                                                } else {
                                                    callback(null)
                                                }
                                            }).catch(error => {
                                                callback(error)
                                            })
                                    }
                                }).catch(error => {
                                    callback(error)
                                })

                        }, async (error) => {
                            console.log('matchArrIns-------------', matchArrIns);
                            if (error) {
                                console.log('error8', error);
                                return res.json(responseData("ERROR_OCCUR", error, req, false));
                            }
                            await CasinoBet.insertMany(matchArrIns)
                            res.status(200).json({ "status": true, "message": "success", "data": response.data })
                        });
                    } else {
                        res.status(200).json({ "status": true, "message": "failed", "data": response.data })
                    }

                }).catch(function (error) {
                    // console.log('error------------',error);
                    res.status(200).json({ "status": false, "message": error, "data": {} })
                });

            } catch (error) {
                console.log('error9', error);
                return res.json(responseData("ERROR_OCCUR", error, req, false));
            }

        } catch (error) {
            console.log('error8', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    // Manual Market API
    get_manual_tournament_list: async (req, res) => {
        try {
            const {
                sport
            } = req.query

            const bodyOption = {
                'access_token': access_token,
                'strEventTypeId': sport,
                "sourceID": "18"
            }

            const response = await axios({
                method: 'post',
                url: `${host}/api/get_tournament_list`,
                data: bodyOption
            });

            let tournArrIns = []
            let gameType = sport == 4 ? 'cricket' : sport == 2 ? 'tennis' : sport == 1 ? 'soccer' : 'Invalid';

            async.eachSeries(response.data, (item, callback) => {

                Tournament.findOne({ seriesId: item.Competition.Id })
                    .then(data => {
                        if (data) {
                            callback(null)
                        } else {
                            tournArrIns.push({
                                gameType: gameType,
                                sportBetFairId: sport,
                                seriesId: item.Competition.Id,
                                seriesName: item.Competition.Name,
                                sourceID: "18"
                            })
                            callback(null)
                        }
                    })
                    .catch(error => {
                        callback(error)
                    })

            }, async (error) => {

                if (error) {
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                const resp = await Tournament.insertMany(tournArrIns);

                return res.json(responseData("GET_LIST_TOURNAMENT", resp, req, true));
            })

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    get_manual_match_list: async (req, res) => {
        try {
            const {
                seriesId,
            } = req.query

            let tournamentExist = await Tournament.findOne({
                seriesId: seriesId
            })

            if (!tournamentExist) {
                return res.json(responseData("TOURNAMENT_DONT_EXIST", {}, req, false));
            }

            bodyOption = {
                'access_token': access_token,
                "strCompetitionId": seriesId,
                "sourceID": "18"
            }

            const matchData = await axios({
                method: 'post',
                url: `${host}/api/get_match_list`,
                data: bodyOption
            });

            let matchArrIns = [];

            async.eachSeries(matchData.data, (item, callback) => {
                console.log('item', item)
                Match.findOne({
                    seriesId: seriesId,
                    eventId: item.Event.Id
                })
                    .then(data => {
                        if (data) {
                            let bodyOption = {
                                'access_token': access_token,
                                "strEventID": item.Event.Id
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/get_bookmaker_list`,
                                data: bodyOption
                            })
                                .then(fancyData => {
                                    fancyData = fancyData?.data?.appdata

                                    let marketMatchBookmakerOdds = fancyData.find(({ marketName, marketTypeName }) => marketName == "BOOKMAKER 0 SEC NO COMM" && marketTypeName === "MANUAL_ODDS");
                                    // console.log('marketMatchBookmakerOdds',marketMatchBookmakerOdds);
                                    if (marketMatchBookmakerOdds) {
                                        let marketDataToBeUpdated = {}

                                        let bodyOption = {
                                            'access_token': access_token,
                                            "event_id": item.Event.Id,
                                            "sport_id": tournamentExist?.sportBetFairId,
                                            "market_id": marketMatchBookmakerOdds.marketID,
                                            "tournament_id": seriesId
                                        };

                                        axios({
                                            method: 'post',
                                            url: `${host}/api/import_market`,
                                            data: bodyOption
                                        }).then(importBookmakerMarketData => {

                                            marketDataToBeUpdated.bookmakerMarketId = marketMatchBookmakerOdds.marketID;
                                            marketDataToBeUpdated.jsonBookmakerData = marketMatchBookmakerOdds.runner;
                                            marketDataToBeUpdated.bookmakerCentralizedId = importBookmakerMarketData?.data?.data?.centralID;

                                            Match.findOneAndUpdate({
                                                eventId: item.Event.Id
                                            },
                                                {
                                                    $set: marketDataToBeUpdated
                                                },
                                                { returnOriginal: false }).then(result => {
                                                    callback(null)
                                                })
                                                .catch(error => {
                                                    console.log('error5', error);
                                                    callback(error)
                                                })

                                        }).catch(error => {
                                            console.log('error5', error);
                                            callback(error)
                                        });

                                    } else {

                                        callback(null)
                                    }
                                })
                                .catch(error => {
                                    console.log('error5', error);
                                    callback(error)
                                })
                        } else {

                            let str = item.Event.OpenDate;
                            let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));

                            let marketDataToBeUpdated = {
                                seriesId: seriesId,
                                eventId: item.Event.Id,
                                gameType: tournamentExist.gameType,
                                tournamentId: tournamentExist._id,
                                eventName: item.Event.Name,
                                countryCode: item.Event?.CountryCode,
                                venue: item.Event?.Venue,
                                timeZone: item.Event?.Timezone,
                                eventDateTime: new Date(eventDateParsed),
                                marketId: item.Event.Id,
                                centralizedId: item?.Event?.centralID,
                                IsMarketDataDelayed: false,
                                status: "active",
                            }

                            let bodyOption = {
                                'access_token': access_token,
                                "strEventID": item.Event.Id
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/get_bookmaker_list`,
                                data: bodyOption
                            })
                                .then(fancyData => {
                                    fancyData = fancyData?.data?.appdata

                                    let marketMatchBookmakerOdds = fancyData.find(({ marketName, marketTypeName }) => marketName == "BOOKMAKER 0 SEC NO COMM" && marketTypeName === "MANUAL_ODDS");
                                    // console.log('marketMatchBookmakerOdds',marketMatchBookmakerOdds);
                                    if (marketMatchBookmakerOdds) {

                                        let bodyOption = {
                                            'access_token': access_token,
                                            "event_id": item.Event.Id,
                                            "sport_id": tournamentExist?.sportBetFairId,
                                            "market_id": marketMatchBookmakerOdds.marketID,
                                            "tournament_id": seriesId
                                        };

                                        axios({
                                            method: 'post',
                                            url: `${host}/api/import_market`,
                                            data: bodyOption
                                        }).then(importBookmakerMarketData => {

                                            // console.log('insert importBookmakerMarketData?.data?.data?.centralID',item.Event.Id, importBookmakerMarketData?.data?.data?.centralID)
                                            marketDataToBeUpdated.bookmakerMarketId = marketMatchBookmakerOdds.marketID;
                                            marketDataToBeUpdated.jsonBookmakerData = marketMatchBookmakerOdds.runner;
                                            marketDataToBeUpdated.bookmakerCentralizedId = importBookmakerMarketData?.data?.data?.centralID;

                                            matchArrIns.push(marketDataToBeUpdated);

                                            callback(null)

                                        }).catch(error => {
                                            console.log('error5', error);
                                            callback(error)
                                        });

                                    } else {

                                        marketDataToBeUpdated.bookmakerMarketId = null
                                        marketDataToBeUpdated.jsonBookmakerData = null;
                                        marketDataToBeUpdated.bookmakerCentralizedId = null;
                                        matchArrIns.push(marketDataToBeUpdated)
                                        callback(null)
                                    }
                                })
                                .catch(error => {
                                    console.log('error5', error);
                                    callback(error)
                                })
                        }
                    })
                    .catch(error => {
                        console.log('error7', error);
                        callback(error)
                    })

            }, async (error) => {
                // console.log('matchArrIns',matchArrIns);
                await Match.insertMany(matchArrIns)

                if (error) {
                    // console.log('error8',error);
                    return res.json(responseData("ERROR_OCCUR", error, req, false));
                }

                return res.json(responseData("GET_LIST_MATCH", matchData.data, req, true));
            })

        } catch (error) {
            console.log('error9', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    save_manual_fancy_list: async (req, res) => {
        try {

            const {
                eventId
            } = req.query

            let matchExist = await Match.findOne({
                eventId
            })

            if (!matchExist) {
                return res.json(responseData("MATCH_DONT_EXIST", {}, req, false));
            }

            let SessionBetExist = await SessionBet.distinct('selectionId', { eventId });
            if (SessionBetExist) {
                return res.json(responseData("SessionBetExist", {}, req, false));
            }

            let bodyOption = {
                'access_token': access_token,
                'strEventID': eventId
            }

            await Fancy.deleteMany({
                eventId,
                selectionId: { $nin: await SessionBet.distinct('selectionId', { eventId }) }
            });

            let fancyArray = []

            axios({
                method: 'post',
                url: `${host}/api/get_fancy_list`,
                data: bodyOption
            })
                .then(fancyData => {

                    fancyData = fancyData.data.appdata;

                    async.eachSeries(fancyData, (fancyDataItem, callback) => {
                        // console.log('fancyDataItem',fancyDataItem)
                        if (fancyDataItem.marketTypeName == 'SESSION') {

                            let bodyFancyOption = {
                                'access_token': access_token,
                                "sport_id": "4",
                                'match_id': eventId,
                                'market_ids': `${fancyDataItem.marketID}`,
                                'tournament_id': matchExist?.seriesId
                            }

                            axios({
                                method: 'post',
                                url: `${host}/api/import_fancy_market`,
                                data: bodyFancyOption
                            }).then(importMarketData => {

                                // console.log('insert ---- fancy importMarketData?.data?.data?.centralID',eventId, importMarketData?.data?.data[0]?.centralId);

                                fancyArray.push({
                                    tournamentId: ObjectId(matchExist.tournamentId),
                                    matchId: ObjectId(matchExist._id),
                                    matchName: matchExist.eventName,
                                    seriesId: matchExist.seriesId,
                                    eventId: matchExist.eventId,
                                    marketId: fancyDataItem.marketID,
                                    centralizedId: importMarketData?.data?.data[0]?.centralId,
                                    selectionId: fancyDataItem?.runner[0]?.selectionID || null,
                                    fancyId: fancyDataItem.marketID,
                                    fancyName: fancyDataItem.marketName,
                                    eventDateTime: matchExist.eventDateTime,
                                    marketCount: fancyDataItem.runner.length,
                                    jsonData: fancyDataItem.runner,
                                    marketType: fancyDataItem.marketType,
                                    categoryType: fancyDataItem.categoryType,
                                    status: "open",
                                    isDeleted: false,
                                });
                                callback(null)
                            }).catch(error => {
                                console.log('fancy error1', error);
                                callback(error)
                            })
                        } else {
                            callback(null)
                        }
                    }, async (error) => {

                        // console.log('fancyArray',fancyArray);
                        if (error) {

                            return res.json(responseData("ERROR_OCCUR", error, req, false));
                        }
                        if (fancyArray && fancyArray.length > 0) {
                            await Fancy.insertMany(fancyArray)
                            return res.json(responseData("SAVE_FANCY_DATA", {}, req, true));
                        } else {
                            return res.json(responseData("NO_FANCY_DATA", {}, req, false));
                        }
                    });

                }).catch(error => {
                    console.log('error---------', error);
                    if (error) {
                        return res.json(responseData("ERROR_OCCUR", error, req, false));
                    }
                });

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    addBetFair: async (req, res) => {
        try {
            // ,'pending'

            let tournamentExist = await Match.distinct('seriesId', { eventType: 2, status: { $in: ['active', 'in_play'] } });

            if (!tournamentExist) {
                return res.json(responseData("TR_DONT_EXIST", {}, req, false));
            }

            // let str = "/Date(1680202800000)/"; //item.Event.OpenDate;
            // let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));
            // console.log('new Date(eventDateParsed)',new Date(eventDateParsed))
            // return true;

            const matchArrIns = [];
            async.eachSeries(tournamentExist, (tournament, outerCallback) => {
                setTimeout(function () {
                    let bodyOption = {
                        'access_token': access_token,
                        'strEventTypeId': "2",
                        "strCompetitionId": tournament
                    }
                    // console.log('bodyOption',bodyOption)
                    axios({
                        method: 'post',
                        url: `${host}/api/get_match_list`,
                        data: bodyOption
                    }).then(matchData => {
                        async.eachSeries(matchData.data, (item, callback) => {
                            let str = item.Event.OpenDate;
                            let eventDateParsed = parseInt(str.replace(/[^0-9]/g, ""));
                            // (item.Event.Id=="32227148") && console.log('new Date(eventDateParsed)',item.Event.Id, new Date(eventDateParsed))
                            // if(item.Event.Id=="32227148"){
                            //     Match.findOneAndUpdate({
                            //         eventId:item.Event.Id
                            //     },
                            //     {
                            //         $set:{
                            //             eventDateTime: new Date(eventDateParsed),
                            //         }
                            //     })
                            //     .then(data => {
                            //         callback(null)
                            //     })
                            //     .catch(error => {
                            //         callback(error)
                            //     })
                            // }else{
                            //     callback(null)
                            // }

                            Match.findOneAndUpdate({
                                eventId: item.Event.Id
                            },
                                {
                                    $set: {
                                        eventDateTime: new Date(eventDateParsed),
                                    }
                                })
                                .then(data => {
                                    callback(null)
                                })
                                .catch(error => {
                                    callback(error)
                                })

                        }, async (error) => {
                            (error) && console.log('outerCallback error', error)
                            outerCallback(null)
                            // console.log('matchArrIns-------------',matchArrIns);
                        });

                    })
                        .catch(error => {
                            outerCallback(error)
                        });
                }, 2000);

            }, async (error) => {
                (error) && console.log('error', error)
                return res.json(responseData("GET_LIST_MATCH", [], req, true));
                // console.log('matchArrIns-------------',matchArrIns);
            });

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    setExposer: async (req, res) => {
        try {

            let userExist = await User.distinct('_id', { userType: "user", exposure: { $gte: 0 } });

            if (!userExist) {
                return res.json(responseData("TR_DONT_EXIST", {}, req, false));
            }

            async.eachSeries(userExist, (user, callback) => {

                let matchPattern = {
                    isDeclared: false,
                    forBet: 1,
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
                (error) && console.log('error', error)
                return res.json(responseData("update successfully", [], req, true));
            });

        } catch (error) {
            console.log('error', error)
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    rollbackCasinoAmount: async (req, res) => {
        try {
            const today = new Date();
            const eightHourAgo = new Date(today);
            eightHourAgo.setHours(today.getHours() - 8);
            // console.log('today: ', eightHourAgo);return false;
            const casinoBet = await CasinoBet.find({createdAt: { $lte: eightHourAgo}, status: 'bet'})
            async.eachSeries(casinoBet, async (bet, callback) => {
                const userDetails = await User.findOne({ _id: bet.userId })
                if(userDetails){
                    const userUpdatedBalance = userDetails.totalCoins + Number(bet.betAmount)
                    // console.log('userUpdatedBalance: ', userUpdatedBalance, userDetails._id);return false;
                    const transactionObj = {
                        gameType: 'casino',
                        transactionType: 'credit',
                        userId: userDetails?._id,
                        amount: bet.betAmount,
                        status: 'success',
                        eventType: '-1',
                        realCutAmount: Math.abs(bet.betAmount),
                        oldBalance: userDetails.totalCoins,
                        newBalance: userUpdatedBalance
                    }
                    await Transaction.create(transactionObj)
                    await User.findOneAndUpdate({ _id: userDetails._id }, { $set: { totalCoins: userUpdatedBalance } })
                    await CasinoBet.findOneAndUpdate({ _id: bet._id }, { $set: { status: 'rollback', amount: 0, profitLossAmount: 0 }})
                }
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