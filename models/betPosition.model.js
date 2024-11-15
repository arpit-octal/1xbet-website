const mongoose = require("mongoose");

const BetPositionSchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'matches',
        default:null
    },
    matchBetId: {
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
    bookmakerMarketId: {
        type: String,
        required:false
    },
    betfairSelectionId: {
        type: String,
        required:false
    },
    bookmakerSelectionId: {
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
    betType: {
        type: String,
        required:false
    },
    oddsType: {
        type: String,
        required:false
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
 
const BetPosition = mongoose.model("bet_position", BetPositionSchema);

module.exports = BetPosition;