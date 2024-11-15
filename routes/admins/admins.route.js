const express = require("express");
const router = express.Router();

const validationRule = require("../../validations/admins/auth");
const { verifyAdminToken } = require("../../middlewares/verifyToken");
const { authorize } = require("../../middlewares/authorize");
const { user_profile } = require("../../middlewares/multerUpload");

const admin = require("../../controllers/admins/admin.controller");

router.post("/login", validationRule.validate("admin-login"), admin.admin_login);
router.post("/refresh-token",[], admin.refresh_token);
router.post("/change-password", [verifyAdminToken], admin.changePassword);

//profile 
router.get("/profile", [verifyAdminToken], admin.profile)
router.get("/refresh-amount", [verifyAdminToken], admin.amount);
router.post("/update-reference-amount", [verifyAdminToken], admin.update_reference_amount)

router.get("/meta-data",[verifyAdminToken], admin.user_meta_data)
// validationRule.validate("add-profile"),
router.post("/add-profile", [verifyAdminToken],  admin.add_admin)
router.put("/edit-profile/:id", [verifyAdminToken], admin.edit_admin);
router.put("/profile-change-status/:id", [verifyAdminToken], admin.update_status);
router.get("/profile-list", [verifyAdminToken], admin.admin_user_list);
router.get("/risk-profile-list", [verifyAdminToken], admin.risk_profile_list);
router.get("/match-profile-list", [verifyAdminToken], admin.match_profile_list);
router.get("/locked-user-list", [verifyAdminToken], admin.locked_user_list);

// logs
router.get("/activity-logs", [verifyAdminToken],admin.activity_logs);

router.post("/deposit-chips", [verifyAdminToken], validationRule.validate("coin-check"),admin.save_coin_owner);
router.post("/deposit-amount", [verifyAdminToken],admin.deposit_amount);
router.get("/search-user", [verifyAdminToken], admin.search_user);

router.post("/create-website", [verifyAdminToken], admin.create_website);
router.get("/list-website", [verifyAdminToken], admin.list_website);
router.get("/website-setting", [verifyAdminToken], admin.list_website_setting);
router.post("/update-website-setting", [verifyAdminToken], admin.create_website_setting);

router.get("/exposure-list", [verifyAdminToken], admin.exposure_list);
router.post("/update-exposure", [verifyAdminToken], admin.update_exposure);
router.post("/update-commission", [verifyAdminToken], admin.update_commission);

// user profit loss
router.get('/profit-loss', [verifyAdminToken], admin.profit_loss);
router.get('/match-profit-loss', [verifyAdminToken], admin.match_profit_loss);

router.get("/downline-list", [verifyAdminToken], admin.admin_user_list);

module.exports = router;