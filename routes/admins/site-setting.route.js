const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/admins/auth");
const { verifyAdminToken } = require("../../middlewares/verifyToken");

const {
    site_setting_list,
    site_setting_update
} = require('../../controllers/admins/site-setting.controller');

router.post('/site-setting-update/:id', [verifyAdminToken], site_setting_update);
router.get('/site-setting-list', [verifyAdminToken], site_setting_list);

module.exports = router;