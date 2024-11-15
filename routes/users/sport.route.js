const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');

const {
    get_sports,
    get_mobile_sports,
    get_sport_list,
    set_multi_market,
    get_multi_market,
    inplay_match_count
} = require('../../controllers/users/sport.controller');

router.get('/', get_sports);
router.get('/mobile', get_mobile_sports);

router.get('/list', get_sport_list);

// multi market
router.post('/multi-market',[verifyToken], set_multi_market);
router.get('/multi-market', [verifyToken], get_multi_market);
router.get('/inplay-count', inplay_match_count);


module.exports = router;