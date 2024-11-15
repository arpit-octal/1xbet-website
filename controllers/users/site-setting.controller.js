const { responseData } = require("../../helpers/responseData");

const {
    site_setting_list,
    global_setting_list
} = require('../../services/users/site-setting.services')

module.exports = {
    site_setting_list: async (req, res) => {
        try {
            await site_setting_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    global_setting_list: async (req, res) => {
        try {
            await global_setting_list(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    }
}