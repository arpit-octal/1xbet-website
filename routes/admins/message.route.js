const express = require('express');
const router = express.Router();

const { verifyAdminToken } = require('../../middlewares/verifyToken');
const validationRule = require("../../validations/admins/auth");

const {
    create,
    getOne,
    update,
    getList,
    getImportant,
    statusUpdate,
    getDownline
} = require('../../controllers/admins/message.controller');

router.post('/', [verifyAdminToken], create);
router.get('/detail', [verifyAdminToken], getOne);
router.put('/update', [verifyAdminToken], update);
router.put('/status-update', [verifyAdminToken], statusUpdate);
router.get('/list', [verifyAdminToken], getList);
router.get('/important', [verifyAdminToken], getImportant);
router.get('/downline', [verifyAdminToken], getDownline);

module.exports = router;