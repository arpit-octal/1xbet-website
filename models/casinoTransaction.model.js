const mongoose = require("mongoose");

const CasinoTransactionSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum : ["debit","credit"],
        default: "credit",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    amount: {
        type: Number,
        trim:true,
        required:[true,'Please add amount'],
    },
    realCutAmount: {
        type: Number,
        default: 0
    },
    oldBalance: {
        type: Number,
        default: 0,
    },
    newBalance: {
        type: Number,
        required:[true,'Please update new balance'],
        default: 0,
    },
    status: {
        type: String,
        enum : ["success","failed","completed"],
        default: "failed",
    },
    ip:{
        type:String,
        required:false
    },
    remark: {
        type: String,
        default: null,
    },
    
    geolocation: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [Number], // [longitude, latitude]
    },
    userAgent:{
        type:String,
        required:false
    },
    realAmount:{
        type:Number,
        default:1
    },
    forBet:{
        type:Number,
        default:0
    },
    forEasyGoCasino:{
        type:Number,
        default:1
    },
    casinoId:{
        type:String,
        required:[false,'Please casino ID'],
    },
    casinoName:{
        type:String,
        required:false,
        default:""
    },
    gameType:{
        type:String,
        required:false,
        default:""
    },
    platform:{
        type:String,
        required:false,
        default:""
    },
    currency:{
        type:String,
        required:false,
        default:""
    },
    gameCode:{
        type:String,
        required:false,
        default:""
    },
    isDeclared:{
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
    casinoType: {
        type: String,
        required:false,
        default:"AE_CASINO"
    },
    commission: {
        type:Number,
        default:0
    },
    forBet:{
        type:Number,
        default:0
    }
},
{ 
    timestamps: { createdAt: true, updatedAt: false }
});
 
const CasinoTransactionModel = mongoose.model("casino_transactions", CasinoTransactionSchema);

module.exports = CasinoTransactionModel;