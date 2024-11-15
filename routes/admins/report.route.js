const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/admins/auth");
const { verifyAdminToken } = require("../../middlewares/verifyToken");

const {
    downline,
    market,
    casino,
    casino_date_pl,
    casino_pl,
    casino_data
} = require('../../controllers/admins/report.controller');

router.get('/downline', [verifyAdminToken], downline);
router.get('/market', [verifyAdminToken], market);
// router.get('/casino', [verifyAdminToken], casino); 
router.get('/casino-profit-loss-by-date', [verifyAdminToken], casino_date_pl);
router.get('/casino-profit-loss', [verifyAdminToken], casino_pl);
router.get('/casino', [verifyAdminToken], casino_data);

module.exports = router;