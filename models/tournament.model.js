const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
    gameType: {
        type: String,
        enum : ["cricket", "tennis", "soccer","casino"],
        default: "cricket",
    },
    sportBetFairId: {
        type: Number,
        default: 0,
    },
    seriesId: {
        type: String,
        required:[true,'please add series id']
    },
    seriesName: {
        type: String,
        required:[true,'please add series name']
    },
    sourceID: {
        type: String,
        default: "0",
    },
    competitionRegion: {
        type: String,
        default: "UTC",
    },
    marketCount: {
        type: String,
        default: "UTC",
    },
    status: {
        type: String,
        enum : ["active","suspend","locked"],
        default: "active",
    },
    matchOdds: {
        type: String,
        enum : ["on","off"],
        default: "on",
    },
    bookMaker: {
        type: String,
        enum : ["on","off"],
        default: "on",
    },
    fancy: {
        type: String,
        enum : ["on","off"],
        default: "on",
    },
    premiumFancy: {
        type: String,
        enum : ["on","off"],
        default: "on",
    },
    isDeleted: {
        type:Boolean,
        default:false
    },
    matchSetting:[]
},
{ 
    timestamps: true,
    toObject : {getters: true,setters: true, virtuals: false},
    toJSON : {getters: true, setters: true, virtuals: false}
 });
 
 const Tournament = mongoose.model("tournament", TournamentSchema);

 module.exports = Tournament;