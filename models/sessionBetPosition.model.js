const mongoose = require("mongoose");

const SessionBetPositionSchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'matches',
        default:null
    },
    sessionBetId: {
        type: String,
        required:false
    },
    seriesId: {
        type: String,
        required:false
    },
    eventId: {
        type: String,
        required:false
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    marketId: {
        type: String,
        required:false
    },
    fancyId: {
        type: String,
        required:false
    },
    selectionId: {
        type: String,
        required:false
    },
    wonTeamSelectionId: {
        type: String,
        required:false
    },
    type: {
        type: String,
        required:false
    },
    oddsType: {
        type: String,
        required:false
    },
    betRun:{
        type: Number,
        default: 0,
    },
    lossRunRange:{
        type: Number,
        default: 0,
    },
    profitRunRange:{
        type: Number,
        default: 0,
    },
    decisionRun:{
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        default: 0,
    },
    bhav: {
        type: String,
        required:false
    },
    positionLoseAmount:{
        type: Number,
        default: 0,
    },
    positionProfitAmount:{
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum : ["pending","success","failed"],
        default: "success",
    },
    isDeleted: {
        type:Boolean,
        default:false
    },
    jsonData: []
},
{
    timestamps: true,
    toObject : {getters: true,setters: true, virtuals: false},
    toJSON : {getters: true, setters: true, virtuals: false}
});
 
const SessionBetPosition = mongoose.model("session_bet_position", SessionBetPositionSchema);

module.exports = SessionBetPosition;