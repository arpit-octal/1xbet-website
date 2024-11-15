const { responseData } = require("../../helpers/responseData");

const {
    downline,
    market,
    casino,
    casino_pl,
    casino_date_pl,
    casino_data
} = require('../../services/admins/report.services')

module.exports = {
    downline: async (req, res) => {
        try {
            await downline(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    market: async (req, res) => {
        try {
            await market(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino: async (req, res) => {
        try {
            await casino(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_pl: async (req, res) => {
        try {
            await casino_pl(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_date_pl: async (req, res) => {
        try {
            await casino_date_pl(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_data: async (req, res) => {
        try {
            await casino_data(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}