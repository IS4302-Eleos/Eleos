import mongoose from 'mongoose'
import config from '../config.js'

export default () => {
  mongoose.connect(`mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=admin`, {
    useNewUrlParser: true
  }).catch(function (err) {
    throw err
  })
  mongoose.connection.once('open', () => {
    console.log('connected to database')
  })
}
