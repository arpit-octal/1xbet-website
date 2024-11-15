const { responseData } = require("../../helpers/responseData");
const admin_service = require('../../services/admins/admin.services')
module.exports = {
    admin_login: async (req, res) => {
        try {
            await admin_service.admin_login(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    refresh_token: async (req, res) => {
        try {
            await admin_service.refresh_token(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_reference_amount: async (req, res) => {
        try {
            await admin_service.update_reference_amount(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    changePassword: async (req, res) => {
        try {
            await admin_service.changePassword(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    profile: async (req, res) => {
        try {
            await admin_service.profile(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    amount: async (req, res) => {
        try {
            await admin_service.amount(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    admin_user_list: async (req, res) => {
        try {
            await admin_service.admin_user_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    risk_profile_list: async (req, res) => {
        try {
            await admin_service.risk_profile_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    match_profile_list: async (req, res) => {
        try {
            await admin_service.match_profile_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    locked_user_list: async (req, res) => {
        try {
            await admin_service.locked_user_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    add_admin: async (req, res) => {
        try {
            await admin_service.add_admin(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    edit_admin: async (req, res) => {
        try {
            await admin_service.edit_admin(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_status: async (req, res) => {
        try {
            await admin_service.update_status(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    user_meta_data: async (req, res) => {
        try {
            await admin_service.user_meta_data(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    activity_logs:async (req, res) => {
        try {
            await admin_service.activity_logs(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    save_coin_owner:async(req,res) => {
        try {
            await admin_service.save_coin_owner(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    deposit_amount:async(req,res) => {
        try {
            await admin_service.deposit_amount(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    search_user:async(req,res) => {
        try {
            await admin_service.search_user(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    create_website:async(req,res) => {
        try {
            await admin_service.create_website(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    list_website:async(req,res) => {
        try {
            await admin_service.list_website(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    list_website_setting:async(req,res) => {
        try {
            await admin_service.list_website_setting(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    create_website_setting:async(req,res) => {
        try {
            await admin_service.create_website_setting(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },    
    exposure_list:async(req,res) => {
        try {
            await admin_service.exposure_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_exposure:async(req,res) => {
        try {
            await admin_service.update_exposure(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    update_commission:async(req,res) => {
        try {
            await admin_service.update_commission(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    profit_loss:async(req,res) => {
        try {
            await admin_service.profit_loss(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    match_profit_loss:async(req,res) => {
        try {
            await admin_service.match_profit_loss(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}