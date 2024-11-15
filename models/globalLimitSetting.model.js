const mongoose = require("mongoose");

const GlobalLimitSettingSchema = new mongoose.Schema({
    type:{
        type:String,
        trim:true,
        required:[true,'Please add type']
    },
    minAmount:{
        type: Number,
        default: 100,
    },
    maxAmount:{
        type: Number,
        default: 100000,
    },
    maxProfit:{
        type: Number,
        default: 100000,
    },
    onShow: {
        type: Number,
        default: false,
    },
    betDelay: {
        type:Number,
        default: false,
    },
    sportType: {
        type: String,
    },
    oddsLimit: {
        type: Number,
        default: false,
    }
},
{ 
    timestamps: true,
});

const GlobalLimitSetting = mongoose.model("global_limit_setting", GlobalLimitSettingSchema);

module.exports = GlobalLimitSetting;