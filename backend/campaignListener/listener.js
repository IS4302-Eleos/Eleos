import Web3 from 'web3'
import * as fs from 'fs'
import contract from '@truffle/contract'
import subscribeToContractEvents from './util.js'
import config from '../config.js'

const solPath = config.bc.campaignFactoryPath
const providerEndpoint = `ws://${config.bc.host}:${config.bc.port}`
const eventName = config.bc.campaignFactoryEvent

const campaignFactoryContract = contract(JSON.parse(fs.readFileSync(solPath)))
const provider = new Web3.providers.WebsocketProvider(providerEndpoint)

process.on('exit', () => provider.disconnect())

campaignFactoryContract.setProvider(provider)
campaignFactoryContract.deployed().then(campaignFactory => {
  subscribeToContractEvents(campaignFactory, eventName,
    (event) => {
      const { ownerAddress, campaignAddress } = event.returnValues
      console.log(`Owner "${ownerAddress}" deployed contract @ "${campaignAddress}"`)
    }
  )
  console.log('Subscribed')
})
