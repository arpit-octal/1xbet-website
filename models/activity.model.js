const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    activityDate:{
        type:Date,
        required:[true,'Please add the website name']
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default:null
    },
    activityStatus:{
        type: String,
        enum : ["login","Login Success"],
        default: "Login Success"
    },
    ip:{
        type:String,
        required:false
    },
    isp:{
        type:String,
        required:false
    },
    country:{
        type:String,
        required:false
    },
    city:{
        type:String,
        required:false
    },
    region:{
        type:String,
        required:false
    },
    geolocation: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [Number], // [longitude, latitude]
    },
    userAgent:{
        type:String,
        required:false
    }
},
{ 
    timestamps: { createdAt: true, updatedAt: false }
});

const ActivityModel = mongoose.model("activities", ActivitySchema);

module.exports = ActivityModel;