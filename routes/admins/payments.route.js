const express = require("express");
const router = express.Router();
const { verifyAdminToken } = require("../../middlewares/verifyToken");
const { create, getList, paymentChangeStatus, paymentRequests, paymentWithdrawRequests, updatetWithdrawPaymentRequest,updateDepositRequest } = require("../../controllers/admins/payments.controller");
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage }).fields([{ name: "logoImage" }, { name: "qrImage" }]);
var uploadImage = multer({ storage: storage })

router.post("/create", [verifyAdminToken], upload, create)
router.get("/getList", [verifyAdminToken], getList)
router.put("/payment-change-status/:id", [verifyAdminToken], paymentChangeStatus)
router.get("/payment-requests", [verifyAdminToken], paymentRequests)
router.get("/payment-withdraw-requests", [verifyAdminToken], paymentWithdrawRequests)
router.post("/update-withdraw-payment-requests/:id", [verifyAdminToken], uploadImage.single("image"), updatetWithdrawPaymentRequest);
router.put("/update-deposit-payment-requests/:id", [verifyAdminToken], updateDepositRequest);

module.exports = router;