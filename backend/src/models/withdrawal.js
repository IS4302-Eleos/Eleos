import mongoose from 'mongoose'

const WithdrawalSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: Date,
  campaignAddress: String,
  withdrawerAddress: String,
  amount: String,
  beneficiaryAddress: String
})

export default mongoose.model('Withdrawal', WithdrawalSchema)
