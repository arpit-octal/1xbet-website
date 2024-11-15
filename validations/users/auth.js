const { body, check } = require("express-validator");
const { validatorMiddleware } = require("../../helpers/helper");


module.exports.validate = (method) => {
  switch (method) {
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
  case "fancy-place-bet-check": {
        return [
          body("eventId").notEmpty().withMessage('INVALID_EVENT_ID'),
          // body("marketId").notEmpty().withMessage('INVALID_MARKET_ID'),
          body("selectionId").notEmpty().withMessage('INVALID_SELECTION_ID'),
          body("centralizedId").notEmpty().withMessage('INVALID_CENTRALIZED_ID'),
          body("betType").notEmpty().withMessage('INVALID_BET_TYPE'),
          body("bhav").isFloat().withMessage('INVALID_BHAV').isInt({ min:1}).withMessage('INVALID_BHAV').notEmpty().withMessage("BHAV_CANT_BE_ZERO"),
          body("amount")
              .isFloat()
              .withMessage('INVALID_AMOUNT')
              .isInt({ min:1})
              .withMessage('INVALID_AMOUNT')
              .notEmpty()
              .withMessage("AMOUNT_CANT_BE_ZERO"),
          body("betPlaceTime")
              .notEmpty()
              .withMessage("BET_PLACE_EMPTY"),
              validatorMiddleware,
          // body("runnerName")
          //     .notEmpty()
          //     .withMessage("RUNNER_NAME_EMPTY"),
          //     validatorMiddleware,
        ];
      }
    
    case "premium-fancy-place-bet-check": {
        return [
          // body("apiSiteSpecifier").notEmpty().withMessage('INVALID_SiteSpecifier'),
          // body("apiSiteSelectionId").notEmpty().withMessage('INVALID_apiSiteSelectionId'),
          body("eventId").notEmpty().withMessage('INVALID_EVENT_ID'),
          // body("marketId").notEmpty().withMessage('INVALID_MARKET_ID'),
          body("selectionId").notEmpty().withMessage('INVALID_SELECTION_ID'),
          body("fancySelectionId").notEmpty().withMessage('INVALID_fancySelectionId'),
          body("betType").notEmpty().withMessage('INVALID_BET_TYPE'),
          body("bhav").notEmpty().withMessage('INVALID_BHAV').notEmpty().withMessage("BHAV_CANT_BE_ZERO"),
          body("amount")
              .isFloat()
              .withMessage('INVALID_AMOUNT')
              .isInt({ min:1})
              .withMessage('INVALID_AMOUNT')
              .notEmpty()
              .withMessage("AMOUNT_CANT_BE_ZERO"),
          body("betPlaceTime")
              .notEmpty()
              .withMessage("BET_PLACE_EMPTY"),
              validatorMiddleware,
          body("runnerName")
              .notEmpty()
              .withMessage("RUNNER_NAME_EMPTY"),
              validatorMiddleware,
          body("fancyName")
              .notEmpty()
              .withMessage("FANCY_NAME_EMPTY"),
              validatorMiddleware,
        ];
      }
  }
}