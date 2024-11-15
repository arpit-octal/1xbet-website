const SiteSetting = require("../../models/siteSetting.model");
const globalSettings = require("../../models/globalLimitSetting.model");
const { responseData } = require("../../helpers/responseData");
module.exports = {
  site_setting_list: async (req, res) => {
    try {
      const siteSetting = await SiteSetting.find({});
      const resObj = {};
      siteSetting.map((item) => {
        resObj[item.fieldName] = item.fieldValue
      })
      return res.json(responseData("GET_LIST", resObj, req, true));
    } catch (error) {
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  global_setting_list: async (req, res) => {
    try {
      const {sportType} = req.query;
      let query;
      if(sportType) {
        query = await globalSettings.find({sportType});
      }else {
        query = await globalSettings.find();
      }
      return res.json(responseData("GET_LIST", query, req, true));
    } catch (error) {
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
};
