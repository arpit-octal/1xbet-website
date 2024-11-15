const { responseData } = require("../../helpers/responseData");

const {
    global_limit_setting_update,
    global_limit_setting_list,
    before_inplay_limit,
    getReferralSetting,
    updateReferralSetting
} = require('../../services/admins/settings.services')

module.exports = {
    global_limit_setting_update: async (req, res) => {
        try {
            await global_limit_setting_update(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    global_limit_setting_list: async (req, res) => {
        try {
            await global_limit_setting_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    before_inplay_limit: async (req, res) => {
        try {
            await before_inplay_limit(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    getReferralSetting: async (req, res) => {
        try {
            await getReferralSetting(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    updateReferralSetting: async (req, res) => {
        try {
            await updateReferralSetting(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    
}