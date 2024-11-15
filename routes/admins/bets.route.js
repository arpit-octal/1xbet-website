const express = require('express');
const router = express.Router();

const { verifyAdminToken } = require("../../middlewares/verifyToken");
const bets = require("../../controllers/admins/bet.controller");

// bets
router.get('/live-bet-list', [verifyAdminToken], bets.liveList);
router.get('/bet-list', [verifyAdminToken], bets.betList);
router.get('/rejected-bet-list', [verifyAdminToken], bets.rejectedBetList);
router.get('/bet-history', [verifyAdminToken], bets.betHistory);
router.get('/profit-loss-bet', [verifyAdminToken], bets.betProfitLoss);
router.get('/events-bets', [verifyAdminToken], bets.events_bets);
router.get('/user-events-bets', [verifyAdminToken], bets.user_events_bets);
router.get('/prematch-events-bets', [verifyAdminToken], bets.prematch_events_bets);
router.get('/event-session-bets', [verifyAdminToken], bets.event_session_bets);
router.get('/delete', [verifyAdminToken], bets.deleteBet);
router.post('/update-bet-status', [verifyAdminToken], bets.update_bet_status);

module.exports = router;