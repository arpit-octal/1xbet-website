const mongoose = require("mongoose");

const SiteSettingSchema = new mongoose.Schema(
  {
    fieldType: {
      type: String,
      enum: ["text", "email", "phoneNumber", "logo", "number"],
      default: "text",
    },
    fieldName: {
      type: String,
      default: "",
    },
    fieldValue: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SiteSetting = mongoose.model("site_setting", SiteSettingSchema);

module.exports = SiteSetting;
