const express = require('express')
const router = express.Router()
const Banner = require('../../controllers/admins/banner.controller')
const { verifyToken } = require('../../middlewares/verifyToken')
const multer = require('multer')
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })
router.get('/', [verifyToken], Banner.BannerList)
router.post('/', [verifyToken], upload.single('bannerImage'), Banner.addHomeBanner)
router.put('/:id', [verifyToken], upload.single('bannerImage'), Banner.editBanner)
router.put('/change-status/:id', [verifyToken], Banner.BannerChangeStatus)

module.exports = router
