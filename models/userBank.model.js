const mongoose = require("mongoose");

const bankModelSchema = new mongoose.Schema({
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
    },
    accountHolderName:{
        type: String,
        required: true
    },
    
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: true },
        toJSON: { getters: true, setters: true, virtuals: true }
    });

const bankModel = mongoose.model("bankModel", bankModelSchema);

module.exports = bankModel;