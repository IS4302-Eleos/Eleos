import mongoose from 'mongoose'

const CampaignSchema = new mongoose.Schema({
  campaignAddress: {
    type: Buffer,
    required: true,
    unique: true
  },
  campaignName: String,
  organisationUrl: String,
  endTimestamp: Date,
  beneficiaryAddress: Buffer,
  campaignOwnerAddress: Buffer,
  targetDonationAmount: Number,

  campaignDescription: String
  // campaignImage: {
  //   data: Buffer,
  //   contentType: String
  // },
  // campaignTags: [String]
})

export default mongoose.model('Campaign', CampaignSchema)
