const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    paymentName: {
        type: String,
        required: true,
        unique: true,

    },
    key1: {
        type: String,
        required: true,

    },
    key2: {
        type: String,
        required: true,

    },
    key3: {
        type: String,
        required: true,

    },
    key4: {
        type: String,


    },
    value1: {
        type: String,
        required: true,

    },
    value2: {
        type: String,
        required: true,

    },
    value3: {
        type: String,
        required: true,

    },
    value4: {
        type: String,


    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    logoImage: {
        type: String,
        required: true,
    },
    logoImageUrl: {
        type: String,

    },
    qrImage: {
        type: String,

    },
    qrImageUrl: {
        type: String,

    },
    minAmount: {
        type: Number,
        default: 0,

    }, maxAmount: {
        type: Number,
        default: 0,

    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: true },
        toJSON: { getters: true, setters: true, virtuals: true }
    });

const PaymentModel = mongoose.model("payments", PaymentSchema);

module.exports = PaymentModel;