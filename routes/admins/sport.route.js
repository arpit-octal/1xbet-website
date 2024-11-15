const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const { verifyAdminToken } = require("../../middlewares/verifyToken");

const {
    get_sport_list,
    update_status,
    get_sport_filter_list
} = require('../../controllers/admins/sport.controller');

router.get('/list',[verifyAdminToken], get_sport_list);
router.put('/update-status/:id',[verifyAdminToken], update_status);
router.get('/filter-list',[verifyAdminToken], get_sport_filter_list);

module.exports = router;