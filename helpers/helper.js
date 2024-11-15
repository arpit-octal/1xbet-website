const { responseData } = require("./responseData");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Transaction = require("../models/transaction.model")
const fs = require("fs");
dotenv.config();
const { ObjectId } = require('mongodb');

module.exports = {
  getAccessToken(token) {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGlkIjoiOWJldCIsImRhdGV0aW1lIjoxNjc5NDk2Mzg3OTkxLCJpYXQiOjE2Nzk0OTYzODd9.iVj6j-gOfLFxcuBhY6XXjlpUG1ZGv9YbAwZt_W2qsGg';
  },
  isInt(n) {
    return Number(n) === n && n % 1 === 0;
  },
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  },
  validatorMiddleware: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .json(responseData(errors.errors[0].msg, {}, req, false));
    } else {
      next();
    }
  },
  generateAuthToken(userData) {
    const token = jwt.sign({ user: userData }, process.env.JWT_SECRET, {
      expiresIn: process.env.tokenLife,
    });
    const refresh_token = jwt.sign({ user: userData }, process.env.JWT_SECRET, {
      expiresIn: process.env.refreshTokenLife,
    });
    return { token, refresh_token };
  },
  generateAdminAuthToken(adminData) {
    const token = jwt.sign({ ...adminData }, process.env.JWT_ADMIN_SECRET, {
      expiresIn: process.env.tokenLife,
    });
    const refresh_token = jwt.sign({ ...adminData }, process.env.JWT_ADMIN_SECRET, {
      expiresIn: process.env.refreshTokenLife,
    });
    return { token, refresh_token };
  },
  generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  },
  reGenerateAuthTokenHelper(user_refresh_token) {

    const response = jwt.verify(
      user_refresh_token,
      process.env.JWT_ADMIN_SECRET,
      (err, user) => {
        if (err) {
          console.log('err-----------------------', err)
          return false;
        } else {
          return user;
        }
      }
    );
    if (response) {
      // console.log('reGenerateAuthTokenHelper', response)
      delete response['iat']
      delete response['exp']
      let token = jwt.sign({ ...response }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: process.env.tokenLife,
      });
      const refresh_token = jwt.sign({ ...response }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: process.env.refreshTokenLife,
      });

      return { token, refresh_token };
    } else {
      return false;
    }
  },
  reGenerateUserAuthTokenHelper(user_refresh_token) {

    const response = jwt.verify(
      user_refresh_token,
      process.env.JWT_SECRET,
      (err, user) => {
        if (err) {
          console.log('err-----------------------', err)
          return false;
        } else {
          return user;
        }
      }
    );
    if (response) {
      console.log('reGenerateAuthTokenHelper', response)
      delete response['iat']
      delete response['exp']
      let token = jwt.sign({ ...response }, process.env.JWT_SECRET, {
        expiresIn: process.env.tokenLife,
      });
      const refresh_token = jwt.sign({ ...response }, process.env.JWT_SECRET, {
        expiresIn: process.env.refreshTokenLife,
      });
      return { token, refresh_token };
    } else {
      return false;
    }
  },
  getUserType(type) {

    // "owner","sub_owner", "admin", "super_admin","sub_admin",'senior_super','super_agent','agent','user'
    if (type === 'owner') {
      return 'sub_owner';
    } else if (type === 'sub_owner') {
      return 'super_admin'
    } else if (type === 'super_admin') {
      return 'admin'
    } else if (type === 'admin') {
      return 'sub_admin'
    } else if (type === 'sub_admin') {
      return 'senior_super'
    } else if (type === 'senior_super') {
      return 'super_agent'
    } else if (type === 'super_agent') {
      return 'agent'
    } else if (type === 'agent') {
      return 'user'
    } else {
      return undefined
    }

  },
  gsStatus(type) {

    // "owner","sub_owner", "admin", "super_admin","sub_admin",'senior_super','super_agent','agent','user'
    if (type == 'SUSPENDED') {
      return '3';
    } else if (type == 'Ball Running') {
      return '9'
    } else if (type == "" || type == "OPEN") {
      return '1'
    } else {
      return '3'
    }
  },
  categoryType(type) {
    if (type == '2') {
      return '11';
    } else if (type == '3') {
      return '2'
    } else if (type == '1') {
      return '7'
    } else {
      return '9'
    }
  },
  betFairBackFormulaProfit(amount, odds) {
    return Math.round((odds - 1) * amount);
  },
  betFairBackFormulaLose(amount, odds) {
    return amount;
  },
  betFairLayFormulaProfit(amount, odds) {
    return amount;
  },
  betFairLayFormulaLose(amount, odds) {
    return Math.round((odds - 1) * amount);
  },
  bookmakerRealRate(odds) {
    return odds / 100;
  },
  betFairFormula(amount, odds) {
    // return Math.round((odds-1) * amount).toFixed(2);
    return Number((odds - 1) * amount).toFixed(2)
  },
  sessionFormula(amount, odds) {
    // return Math.round((amount*odds) / 100).toFixed(2);
    return Number((amount * odds) / 100).toFixed(2)
  },
  totalExposureAmount({ userId, marketId }) {
    let matchPattern = {
      isDeclared: false,
      forBet: 1
    };
    if (userId) {
      matchPattern.userId = userId
    }
    if (marketId) {
      matchPattern.marketId = marketId
    }
    return Transaction.aggregate([
      {
        $match: matchPattern
      },
      {
        $group: {
          _id: null,
          totalExposureAmount: { $sum: "$realCutAmount" }
        }
      }
    ])
  },
  totalAmount({ userId, marketId }) {
    let matchPattern = {};

    matchPattern.userId = userId;
    matchPattern.forCasinoBet = 0;

    if (marketId) {
      matchPattern.marketId = marketId
    }

    return Transaction.aggregate([
      {
        $match: matchPattern
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$realCutAmount" }
        }
      }
    ])
  },
  totalMultiMarketExposure({ userId, marketId }) {
    let matchPattern = {};
    if (userId) {
      matchPattern.userId = userId
    }
    if (marketId) {
      matchPattern.marketId = { $in: marketId }
    }
    matchPattern.forCasinoBet = 0;
    // console.log("LLLLLL", matchPattern)
    return Transaction.aggregate([
      {
        $match: matchPattern
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$realCutAmount" }
        }
      }
    ])
  },
  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
};