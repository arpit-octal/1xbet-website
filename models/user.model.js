const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

function imageURL(image) {
    // const path = config.USER + '/' + image;
    if (image != null) {
        return process.env.IMAGE_LOCAL_PATH + image;
    } else {
        return process.env.IMAGE_LOCAL_PATH + "no_image.png";
    }
}

const UserSchema = new mongoose.Schema({
    usedFor: {
        type: String,
        default: ""
    },
    userType: {
        type: String,
        enum: ["owner", "sub_owner", "super_admin", "admin", "sub_admin", 'senior_super', 'super_agent', 'agent', 'user'],
        default: "user",
    },
    createdById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    createdBy: {
        type: String,
        default: null
    },
    authority: {
        type: Number,
        default: 1
    },
    email: {
        type: String,
        required: [false, 'Please add email Id'],
        trim: true,
    },
    uniqueId: {
        type: String,
        trim: true,
        default: null
    },
    username: {
        type: String,
        required: [true, 'Please add username'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please add password'],
    },
    pwd: {
        type: String,
        required: [true, 'Please add password'],
    },
    phone: {
        type: Number,
        default: 0,
    },
    firstName: {
        type: String,
        default: 'user',
        trim: true,
    },
    lastName: {
        type: String,
        default: 'user',
        trim: true,
    },
    isPasswordReset: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: null,
    },
    tokenTime: {
        type: String,
        default: null,
    },
    lastLimit: {
        type: String,
        default: null,
    },
    website: {
        type: String,
        default: null,
    },
    timeZone: {
        type: String,
        default: null,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    timeZoneOffset: {
        type: String,
        default: null,
    },
    lastIp: {
        type: String,
        default: null,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    betsBlocked: {
        type: Boolean,
        default: false,
    },
    userShareType: {
        type: String,
        default: null,
    },
    ipAddress: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    totalCoins: {
        type: Number,
        default: 0,
    },
    casinoCoins: {
        type: Number,
        default: 0,
    },
    aeCasinoUserId: {
        type: String,
        default: null
    },
    easyToGoUserId: {
        type: String,
        default: null
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    owCutShare: {
        type: Number,
        default: 100,
    },
    sowCutShare: {
        type: Number,
        default: 100,
    },
    suaCutShare: {
        type: Number,
        default: 100,
    },
    adCutShare: {
        type: Number,
        default: 100,
    },
    sadCutShare: {
        type: Number,
        default: 100,
    },
    ssmCutShare: {
        type: Number,
        default: 100,
    },
    saCutShare: {
        type: Number,
        default: 100,
    },
    clCutShare: {
        type: Number,
        default: 100,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    subOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    superAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    subAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    superSeniorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    superAgentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
    },
    creditReference: {
        type: Number,
        default: 0,
    },
    exposure: {
        type: Number,
        default: 0,
    },
    availableLimit: {
        type: Number,
        default: 0,
    },
    playerBalance: {
        type: Number,
        default: 0,
    },
    exposureLimit: {
        type: Number,
        default: 0,
    },
    commission: {
        type: Number,
        default: 0,
    },
    fixLimit: {
        type: Number,
        default: 0,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    uniqueId: {
        type: String,
        default: null,
    },
    fancyBet: {
        type: Boolean,
        default: true,
    },
    sportsBook: {
        type: Boolean,
        default: true,
    },
    binary: {
        type: Boolean,
        default: true,
    },
    odds: {
        type: Boolean,
        default: true,
    },
    stake: [],
    editStake: [],
    editOneClickBetStake: [],
    defaultOneClickBetStake: {
        type: Number,
        default: 0,
    },
    isOneClickBetStake: {
        type: Boolean,
        default: false,
    },
    betBlock: {
        type: Boolean,
        default: false,
    },
    defaultStake: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["active", "suspend", "locked", "cheater"],
        default: "active",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    casinoUsername: {
        type: String,
        default: ''
    },
    casinoToken: {
        type: String,
        default: ''
    },
    referralCode: {
        type: String,
        unique: true,
    },
    refferedCode: {
        type: String,
        default: "",
    },
},
    {
        timestamps: true
    });

UserSchema.plugin(mongoosePaginate);
const User = mongoose.model("user", UserSchema);

module.exports = User;