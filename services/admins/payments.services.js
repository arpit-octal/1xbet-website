
const Payments = require("../../models/payments.model");
const paymentRequests = require("../../models/paymentRequest.model");
const paymentWithdrawRequests = require("../../models/paymentWithdrawRequests.model");
const { responseData } = require("../../helpers/responseData");
const { getPaginateObj } = require('../../helpers/serviceHelper');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const { isEmpty } = require("lodash");

module.exports = {
    create: async (req, res) => {
        // console.log("-------------> Body: ", req.body);
        // console.log("File: ", req.files);
        // console.log("File----------------------: ", req.files[0]);
        // console.log("File---===================: ", req.files.logoImage);
        try {
            let { paymentName, key1, key2, key3, key4, value1, value2, value3, value4, minAmount, maxAmount, id } = req.body;
            const updateData = {};
            if (paymentName) updateData.paymentName = paymentName;
            if (key1) updateData.key1 = key1;
            if (key2) updateData.key2 = key2;
            if (key3) updateData.key3 = key3;
            if (key4) updateData.key4 = key4;
            if (value1) updateData.value1 = value1;
            if (value2) updateData.value2 = value2;
            if (value3) updateData.value3 = value3;
            if (value4) updateData.value4 = value4;
            if (minAmount) updateData.minAmount = minAmount;
            if (maxAmount) updateData.maxAmount = maxAmount;

            if (req?.files?.logoImage && req?.files?.logoImage[0]?.originalname) {
                // console.log("originalname", req.files.logoImage[0]?.originalname);
                if (req?.files?.logoImage[0]?.originalname) updateData.logoImage = req?.files?.logoImage[0]?.originalname;
                if (req?.files?.logoImage[0]?.originalname) updateData.logoImageUrl = process.env.IMAGE_LOCAL_PATH + req?.files?.logoImage[0]?.originalname;
            }
            if (req?.files?.qrImage && req?.files?.qrImage[0]?.originalname) {
                if (req.files.qrImage[0]?.originalname) updateData.qrImage = req.files.qrImage[0]?.originalname;
                if (req?.files?.qrImage[0]?.originalname) updateData.qrImageUrl = process.env.IMAGE_LOCAL_PATH + req?.files?.qrImage[0]?.originalname;
            }
            // console.log("updateData", updateData);
            const query = await Payments.findOneAndUpdate(
                {
                    _id: id

                },
                {
                    $set: updateData,
                },
                { returnOriginal: false }
            );
            console.log("query", query);
            if (!query) {
                console.log("ddddddddddddddddd", updateData);
                const resp = await Payments.create(updateData);
                return res.json(responseData("ADDED_SUCCESSFULLY", resp, req, true));
            }
            return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));
        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },
    getList: async (req, res) => {

        try {
            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const total = await Payments.countDocuments({
            });

            let queryResponse = await Payments.aggregate([
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)
            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    paymentChangeStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const arr = ["active", "inactive"];
            if (!arr.includes(status)) {
                return res.json(
                    responseData("INVALID_STATUS", {}, req, false)
                );
            }
            const resp = await Payments.updateOne({ _id: req.params.id }, { $set: { status } });
            if (resp.modifiedCount) {
                return res.json(responseData("STATUS_UPDATE", {}, req, true));
            } else {
                return res.json(responseData("NOT_FOUND", {}, req, false));
            }
        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));;
        }
    },
    paymentRequests: async (req, res) => {

        try {
            // Pagination
            let {

                keyword,

            } = req.query
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            let matchFilter = {}
            if (keyword) {
                matchFilter.$or = [
                    { 'customerName': { $regex: keyword, $options: 'i' } },
                    { 'utrNumber': { $regex: keyword, $options: 'i' } },

                ]
            }

            const total = await paymentRequests.countDocuments({
                matchFilter
            });


            let queryResponse = await paymentRequests.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                        pipeline: [
                            {
                                $project: {
                                    username: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)
            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    paymentWithdrawRequests: async (req, res) => {

        try {
            // Pagination
            let { keyword } = req.query
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            let matchFilter = {}
            if (keyword) {
                matchFilter.$or = [
                    { 'customerName': { $regex: keyword, $options: 'i' } }

                ]
            }

            const total = await paymentWithdrawRequests.countDocuments({
                matchFilter
            });


            let queryResponse = await paymentWithdrawRequests.aggregate([
                {
                    $match: matchFilter
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: startIndex
                },
                {
                    $limit: limit
                },
            ])

            let paginateObj = await getPaginateObj(total, limit, page, startIndex, endIndex)
            let responseCreate = {
                data: queryResponse,
                count: queryResponse.length,
                ...paginateObj,
            }

            return res.json(responseData("GET_LIST", responseCreate, req, true));

        } catch (error) {
            return res.json(responseData("ERROR_OCCUR", error.message, req, false));
        }
    },
    updatetWithdrawPaymentRequest: async (req, res) => {
        try {
            let { status, amountPaid, description } = req.body;
            const { id } = req.params
            const updateData = {
                status
            };
            if (amountPaid) updateData.amountPaid = amountPaid;
            if (description) updateData.description = description;
            if (status == "Completed") {
                if (req?.file && req?.file.originalname) {
                    // co
                    if (req?.file?.originalname) updateData.image = req?.file.originalname;
                    if (req?.file?.originalname) updateData.imageUrl = process.env.IMAGE_LOCAL_PATH + req?.file.originalname;
                } else {
                    return res.json(responseData("IMAGE_REQUIRED", {}, req, false));
                }
            }
            const resp = await paymentWithdrawRequests.findOneAndUpdate({ _id: ObjectId(id) }, { $set: updateData }, { new: true });
            return res.json(responseData("PAYMENT_UPDATED_SUCCESSFULLY", resp, req, true));
        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    },

    updateDepositRequest: async (req, res) => {
        try {
            const { paymentStatus, receiverBank } = req.body
            let updateData = {}
            if (paymentStatus == "approved") {
                updateData = {
                    paymentStatus,
                    receiverBank
                }
            } else {
                updateData = {
                    paymentStatus
                }
            }
            const depositUpdate = await paymentRequests.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, { new: true })
            if (isEmpty(depositUpdate)) {
                return res.json(responseData("NOT_FOUND", {}, req, true));
            }
            return res.json(responseData("PAYMENT_UPDATED_SUCCESSFULLY", depositUpdate, req, true));
        } catch (error) {
            console.log('error', error);
            return res.json(responseData("ERROR_OCCUR", error, req, false));
        }
    }


}