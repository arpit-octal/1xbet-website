const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
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
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    balance: {
        type: Number,
        required:[true,'Please balance'],
        default: 0,
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
        type:Boolean,
        default: true,
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
},
{ 
    timestamps: true,
    toObject : {getters: true,setters: true, virtuals: true},
    toJSON : {getters: true, setters: true, virtuals: true}
 });
 
const WalletModel = mongoose.model("wallets", WalletSchema);

module.exports = WalletModel;