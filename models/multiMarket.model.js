const mongoose = require('mongoose');

const MultiMarketSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    eventId:{
        type:String,
        default:null
    },
},
{ 
    timestamps: { createdAt: true, updatedAt: true }
});
 
const MultiMarketModel = mongoose.model('multi_market', MultiMarketSchema);

module.exports = MultiMarketModel;