import Web3 from 'web3'
import * as fs from 'fs'
import contract from '@truffle/contract'
import { subscribeToContractEvents, getCampaignInfo, storeCampaignInfo } from './util.js'
import config from '../config.js'
import initdb from '../src/database.js'

initdb()

const campaignFactoryPath = config.bc.campaignFactoryPath
const campaignPath = config.bc.campaignPath

const providerEndpoint = `ws://${config.bc.host}:${config.bc.port}`
const eventName = config.bc.campaignFactoryEvent

const campaignFactoryContract = contract(JSON.parse(fs.readFileSync(campaignFactoryPath)))
const campaignContract = contract(JSON.parse(fs.readFileSync(campaignPath)))
const provider = new Web3.providers.WebsocketProvider(providerEndpoint)

process.on('exit', () => provider.disconnect())

campaignContract.setProvider(provider)
campaignFactoryContract.setProvider(provider)
campaignFactoryContract.deployed().then(campaignFactory => {
  subscribeToContractEvents(campaignFactory, eventName,
    (event) => {
      const { ownerAddress, campaignAddress } = event.returnValues
      console.log(`Owner "${ownerAddress}" deployed contract @ "${campaignAddress}"`)
      campaignContract.at(campaignAddress).then(
        async (campaignInstance) => {
          const campaignInfo = await getCampaignInfo(campaignInstance)
          await storeCampaignInfo(campaignInfo)
        }
      )
    }
  )
  console.log('subscribed')
})
