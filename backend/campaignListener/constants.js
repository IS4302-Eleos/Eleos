import config from '../config.js'
import * as fs from 'fs'
import contract from '@truffle/contract'
import Web3 from 'web3'

const EVENT_CAMPAIGN_STARTED = 'CampaignStarted'
const EVENT_DONATE = 'Donate'

const PROVIDER_ENDPOINT = `ws://${config.bc.host}:${config.bc.port}`

const campaignFactoryContract = contract(JSON.parse(fs.readFileSync(config.bc.campaignFactoryPath)))
const campaignContract = contract(JSON.parse(fs.readFileSync(config.bc.campaignPath)))
const reputationContract = contract(JSON.parse(fs.readFileSync(config.bc.reputationPath)))

const provider = new Web3.providers.WebsocketProvider(PROVIDER_ENDPOINT)
const web3 = new Web3(provider)

campaignContract.setProvider(provider)
campaignFactoryContract.setProvider(provider)
reputationContract.setProvider(provider)

export default {
  EVENT_CAMPAIGN_STARTED,
  EVENT_DONATE,
  PROVIDER_ENDPOINT,
  campaignFactoryContract,
  campaignContract,
  reputationContract,
  provider,
  web3
}
