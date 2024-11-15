const mongoose = require("mongoose");

const SubscribeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sms", "email", "whatsapp"],
      default: "text",
      required: true
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

const Subscribe = mongoose.model("subscribe", SubscribeSchema);

module.exports = Subscribe;
