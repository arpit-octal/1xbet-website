const { responseData } = require("../../helpers/responseData");

const {
    casino_webhook,
    casino_webhook_balance,
    casino_balance,
    casino_bet_request,
    casino_result_request,
    casino_rollback_request
} = require('../../services/casino/casino.services')

module.exports = {
    casino_webhook: async (req, res) => {
        try {
            await casino_webhook(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_webhook_balance: async (req, res) => {
        try {
            await casino_webhook_balance(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_balance: async (req, res) => {
        try {
            await casino_balance(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_bet_request: async (req, res) => {
        try {
            await casino_bet_request(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_result_request: async (req, res) => {
        try {
            await casino_result_request(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_rollback_request: async (req, res) => {
        try {
            await casino_rollback_request(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },

}