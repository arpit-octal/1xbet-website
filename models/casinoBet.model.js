const mongoose = require("mongoose");

const CasinoBetSchema = new mongoose.Schema({

    status: {
        type: String,
        enum: ["bet", "result", "rollback"],
        default: "bet",
    },
    updatedBalance: {
        type: Number,
    },
    operatorId: {
        type: String,
    },
    operatorToken: {
        type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId,
    },
    reqId: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    gameId: {
        type: String,
    },
    roundId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    betAmount: {
        type: Number,
    },
    profitLossAmount: {
        type: Number,
        default: 0
    },
    betType: {
        type: String,
    },
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: false },
        toJSON: { getters: true, setters: true, virtuals: false }
    });


const CasinoBet = mongoose.model("casino_bet", CasinoBetSchema);

module.exports = CasinoBet;