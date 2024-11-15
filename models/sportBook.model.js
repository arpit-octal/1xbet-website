const mongoose = require("mongoose");

const SportBookSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'tournaments',
        default:null
    },
    eventType: {
        type: String,
        enum : [4, 2,1,-1],
        default: 4,
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'matches',
        default:null
    },
    matchName: {
        type: String,
        default: null,
    },
    seriesId: {
        type: String,
        required:[true,'please add series id']
    },
    eventId: {
        type: String,
        required:[true,'please add event id']
    },
    marketId: {
        type: String,
        required:[true,'please add market id']
    },
    selectionId: {
        type: String,
        required:[false,'please add selection id']
    },
    fancyId: {
        type: String,
        required:false
    },
    centralizedId: {
        type: String,
        required:false
    },
    fancyName: {
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
        enum : ["pending","open","close","locked","active"],
        default: "active",
    },
    isDeleted: {
        type:Boolean,
        default:false
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
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
    betType: {
        type: String,
        required:false
    },
    teamSelectionWin:{
        type: String,
        required:false
    },
    isDeclared:{
        type:Boolean,
        default:false
    },
},
{ 
    timestamps: true,
});

const SportBookModel = mongoose.model("sportBook", SportBookSchema);

module.exports = SportBookModel;