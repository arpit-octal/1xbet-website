const { responseData } = require("../../helpers/responseData");

const {
    site_setting_list,
    site_setting_update
} = require('../../services/admins/site-setting.services')

module.exports = {
    site_setting_list: async (req, res) => {
        try {
            await site_setting_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    site_setting_update: async (req, res) => {
        try {
            await site_setting_update(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
}