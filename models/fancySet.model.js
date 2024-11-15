const mongoose = require("mongoose");

const PremiumFancySetSchema = new mongoose.Schema({
    eventId:{
        type:String,
        trim:true,
        required:[true,'Please add event id']
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default: null,
    },
},
{ 
    timestamps: true,
});

const PremiumFancy = mongoose.model("premium_fancy", PremiumFancySetSchema);

module.exports = PremiumFancy;