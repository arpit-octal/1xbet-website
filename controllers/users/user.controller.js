const { responseData } = require("../../helpers/responseData");
const user_service = require('../../services/users/user.services')
module.exports = {
    user_login: async (req, res) => {
        try {
            await user_service.user_login(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    refresh_amount: async (req, res) => {
        try {
            await user_service.refresh_amount(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    refresh_token: async (req, res) => {
        try {
            await user_service.refresh_token(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    changePassword: async (req, res) => {
        try {
            await user_service.changePassword(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    activity_logs: async (req, res) => {
        try {
            await user_service.activity_logs(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    profile: async (req, res) => {
        try {
            await user_service.profile(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    profile_update: async (req, res) => {
        try {
            await user_service.profile_update(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    edit_stake: async (req, res) => {
        try {
            await user_service.edit_stake(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    edit_one_click_stake: async (req, res) => {
        try {
            await user_service.edit_one_click_stake(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    subscribe: async (req, res) => {
        try {
            await user_service.subscribe(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    totalExposureAmount: async (req, res) => {
        try {
            await user_service.totalExposureAmount(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casinoAmountAdd: async (req, res) => {
        try {
            await user_service.casinoAmountAdd(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    easyToGoCasinoAmountAdd: async (req, res) => {
        try {
            await user_service.easyToGoCasinoAmountAdd(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    list_website_setting: async (req, res) => {
        try {
            await user_service.list_website_setting(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    // casinoVendorList: async (req, res) => {
    //     try {
    //         await user_service.casinoVendorList(req, res);
    //     } catch (err) {
    //         var msg = err.message || "SOMETHING_WENT_WRONG";
    //         return res.status(422).json(responseData(msg, {}, req));
    //     }
    // },
    // casinoGameListByVendor: async (req, res) => {
    //     try {
    //         await user_service.casinoGameListByVendor(req, res);
    //     } catch (err) {
    //         var msg = err.message || "SOMETHING_WENT_WRONG";
    //         return res.status(422).json(responseData(msg, {}, req));
    //     }
    // },
    // casinoGameURL: async (req, res) => {
    //     try {
    //         await user_service.casinoGameURL(req, res);
    //     } catch (err) {
    //         var msg = err.message || "SOMETHING_WENT_WRONG";
    //         return res.status(422).json(responseData(msg, {}, req));
    //     }
    // },
    // casinoAddUser: async (req, res) => {
    //     try {
    //         await user_service.casinoAddUser(req, res);
    //     } catch (err) {
    //         var msg = err.message || "SOMETHING_WENT_WRONG";
    //         return res.status(422).json(responseData(msg, {}, req));
    //     }
    // },
    casinoGameList: async (req, res) => {
        try {
            await user_service.casinoGameList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    topCasinoList: async (req, res) => {
        try {
            await user_service.topCasinoList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casinoProviderList: async (req, res) => {
        try {
            await user_service.casinoProviderList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    casinoGameLogin: async (req, res) => {
        try {
            await user_service.casinoGameLogin(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    add_user: async (req, res) => {
        try {
            await user_service.add_user(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    register: async (req, res) => {
        try {
            await user_service.register(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
}