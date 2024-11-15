const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
const CasinoTransaction = require('../models/casinoTransaction.model');
const fancySet = require('../models/fancySet.model');
let jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { checkSocketExist } = require('./serviceHelper')

let socketUserObject = {};
var globalIo;

exports = module.exports = async (io) => {

    globalIo = io;
    io.use(async (socket, next) => {

        let token = null
        let secret = null
        let userData = null

        token = (socket.handshake.query.token) ? socket.handshake.query.token : socket.handshake.headers.token;
        secret = (socket.handshake.query?.userType == "front") ? process.env.JWT_SECRET : process.env.JWT_ADMIN_SECRET;
        console.log("token--------------", token);
        if (!token) return next(new Error("pls send token"));

        try {
            userData = jwt.verify(token, secret)
        } catch (e) {
            return next(new Error("Check Error while connecting"));
        }

        if (socket.handshake.query?.userType == "front" && !userData?.user?._id) {
            return next(new Error("User not found"));
        }

        if (socket.handshake.query?.userType !== "front" && !userData?._id) {
            return next(new Error("User not found"));
        }

        let userId = (socket.handshake.query?.userType == "front") ? userData.user._id : userData._id;

        let userCheck = await User.findById(userId)

        if (!userCheck) {
            return next(new Error("User deleted please contact to owner"));
        } else if (userCheck.isDeleted === true) {
            return next(new Error("Error while connecting"));
        }
        // else if(userCheck.uniqueId != userData.uniqueId){
        //     return next(new Error("Error while connecting re-login"));
        // }
        else if (userCheck.status === 'suspend') {
            return next(new Error("Please contact Admin, Your account is suspended"));
        } else if (userCheck.status === 'locked') {
            return next(new Error("Please contact Admin, Your account is locked"));
        }

        // await User.findByIdAndUpdate(userId, { $set: { isOnline: true } })

        socket.handshake.headers.user_id = userId

        next()
    });
    io.sockets.on('connection', async (socket) => {

        (socket.handshake.headers.user_id == "6461fdea1a444becc77cb25d") && console.log('socket connected successfully', socket.handshake.headers.user_id);

        let { socketUserNewObject, logoutSocketId } = await checkSocketExist(socketUserObject, socket.id, socket.handshake.headers.user_id)

        if (logoutSocketId) {
            let logoutObj = {
                user_id: socket.handshake.headers.user_id,
                status: true,
                message: "connected"
            }
            io.to(logoutSocketId).emit('deviceLogin', logoutObj);
        }

        socketUserObject = socketUserNewObject;

        socket.on("getCoins", async (data, callback) => {

            // console.log('data-',data)
            let matchPattern = {
                isDeclared: false,
                forBet: 1,
            };
            matchPattern.userId = ObjectId(data?.user_id);
            matchPattern.forCasinoBet = 0;

            const totalExposure = await Transaction.aggregate([
                {
                    $match: matchPattern
                },
                {
                    $group: {
                        _id: null,
                        totalExposureAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            const totalAMT = await Transaction.aggregate([
                {
                    $match: { userId: ObjectId(data?.user_id), forCasinoBet: 0 }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            const casinoTotalAMT = await CasinoTransaction.aggregate([
                {
                    $match: { userId: ObjectId(data?.user_id) }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$realCutAmount" }
                    }
                }
            ]);

            await User.findOneAndUpdate({
                _id: ObjectId(data?.user_id)
            },
                {
                    $set: {
                        exposure: totalExposure.length > 0 ? Math.abs(totalExposure[0].totalExposureAmount) : 0,
                        totalCoins: totalAMT.length > 0 ? totalAMT[0].totalAmount : 0,
                        casinoCoins: casinoTotalAMT.length > 0 ? Math.abs(casinoTotalAMT[0].totalAmount) : 0,
                        betBlock: false
                    }
                });
            const objectToSend = await User.findOne({ _id: data?.user_id });
            const resp = {
                status: true, message: "Success", results: {
                    "userId": data?.user_id,
                    "totalCoins": objectToSend?.totalCoins,
                    "casinoCoins": objectToSend?.casinoCoins,
                    "aeCasinoUserId": objectToSend?.aeCasinoUserId,
                    "exposure": Math.abs(objectToSend?.exposure)
                }
            };
            if (socketUserObject[data?.user_id]) {
                io.to(socketUserObject[data?.user_id]).emit('listenGetCoin', resp);
            }

            // console.log('socketUserObject',socketUserObject, data?.user_id)
            callback && callback(resp);

        });

        socket.on('disconnect', async function () {
            delete socketUserObject[socket.handshake.query.user_id];
            // console.log('disconnect', socket.handshake.query.user_id);
        });

    });
}
exports.triggerMethod = {
    async forceLogout(data) {
        const resp = {
            status: true, message: "Success", results: data, userId: data?.user_id
        };

        (data?.user_id == "6461fdea1a444becc77cb25d") && console.log('socketUserObject[data?.user_id]', socketUserObject[data?.user_id], socketUserObject["6461fdea1a444becc77cb25d"]);

        (data?.user_id == "6461fdea1a444becc77cb25d") && console.log('listenForceLogoutRefresh1 --------------forceLogout------------------------------', resp);

        globalIo.emit('listenForceLogoutRefresh1', resp);

        if (socketUserObject[data?.user_id]) {
            (data?.user_id == "6461fdea1a444becc77cb25d") && console.log('socketUserObject[data?.user_id]-- forceLogoummmmmmmmmmmmmmmmmmmt----', socketUserObject[data?.user_id]);
            globalIo.to(socketUserObject[data?.user_id]).emit('listenForceLogout', resp);
            return true;
        } else {
            return true;
        }
    },

    async coinUpdate(data) {
        // console.log('socketUserObject----------------coinUpdate--------------------------------------',data, socketUserObject);
        let matchPattern = {
            isDeclared: false,
            forBet: 1,
        };
        matchPattern.userId = ObjectId(data?.user_id);

        const totalExposure = await Transaction.aggregate([
            {
                $match: matchPattern
            },
            {
                $group: {
                    _id: null,
                    totalExposureAmount: { $sum: "$realCutAmount" }
                }
            }
        ]);

        const totalAMT = await Transaction.aggregate([
            {
                $match: { userId: ObjectId(data?.user_id), forCasinoBet: 0 }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$realCutAmount" }
                }
            }
        ]);

        const totalCasinoAMT = await CasinoTransaction.aggregate([
            {
                $match: { userId: ObjectId(data?.user_id) }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$realCutAmount" }
                }
            }
        ]);

        await User.findOneAndUpdate({
            _id: ObjectId(data?.user_id)
        },
            {
                $set: {
                    exposure: totalExposure.length > 0 ? Math.abs(totalExposure[0].totalExposureAmount) : 0,
                    totalCoins: totalAMT.length > 0 ? totalAMT[0].totalAmount : 0,
                    casinoCoins: totalCasinoAMT.length > 0 ? Math.abs(totalCasinoAMT[0].totalAmount) : 0,
                    betBlock: false
                }
            });
        const objectToSend = await User.findOne({ _id: data?.user_id });
        const resp = {
            status: true, message: "Success", results: {
                "userId": data?.user_id,
                "totalCoins": objectToSend?.totalCoins,
                "casinoCoins": objectToSend?.casinoCoins,
                "aeCasinoUserId": objectToSend?.aeCasinoUserId,
                "exposure": Math.abs(objectToSend?.exposure)
            }
        };
        // console.log('listenGetCoin resp',resp)
        if (socketUserObject[data?.user_id]) {
            globalIo.to(socketUserObject[data?.user_id]).emit('listenGetCoin', resp);
        }
        // const resp = {
        //     status: true, message: "Success", results: {"totalCoins": data?.newBalance, "exposure": data?.exposure}
        // };
        // if (socketUserObject[data?.user_id]) {
        //     // console.log('socketUserObject[data?.user_id]----coinUpdate --',socketUserObject[data?.user_id]);
        //     globalIo.to(socketUserObject[data?.user_id]).emit('listenGetCoin', resp);
        // }
        return resp;
    },

    async betFairFancy(data) {
        const resp = { status: true, message: "Success", results: data?.result, eventId: data?.eventId };
        // socketEventObject
        // console.log('resp-------------', resp)
        globalIo.emit('listenDiamondFancy', resp);
        return true;
    },

    async betFairPremiumFancy(data) {
        const resp = { status: true, message: "Success", results: data?.result, eventId: data?.eventId };
        // socketEventObject
        // console.log('resp-------------', resp)
        globalIo.emit('listenDiamondPremiumFancy', resp);
        return true;
    },

    async getBetFairOdds(data) {
        const resp = { status: true, message: "Success", results: data?.result, eventId: data?.eventId };
        globalIo.emit('listenBetFairOdds', resp);
        return true;
    },

    async scoreAllResult(data) {
        // console.log('scoreAll',data)
        // globalIo.emit('scoreAll', data);
        // return data;
    },

    // async betFairOddsApi(data){
    //     globalIo.emit('betFairOdds', data);
    //     return data;
    // },

    async refreshPage(data) {
        globalIo.emit('refreshPage', data);
        return true;
    },
};