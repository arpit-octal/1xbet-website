const { responseData } = require("../../helpers/responseData");
const paymentService = require('../../services/users/payment.services')
module.exports = {
    getList: async (req, res) => {
        try {
            await paymentService.getList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    submitPaymentRequest: async (req, res) => {
        try {
            await paymentService.submitPaymentRequest(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    submitWithdrawPaymentRequest: async (req, res) => {
        try {
            await paymentService.submitWithdrawPaymentRequest(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    withdrawRequestList: async (req, res) => {
        try {
            await paymentService.withdrawRequestList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    depositRequestList: async (req, res) => {
        try {
            await paymentService.depositRequestList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
    bankList: async (req, res) => {
        try {
            await paymentService.bankList(req, res);
        } catch (err) {
            var msg = err.message || "SOMETHING_WENT_WRONG";
            return res.status(422).json(responseData(msg, {}, req));
        }
    },
}