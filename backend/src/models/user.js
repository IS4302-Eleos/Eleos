import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  publickey: String,
  nonce: String
})

export default mongoose.model('User', UserSchema)
