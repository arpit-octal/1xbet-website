const { responseData } = require("../../helpers/responseData");

const {
    liveList,
    betList,
    rejectedBetList,
    betHistory,
    betProfitLoss,
    events_bets,
    user_events_bets,
    prematch_events_bets,
    event_session_bets,
    deleteBet,
    update_bet_status
} = require('../../services/admins/bet.services')

module.exports = {
    liveList: async (req, res) => {
        try {
            await liveList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    betList: async (req, res) => {
        try {
            await betList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    rejectedBetList: async (req, res) => {
        try {
            await rejectedBetList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    betHistory: async (req, res) => {
        try {
            await betHistory(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    betProfitLoss: async (req, res) => {
        try {
            await betProfitLoss(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    events_bets: async (req, res) => {
        try {
            await events_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    user_events_bets: async (req, res) => {
        try {
            await user_events_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    prematch_events_bets: async (req, res) => {
        try {
            await prematch_events_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    event_session_bets: async (req, res) => {
        try {
            await event_session_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    deleteBet: async (req, res) => {
        try {
            await delete(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_bet_status: async (req, res) => {
        try {
            await update_bet_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}