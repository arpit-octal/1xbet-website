const express = require("express");
const router = express.Router();

// const validationRule = require("../../validations/admins/auth");
const { verifyToken } = require("../../middlewares/verifyToken");

const user = require("../../controllers/users/user.controller");

router.post("/login", [], user.user_login);
router.get("/refresh-amount", [verifyToken], user.refresh_amount);
router.post("/refresh-token", [], user.refresh_token);
router.post("/change-password", [verifyToken], [], user.changePassword)
router.get("/activity-logs", [verifyToken], user.activity_logs);
router.get("/profile", [verifyToken], user.profile);
router.post("/profile-update", [verifyToken], user.profile_update);
router.post("/edit-stake", [verifyToken], user.edit_stake)
router.post("/edit-one-click-stake", [verifyToken], user.edit_one_click_stake);
router.post("/subscribe", [], user.subscribe);
router.get("/total-exposure-amount", [verifyToken], user.totalExposureAmount);
router.post("/casino-amount-add", [verifyToken], user.casinoAmountAdd);
router.post("/easytogo-casino-amount-add", [verifyToken], user.easyToGoCasinoAmountAdd);
router.get("/website-setting", [], user.list_website_setting);
// router.get("/casino-vendors", [], user.casinoVendorList);
// router.get("/casino-games-by-vendors", [verifyToken], user.casinoGameListByVendor);
// router.get("/casino-game-url", [verifyToken], user.casinoGameURL);
// router.get("/casino-add-user", [verifyToken], user.casinoAddUser);
router.get("/casino-games-list", [], user.casinoGameList);
router.get('/top-casino-route',[], user.topCasinoList);
router.get("/casino-vendors", [], user.casinoProviderList);
router.post("/casino-game-login", [verifyToken], user.casinoGameLogin);
router.post("/add-user", [], user.add_user);
router.post("/register", user.register);
module.exports = router;