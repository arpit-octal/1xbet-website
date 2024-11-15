const paymentRequests = require("../../models/paymentRequest.model");
const paymentWithdrawRequests = require("../../models/paymentWithdrawRequests.model");
const Payments = require("../../models/payments.model");
const { isEmpty } = require("lodash");
const { responseData } = require("../../helpers/responseData");
const { saveActivity, getPaginateObj } = require("../../helpers/serviceHelper");
const {
    generateAuthToken,
    reGenerateUserAuthTokenHelper,
    totalExposureAmount,
    totalAmount,
    totalMultiMarketExposure,
    getUserType,
} = require("../../helpers/helper");
const { ObjectId } = require("mongodb");
const Transaction = require("../../models/transaction.model");
const { makeid } = require("../../helpers/helper");
const paymentRequestsModel = require("../../models/paymentRequest.model");
const bankModel = require("../../models/userBank.model");
module.exports = {
    getList: async (req, res) => {
        try {
            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Payments.countDocuments({ status: 'active' });

            let queryResponse = await Payments.aggregate([
                {
                    $match: { status: "active" }
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: startIndex,
                },
                {
                    $limit: limit,
                },
            ]);

            let paginateObj = await getPaginateObj(
                total,
                limit,
                page,
                startIndex,
                endIndex
            );
            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            };

            return res.json(responseData("GET_LIST", responseCreate, req, true));
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    submitPaymentRequest: async (req, res) => {
        try {
            let { utrNumber, amount, customerName } = req.body;
            const updateData = {
                userId: req.user._id,
            };
            if (utrNumber) updateData.utrNumber = utrNumber;
            if (customerName) updateData.customerName = customerName;
            if (amount) updateData.amount = amount;

            if (req?.file && req?.file.originalname) {
                if (req?.file?.originalname) updateData.image = req?.file.originalname;
                if (req?.file?.originalname) {
                    updateData.imageUrl = process.env.IMAGE_LOCAL_PATH + req?.file.originalname;
                }
            }

            const resp = await paymentRequests.create(updateData);
            return res.json(responseData("DEPOSIT_ADDED_SUCCESSFULLY", resp, req, true));
        } catch (error) {
            console.log("error", error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    submitWithdrawPaymentRequest: async (req, res) => {
        try {
            let { bankList, paymentManagerDetails, paymentManagerName, amount, customerName, accountNumber, ifscCode, bankName, accountHolderName } = req.body;
            if (!bankList) {
                const bankDetail = await bankModel.findOne({ accountNumber: accountNumber })
                if (!isEmpty(bankDetail)) {
                    return res.json(responseData("BANK_ALREADY_EXISTS", {}, req, false));
                }
            }
            const updateData = {
                userId: req.user._id,
                accountNumber,
                ifscCode,
                bankName,
                accountHolderName
            };
            if (paymentManagerName) updateData.paymentManagerName = paymentManagerName;
            if (paymentManagerDetails) updateData.paymentManagerDetails = paymentManagerDetails;
            if (customerName) updateData.customerName = customerName;
            if (amount) updateData.amount = amount;

            if (req?.file && req?.file.originalname) {
                if (req?.file?.originalname) updateData.image = req?.file.originalname;
                if (req?.file?.originalname) updateData.imageUrl = process.env.IMAGE_LOCAL_PATH + req?.file.originalname;
            }
            await bankModel.create(updateData)
            const resp = await paymentWithdrawRequests.create(updateData);
            return res.json(responseData("WITHDRAW_ADDED_SUCCESSFULLY", resp, req, true));
        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    withdrawRequestList: async (req, res) => {
        try {
            const queryPattern = [
                {
                    $match: {
                        userId: ObjectId(req.user._id)
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]
            const data = await paymentWithdrawRequests.aggregate(queryPattern)
            return res.json(responseData("GET_LIST", data, req, true));
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    depositRequestList: async (req, res) => {
        try {
            const queryPattern = [
                {
                    $match: {
                        userId: ObjectId(req.user._id)
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]
            const data = await paymentRequestsModel.aggregate(queryPattern)
            return res.json(responseData("GET_LIST", data, req, true));
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    bankList: async (req, res) => {
        try {
            const queryPattern = [
                {
                    $match: {
                        userId: ObjectId(req.user._id)
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]
            const data = await bankModel.aggregate(queryPattern)
            return res.json(responseData("GET_LIST", data, req, true));
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
}