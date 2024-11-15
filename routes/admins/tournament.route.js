const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const { verifyAdminToken } = require("../../middlewares/verifyToken");

const {
    get_tournament_list,
    update_status,
    delete_all,
    get_series_list,
    block_market
} = require('../../controllers/admins/tournament.controller');

router.get('/list', [verifyAdminToken], get_tournament_list);
router.get('/series', [verifyAdminToken], get_series_list);
router.post('/block-market', [verifyAdminToken], block_market);
router.put('/update-status/:id', [verifyAdminToken], update_status);
router.get('/delete-all', [verifyAdminToken], delete_all);

module.exports = router;