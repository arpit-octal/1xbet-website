const express = require("express");
const router = express.Router();

// const validationRule = require("../../validations/admins/auth");
const { verifyToken } = require("../../middlewares/verifyToken");

const controller = require('../../controllers/users/paymentRequest.controller')

const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
router.get("/getList", controller.getList);
router.post("/submit-payment-request", [verifyToken], upload.single("image"), controller.submitPaymentRequest);
router.post("/submit-withdraw-payment-request", [verifyToken], controller.submitWithdrawPaymentRequest);
router.get("/withdraw-payment-request", [verifyToken], controller.withdrawRequestList);
router.get("/deposit-payment-request", [verifyToken], controller.depositRequestList);
router.get("/bank-list", [verifyToken], controller.bankList);

module.exports = router;