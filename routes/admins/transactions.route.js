const express = require("express");
const router = express.Router();

const { verifyAdminToken } = require("../../middlewares/verifyToken");
const validationRule = require("../../validations/users/auth");

const {
    transaction_create,
    transaction_logs,
    transaction_bet_logs,
    check_limit
} = require("../../controllers/admins/transactions.controller");

router.post("/create", [verifyAdminToken], transaction_create)
router.get("/check-limit", [verifyAdminToken], check_limit)
router.get("/logs", [verifyAdminToken], transaction_logs);
router.get("/bet-logs", [verifyAdminToken], transaction_bet_logs)

module.exports = router;