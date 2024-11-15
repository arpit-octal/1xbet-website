const { responseData } = require("../../helpers/responseData");
const {
    create,
    getList, paymentChangeStatus, paymentRequests, paymentWithdrawRequests, updatetWithdrawPaymentRequest,updateDepositRequest
} = require('../../services/admins/payments.services')

module.exports = {
    create: async (req, res) => {

        try {
            await create(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    getList: async (req, res) => {
        try {
            await getList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    paymentChangeStatus: async (req, res) => {
        try {
            await paymentChangeStatus(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    paymentRequests: async (req, res) => {
        try {
            await paymentRequests(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    paymentWithdrawRequests: async (req, res) => {
        try {
            await paymentWithdrawRequests(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    updatetWithdrawPaymentRequest: async (req, res) => {
        try {
            await updatetWithdrawPaymentRequest(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    updateDepositRequest: async (req, res) => {
        try {
            await updateDepositRequest(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },


}