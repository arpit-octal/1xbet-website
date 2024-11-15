const mongoose = require("mongoose");
const Transaction = require("./transaction.model");
const moment = require("moment");

const TransactionSchema = new mongoose.Schema({
    // uniqueId: {
    //     type: Number,
    //     trim:true,
    //     unique:true,
    //     default:null
    // },
    gameType: {
        type: String,
        default: "cricket",
    },
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
    forCommission:{
        type:Number,
        default:0
    },
    commissionBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    forCasino:{
        type:Number,
        default:0
    },
    forEasyGoCasino:{
        type:Number,
        default:0
    },
    forCasinoBet:{
        type:Number,
        default:0
    },
    betId:{
        type:String,
        default:false
    },
    eventType: {
        type: String,
        enum : [4, 2,1,-1],
        default: 4,
    },
    matchName: {
        type: String,
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
    winner:{
        type:String,
        required:false,
        default:""
    },
    selectionId:{
        type:String,
        required:[false,'Please selection ID'],
    },
    roundId:{
        type:String,
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
    betFaireType: {
        type: String,
        required:false,
        default:"betfair"
    },
    commission: {
        type:Number,
        default:0
    },
    casinoBetTransactionId: {
        type: String,
        required:false,
        default:""
    },
},
{ 
    timestamps: { createdAt: true, updatedAt: false }
});

// TransactionSchema.pre("save", function (next) {
//     var docs = this;
//     mongoose
//       .model("transactions", TransactionSchema)
//       .countDocuments(function (error, counter) {
//         if (error) return next(error);
//         console.log('counter---',counter)
//         docs.uniqueId = counter + 1;
//         next();
//       });
// });
 
// TransactionSchema.pre("insertMany", async function (next, docs) {
//     if (Array.isArray(docs) && docs.length) {
//         const t1 = await mongoose.model("transactions", TransactionSchema).count();
//         const hashedUsers = docs.map(async (user,i) => {
//             i = i +1;
//             return await new Promise((resolve, reject) => {
//                 user.uniqueId = Math.abs(t1) + Math.abs(i);
//                 console.log('user.uniqueId ---',t1, i, user.uniqueId)
//                 resolve(user)
//             })
//         })
//         docs = await Promise.all(hashedUsers)
//         next()
//     } else {
//         return next(new Error("Transaction list should not be empty")) // lookup early return pattern
//     }
// });

TransactionSchema.pre("insertMany", async function (next, docs) {
    if (Array.isArray(docs) && docs.length) {
        const hashedUsers = docs.map(async (user,i) => {
            return await new Promise((resolve, reject) => {
                if(user?.gameType && user?.gameType=="casino")
                {
                    // console.log('user--',`${moment().utc().format("YYYY-MM-DD[T]HH:mm:ss")}+00:00`); 
                    // console.log('user--',`${moment().utc().add('1','seconds').format("YYYY-MM-DD[T]HH:mm:ss")}+00:00`);                
                    user.createdAt = `${moment().utc().add(i,'seconds').format("YYYY-MM-DD[T]HH:mm:ss")}+00:00`;
                    resolve(user);
                }else{
                    resolve(user)
                }
                
                // user.uniqueId = Math.abs(t1) + Math.abs(i);
                // console.log('user.uniqueId ---',t1, i, user.uniqueId)
                // resolve(user)
            })
        })
        docs = await Promise.all(hashedUsers)
        next()
    }else{
        next()
    }
});

const TransactionModel = mongoose.model("transactions", TransactionSchema);

module.exports = TransactionModel;