
import { subscribeToContractEvents, getCampaignDetails } from '../campaignListener/util.js'
import chai from 'chai'
import Web3 from 'web3'
import * as fs from 'fs'
import contract from '@truffle/contract'

const assert = chai.assert

describe('Testing campaignListener utils', () => {
  let accounts, campaignFactory
  let contractOwner, beneficiary, campaignOwner
  let campaignAddress, campaignName, organisationUrl, endTimestamp, beneficiaryAddress, campaignOwnerAddress, targetDonationAmount

  const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545')
  const web3 = new Web3(provider)
  const campaignFactoryContract = contract(JSON.parse(fs.readFileSync('../blockchain/build/contracts/CampaignFactory.json')))
  const campaignContract = contract(JSON.parse(fs.readFileSync('../blockchain/build/contracts/Campaign.json')))
  campaignFactoryContract.setProvider(provider)
  campaignContract.setProvider(provider)

  before(async () => {
    accounts = await web3.eth.getAccounts()
    campaignFactory = await campaignFactoryContract.deployed()
    contractOwner = accounts[0]
    beneficiary = accounts[1]
    campaignOwner = accounts[2]

    campaignName = 'Charity 1'
    organisationUrl = 'https://www.charity1.com'
    endTimestamp = 1672502399 // 31/12/2022 23:59:59 GMT+8
    beneficiaryAddress = beneficiary
    campaignOwnerAddress = campaignOwner
    targetDonationAmount = 10
  })

  it('subscribeToContractEvents should retrieve ownerAddress and campaignAddress from CampaignStarted event', async () => {
    const eventName = 'CampaignStarted'
    let testOwnerAddress, testCampaignAddress

    // Listen for new events
    subscribeToContractEvents(
      campaignFactory,
      eventName,
      (event) => {
        const { ownerAddress, campaignAddress } = event.returnValues
        testOwnerAddress = ownerAddress
        testCampaignAddress = campaignAddress
      }
    )

    const tx = await campaignFactory.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount,
      { from: contractOwner }
    )

    campaignAddress = tx.logs[0].args.campaignAddress

    await new Promise(resolve => setTimeout(resolve, 1000))

    assert.equal(testOwnerAddress, campaignOwner)
    assert.equal(testCampaignAddress, campaignAddress)
  })

  it('getCampaignDetails should retrieve details of new campaign', async () => {
    const campaignInstance = await campaignContract.at(campaignAddress)

    const campaignInfo = await getCampaignDetails(campaignInstance)

    assert.equal(campaignAddress, campaignInfo.campaignAddress)
    assert.equal(campaignName, campaignInfo.campaignName)
    assert.equal(organisationUrl, campaignInfo.organisationUrl)
    assert.equal(endTimestamp, campaignInfo.endTimestamp)
    assert.equal(beneficiaryAddress, campaignInfo.beneficiaryAddress)
    assert.equal(campaignOwnerAddress, campaignInfo.campaignOwnerAddress)
  })
})