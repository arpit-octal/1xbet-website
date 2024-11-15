const mongoose = require("mongoose");

const DeletedReportSchema = new mongoose.Schema({
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
    clientName:{
        type: String,
        required:false,
        default:""
    },
    marketId: {
        type: String,
        required:false,
        default:""
    },
    selectionId: {
        type: String,
        required:true,
        default:""
    },
    eventId:{
        type: String,
        required:false,
        default:""
    },
    eventType:{
        type: String,
        enum : [4, 2,1,-1],
        default: 4
    },
    reportType: {
        type: String,
        default:"betFair"
    },
    amount: {
        type: Number,
        required:true,
        default:0
    },
    realAmount: {
        type: Number,
        required:true,
        default:0
    },
    realCutAmount: {
        type: Number,
        default: 0
    },
    betAmount: {
        type: Number,
        default: 0
    },
    reportName: {
        type: String,
        required: false
    },
    runnerName: {
        type: String,
        required: false
    },
    matchName: {
        type: String,
        required: false
    },
    reportGenerateDate: {
        type: Date,
        required: false
    },
    transactionType: {
        type: String,
        required: false
    },
    commission: {
        type:Number,
        default:0
    }
},
{ 
    timestamps: true,
    toObject : {getters: true,setters: true, virtuals: false},
    toJSON : {getters: true, setters: true, virtuals: false}
});

 
const DeletedReport = mongoose.model("deleted_report", DeletedReportSchema);

module.exports = DeletedReport;