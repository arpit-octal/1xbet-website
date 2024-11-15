const globalSettings = require("../../models/globalLimitSetting.model");
const SiteSetting = require("../../models/siteSetting.model");
const { responseData } = require("../../helpers/responseData");
const { ObjectId } = require('mongodb');
const ReferralSetting = require("../../models/referralSetting.models")
module.exports = {
  global_limit_setting_update: async (req, res) => {
    try {
      let { minAmount, maxAmount, maxProfit, onShow, betDelay, type, sportType, oddsLimit } =
        req.body;
      const updateData = {};
      if (minAmount) updateData.minAmount = minAmount;
      if (maxAmount) updateData.maxAmount = maxAmount;
      if (maxProfit) updateData.maxProfit = maxProfit;
      if (onShow) updateData.onShow = onShow;
      if (betDelay) updateData.betDelay = betDelay;
      if (oddsLimit) updateData.oddsLimit = oddsLimit;
      const query = await globalSettings.findOneAndUpdate(
        {
          type,
          sportType
        },
        {
          $set: updateData,
        },
        { returnOriginal: false }
      );
      if (!query) {
        const resp = await globalSettings.create({
          ...updateData,
          sportType,
          type,
        });
        return res.json(responseData("ADDED_SUCCESSFULLY", resp, req, true));
      }
      return res.json(responseData("UPDATED_SUCCESSFULLY", query, req, true));
    } catch (error) {
      console.log('error', error);
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  global_limit_setting_list: async (req, res) => {
    try {
      const { sportType } = req.query;
      let query;
      if (sportType) {
        query = await globalSettings.find({ sportType });
      } else {
        query = await globalSettings.find();
      }
      return res.json(responseData("GET_LIST", query, req, true));
    } catch (error) {
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  before_inplay_limit: async (req, res) => {
    try {
      const siteSetting = await SiteSetting.findById({ _id: ObjectId('63c8f3ad944403aed706f145') });
      return res.json(responseData("GET_LIST", siteSetting, req, true));
    } catch (error) {
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  getReferralSetting: async (req, res) => {
    try {

      let result = await ReferralSetting.findOne({ slug: "referralSetting" })
      if (result) {
        return res.json(responseData("REFERRAL_SETTING", result, req, true));
      }
    } catch (error) {
      return res.json(responseData(error.message, {}, req, false));
    }
  },
  updateReferralSetting: async (req, res) => {
    try {
      let { signupBonus, referralBonus } = req.body
      let data = {
        signupBonus: signupBonus || 0,
        referralBonus: referralBonus || 0
      }
      let result = await ReferralSetting.findOneAndUpdate({ slug: "referralSetting" }, { $set: data }, { new: true })
      if (result) {
        return res.json(responseData("REFERRAL_SETTING_UPDATE", result, req, true));
      }

    } catch (error) {
      return res.json(responseData(error.message, {}, req, false));
    }
  },
};
