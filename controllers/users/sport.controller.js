const { responseData } = require("../../helpers/responseData");

const {
    get_sport_list,
    get_sports,
    get_mobile_sports,
    update_status,
    set_multi_market,
    get_multi_market,
    inplay_match_count,
} = require('../../services/users/sport.services')

module.exports = {
    get_sports: async (req, res) => {
        try {
            await get_sports(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_mobile_sports: async (req, res) => {
        try {
            await get_mobile_sports(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_sport_list: async (req, res) => {
        try {
            await get_sport_list(req, res);
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
    set_multi_market: async (req, res) => {
        try {
            await set_multi_market(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_multi_market: async (req, res) => {
        try {
            await get_multi_market(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    inplay_match_count:async (req, res) => {
        try {
            await inplay_match_count(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
}