const { responseData } = require("../../helpers/responseData");

const {
    get_match_list,
    result_match_list,
    add_match_list,
    update_multiple,
    get_match_detail,
    update_status,
    update_status_by_eventId,
    update_match,
    update_series_status,
    inplay_status,
    update_match_limit,
    get_fancy_list,
    get_premium_fancy_list,
    get_result_fancy_premium_list,
    fancy_delete,
    get_sport_filter_list,
    get_sport_filter_list_fancy_result,
    update_fancy_status,
    fancy_bet_position,
    risk_match_list,
    risk_bookmaker_match_list,
    add_match_ad,
    update_premiumfancy_status,
    top_casino_list,
    casino_status_update
} = require('../../services/admins/match.services')

module.exports = {
    get_match_list: async (req, res) => {
        try {
            await get_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    result_match_list: async (req, res) => {
        try {
            await result_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    risk_match_list: async (req, res) => {
        try {
            await risk_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    risk_bookmaker_match_list: async (req, res) => {
        try {
            await risk_bookmaker_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    add_match_list: async (req, res) => {
        try {
            await add_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_multiple: async (req, res) => {
        try {
            await update_multiple(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_match_detail: async (req, res) => {
        try {
            await get_match_detail(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_status: async (req, res) => {
        try {
            await update_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    add_match_ad: async (req, res) => {
        try {
            await add_match_ad(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_status_by_eventId: async (req, res) => {
        try {
            await update_status_by_eventId(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    inplay_status: async (req, res) => {
        try {
            await inplay_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_series_status: async (req, res) => {
        try {
            await update_series_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_match: async (req, res) => {
        try {
            await update_match(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_match_limit: async (req, res) => {
        try {
            await update_match_limit(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_fancy_list: async (req, res) => {
        try {
            await get_fancy_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_premium_fancy_list: async (req, res) => {
        try {
            await get_premium_fancy_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_result_fancy_premium_list: async (req, res) => {
        try {
            await get_result_fancy_premium_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    fancy_delete: async (req, res) => {
        try {
            await fancy_delete(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_fancy_status: async (req, res) => {
        try {
            await update_fancy_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_premiumfancy_status: async (req, res) => {
        try {
            await update_premiumfancy_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    fancy_bet_position: async (req, res) => {
        try {
            await fancy_bet_position(req, res);
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
    get_sport_filter_list_fancy_result: async (req, res) => {
        try {
            await get_sport_filter_list_fancy_result(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    top_casino_list: async (req, res) => {
        try {
            await top_casino_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_status_update: async (req, res) => {
        try {
            await casino_status_update(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }

}