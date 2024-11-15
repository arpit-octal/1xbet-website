const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/users/auth");

const {
    site_setting_list,
    global_setting_list
} = require('../../controllers/users/site-setting.controller');

router.get('/site-setting-list', [], site_setting_list);
router.get('/global-setting-list', [], global_setting_list);

module.exports = router;