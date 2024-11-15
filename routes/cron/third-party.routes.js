const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');

const {
    get_tournament_list,
    soccer_tournament_match,
    tennis_tournament_match,
    cricket_tournament_match,
    save_fancy_list,
    save_bookmaker_list,
    save_match_fancy_list,
    save_match_bookmaker_list,
    live_match,
    match_odds,
    rollbackCasinoAmount
} = require('../../controllers/cron/third-party.controllers');

router.get('/soccer-tournament-match', soccer_tournament_match);
router.get('/tennis-tournament-match', tennis_tournament_match);
router.get('/cricket-tournament-match', cricket_tournament_match);
router.get('/tournament-list', get_tournament_list);

router.get('/fancy-list-save', save_fancy_list);
router.get('/bookmaker-list-save', save_bookmaker_list);
router.get('/match-fancy-list-save', save_match_fancy_list);
router.get('/match-bookmaker-list-save', save_match_bookmaker_list);
router.get('/live-match', live_match);
router.get('/match-odds', match_odds);
router.get('/roll-back', rollbackCasinoAmount);

module.exports = router;