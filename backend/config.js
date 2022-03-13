import 'dotenv/config'

export default {
  app: {
    port: process.env.API_PORT
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
}
