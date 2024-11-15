const Match = require("../../models/match.model");
const Tournament = require("../../models/tournament.model");
const User = require("../../models/user.model");
const CasinoBet = require("../../models/casinoBet.model");
const Bet = require("../../models/bet.model");
const Report = require("../../models/report.model");
const DeletedReport = require("../../models/deletedReport.model");
const Transaction = require("../../models/transaction.model");
const DeletedTransaction = require("../../models/deletedTransaction.model");
const BetPosition = require("../../models/betPosition.model");
const SessionBet = require("../../models/sessionBet.model");
const SportBookBet = require("../../models/sportsBookBet.model");
const Admin = require("../../models/user.model");
let  bcrypt = require('bcryptjs');
const { responseData } = require("../../helpers/responseData");
const { getPaginateObj } = require("../../helpers/serviceHelper");
const {
  getAccessToken,
  betFairLayFormulaProfit,
  betFairLayFormulaLose,
  betFairBackFormulaProfit,
  betFairBackFormulaLose,
  bookmakerRealRate,
} = require("../../helpers/helper");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const axios = require("axios").default;
const async = require("async");

module.exports = {
  liveList: async (req, res) => {
    try {
      const { type, betType, sortType, status, last } = req.query;
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
      let { sortOrder } = req.query;
      let keyword= req.query?.keyword || "";
      let searchObj = {
        isDeclared: false,
      };
      // console.log('keyword',keyword)
      if(keyword)
      {
        searchObj.userId={$in:await User.distinct('_id', {username:keyword})}
      }

      // console.log('searchObj',searchObj)

      let sortPattern = {};
      var  queryPattern = [{
          $match: {...searchObj, ...matchPlayerFilter},
        },
      ];
      let queryResponse;

      if (type && type !=3) {
        searchObj.eventType = type;
      }

      if (status && type !=3){
        searchObj.status = status;
      }

      if (last) {
        queryPattern.push({ $limit: Number(last) });
      }

      if (type && betType && betType === "sportBook") {
        if (sortType && sortOrder) {
          sortOrder = sortOrder === "asc" ? 1 : -1;
          sortPattern[sortType] = sortOrder;

          queryPattern.push({ $sort: sortPattern });
        }
        searchObj.eventType = type;
        queryResponse = await SportBookBet.aggregate(queryPattern);
      }

      if (type && betType && betType === "fancy") {
        if (sortType && sortOrder) {
          sortOrder = sortOrder === "asc" ? 1 : -1;
          sortPattern[sortType] = sortOrder;

          queryPattern.push({ $sort: sortPattern });
        }
        searchObj.eventType = type;
        queryResponse = await SessionBet.aggregate(queryPattern);
      }

      if (betType && betType === "casino") {
        if (sortType && sortOrder) {
          sortOrder = sortOrder === "asc" ? 1 : -1;
          sortPattern[sortType] = sortOrder;

          queryPattern.push({ $sort: sortPattern });
        }
        // searchObj.eventType = type;
        // console.log('queryPattern',betType, queryPattern)
        queryResponse = await CasinoBet.aggregate(queryPattern);
      }

      if (betType !== "fancy" && betType !== "sportBook" && betType !== "casino") {
        if (type && betType && betType == "bookmaker") {
          searchObj.eventType = type;
          searchObj.betFaireType = betType;
        }
        if (type && betType && (betType == "betfair" || betType == "betFair")) {
          searchObj.eventType = type;
          searchObj.betFaireType ={$in:["betFair","betfair"]};
        }
        if (sortType && sortOrder) {
          sortOrder = sortOrder === "asc" ? 1 : -1;
          sortPattern[sortType] = sortOrder;

          queryPattern.push({ $sort: sortPattern });
        }
        queryResponse = await Bet.aggregate(queryPattern);
      }

      return res.json(responseData("BET_LIST", queryResponse, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  betList: async (req, res) => {
    try {
      const { type, betType, status, last } = req.query;
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

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let total;

      let searchObj = {...matchPlayerFilter};
      
      let queryResponse;

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

      if (betType && betType === "casino") {
        queryResponse = await CasinoBet.aggregate([{$match: searchObj,},{ $skip: startIndex},{$limit: limit},{ $sort:{timeInserted:-1}}]);
        total = await CasinoBet.countDocuments(searchObj);
      }

      let NewSearchObj = {...searchObj};

      NewSearchObj.isDeclared =true;
      if (type) {
        NewSearchObj.eventType = type;
      }

      if (status) {
        if(status=='unmatched' || status=='matched')
        {
          NewSearchObj.isMatched = (status=='matched')?true:false;
        }else{
          NewSearchObj.status = status;
        }
      }
      NewSearchObj.eventType = type;

      if (type && betType && betType === "sportBook") {
        
        queryResponse = await SportBookBet.aggregate([{
          $match: NewSearchObj,
        },{ $skip: startIndex},{$limit: limit},{ $sort:{timeInserted:-1}}]);
        total = await SportBookBet.countDocuments(NewSearchObj);
      }

      if (type && betType && betType === "fancy") {
        NewSearchObj.eventType = type;
        queryResponse = await SessionBet.aggregate([{
          $match: NewSearchObj,
        },{ $skip: startIndex},{$limit: limit},{ $sort:{timeInserted:-1}}]);
        total = await SessionBet.countDocuments(NewSearchObj);
      }

      if (betType !== "fancy" && betType !== "sportBook" && betType !== "casino") {
        if (type && betType && betType === "bookmaker") {
          NewSearchObj.eventType = type;
          NewSearchObj.betFaireType = betType;
        }
        if (type && betType && (betType === "betfair" || betType === "betFair")) {
          NewSearchObj.eventType = type;
          NewSearchObj.betFaireType ={$in:["betFair","betfair"]};
        }
        queryResponse = await Bet.aggregate([{
          $match: NewSearchObj,
        },{ $skip: startIndex},{$limit: limit},{ $sort:{timeInserted:-1}}]);
        total = await Bet.countDocuments(NewSearchObj);
        // console.log('total',total, NewSearchObj)
      }

      let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)
  
      let matchResponse = {
          data: queryResponse,
          count: queryResponse.length,
          ...paginateObj
      }

      return res.json(responseData("BET_LIST", matchResponse, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  rejectedBetList: async (req, res) => {
    try {
      const { type, betType } = req.query;

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

      let searchObj = {
        ...matchPlayerFilter,
        isDeleted: true,
      };
      var queryPattern = [
        {
          $match: searchObj,
        },
      ];
      let queryResponse;

      if (type) {
        searchObj.eventType = type;
      }

      queryPattern.push({ $sort:{timeInserted:-1}});

      if (type && betType && betType === "sportBook") {
        searchObj.eventType = type;
        queryResponse = await SportBookBet.aggregate(queryPattern);
      }

      if (type && betType && betType === "fancy") {
        searchObj.eventType = type;
        queryResponse = await SessionBet.aggregate(queryPattern);
      }

      if (betType !== "fancy" && betType !== "sportBook") {
        if (type && betType && betType === "bookmaker") {
          searchObj.eventType = type;
          searchObj.betFaireType = betType;
        }
        if (type && betType && (betType === "betfair" || betType === "betFair")) {
          searchObj.eventType = type;
          searchObj.betFaireType = {$in:["betFair","betfair"]};
        }
        queryResponse = await Bet.aggregate(queryPattern);
      }

      return res.json(responseData("BET_LIST", queryResponse, req, true));
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  betHistory: async (req, res) => {
    try {
      const { type, betType, status, userType, id, userId } = req.query;
      let { fromPeriod, toPeriod, filterByDay } = req.query;

      let searchObj = {};

      if(userId){
        searchObj.userId = ObjectId(userId)
      }

      if(userType && userType === "owner") {
        searchObj.ownerId = ObjectId(id);
      }
      if(userType === "sub_owner"){
        searchObj.subOwnerId = ObjectId(id)
      }
      if(userType === "super_admin"){
        searchObj.superAdminId = ObjectId(id)
      }
      if(userType === "admin"){
        searchObj.adminId = ObjectId(id)
      }
      if(userType === "sub_admin"){
        searchObj.subAdminId = ObjectId(id)
      }
      if(userType === "senior_super"){
        searchObj.superSeniorId = ObjectId(id)
      }
      if(userType === "super_agent"){
        searchObj.superAgentId = ObjectId(id)
      }
      if(userType === "agent"){
        searchObj.agentId = ObjectId(id)
      }
      if(userType === "user"){
        searchObj.userId = ObjectId(id)
      }

      var queryPattern = [
        {
          $match: searchObj,
        },
      ];
      let matchResponse;

      if (status) {
        if(status=="active")
        {
          searchObj.status ={$in:['active','pending']};
        }else{
          searchObj.status = status;
        }
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let total;

      if(fromPeriod){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = new Date(fromPeriod)
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
      // if (last) {
      //   queryPattern.push({ $limit: Number(last) });
      // }

      queryPattern.push({ $sort:{timeInserted:-1}});

      queryPattern.push({$skip: startIndex})
      queryPattern.push({ $limit: limit});

      if (betType && betType === "sportBook") {
        matchResponse = await SportBookBet.aggregate(queryPattern);
        total = await SportBookBet.countDocuments(searchObj);
      }

      if (betType && betType === "fancy") {
        matchResponse = await SessionBet.aggregate(queryPattern);
        total = await SessionBet.countDocuments(searchObj);
      }
      
      if (betType && betType === "casino") {
        matchResponse = await CasinoBet.aggregate(queryPattern);
        total = await CasinoBet.countDocuments({});
      }

      if (betType !== "fancy" && betType !== "sportBook" && betType !== "casino") {
        if (betType && betType === "bookmaker") {
          searchObj.betFaireType = betType;
        }
        if (betType && (betType === "betfair" || betType === "betFair")) {
          searchObj.betFaireType ={$in:["betFair","betfair"]};
        }
        matchResponse = await Bet.aggregate(queryPattern);
        total = await Bet.countDocuments(searchObj);
      }

      let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)
  
      let queryResponse = {
          data: matchResponse,
          count: matchResponse.length,
          ...paginateObj
      }

      return res.json(responseData("BET_LIST", queryResponse, req, true));

    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  betHistoryWithMatch: async (req, res) => {
    try {
      const { betType, status, last, userType, id } = req.query;
      let { fromPeriod, toPeriod, filterByDay } = req.query;
      let userBType = userType ? userType : req.user.userType;
      let userId = id ? id : req.user._id
      let regexFilter = {};
      let searchObj = {};
      const betFilter = {};

      return res.json(responseData("ERROR_OCCUR", "", req, false));
      
      if(userBType && userBType === "owner") {
        betFilter.ownerId = ObjectId(userId);
      }
      if(userBType === "sub_owner"){
        betFilter.subOwnerId = ObjectId(userId)
      }
      if(userBType === "super_admin"){
        betFilter.superAdminId = ObjectId(userId)
      }
      if(userBType === "admin"){
        betFilter.adminId = ObjectId(userId)
      }
      if(userBType === "sub_admin"){
        betFilter.subAdminId = ObjectId(userId)
      }
      if(userBType === "senior_super"){
        betFilter.superSeniorId = ObjectId(userId)
      }
      if(userBType === "super_agent"){
        betFilter.superAgentId = ObjectId(userId)
      }
      if(userBType === "agent"){
        betFilter.agentId = ObjectId(userId)
      }
      if(userBType === "user"){
        betFilter.userId = ObjectId(userId)
      }

      searchObj = {...betFilter};

      searchObj.isDeclared=true;
      
      if (status) {
        searchObj.status = status;
      }

      if(fromPeriod){
        fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
        fromPeriod = new Date(fromPeriod)
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

      if (betType !== "fancy" && betType !== "sportBook") {
        if (betType && betType === "bookmaker") {
          searchObj.betFaireType = betType;
        }
        if (betType && (betType === "betfair" || betType === "betFair")) {
          searchObj.betFaireType ={$in:["betFair","betfair"]};
        }
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      if(betType=='bookmaker')
      {
        regexFilter.eventId={$in:await Bet.distinct('eventId', searchObj)}
      }else if(betType=='sportbook')
      {
        regexFilter.eventId={$in:await SportBookBet.distinct('eventId', searchObj)}
      }else if(betType=='fancy')
      {
        regexFilter.eventId={$in:await SessionBet.distinct('eventId', searchObj)}
      }else
      {
        regexFilter.eventId={$in:await Bet.distinct('eventId', searchObj)}
      }
      const total = await Match.countDocuments(regexFilter);
      // console.log('searchObj-----------',searchObj, regexFilter)           

      let matchResponse;
      // fancy OR betFair OR bookmaker OR sportbook
      if(betType=='bookmaker')
      {
          matchResponse = await Match.aggregate([
              
              {
                  $lookup: {
                          from: 'bets',
                          let: {
                              addr: '$marketId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$marketId', '$$addr'] },
                                      betFaireType:"bookmaker",
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);
      }else if(betType=='sportbook')
      {
          matchResponse = await Match.aggregate([
              // {
              //     $lookup: {
              //             from: 'tournaments',
              //             let: {
              //                 addr: '$seriesId'
              //             },
              //             pipeline: [
              //                 {
              //                     $match: { 
              //                         $expr: { $eq: [ '$seriesId', '$$addr'] },
              //                         status:'active'
              //                     }
              //                 },
              //                 {
              //                     $project:{
              //                         _id:1,
              //                         seriesId:1,
              //                         seriesName:1
              //                     }
              //                 },
              //                 { $sort:{eventDateTime:1} },
              //             ],
              //             as: 'tournament'
              //     }
              // },
              // {
              //     $unwind:{
              //         path: '$tournament',
              //         preserveNullAndEmptyArrays: true,
              //     }
              // },
              {
                  $lookup: {
                          from: 'sports_book_bets',
                          let: {
                              addr: '$marketId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$marketId', '$$addr'] },
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);
      }else if(betType=='fancy')
      {
          matchResponse = await Match.aggregate([
              {
                  $lookup: {
                          from: 'tournaments',
                          let: {
                              addr: '$seriesId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$seriesId', '$$addr'] },
                                      status:'active'
                                  }
                              },
                              {
                                  $project:{
                                      _id:1,
                                      seriesId:1,
                                      seriesName:1
                                  }
                              },
                              { $sort:{eventDateTime:1} },
                          ],
                          as: 'tournament'
                  }
              },
              {
                  $unwind:{
                      path: '$tournament',
                      preserveNullAndEmptyArrays: true,
                  }
              },
              {
                  $lookup: {
                          from: 'session_bets',
                          let: {
                              addr: '$marketId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$marketId', '$$addr'] },
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);

      }else
      {
          matchResponse = await Match.aggregate([
              {
                  $lookup: {
                          from: 'tournaments',
                          let: {
                              addr: '$seriesId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$seriesId', '$$addr'] },
                                      status:'active'
                                  }
                              },
                              {
                                  $project:{
                                      _id:1,
                                      seriesId:1,
                                      seriesName:1
                                  }
                              },
                              { $sort:{eventDateTime:1} },
                          ],
                          as: 'tournament'
                  }
              },
              {
                  $unwind:{
                      path: '$tournament',
                      preserveNullAndEmptyArrays: true,
                  }
              },
              {
                  $lookup: {
                          from: 'bets',
                          let: {
                              addr: '$marketId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$marketId', '$$addr'] },
                                      betFaireType:{$in:["betFair","betfair"]},
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);

      }

      let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)
  
      let queryResponse = {
          data: matchResponse,
          count: matchResponse.length,
          ...paginateObj
      }

      return res.json(responseData("BET_LIST", queryResponse, req, true));
      
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  betProfitLoss: async (req, res) => {
    try {
      let { betType, userType, id, fromPeriod, toPeriod, filterByDay } = req.query;
      userType = userType ? userType : req.user.userType;
      id = id ? id : req.user._id;

      // return res.json(responseData("ERROR_OCCUR", "", req, false));

      let regexFilter = {};
      let searchObj = {
        isDeclared: true
      };
      const betFilter = {};
      
      if(userType && userType === "owner") {
        betFilter.ownerId = ObjectId(id);
      }
      if(userType === "sub_owner"){
        betFilter.subOwnerId = ObjectId(id)
      }
      if(userType === "super_admin"){
        betFilter.superAdminId = ObjectId(id)
      }
      if(userType === "admin"){
        betFilter.adminId = ObjectId(id)
      }
      if(userType === "sub_admin"){
        betFilter.subAdminId = ObjectId(id)
      }
      if(userType === "senior_super"){
        betFilter.superSeniorId = ObjectId(id)
      }
      if(userType === "super_agent"){
        betFilter.superAgentId = ObjectId(id)
      }
      if(userType === "agent"){
        betFilter.agentId = ObjectId(id)
      }
      if(userType === "user"){
        betFilter.userId = ObjectId(id)
      }

      searchObj = {...betFilter};

      if(betType==='bookmaker')
      {
          searchObj.reportType ="bookmaker";
          
      }else if(betType==='betFair' || betType==='betfair')
      {
          searchObj.reportType ={$in:["betFair","betfair"]};
      }else if(betType==='sportbook' || betType==='fancy'){
          searchObj.reportType = betType;
      }

      if(fromPeriod){
          fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
          fromPeriod = new Date(fromPeriod)
          // console.log("fromPeriod", fromPeriod)
          regexFilter.eventDateTime = {$gte: fromPeriod}
      }
      if(toPeriod){
          toPeriod = moment(toPeriod).format("MM-DD-YYYY")
          toPeriod = new Date(toPeriod)
          toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
          toPeriod = new Date(toPeriod)
          regexFilter.eventDateTime = {$lt: toPeriod}
      }
      if(filterByDay === "today"){
          fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
          fromPeriod = moment().startOf('day')
          fromPeriod = new Date(fromPeriod)
          regexFilter.eventDateTime = {$gte: fromPeriod}
      }
      if(filterByDay === "yesterday"){
          fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
          fromPeriod = moment().startOf('day')
          fromPeriod = moment(fromPeriod).subtract(1,'day')
          fromPeriod = new Date(fromPeriod)
          regexFilter.eventDateTime = {$gte: fromPeriod}
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      regexFilter.eventId={$in:await Report.distinct('eventId', searchObj)}
      let total;
      if (betType === "casino") {
        total = await CasinoBet.countDocuments({});
      }else{
        total = await Match.countDocuments(regexFilter);
      }
      // console.log('searchObj-----------',searchObj)           

      let matchResponse;
      // fancy OR betFair OR bookmaker OR sportbook
      if (betType === "casino") {
          matchResponse = await CasinoBet.aggregate([
            {
              $match:searchObj
            },
            { $sort:{timeInserted:-1} 
            }
          ]);
      }else if(betType=='bookmaker')
      {
          matchResponse = await Match.aggregate([
              {
                  $lookup: {
                          from: 'tournaments',
                          let: {
                              addr: '$seriesId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$seriesId', '$$addr'] },
                                      status:'active'
                                  }
                              },
                              {
                                  $project:{
                                      _id:1,
                                      seriesId:1,
                                      seriesName:1
                                  }
                              },
                              { $sort:{eventDateTime:1} },
                          ],
                          as: 'tournament'
                  }
              },
              {
                  $unwind:{
                      path: '$tournament',
                      preserveNullAndEmptyArrays: true,
                  }
              },
              {
                  $lookup: {
                          from: 'bets',
                          let: {
                              addr: '$eventId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$eventId', '$$addr'] },
                                      betFaireType:"bookmaker",
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:-1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);
      }else if(betType=='sportbook')
      {
          matchResponse = await Match.aggregate([
              {
                  $lookup: {
                          from: 'tournaments',
                          let: {
                              addr: '$seriesId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$seriesId', '$$addr'] },
                                      status:'active'
                                  }
                              },
                              {
                                  $project:{
                                      _id:1,
                                      seriesId:1,
                                      seriesName:1
                                  }
                              },
                              { $sort:{eventDateTime:1} },
                          ],
                          as: 'tournament'
                  }
              },
              {
                  $unwind:{
                      path: '$tournament',
                      preserveNullAndEmptyArrays: true,
                  }
              },
              {
                  $lookup: {
                          from: 'sports_book_bets',
                          let: {
                              addr: '$marketId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$marketId', '$$addr'] },
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:-1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);
      }else if(betType=='fancy')
      {
          matchResponse = await Match.aggregate([
              {
                  $lookup: {
                          from: 'tournaments',
                          let: {
                              addr: '$seriesId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$seriesId', '$$addr'] },
                                      status:'active'
                                  }
                              },
                              {
                                  $project:{
                                      _id:1,
                                      seriesId:1,
                                      seriesName:1
                                  }
                              },
                              { $sort:{eventDateTime:1} },
                          ],
                          as: 'tournament'
                  }
              },
              {
                  $unwind:{
                      path: '$tournament',
                      preserveNullAndEmptyArrays: true,
                  }
              },
              {
                  $lookup: {
                          from: 'session_bets',
                          let: {
                              addr: '$eventId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$eventId', '$$addr'] },
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:-1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);

      }else
      {
          matchResponse = await Match.aggregate([
              {
                  $lookup: {
                          from: 'tournaments',
                          let: {
                              addr: '$seriesId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$seriesId', '$$addr'] },
                                      status:'active'
                                  }
                              },
                              {
                                  $project:{
                                      _id:1,
                                      seriesId:1,
                                      seriesName:1
                                  }
                              },
                              { $sort:{eventDateTime:1} },
                          ],
                          as: 'tournament'
                  }
              },
              {
                  $unwind:{
                      path: '$tournament',
                      preserveNullAndEmptyArrays: true,
                  }
              },
              {
                  $lookup: {
                          from: 'bets',
                          let: {
                              addr: '$marketId'
                          },
                          pipeline: [
                              {
                                  $match: { 
                                      $expr: { $eq: [ '$marketId', '$$addr'] },
                                      betFaireType:{$in:["betFair","betfair"]},
                                      ...betFilter
                                  }
                              }
                          ],
                          as: 'bets_list'
                  }
              },
              {
                  $match:regexFilter
              },
              { $sort:{eventDateTime:1} },
              {
                  $skip: startIndex
              },
              {
                  $limit: limit
              },
              {
                  $project:{
                      '_id':'$_id',
                      'gameType': '$gameType',
                      'tournamentId':'$tournamentId',
                      'seriesId': '$seriesId',
                      'eventId': '$eventId',
                      'marketId': '$marketId',
                      'centralizedId': '$centralizedId',
                      'bookmakerMarketId': '$bookmakerMarketId',
                      'bookmakerCentralizedId': '$bookmakerCentralizedId',
                      'isMarketDataDelayed': '$isMarketDataDelayed',
                      'eventName': '$eventName',
                      'countryCode': '$countryCode',
                      'venue': '$venue',
                      'timeZone': '$timeZone',
                      'eventDateTime': '$eventDateTime',
                      'status':'$status',
                      'eventType':"$eventType",
                      'seriesName':"$tournament.seriesName",
                      "bets_list":"$bets_list"
                  }
              }
          ]);

      }

      let paginateObj = await getPaginateObj(total,limit,page,startIndex,endIndex)
  
      let queryResponse = {
          data: matchResponse,
          count: matchResponse.length,
          ...paginateObj
      }

      return res.json(responseData("BET_LIST", queryResponse, req, true));

      // let searchObj = {
      //   isDeclared: true
      // };

      // if(userId){
      //   searchObj.userId = ObjectId(userId)
      // }

      // if(userType && userType === "owner") {
      //   searchObj.ownerId = ObjectId(id);
      // }
      // if(userType === "sub_owner"){
      //   searchObj.subOwnerId = ObjectId(id)
      // }
      // if(userType === "super_admin"){
      //   searchObj.superAdminId = ObjectId(id)
      // }
      // if(userType === "admin"){
      //   searchObj.adminId = ObjectId(id)
      // }
      // if(userType === "sub_admin"){
      //   searchObj.subAdminId = ObjectId(id)
      // }
      // if(userType === "senior_super"){
      //   searchObj.superSeniorId = ObjectId(id)
      // }
      // if(userType === "super_agent"){
      //   searchObj.superAgentId = ObjectId(id)
      // }
      // if(userType === "agent"){
      //   searchObj.agentId = ObjectId(id)
      // }
      // if(userType === "user"){
      //   searchObj.userId = ObjectId(id)
      // }

      // var queryPattern = [
      //   {
      //     $match: searchObj,
      //   },
      // ];
      // let queryResponse;

      // if (status) {
      //   searchObj.status = status;
      // }

      // if(fromPeriod){
      //   fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
      //   fromPeriod = new Date(fromPeriod)
      //   searchObj.eventDateTime = {$gte: fromPeriod}
      // }
      // if(toPeriod){
      //   toPeriod = moment(toPeriod).format("MM-DD-YYYY")
      //   toPeriod = new Date(toPeriod)
      //   toPeriod = toPeriod.setDate(toPeriod.getDate() + 1)
      //   toPeriod = new Date(toPeriod)
      //   searchObj.eventDateTime = {$lt: toPeriod}
      // }
      // if(filterByDay === "today"){
      //   fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
      //   fromPeriod = moment().startOf('day')
      //   fromPeriod = new Date(fromPeriod)
      //   searchObj.eventDateTime = {$gte: fromPeriod}
      // }
      // if(filterByDay === "yesterday"){
      //   fromPeriod = moment(fromPeriod).format("MM-DD-YYYY")
      //   fromPeriod = moment().startOf('day')
      //   fromPeriod = moment(fromPeriod).subtract(1,'day')
      //   fromPeriod = new Date(fromPeriod)
      //   searchObj.eventDateTime = {$gte: fromPeriod}
      // }
      // if (last) {
      //   queryPattern.push({ $limit: Number(last) });
      // }

      // queryPattern.push({ $sort:{eventDateTime:-1}});

      // if (betType && betType === "sportBook") {
      //   queryResponse = await SportBookBet.aggregate(queryPattern);
      // }

      // if (betType && betType === "fancy") {
      //   queryResponse = await SessionBet.aggregate(queryPattern);
      // }

      // if (betType !== "fancy" && betType !== "sportBook") {
      //   if (betType && betType === "bookmaker") {
      //     searchObj.betFaireType = betType;
      //   }
      //   if (betType && (betType === "betfair" || betType === "betFair")) {
      //     // searchObj.betFaireType = betType;
      //     searchObj.betFaireType ={$in:["betFair","betfair"]};
      //   }
      //   queryResponse = await Bet.aggregate(queryPattern);
      // }
    } catch (error) {
      console.log("error", error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  // bet list api
  events_bets: async (req, res) => {
    try {
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
      let matched = await Bet.aggregate([
              {
                  $match:{
                    ...matchPlayerFilter,
                    eventId:req?.query?.eventId,
                    isMatched:true,
                    betFaireType:{$in:["betFair","betfair"]}
                  }
              },
          ]);
          let unMatched = await Bet.aggregate([
              {
                $match:{
                    ...matchPlayerFilter,
                    eventId:req?.query?.eventId,
                    isMatched:false,
                    betFaireType:{$in:["betFair","betfair"]}
                }
              },
          ]);

          const BetFairBet ={matched, unMatched};

          const BookmakerBet = await Bet.aggregate([
              {
                $match:{
                    ...matchPlayerFilter,
                    eventId:req?.query?.eventId,
                    betFaireType:"bookmaker"
                }
              },
          ]);

          const FancyBet = await SessionBet.aggregate([
              {
                  $match:{
                      ...matchPlayerFilter,
                      eventId:req?.query?.eventId
                  }
              },
          ]);

          const SportBooksBet = await SportBookBet.aggregate([
              {
                  $match:{
                      ...matchPlayerFilter,
                      eventId:req?.query?.eventId
                  }
              },
          ]);

          return res.json(responseData("BET_LIST", {BetFairBet, BookmakerBet, FancyBet, SportBooksBet}, req, true));

      } catch (error) {
          console.log('error',error);
          return res.json(responseData("ERROR_OCCUR", error, req, false));
      }
  },
  event_session_bets: async (req, res) => {
    try {
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
        let matched = await SessionBet.aggregate([
              {
                  $match:{
                    ...matchPlayerFilter,
                    eventId:req?.query?.eventId,
                  }
              },
          ]);
          return res.json(responseData("BET_LIST",matched, req, true));

      } catch (error) {
          console.log('error',error);
          return res.json(responseData("ERROR_OCCUR", error, req, false));
      }
  },
  user_events_bets: async (req, res) => {
    try {
        let matched = await Bet.aggregate([
              {
                  $match:{
                    eventId:req?.query?.eventId,
                    userId:ObjectId(req?.query?.userId),
                    isMatched:true,
                    // betFaireType:{$in:["betFair","betfair"]}
                  }
              },
          ]);
          return res.json(responseData("BET_LIST",matched, req, true));

      } catch (error) {
          console.log('error',error);
          return res.json(responseData("ERROR_OCCUR", error, req, false));
      }
  },
  prematch_events_bets: async (req, res) => {
    try {
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
        let matched = await Bet.aggregate([
              {
                  $match:{
                    ...matchPlayerFilter,
                    eventId:req?.query?.eventId,
                    isMatched:true,
                    // betFaireType:{$in:["betFair","betfair"]}
                  }
              },
          ]);
          return res.json(responseData("BET_LIST",matched, req, true));

      } catch (error) {
          console.log('error',error);
          return res.json(responseData("ERROR_OCCUR", error, req, false));
      }
  },
  update_bet_status: async (req, res) => {
    try {
            
      let { status, betId, betType } = req.body;
      const { _id } = req.user;
      const admin = await Admin.findOne({ _id})
      if(!req.body?.password)
      {
          return res.json(responseData("PASSWORD_REQUIRED", {}, req, false));
      }
      if(!admin){
          return res.json(responseData("INVALID_USER", {}, req, false));
      }
      const match = await bcrypt.compare(req.body?.password, admin.password)
      if (match) {
        let query;
        if (betType =='casino') {
          query = await CasinoBet.findOneAndUpdate({
              platformTxId:betId
            },
            {
                $set:{status}
            },
            { returnOriginal: false 
          });

          const deletedTransactions = await Transaction.find({selectionId:betId})

          await DeletedTransaction.insertMany(deletedTransactions)
          await Transaction.deleteMany({selectionId:betId});
          const deleteReports = await Report.find({selectionId:betId})
          await DeletedReport.insertMany(deleteReports)
          await Report.deleteMany({selectionId:betId});

          return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));
          
        }else if (status =='cancelled' || status =='voided') {
              query = await Bet.findOneAndUpdate({
                          matchBetId:betId
                        },
                        {
                            $set:{status:"deleted"}
                        },
                        { returnOriginal: false });
              const deletedTransactions = await Transaction.find({betId})

              await DeletedTransaction.insertMany(deletedTransactions)
              await Transaction.deleteMany({betId});
              const deleteReports = await Report.find({betId})
              await DeletedReport.insertMany(deleteReports)
              await Report.deleteMany({betId});

              return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));
              
        }else
        {
            query = await Match.updateMany({
                      eventId:req.body?.eventId
                  },
                  {
                      $set:{status:status}
                  },
                  { returnOriginal: false });

                  const query = await Bet.findOneAndUpdate({
                    matchBetId:betId
                  },
                  {
                      $set:{status:status, isDeleted:true}
                  },
                  { returnOriginal: false });

              const deletedTransactions = await Transaction.find({betId})

              await DeletedTransaction.insertMany(deletedTransactions)
              await Transaction.deleteMany({betId});
              const deleteReports = await Report.find({betId})
              await DeletedReport.insertMany(deleteReports)
              await Report.deleteMany({betId});

              return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));
          
        }
      } else {
          return res.json(responseData("INVALID_PASSWORD", {}, req, false));
      }

    } catch (error) {
        return res.json(responseData(error.message, {}, req, false));
    }
  }
};
