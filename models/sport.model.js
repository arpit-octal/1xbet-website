const mongoose = require("mongoose");

const SportSchema = new mongoose.Schema({
    betfairId: {
        type: String,
        default: 0,
    },
    name:{
        type:String,
        trim:true,
        required:[true,'Please add the website name']
    },
    status: {
        type: String,
        enum : ["active","suspend","locked"],
        default: "active",
    },
    banking: {
        type: String,
        enum : ["on","off"],
        default: "on",
    },
    internationalMarket: {
        type: String,
        enum : ["on","off"],
        default: "on",
    }
},
{ 
    timestamps: true,
});

const SportModel = mongoose.model("sports", SportSchema);

module.exports = SportModel;