const { responseData } = require("../../helpers/responseData");
const {
    transaction_create,
    transaction_logs,
    transaction_bet_logs,
    check_limit
} = require('../../services/admins/transactions.services')

module.exports = {
    transaction_create: async (req, res) => {
        try {
            await transaction_create(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    check_limit: async (req, res) => {
        try {
            await check_limit(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    transaction_logs: async (req, res) => {
        try {
            await transaction_logs(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    transaction_bet_logs: async (req, res) => {
        try {
            await transaction_bet_logs(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}