const mongoose = require("mongoose");

const paymentRequestsSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    utrNumber: {
        type: String,
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    image: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,

    },
    amount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    paymentStatus: {
        type: String,
    },
    receiverBank: {
        type: String
    }

},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: true },
        toJSON: { getters: true, setters: true, virtuals: true }
    });

const paymentRequestsModel = mongoose.model("payment_requests", paymentRequestsSchema);

module.exports = paymentRequestsModel;