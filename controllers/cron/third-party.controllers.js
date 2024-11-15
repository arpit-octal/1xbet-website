const { responseData } = require("../../helpers/responseData");
const third_party_service = require('../../services/cron/third-party.services')
module.exports = {
    soccer_tournament_match: async (req, res) => {
        try {
            await third_party_service.soccer_tournament_match(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    tennis_tournament_match: async (req, res) => {
        try {
            await third_party_service.tennis_tournament_match(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    cricket_tournament_match: async (req, res) => {
        try {
            await third_party_service.cricket_tournament_match(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_tournament_list: async (req, res) => {
        try {
            await third_party_service.get_tournament_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_match_list: async (req, res) => {
        try {
            await third_party_service.get_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_tennis_list: async (req, res) => {
        try {
            await third_party_service.get_tennis_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_soccer_list: async (req, res) => {
        try {
            await third_party_service.get_soccer_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_fancy_list: async (req, res) => {
        try {
            await third_party_service.save_fancy_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_bookmaker_list: async (req, res) => {
        try {
            await third_party_service.save_bookmaker_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_match_fancy_list: async (req, res) => {
        try {
            await third_party_service.save_match_fancy_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_match_bookmaker_list: async (req, res) => {
        try {
            await third_party_service.save_match_bookmaker_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    premium_fancy: async (req, res) => {
        try {
            await third_party_service.premium_fancy(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    match_odds: async (req, res) => {
        try {
            await third_party_service.match_odds(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    live_match: async (req, res) => {
        try {
            await third_party_service.live_match(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casino_transaction: async (req, res) => {
        try {
            await third_party_service.casino_transaction(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    diamond_api: async (req, res) => {
        try {
            await third_party_service.diamond_api(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    // Manual Market API
    get_manual_tournament_list: async (req, res) => {
        try {
            await third_party_service.get_manual_tournament_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_manual_match_list: async (req, res) => {
        try {
            await third_party_service.get_manual_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_manual_fancy_list: async (req, res) => {
        try {
            await third_party_service.save_manual_fancy_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_betFair_list: async (req, res) => {
        try {
            await third_party_service.save_betFair_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_match_betFair_list: async (req, res) => {
        try {
            await third_party_service.save_match_betFair_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    addBetFair: async (req, res) => {
        try {
            await third_party_service.addBetFair(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    setExposer: async (req, res) => {
        try {
            await third_party_service.setExposer(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    rollbackCasinoAmount: async (req, res) => {
        try {
            await third_party_service.rollbackCasinoAmount(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
}