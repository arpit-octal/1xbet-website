const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middlewares/verifyToken");
const validationRule = require("../../validations/users/auth");

const {
    transaction_create,
    transaction_logs,
    transaction_bet_logs
} = require("../../controllers/users/transaction.controller");

router.post("/create", [verifyToken], validationRule.validate('transaction-create-check'), transaction_create)
router.get("/logs", [verifyToken], transaction_logs)
router.get("/bet-logs", [verifyToken], transaction_bet_logs)

module.exports = router;