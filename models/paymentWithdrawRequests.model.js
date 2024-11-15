const mongoose = require("mongoose");

const paymentWithdrawRequestsSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        // unique: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed","Declined"],
        default: "Pending",
    },
    image: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
    },
    paymentManagerName: {
        type: String,
        required: true,
    },
    // paymentManagerDetails: {
    //     type: String,
    //     required: true,
    // },
    description: {
        type: String,
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ifscCode:{
        type: String,
        required: true
    },
    bankName:{
        type: String,
        required: true
    },
    accountNumber:{
        type: String,
        required: true
    }
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: true },
        toJSON: { getters: true, setters: true, virtuals: true }
    });

const paymentWithdrawRequestsModel = mongoose.model("payment_withdraw_requests", paymentWithdrawRequestsSchema);

module.exports = paymentWithdrawRequestsModel;