const SiteSetting = require("../../models/siteSetting.model");
const { responseData } = require("../../helpers/responseData");
module.exports = {
  site_setting_list: async (req, res) => {
    try {
      const siteSetting = await SiteSetting.find({});

      return res.json(responseData("GET_LIST", siteSetting, req, true));
    } catch (error) {
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
  site_setting_update: async (req, res) => {
    try {
      const { id } = req.params;
      const { fieldValue } = req.body;
      const settingUpdate = await SiteSetting.findByIdAndUpdate(
        { _id: id },
        { fieldValue }
      );
      if (settingUpdate) {
        return res.json(responseData("UPDATED_SUCCESSFULLY",settingUpdate, req, true));
      } else {
        return res.json(responseData("ERROR_OCCUR", error, req, false));
      }
    } catch (error) {
      return res.json(responseData("ERROR_OCCUR", error, req, false));
    }
  },
};
