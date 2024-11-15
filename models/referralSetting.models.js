const mongoose = require("mongoose");

const ReferralSettingSchema = new mongoose.Schema(
    {
        referralBonus: {
            type: Number,
            default: 0,
        },
        signupBonus: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            default: 'referralSetting',
        }
    },
    {
        timestamps: true,
    }
);

const ReferralSetting = mongoose.model("referralSetting", ReferralSettingSchema);

module.exports = ReferralSetting;
