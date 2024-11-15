const { responseData } = require("../../helpers/responseData");

const {
    create,
    getOne,
    update,
    getList,
    getImportant,
    statusUpdate,
    getDownline
} = require('../../services/admins/message.services')

module.exports = {
    create:async (req, res) => {
        try {
            await create(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    getOne:async (req, res) => {
        try {
            await getOne(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update:async (req, res) => {
        try {
            await update(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    statusUpdate:async (req, res) => {
        try {
            await statusUpdate(req, res);
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
    },
    getImportant:async (req, res) => {
        try {
            await getImportant(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    getDownline:async (req, res) => {
        try {
            await getDownline(req, res);
        } catch (err) {
            let msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
}