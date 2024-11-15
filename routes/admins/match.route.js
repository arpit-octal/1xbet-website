const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/admins/auth");
const { verifyAdminToken } = require("../../middlewares/verifyToken");

const {
    get_match_list,
    result_match_list,
    add_match_list,
    update_multiple,
    get_match_detail,
    update_status,
    add_match_ad,
    update_status_by_eventId,
    update_match,
    update_series_status,
    inplay_status,
    update_match_limit,
    get_fancy_list,
    get_premium_fancy_list,
    get_result_fancy_premium_list,
    get_sport_filter_list,
    get_sport_filter_list_fancy_result,
    fancy_delete,
    update_fancy_status,
    fancy_bet_position,
    risk_match_list,
    risk_bookmaker_match_list,
    update_premiumfancy_status,
    top_casino_list,
    casino_status_update
} = require('../../controllers/admins/match.controller');

router.get('/list', [verifyAdminToken], get_match_list);
router.get('/result-match-list', [verifyAdminToken], result_match_list);
router.get("/risk-match-list", [verifyAdminToken], risk_match_list);
router.get("/risk-bookmaker-match-list", [verifyAdminToken], risk_bookmaker_match_list);
router.get('/add-match-list', [verifyAdminToken], add_match_list);
router.post('/update-multiple', [verifyAdminToken], update_multiple);
router.get('/detail', [verifyAdminToken], get_match_detail);
router.put('/update-status/:id', [verifyAdminToken], validationRule.validate('update-status-check'), update_status);
router.put('/add-match-ad/:id', [verifyAdminToken], [], add_match_ad);
router.get('/update-status-by-eventid', [verifyAdminToken], update_status_by_eventId);
router.post('/series-matches-status', [verifyAdminToken], update_series_status);
router.get('/inplay-status', [verifyAdminToken], inplay_status);
router.put('/update-match/:id', [verifyAdminToken], update_match);
router.post('/update-match-limit-by-eventid', [verifyAdminToken], update_match_limit);
router.get('/fancy-list', [verifyAdminToken], get_fancy_list);
router.get('/premium-fancy-list', [verifyAdminToken], get_premium_fancy_list);
router.get('/result-fancy-premium-list', [verifyAdminToken], get_result_fancy_premium_list);
router.post('/fancy-delete', [verifyAdminToken], fancy_delete);
router.get('/filter-list', [verifyAdminToken], get_sport_filter_list);
router.get('/filter-fancy-result-list', [verifyAdminToken], get_sport_filter_list_fancy_result);
router.post('/update-fancy-status', [verifyAdminToken], update_fancy_status);
router.post('/update-premiumfancy-status', [verifyAdminToken], update_premiumfancy_status);

//fancy bet position downline
router.get('/fancy-bet-position', [verifyAdminToken], fancy_bet_position);
router.get('/top-casino-list',[verifyAdminToken],  top_casino_list);
router.put('/top-casino-status-update/:id',[verifyAdminToken],  casino_status_update);

module.exports = router;