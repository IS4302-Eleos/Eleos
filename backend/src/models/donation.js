import mongoose from 'mongoose'

const DonationSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: Date,
  campaignAddress: String,
  donorAddress: String,
  amount: String
})

export default mongoose.model('Donation', DonationSchema)
