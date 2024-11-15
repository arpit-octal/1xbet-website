const mongoose = require("mongoose");

const WebSiteSettingSchema = new mongoose.Schema(
    {
        websiteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "websites",
            default: null,
        },
        telegramContent: {
            type: String,
            default: "",
        },
        telegramContent2: {
            type: String,
            default: "",
        },
        whatsappContent: {
            type: String,
            default: "",
        },
        whatsappContent2: {
            type: String,
            default: "",
        },
        emailContent: {
            type: String,
            default: "",
        },
        emailContent2: {
            type: String,
            default: "",
        },
        skypeContent: {
            type: String,
            default: "",
        },
        instagramContent: {
            type: String,
            default: "",
        },
        facebookContent: {
            type: String,
            default: "",
        },
        telegramShowing: {
            type: String,
            default: "",
        },
        telegramShowing2: {
            type: String,
            default: "",
        },
        whatsappShowing: {
            type: String,
            default: "",
        },
        whatsappShowing2: {
            type: String,
            default: "",
        },
        emailShowing: {
            type: String,
            default: "",
        },
        emailShowing2: {
            type: String,
            default: "",
        },
        skypeShowing: {
            type: String,
            default: "",
        },
        instagramShowing: {
            type: String,
            default: "",
        },
        facebookShowing: {
            type: String,
            default: "",
        },
        createdById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const WebSiteSetting = mongoose.model("website_settings", WebSiteSettingSchema);

module.exports = WebSiteSetting;
