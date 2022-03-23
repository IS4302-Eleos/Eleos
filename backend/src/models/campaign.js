import mongoose from 'mongoose'

const CampaignSchema = new mongoose.Schema({
  campaignAddress: {
    type: String,
    required: true,
    unique: true
  },
  campaignName: String,
  organisationUrl: String,
  endTimestamp: Date,
  beneficiaryAddress: String,
  campaignOwnerAddress: String,
  targetDonationAmount: String,

  campaignDescription: String
  // campaignImage: {
  //   data: Buffer,
  //   contentType: String
  // },
  // campaignTags: [String]
})

export default mongoose.model('Campaign', CampaignSchema)
