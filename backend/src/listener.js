import Web3 from 'web3'
import * as fs from 'fs'
import contract from '@truffle/contract'
import addListener from './addListener.js'
import { argv, exit } from 'process'

const commandLineArguments = argv.slice(2)
if (commandLineArguments.length !== 3) {
  console.error('Too little arguments')
  exit(1)
}

const [solPath, providerEndpoint, eventName] = commandLineArguments

// const solPath = '../blockchain/build/contracts/CampaignFactory.json';
// const providerEndpoint = 'ws://localhost:8545';
// const eventName = 'CampaignStarted';

const campaignFactoryContract = contract(JSON.parse(fs.readFileSync(solPath)))
const provider = new Web3.providers.WebsocketProvider(providerEndpoint)

process.on('exit', () => provider.disconnect())

campaignFactoryContract.setProvider(provider)
campaignFactoryContract.deployed().then(campaignFactory => {
  addListener(campaignFactory, eventName,
    (event) => {
      const returnValues = event.returnValues
      const ownerAddress = returnValues.ownerAddress
      const campaignAddress = returnValues.campaignAddress
      console.log(`Owner "${ownerAddress}" deployed contract @ "${campaignAddress}"`)
    }
  )
  console.log('Subscribed')
})
