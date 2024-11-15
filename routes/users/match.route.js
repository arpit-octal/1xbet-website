const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/users/auth");

const {
    get_series_list,
    get_match_list,
    get_mobile_match_list,
    get_match_detail,
    get_match_fancy,
    get_score,
    get_bet_position,
    fancy_bet_position,
    sport_book_bet_position,
    get_events_bet_position,
    get_last_rate,
    check_bet_price,
    place_bet,
    bookmaker_place_bet,
    multiple_event_place_bet,
    fancy_place_bet,
    diamond_fancy_place_bet,
    premium_fancy_place_bet,
    clear_unmatched_bet,
    get_current_bets,
    my_bets,
    my_fancy_bets,
    my_bookmaker_bets,
    my_sport_book_bets,
    events_bets,
    bet_history,
    search_list,
    profit_loss,
    get_current_match_group_bets,
    get_current_match_bets,
    get_mobile_current_bets,
    get_current_unmatch_group_bets
} = require('../../controllers/users/match.controller');

router.get('/series', get_series_list);
router.get('/list', get_match_list);
router.get('/mobile-list', get_mobile_match_list);
router.get('/search-list', search_list);
router.get('/detail', get_match_detail);
router.get('/fancy-list', get_match_fancy);
router.get('/score', [], get_score);
router.get('/last-rate', [], get_last_rate);
router.get('/get-bet-positions', [verifyToken], get_bet_position);
router.get('/fancy-bet-positions', [verifyToken], fancy_bet_position);
router.get('/sport-book-bet-positions', [verifyToken], sport_book_bet_position);
router.post('/get-events-bet-positions', [verifyToken], get_events_bet_position);
router.post('/multiple-event-place-bet', [verifyToken], multiple_event_place_bet);
router.post('/check-bet-price', [verifyToken], check_bet_price);
router.post('/betfaire-place-bet', [verifyToken], place_bet);
router.post('/bookmaker-place-bet', [verifyToken], bookmaker_place_bet);
router.post('/tennis-place-bet', [verifyToken], place_bet); //tennis_place_bet
router.post('/soccer-place-bet', [verifyToken], place_bet); //soccer_place_bet
router.post('/fancy-place-bet', [verifyToken], validationRule.validate('fancy-place-bet-check'), fancy_place_bet);
router.post('/diamond-fancy-place-bet', [verifyToken], validationRule.validate('fancy-place-bet-check'), diamond_fancy_place_bet);
router.post('/premium-fancy-place-bet', [verifyToken], validationRule.validate('premium-fancy-place-bet-check'), premium_fancy_place_bet);

// bets
router.get('/current-bets', [verifyToken], get_current_bets);
router.get('/mobile-current-bets', [verifyToken], get_mobile_current_bets);
router.get('/current-group-match-bets', [verifyToken], get_current_match_group_bets);
router.get('/current-group-unmatch-bets', [verifyToken], get_current_unmatch_group_bets);
router.get('/current-match-bets', [verifyToken], get_current_match_bets);
router.get('/my-bets', [verifyToken], my_bets);
router.get('/my-bookmaker-bets', [verifyToken], my_bookmaker_bets);
router.get('/my-fancy-bets', [verifyToken], my_fancy_bets);
router.get('/my-sport-book-bets', [verifyToken], my_sport_book_bets);

router.get('/events-bets', [verifyToken], events_bets);
router.get('/bet-history', [verifyToken], bet_history);
router.get('/profit-loss', [verifyToken], profit_loss);

// clear unmatched bet
router.get('/clear-unmatched-bet', [verifyToken], clear_unmatched_bet);

module.exports = router;