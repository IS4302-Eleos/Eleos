import 'dotenv/config'

export default {
  app: {
    port: process.env.API_PORT || 8000
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'Eleos',
    user: process.env.DB_USER || 'test',
    pass: process.env.DB_PASS || 'test'
  },
  graphiql: process.env.GRAPHIQL_ENABLED || false
}
