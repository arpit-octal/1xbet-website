const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    gameType: {
        type: String,
        enum: ["cricket", "tennis", "soccer", "casino"],
        default: "cricket",
    },
    eventType: {
        type: String,
        enum: [4, 2, 1, -1],
        default: 4,
    },
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournaments',
        default: null
    },
    seriesId: {
        type: String,
        required: [true, 'please add series id']
    },
    eventId: {
        type: String,
        required: [true, 'please add event id']
    },
    marketId: {
        type: String,
        required: false
    },
    totalMatched: {
        type: String,
        required: false
    },
    centralizedId: {
        type: String,
        required: false,
        default: null,
    },
    bookmakerMarketId: {
        type: String,
        required: false
    },
    bookmakerCentralizedId: {
        type: String,
        required: false
    },
    eventName: {
        type: String,
        default: null,
    },
    venue: {
        type: String,
        default: null,
    },
    timeZone: {
        type: String,
        default: null,
    },
    eventDateTime: {
        type: Date,
        default: null,
    },
    marketCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["upcoming", "in_play", "tie", "completed", "abounded", "delete", "delay", "pending", "active"], //,"pending","active","suspend","locked",""
        default: "upcoming",
    },
    match: {
        type: String,
        enum: ["on", "off"],
        default: "on",
    },
    matchOdds: {
        type: String,
        enum: ["on", "off"],
        default: "on",
    },
    bookMaker: {
        type: String,
        enum: ["on", "off"],
        default: "on",
    },
    fancy: {
        type: String,
        enum: ["on", "off"],
        default: "on",
    },
    premiumFancy: {
        type: String,
        enum: ["on", "off"],
        default: "on",
    },
    IsMarketDataDelayed: {
        type: Boolean,
        default: false
    },
    MarketTime: {
        type: Date,
        default: null,
    },
    SuspendTime: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    winner: {
        type: String,
        default: null
    },
    bookMakerWinner: {
        type: String,
        default: null
    },
    isBetFairDeclared: {
        type: Boolean,
        default: false
    },
    isBetFairDeclaredType: {
        type: String,
        default: "Manual"
    },
    isBookmakerDeclared: {
        type: Boolean,
        default: false
    },
    isBookmakerDeclaredType: {
        type: String,
        default: "Manual"
    },
    ip: {
        type: String,
        required: false
    },
    isFancyDeclared: {
        type: Boolean,
        default: false
    },
    isFancyDeclaredType: {
        type: String,
        default: "Manual"
    },
    isSportBookDeclared: {
        type: Boolean,
        default: false
    },
    isSportBookDeclaredType: {
        type: String,
        default: "Manual"
    },
    channel: {
        type: String,
        default: false
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    subOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    superAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    subAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    superSeniorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    superAgentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    scoreId: {
        type: String,
        default: 0
    },
    sourceID: {
        type: String,
        default: "0",
    },
    jsonData: [],
    jsonBookmakerData: [],
    matchSetting: [],
    fancyType: {
        type: String,
        default: "",
    },
    bookmakerType: {
        type: String,
        default: "betfair",
    },
    provider: {
        type: String,
        default: "betfair",
    },
    adsContent: {
        type: String,
        default: ""
    },
    adsStatus: {
        type: Boolean,
        default: false
    },
    isTvOn: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: false },
        toJSON: { getters: true, setters: true, virtuals: false }
    });

const Match = mongoose.model("match", MatchSchema);

module.exports = Match;
