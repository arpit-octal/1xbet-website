const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
    matchBetId: {
        type: String,
        required:false
    },
    eventType: {
        type: String,
        enum : [4, 2,1,-1],
        default: 4,
    },
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'tournaments',
        default:null
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'matches',
        default:null
    },
    matchName: {
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
    clientName: {
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
    betfairCentralizedId: {
        type: String,
        required:false
    },
    bookmakerCentralizedId: {
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
    decisionType:{
        type:String,
        default:'Manual'
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
        required:false
    },
    bhav: {
        type: String,
        required:false
    },
    timeInserted:{
        type: Date,
        required:false
    },
    teamName:{
        type: String,
        required:false
    },
    teamSelectionWin:{
        type: String,
        required:false
    },
    profitAmount:{
        type: Number,
        default: 0,
    },
    loseAmount:{
        type: Number,
        default: 0,
    },
    commissionType: {
        type: String,
        required:false
    },
    commission: {
        type: Number,
        default: 0,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    subOwnerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    }, 
    superAdminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    subAdminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    superSeniorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    superAgentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    agentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    owCutShare:{
        type: Number,
        default: 100,
    },
    sowCutShare:{
        type: Number,
        default: 0,
    },
    suaCutShare:{
        type: Number,
        default: 0,
    },
    adCutShare:{
        type: Number,
        default: 0,
    },
    sadCutShare:{
        type: Number,
        default: 0,
    },
    ssmCutShare:{
        type: Number,
        default: 0,
    },
    saCutShare:{
        type: Number,
        default: 0,
    },
    clCutShare:{
        type: Number,
        default: 0,
    },
    ipAddress: {
        type: String,
        default: null,
    },
    ip:{
        type:String,
        required:false
    },
    status: {
        type: String,
        enum : ["pending","active","suspend","completed","cancelled","voided"],
        default: "active",
    },
    isDeleted: {
        type:Boolean,
        default:false
    },
    isMatched: {
        type:Boolean,
        default:true
    },
    betFaireType: {
        type: String,
        required:false,
        default:"betfair"
    },
    isDeclared:{
        type:Boolean,
        default:false
    },
    isBookmakerDeclared:{
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

 
const Bet = mongoose.model("bet", BetSchema);

module.exports = Bet;