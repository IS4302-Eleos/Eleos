import mongoose from 'mongoose'

const CampaignSchema = new mongoose.Schema({
  address: String,
  title: String,
  start: Date,
  end: Date
})

export default mongoose.model('Campaign', CampaignSchema)
