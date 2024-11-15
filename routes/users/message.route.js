const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/admins/auth");

const {
    getOne,
    getList
} = require('../../controllers/users/message.controller');

router.get('/detail', [], getOne);
router.get('/list', [], getList);

module.exports = router;