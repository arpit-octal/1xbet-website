const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/admins/auth");
const { verifyAdminToken } = require("../../middlewares/verifyToken");

const {
    global_limit_setting_update,
    global_limit_setting_list,
    before_inplay_limit,
    getReferralSetting,
    updateReferralSetting
} = require('../../controllers/admins/settings.controller');

router.post('/global-limit-setting-update', [verifyAdminToken], global_limit_setting_update);
router.get('/global-limit-setting-list', [verifyAdminToken], global_limit_setting_list);
router.get('/before-inplay-limit', [verifyAdminToken], before_inplay_limit);
router.get("/get-referral-setting", [verifyAdminToken], getReferralSetting);
router.post("/update-referral-setting", [verifyAdminToken], updateReferralSetting);

module.exports = router;