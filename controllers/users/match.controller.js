const { responseData } = require("../../helpers/responseData");

const {
    get_match_list,
    get_mobile_match_list,
    get_series_list,
    get_match_detail,
    get_match_fancy,
    get_score,
    get_last_rate,
    get_bet_position,
    fancy_bet_position,
    sport_book_bet_position,
    get_events_bet_position,
    place_bet,
    check_bet_price,
    bookmaker_place_bet,
    multiple_event_place_bet,
    fancy_place_bet,
    diamond_fancy_place_bet,
    premium_fancy_place_bet,
    clear_unmatched_bet,
    get_current_bets,
    get_mobile_current_bets,
    my_bets,
    my_bookmaker_bets,
    my_fancy_bets,
    my_sport_book_bets,
    events_bets,
    bet_history,
    search_list,
    profit_loss,
    get_current_match_bets,
    get_current_match_group_bets,
    get_current_unmatch_group_bets
} = require('../../services/users/match.services')

module.exports = {
    get_match_list: async (req, res) => {
        try {
            await get_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_mobile_match_list: async (req, res) => {
        try {
            await get_mobile_match_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    search_list: async (req, res) => {
        try {
            await search_list(req, res);
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
    get_match_detail: async (req, res) => {
        try {
            await get_match_detail(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_match_fancy: async (req, res) => {
        try {
            await get_match_fancy(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_score: async (req, res) => {
        try {
            await get_score(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_last_rate: async (req, res) => {
        try {
            await get_last_rate(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_bet_position: async (req, res) => {
        try {
            await get_bet_position(req, res);
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
    sport_book_bet_position: async (req, res) => {
        try {
            await sport_book_bet_position(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_events_bet_position: async (req, res) => {
        try {
            await get_events_bet_position(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    check_bet_price: async (req, res) => {
        try {
            await check_bet_price(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    place_bet: async (req, res) => {
        try {
            await place_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    bookmaker_place_bet: async (req, res) => {
        try {
            await bookmaker_place_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    multiple_event_place_bet: async (req, res) => {
        try {
            await multiple_event_place_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    fancy_place_bet: async (req, res) => {
        try {
            await fancy_place_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    diamond_fancy_place_bet: async (req, res) => {
        try {
            await diamond_fancy_place_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    premium_fancy_place_bet: async (req, res) => {
        try {
            await premium_fancy_place_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    my_bets: async (req, res) => {
        try {
            await my_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_current_bets: async (req, res) => {
        try {
            await get_current_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_mobile_current_bets: async (req, res) => {
        try {
            await get_mobile_current_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_current_match_group_bets: async (req, res) => {
        try {
            await get_current_match_group_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_current_unmatch_group_bets: async (req, res) => {
        try {
            await get_current_unmatch_group_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    get_current_match_bets: async (req, res) => {
        try {
            await get_current_match_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    my_fancy_bets: async (req, res) => {
        try {
            await my_fancy_bets(req, res);
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
    my_sport_book_bets: async (req, res) => {
        try {
            await my_sport_book_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    my_bookmaker_bets: async (req, res) => {
        try {
            await my_bookmaker_bets(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    clear_unmatched_bet: async (req, res) => {
        try {
            await clear_unmatched_bet(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    bet_history: async (req, res) => {
        try {
            await bet_history(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    profit_loss: async (req, res) => {
        try {
            await profit_loss(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}