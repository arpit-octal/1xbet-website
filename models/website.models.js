const mongoose = require("mongoose");

const WebsiteSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add the website name']
    },
    domain:{
        type:String,
        unique:true,
        trim:true,
        required:[true,'Please add the website domain']
    },
    createdById:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
},
{ 
    timestamps: true,
});

const WebsiteModel = mongoose.model("websites", WebsiteSchema);

module.exports = WebsiteModel;