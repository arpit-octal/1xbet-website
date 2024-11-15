const Activity = require("../models/activity.model");
const User = require("../models/user.model");
const async = require('async');
const axios = require('axios').default;

const satelize = require('satelize');

/**
 * @param {*} req - from here ip will come req.ip
 * @param {*} user_id - whose activity it is
 * @desc Saves activities
 * @note Only for login right now|change '183.83.178.233' to req.ip
 */
module.exports.saveActivity = async (req, user_id) => {
    //Loging-activity
    // let ispData = null;
    // // console.log('req.ip;',req, req?.ip);
    // let ipAddress = (process.env.IP == 'CLIVE') ? req.ip : '111.93.58.10';
    // satelize.satelize({ ip: ipAddress }, function (err, payload) {
    //     ispData = payload
    // });
    // const data = await axios({
    //     method: 'get',
    //     url: `https://ipinfo.io/${ipAddress}?token=58594d2894e014`,
    // });
    // // console.log('ispData--', data);

    // await Activity.create({
    //     activityDate: new Date(),
    //     userId: user_id,
    //     activityStatus: 'Login Success',
    //     ip: ipAddress,
    //     isp: data?.data?.org || "",
    //     country: ispData ? ispData.country.en : null,
    //     city: data?.data?.city || "",
    //     region: data?.data?.region || "",
    //     geolocation: {
    //         type: 'Point',
    //         coordinates: [ispData ? ispData.longitude : null, ispData ? ispData.latitude : null]
    //     },
    //     userAgent: req.get('User-Agent')
    // });

    return true
}

/**
 *
 * @param {Number} total
 * @param {Number} limit - limit that's given
 * @param {Number} page - on which page we are
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @returns It return Paginate object to help front end
 */
module.exports.getPaginateObj = async (total, limit, page, startIndex, endIndex) => {
    let flag = 0

    if ((total % limit) > 0) {
        flag = parseInt((total / limit)) + 1;
    } else {
        flag = (total / limit)
    }

    // Pagination result
    let paginateme = {
        "totalDocs": total,
        "limit": limit,
        "page": page,
        "totalPages": flag,
        "pagingCounter": page,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": 0,
        "nextPage": 0
    }

    if (endIndex < total) {
        paginateme.hasNextPage = true
        paginateme.nextPage = page + 1
    }

    if (startIndex > 0) {
        paginateme.hasPrevPage = true
        paginateme.prevPage = page - 1
    }

    return paginateme
}

/**
 *
 * @param {Object} socketUserObject - Object that have all the users and its socket.id
 * @param {String} socket_id - new socket id of user
 * @param {String} user_id - new user that have logged in
 * @returns new object with new user added and if user exist it's previous socket.id
 */
module.exports.checkSocketExist = async (socketUserObject, socket_id, user_id) => {

    let logoutSocketId = null

    let customObj = {
        [user_id]: socket_id
    }

    if (socketUserObject[user_id]) {
        logoutSocketId = socketUserObject[user_id]
    }

    delete socketUserObject[user_id]

    socketUserNewObject = {
        ...customObj,
        ...socketUserObject
    }

    return { socketUserNewObject, logoutSocketId }
}