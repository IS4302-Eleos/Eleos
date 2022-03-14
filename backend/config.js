import 'dotenv/config'

export default {
  app: {
    port: process.env.API_PORT
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME
  },
  graphiql: process.env.GRAPHIQL_ENABLED || false
}
