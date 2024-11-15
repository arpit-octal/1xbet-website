const mongoose = require("mongoose");

const SportBookPremiumFancySchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournaments',
        default: null
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'matches',
        default: null
    },
    matchName: {
        type: String,
        default: null,
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
        required: [true, 'please add market id']
    },
    selectionId: {
        type: String,
        required: [false, 'please add selection id']
    },
    premiumFancyId: {
        type: String,
        required: false
    },
    centralizedId: {
        type: String,
        required: false
    },
    premiumFancyName: {
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
    jsonData: [],
    marketStatus: {
        type: Number,
        default: 0,
    },
    marketType: {
        type: Number,
        default: null,
    },
    categoryType: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "open", "close", "locked"],
        default: "pending",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    wonSelectionId: {
        type: Number,
        default: 0,
    },
    isDeclared: {
        type: Boolean,
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
    fancySelectionId: {
        type: String,
        required: false
    },
},
    {
        timestamps: true,
    });

const sportBookPremiumFancyModel = mongoose.model("sportBookPremiumFancy", SportBookPremiumFancySchema);

module.exports = sportBookPremiumFancyModel;