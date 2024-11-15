const { responseData } = require('../../helpers/responseData')
const bannerService = require('../../services/admins/banner.services')
module.exports = {
  BannerList: async (req, res) => {
    try {
      await bannerService.BannerList(req, res)
    } catch (err) {
      const msg = err.message || 'SOMETHING_WENT_WRONG'
      return res.status(422).json(responseData(msg, {}, req))
    }
  },
  addHomeBanner: async (req, res) => {
    try {
      await bannerService.addBanner(req, res)
    } catch (err) {
      const msg = err.message || 'SOMETHING_WENT_WRONG'
      return res.status(422).json(responseData(msg, {}, req))
    }
  },
  editBanner: async (req, res) => {
    try {
      await bannerService.editBanner(req, res)
    } catch (err) {
      const msg = err.message || 'SOMETHING_WENT_WRONG'
      return res.status(422).json(responseData(msg, {}, req))
    }
  },
  BannerChangeStatus: async (req, res) => {
    try {
      await bannerService.BannerChangeStatus(req, res)
    } catch (err) {
      const msg = err.message || 'SOMETHING_WENT_WRONG'
      return res.status(422).json(responseData(msg, {}, req))
    }
  },
}
