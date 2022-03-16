
import addListener from '../src/addListener.js'
import chai from 'chai'
import Web3 from 'web3'
import * as fs from 'fs'
import contract from '@truffle/contract'

const assert = chai.assert

describe('addListener', async () => {
  let accounts, campaignFactory, eventName

  beforeEach(async () => {
    const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545')
    const web3 = new Web3(provider)
    const campaignFactoryContract = contract(JSON.parse(fs.readFileSync('../blockchain/build/contracts/CampaignFactory.json')))
    campaignFactoryContract.setProvider(provider)

    eventName = 'CampaignStarted'
    accounts = await web3.eth.getAccounts()
    campaignFactory = await campaignFactoryContract.deployed()
  })

  it('should retrieve ownerAddress and campaignAddress from CampaignStarted event', async () => {
    const contractOwner = accounts[0]
    const beneficiary = accounts[1]
    const campaignOwner = accounts[2]

    const campaignName = 'Charity 1'
    const organisationUrl = 'https://www.charity1.com'
    const endTimestamp = 1672502399 // 31/12/2022 23:59:59 GMT+8
    const beneficiaryAddress = beneficiary
    const campaignOwnerAddress = campaignOwner
    const targetDonationAmount = 10

    let ownerAddress, campaignAddress;

    addListener(
      campaignFactory,
      eventName,
      (event) => {
        const returnValues = event.returnValues
        ownerAddress = returnValues.ownerAddress
        campaignAddress = returnValues.campaignAddress
        
      }
    )

    const tx = await campaignFactory.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount, { from: contractOwner }
    )

    await new Promise(r => setTimeout(r, 2000));

    assert.equal(ownerAddress, campaignOwner)
    assert.equal(campaignAddress, tx.logs[0].args.campaignAddress)
  })
})
