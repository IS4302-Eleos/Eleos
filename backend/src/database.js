import mongoose from 'mongoose'
import config from '../config.js'

export default () => {
  mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
    useNewUrlParser: true
  })
  mongoose.connection.once('open', () => {
    console.log('connected to database')
  })
}
