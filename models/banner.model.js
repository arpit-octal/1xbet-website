const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
  bannerImage: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    ENUM: ['active', 'inactive'],
    default: 'active'
  }
},
  {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: false },
    toJSON: { getters: true, setters: true, virtuals: false }
  })
const Banner = mongoose.model('Banners', BannerSchema)
module.exports = Banner
