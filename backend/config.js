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
  graphiql: process.env.GRAPHIQL_ENABLED || false,
  bc: {
    host: process.env.GANACHE_HOST || 'localhost',
    port: process.env.GANACHE_PORT || 8545,
    campaignPath: process.env.CAMPAIGN_CONTRACT_PATH || '../blockchain/build/contracts/CampaignFactory.json',
    campaignFactoryPath: process.env.CAMPAIGN_FACTORY_CONTRACT_PATH || '../blockchain/build/contracts/Campaign.json',
    campaignFactoryEvent: process.env.CAMPAIGN_FACTORY_CONTRACT_EVENT || 'CampaignStarted'
  }
}
