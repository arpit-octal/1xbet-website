const { body, check } = require("express-validator");
const { validatorMiddleware } = require("../../helpers/helper");


module.exports.validate = (method) => {
  switch (method) {
    case "admin-login": {
      return [
        body("username")
          .notEmpty()
          .withMessage("USERNAME_EMPTY"),
        body("password")
          .notEmpty()
          .withMessage("PASSWORD_EMPTY"),
        body("uniqueId")
          .notEmpty()
          .withMessage("UNIQUE_EMPTY"),
        validatorMiddleware,
      ];
    }
    case "forgot-password": {
      return [
        body("email")
          .notEmpty()
          .withMessage("EMAIL_EMPTY")
          .isEmail()
          .withMessage("EMAIL_VALID"),
        validatorMiddleware,
      ];
    }
    case "reset-password": {
      return [
        body("password")
          .notEmpty()
          .withMessage("PASSWORD_EMPTY"),
        validatorMiddleware,
      ];
    }
    case "change-password": {
      return [
        body("oldPassword")
          .notEmpty()
          .withMessage("OLDPASSWORD_EMPTY"),
        body("newPassword")
          .notEmpty()
          .withMessage("NEWPASSWORD_EMPTY"),
        validatorMiddleware,
      ];
    }
    case "add-profile": {
      return [
        body("username")
          .notEmpty()
          .withMessage("username_empty")
          .isLength({ min: 2 })
          .withMessage("NAME_LENGTH_MIN")
          .isLength({ max: 30 })
          .withMessage("NAME_LENGTH_MAX"),
        body("email")
          .notEmpty()
          .withMessage("email_EMPTY")
          .isEmail()
          .withMessage("email_VALID"),
        body("phone")
          .notEmpty()
          .withMessage("phone_EMPTY")
          .isNumeric()
          .withMessage("INVALID_phone"),
        body("password")
          .notEmpty()
          .withMessage("PASSWORD_EMPTY"),
        validatorMiddleware,
      ];
    }
    case "transaction-create-check": {
      return [
        body("transactionType")
            .isIn(['credit','debit'])
            .withMessage('INVALID_TRANSACTION_TYPE'),
        body("amount")
            .isNumeric()
            .withMessage('INVALID_AMOUNT')
            .isInt({ min:1})
            .withMessage('INVALID_AMOUNT')
            .notEmpty()
            .withMessage("AMOUNT_CANT_BE_ZERO"),
        body("password")
            .notEmpty()
            .withMessage("PASSWORD_EMPTY"),
        validatorMiddleware,
      ];
    }

    case "coin-check": {
      return [
        body("coins")
            .isNumeric()
            .withMessage('INVALID_COIN')
            .isInt({ min:1})
            .withMessage('INVALID_COIN'),
        body("mypassword")
            .notEmpty()
            .withMessage("PASSWORD_EMPTY"),
        validatorMiddleware,
      ];
    }

    case "update-status-check": {
      return [
        body("status")
            .isIn(['update','active','suspend','locked',"upcoming","in_play","tie","abounded","delete","delay","pending","active"])
            .withMessage('INVALID_STATUS'),
        validatorMiddleware,
      ];
    }

    case "keyword-check":{
      return [
        body("keyword")
            .isString()
            .notEmpty()
            .withMessage('KEYWORD_IS_MISSING')
            .trim(),
        validatorMiddleware,
      ];
    }

  }
}