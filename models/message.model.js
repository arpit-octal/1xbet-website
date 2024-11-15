const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
   createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        default:null
    },
    domain:{
        type:String,
        trim:true,
        required:[true,'Please add the website domain']
    },
    title:{
        type:String,
        default:null
    },
    message:{
        type:String,
        default:null
    },
    msgDate:{
        type:Date,
        default:new Date()
    },
    isImportant: {
        type:Boolean,
        default: false,
    },
    status: {
        type: String,
        enum : ['lock','open','delete'],
        default: 'open',
    },
    type: {
        type: String,
        enum : ['user','hyper','important', 'downline', 'all'],
        default: 'user',
    },
},
{ 
    timestamps: { createdAt: true, updatedAt: true }
});
 
const MessageModel = mongoose.model('messages', MessageSchema);

module.exports = MessageModel;