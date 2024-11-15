const express = require('express');
const router = express.Router();

const { verifyAdminToken } = require("../../middlewares/verifyToken");
const bets = require("../../controllers/admins/bet-result.controller");

// bets
router.post('/fancy', [verifyAdminToken], bets.fancy);
router.post('/premium-fancy', [verifyAdminToken], bets.premiumFancy);
router.post('/betFair', [verifyAdminToken], bets.betFair);
router.post('/bookmaker', [verifyAdminToken], bets.bookmaker);
router.post('/sportBook', [verifyAdminToken], bets.sportBook);

module.exports = router;