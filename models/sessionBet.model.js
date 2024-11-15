const mongoose = require("mongoose");

const SessionBetSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum : [4, 2,1,-1],
        default: 4,
    },
    sessionBetId: {
        type: String,
        required:false
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
        required:[true,'please add series id']
    },
    eventId: {
        type: String,
        required:[true,'please add event id']
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    userID:{
        type: String,
        default: null,
    },
    clientName: {
        type: String,
        required:false
    },
    fancyId: {
        type: String,
        required:false
    },
    fancyName: {
        type: String,
        required:false
    },
    selectionId: {
        type: String,
        required:false
    },
    marketId: {
        type: String,
        required:false
    },
    amount: {
        type: String,
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
    runnerName:{
        type: String,
        required:false
    },
    type: {
        type: String,
        required:false
        //yes no
    },
    profitAmount:{
        type: Number,
        default: 0,
    },
    loseAmount:{
        type: Number,
        default: 0,
    },
    lossPosition: {
        type: Number,
        default: 0,
    },
    profitPosition: {
        type: Number,
        default: 0,
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
    commissionType: {
        type: String,
        required:false
    },
    commission: {
        type: String,
        required:false
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
        enum : ["pending","active","suspend","completed","cancelled","voided","deleted"],
        default: "active",
    },
    isDeleted: {
        type:Boolean,
        default:false
    },
    isDeclared:{
        type:Boolean,
        default:false
    },
    isDeclaredPosition:{
        type:Number,
        default:0
    },
    jsonData: []
},
{ 
    timestamps: true,
    toObject : {getters: true,setters: true, virtuals: false},
    toJSON : {getters: true, setters: true, virtuals: false}
});

 
const SessionBet = mongoose.model("Session_bet", SessionBetSchema);

module.exports = SessionBet;