const { responseData } = require("../../helpers/responseData");

const {
    get_tournament_list,
    update_status,
    delete_all,
    get_series_list,
    block_market
} = require('../../services/admins/tournament.services')

module.exports = {
    get_tournament_list: async (req, res) => {
        try {
            await get_tournament_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_series_list: async (req, res) => {
        try {
            await get_series_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    block_market: async (req, res) => {
        try {
            await block_market(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_status:async (req, res) => {
        try {
            await update_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    delete_all:async (req, res) => {
        try {
            await delete_all(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}