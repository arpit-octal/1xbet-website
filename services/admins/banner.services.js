const Banner = require('../../models/banner.model')
const { isEmpty } = require('lodash')
const { responseData } = require('../../helpers/responseData');

module.exports = {
  BannerList: async (req, res) => {
    try {
      let { sortBy, sortType } = req.query;

      const allBanners = await Banner.find().sort(sortPattern)

      if (allBanners) {
        let bannerLength = await Banner.countDocuments()
        return res.json(responseData('GET_LIST', { allBanners, bannerLength }, req, true))

      }
    } catch (error) {
      return res.json(responseData('ERROR_OCCUR', error.message, req, false))
    }
  },
  addBanner: async (req, res) => {
    try {
      const { title, description } = req.body
      const findRecord = await Banner.find()
      if (!isEmpty(findRecord) && findRecord.length >= 5) {
        return res.json(responseData('ALREADY_FIVE_BANNERS_ADDED', {}, req, false))
      }
      const check = await Banner.findOne({ title })
      if (!isEmpty(check)) {
        return res.json(responseData("BANNER_EXIST", {}, req, false));
      }
      const data = {
        title,
        description
      }
      if (req.file) {
        data.bannerImage = req.file.filename
      }
      const banner = await Banner.create(data)
      if (banner) {
        return res.json(
          responseData('HOME_BANNER_ADDED', banner, req, true)
        )
      } else {
        return res.json(responseData('ERROR_OCCUR', {}, req, false))
      }
    } catch (error) {
      return res.json(responseData('ERROR_OCCUR', error.message, req, false))
    }
  },
  editBanner: async (req, res) => {
    try {
      const { title, description } = req.body
      const check = await Banner.find({ _id: { $ne: req.params.id }, title })
      if (!isEmpty(check)) {
        return res.json(responseData("BANNER_EXIST", {}, req, false));
      }
      const updateValues = {}
      if (title) updateValues.title = title
      if (description) updateValues.description = description
      if (req.file) {
        updateValues.bannerImage = req.file.filename
      }
      const resp = await Banner.findOneAndUpdate({ _id: req.params.id }, { $set: updateValues }, { new: true })
      if (resp) {
        return res.json(responseData('BANNER_UPDATED', resp, req, true))
      } else {
        return res.json(responseData('ERROR_OCCUR', {}, req, false))
      }
    } catch (error) {
      return res.json(responseData('ERROR_OCCUR', error.message, req, false))
    }
  },
  BannerChangeStatus: async (req, res) => {
    try {
      const { status } = req.body
      if (status === 'active' || status === 'inactive') {
        const resp = await Banner.findOneAndUpdate({ _id: req.params.id }, { $set: { status } })
        if (resp) {
          return res.json(responseData('BANNER_STATUS_UPDATE', {}, req, true))
        } else {
          return res.json(responseData('ERROR_OCCUR', {}, req, false))
        }
      } else {
        return res.json(responseData('INVALID_STATUS', {}, req, false))
      }
    } catch (error) {
      return res.json(responseData('ERROR_OCCUR', error.message, req, false))
    }
  },
}
