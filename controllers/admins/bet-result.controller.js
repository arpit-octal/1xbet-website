const { responseData } = require("../../helpers/responseData");

const {
    fancy,
    betFair,
    bookmaker,
    sportBook,
    premiumFancy
} = require('../../services/admins/bet-result.services')

module.exports = {
    fancy: async (req, res) => {
        try {
            await fancy(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    premiumFancy: async (req, res) => {
        try {
            await premiumFancy(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    betFair: async (req, res) => {
        try {
            await betFair(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    bookmaker: async (req, res) => {
        try {
            await bookmaker(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    sportBook: async (req, res) => {
        try {
            await sportBook(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}