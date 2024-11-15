const mongoose = require("mongoose");

const SportBookBetPositionSchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'matches',
        default:null
    },
    SportBookBetId: {
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
    fancySelectionId: {
        type: String,
        required:false
    },
    apiSiteSelectionId: {
        type: String,
        required:false
    },
    apiSiteSpecifier: {
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
    amount: {
        type: Number,
        default: 0,
    },
    bhav: {
        type: String,
        required:false
    },
    betBhav: {
        type: Number,
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
 
const SportBookBetPosition = mongoose.model("sport_book_bet_position", SportBookBetPositionSchema);

module.exports = SportBookBetPosition;