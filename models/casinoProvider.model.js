const mongoose = require("mongoose");

const CasinoProviderSchema = new mongoose.Schema({
    providerName: { type: String },
    sortOrder: { type: Number },
    labelName: { type: String }
},
    {
        timestamps: true,
        toObject: { getters: true, setters: true, virtuals: false },
        toJSON: { getters: true, setters: true, virtuals: false }
    }
);


const CasinoProviders = mongoose.model("casino_provider", CasinoProviderSchema);

module.exports = CasinoProviders;