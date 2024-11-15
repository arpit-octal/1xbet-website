const express = require("express");
const router = express.Router();
const casinoController = require('../../controllers/casino/casino.controller')

router.post("/casino-webhook", [], casinoController.casino_webhook);
router.post("/casino-webhook-bal", [], casinoController.casino_webhook_balance);
router.post("/live-casino/balance", [], casinoController.casino_balance);
router.post("/live-casino/betrequest", [], casinoController.casino_bet_request);
router.post("/live-casino/resultrequest", [], casinoController.casino_result_request);
router.post("/live-casino/rollbackrequest", [], casinoController.casino_rollback_request);

module.exports = router;