const mongoose = require("mongoose");

const DeletedExposureTransactionSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        trim:true,
        required:[true,'Please add amount'],
    },
    status: {
        type: String,
        enum : ["success","failed"],
        default: "success",
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
    marketId:{
        type:String,
        required:[false,'Please marketId ID'],
    },
    eventId:{
        type:String,
        required:[false,'Please eventId ID'],
    },
    betType:{
        type:String,
        default:""
    },
    gameName:{
        type:String,
        required:false,
        default:""
    },
    runnerName:{
        type:String,
        required:false,
        default:""
    },
    selectionId:{
        type:String,
        required:[false,'Please selection ID'],
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
    betFaireType: {
        type: String,
        required:false,
        default:"betfair"
    }
},
{ 
    timestamps: { createdAt: true, updatedAt: false }
});
 
const DeletedExposureTransactionModel = mongoose.model("deleted_exposure_transactions", DeletedExposureTransactionSchema);

module.exports = DeletedExposureTransactionModel;