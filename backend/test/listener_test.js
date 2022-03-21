
import { subscribeToContractEvents, getCampaignInfo, storeCampaignInfo } from '../campaignListener/util.js'
import chai from 'chai'
import Web3 from 'web3'
import * as fs from 'fs'
import contract from '@truffle/contract'
import config from '../config.js'
import Campaign from '../src/models/campaign.js'
import initdb from '../src/database.js'

const assert = chai.assert

describe('Testing campaignListener utils', () => {
  let accounts, contractOwner, beneficiary, campaignOwner
  let campaignAddress, campaignName, organisationUrl, endTimestamp, beneficiaryAddress, campaignOwnerAddress, targetDonationAmount, campaignDescription
  let campaignInfo
  let provider, web3, campaignFactoryContract, campaignContract
  let campaignFactoryInstance, campaignInstance

  before(async () => {
    provider = new Web3.providers.WebsocketProvider(`ws://${config.bc.host}:${config.bc.port}`)
    web3 = new Web3(provider)
    campaignFactoryContract = contract(JSON.parse(fs.readFileSync(config.bc.campaignFactoryPath)))
    campaignContract = contract(JSON.parse(fs.readFileSync(config.bc.campaignPath)))

    campaignFactoryContract.setProvider(provider)
    campaignContract.setProvider(provider)

    accounts = await web3.eth.getAccounts()
    campaignFactoryInstance = await campaignFactoryContract.deployed()

    contractOwner = accounts[0]
    beneficiary = accounts[1]
    campaignOwner = accounts[2]

    campaignName = 'Charity 1'
    organisationUrl = 'https://www.charity1.com'
    endTimestamp = 1672502399000 // 31/12/2022 23:59:59 GMT+8
    beneficiaryAddress = beneficiary
    campaignOwnerAddress = campaignOwner
    targetDonationAmount = 10
    campaignDescription = "It's a cool charity"
  })

  it('subscribeToContractEvents should retrieve ownerAddress and campaignAddress from CampaignStarted event', async () => {
    let testOwnerAddress, testCampaignAddress

    // Listen for new events
    subscribeToContractEvents(
      campaignFactoryInstance,
      'CampaignStarted',
      (event) => {
        const { ownerAddress, campaignAddress } = event.returnValues
        testOwnerAddress = ownerAddress
        testCampaignAddress = campaignAddress
      }
    )

    const tx = await campaignFactoryInstance.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount,
      campaignDescription,
      { from: contractOwner }
    )

    campaignAddress = tx.logs[0].args.campaignAddress

    await new Promise(resolve => setTimeout(resolve, 1000))

    assert.equal(testOwnerAddress.toLowerCase(), campaignOwner.toLowerCase())
    assert.equal(testCampaignAddress.toLowerCase(), campaignAddress.toLowerCase())
  })

  it('getCampaignInfo should retrieve information of the given campaign', async () => {
    campaignInstance = await campaignContract.at(campaignAddress)
    campaignInfo = await getCampaignInfo(campaignInstance)

    assert.equal(campaignAddress.toLowerCase(), campaignInfo.campaignAddress.toLowerCase())
    assert.equal(campaignName, campaignInfo.campaignName)
    assert.equal(organisationUrl, campaignInfo.organisationUrl)
    assert.equal(endTimestamp, campaignInfo.endTimestamp)
    assert.equal(beneficiaryAddress.toLowerCase(), campaignInfo.beneficiaryAddress.toLowerCase())
    assert.equal(campaignOwnerAddress.toLowerCase(), campaignInfo.campaignOwnerAddress.toLowerCase())
    assert.equal(targetDonationAmount.toString(), campaignInfo.targetDonationAmount)
    assert.equal(campaignDescription, campaignInfo.campaignDescription)
  })

  it('storeCampaignInfo should write details of new campaign information into database', async () => {
    initdb()
    const res = await storeCampaignInfo(campaignInfo)
    assert.equal(res.campaignName, campaignName)
    await Campaign.deleteMany({})
  })
})
