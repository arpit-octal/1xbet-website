const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
var axios = require("axios").default;
var qs = require('qs');
const moment = require("moment");
const { responseData } = require('../../helpers/responseData');
const Transaction = require("../../models/transaction.model");
const SportBookBet = require("../../models/sportsBookBet.model");
const SportBook = require("../../models/sportBook.model");
const Match = require("../../models/match.model");
const { ObjectId } = require('mongodb');
const async = require('async');

router.all("/premiumMarketsWithBets/:id", express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('ss',{eventId:req.params.id, isDeclared:false,status:{$ne:"deleted"}})
    const SportBookBets = await SportBook.aggregate([
        {
          $match: {marketId:{$in: await SportBookBet.distinct('marketId', {eventId:{$in:await Match.distinct('eventId',{eventId:req.params.id, status:{$in:['in_play']}})}, isDeclared:false,status:{$ne:"deleted"}})}}
        },
        {
          $group: {
            _id: {eventId:"$eventId",marketId:"$marketId"}, 
            matchName : { $first: '$matchName' },
            eventType : { $first: '$eventType' },
            eventName : { $first: '$matchName' },
            marketName : { $first: '$fancyName' },
            marketId : { $first: '$selectionId' },
            selections: { $first: '$jsonData' },
          }
        },
        {
            $project:{
                _id:"$_id._id",
                eventId:"$_id.eventId",
                marketId:1,
                matchName:1,
                eventType:1,
                eventName:1,
                marketName:1,
                selections:1,
                // data:1
            }
        }

    ]);
    respData = {
        "status": true,
        "events": SportBookBets,
    };
    res.status(200).json(respData);
});

router.all("/premiumMarketsWithBets", express.raw({ type: 'application/json' }), async (req, res) => {
    const SportBookBets = await SportBook.aggregate([
        {
          $match: {marketId:{$in: await SportBookBet.distinct('marketId', {eventId:{$in:await Match.distinct('eventId',{status:{$in:['in_play']}})}, isDeclared:false,status:{$ne:"deleted"}})}}
        },
        {
          $group: {
            _id: {eventId:"$eventId",marketId:"$marketId"}, 
            matchName : { $first: '$matchName' },
            eventType : { $first: '$eventType' },
            eventName : { $first: '$matchName' },
            marketName : { $first: '$fancyName' },
            marketId : { $first: '$selectionId' },
            selections: { $first: '$jsonData' },
          }
        },
        {
            $project:{
                _id:"$_id._id",
                eventId:"$_id.eventId",
                marketId:1,
                matchName:1,
                eventType:1,
                eventName:1,
                marketName:1,
                selections:1,
                // data:1
            }
        }

    ]);
    respData = {
        "status": true,
        "events": SportBookBets,
    };
    res.status(200).json(respData);
});

module.exports = router;