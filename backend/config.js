import 'dotenv/config'

export default {
  app: {
    port: process.env.API_PORT
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  },
  bc: {
    host: process.env.GANACHE_HOST,
    port: process.env.GANACHE_PORT,
    campaignFactoryPath: process.env.CAMPAIGN_FACTORY_CONTRACT_PATH,
    campaignFactoryEvent: process.env.CAMPAIGN_FACTORY_CONTRACT_EVENT
  }
}
