const { responseData } = require("../../helpers/responseData");

const {
    getOne,
    getList
} = require('../../services/users/message.service')

module.exports = {
    getOne:async (req, res) => {
        try {
            await getOne(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    getList:async (req, res) => {
        try {
            await getList(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}