const { responseData } = require("../../helpers/responseData");

const {
    get_sport_list,
    update_status,
    inplay_match_count,
    get_sport_filter_list,
} = require('../../services/admins/sport.services')

module.exports = {
    get_sport_list: async (req, res) => {
        try {
            await get_sport_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_sport_filter_list: async (req, res) => {
        try {
            await get_sport_filter_list(req, res);
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
}