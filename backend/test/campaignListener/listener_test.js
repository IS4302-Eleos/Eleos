import chai from 'chai'
import Web3 from 'web3'

import { spawn } from 'child_process'

import constants from '../../campaignListener/constants.js'
import Campaign from '../../src/models/campaign.js'
import Donation from '../../src/models/donation.js'
import initdb from '../../src/database.js'

const assert = chai.assert
initdb()

describe('Testing campaignListener', () => {
  let accounts, contractOwner, beneficiary, campaignOwner, donor
  let campaignName, organisationUrl, endTimestamp, beneficiaryAddress, campaignOwnerAddress, targetDonationAmount, campaignDescription

  before(async () => {
    accounts = await constants.web3.eth.getAccounts()
    contractOwner = accounts[0]
    beneficiary = accounts[1]
    campaignOwner = accounts[2]
    donor = accounts[3]

    campaignName = 'Charity 1'
    organisationUrl = 'https://www.charity1.com'
    endTimestamp = 1672502399000 // 31/12/2022 23:59:59 GMT+8
    beneficiaryAddress = beneficiary
    campaignOwnerAddress = campaignOwner
    targetDonationAmount = 10
    campaignDescription = "It's a cool charity"
  })

  describe('Sanity test', () => {
    let campaignAddress
    let listenerProcess
    let campaignFactoryInstance

    before(async () => {
      const endorsementInstance = await constants.endorsementContract.new({
        from: contractOwner
      })

      campaignFactoryInstance = await constants.campaignFactoryContract.new(endorsementInstance.address, {
        from: contractOwner,
        value: Web3.utils.toWei('0.01', 'ether')
      })

      listenerProcess = spawn('node', ['campaignListener/listener.js'], {
        env: { CAMPAIGN_FACTORY_ADDRESS: campaignFactoryInstance.address },
        detached: true
      })

      await new Promise(resolve => setTimeout(resolve, 2000))
    })

    after(async () => {
      listenerProcess.kill('SIGINT')
      await Campaign.collection.drop()
      await Donation.collection.drop()
    })

    it('should detect and save 1 Campaign', async () => {
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

      const count = await Campaign.count()
      assert.equal(count, 1)

      const storedCampaign = await Campaign.findOne()
      assert.equal(campaignAddress, storedCampaign.campaignAddress.toString())
    })

    it('should detect and save 1 Donation', async () => {
      const campaignInstance = await constants.campaignContract.at(campaignAddress)

      const tx = await campaignInstance.donate({
        from: donor,
        value: 10
      })

      await new Promise(resolve => setTimeout(resolve, 1000))

      const count = await Donation.count()
      assert.equal(count, 1)

      const storedDonation = await Donation.findOne()
      assert.equal(tx.tx, storedDonation.transactionHash.toString())
    })
  })

  describe('Multi test', () => {
    let campaignAddresses
    let listenerProcess
    let campaignFactoryInstance

    before(async () => {
      const endorsementInstance = await constants.endorsementContract.new({
        from: contractOwner
      })

      campaignFactoryInstance = await constants.campaignFactoryContract.new(endorsementInstance.address, {
        from: contractOwner,
        value: Web3.utils.toWei('0.01', 'ether')
      })

      listenerProcess = spawn('node', ['campaignListener/listener.js'], {
        env: { CAMPAIGN_FACTORY_ADDRESS: campaignFactoryInstance.address },
        detached: true
      })

      await new Promise(resolve => setTimeout(resolve, 2000))
    })

    after(async () => {
      listenerProcess.kill('SIGINT')
      await Campaign.collection.drop()
      await Donation.collection.drop()
    })

    it('should detect and save 3 Campaigns', async () => {
      const txs = await Promise.all([
        campaignFactoryInstance.startCampaign(
          campaignName,
          organisationUrl,
          endTimestamp,
          beneficiaryAddress,
          campaignOwnerAddress,
          targetDonationAmount,
          campaignDescription,
          { from: contractOwner }
        ),
        campaignFactoryInstance.startCampaign(
          campaignName,
          organisationUrl,
          endTimestamp,
          beneficiaryAddress,
          campaignOwnerAddress,
          targetDonationAmount,
          campaignDescription,
          { from: contractOwner }
        ),
        campaignFactoryInstance.startCampaign(
          campaignName,
          organisationUrl,
          endTimestamp,
          beneficiaryAddress,
          campaignOwnerAddress,
          targetDonationAmount,
          campaignDescription,
          { from: contractOwner }
        )
      ])

      campaignAddresses = txs.map((tx) => tx.logs[0].args.campaignAddress)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const count = await Campaign.count()
      assert.equal(count, 3)
    })

    it('should detect and save 3 Donations', async () => {
      const campaignInstances = await Promise.all(campaignAddresses.map(
        (campaignAddress) => {
          return constants.campaignContract.at(campaignAddress)
        }
      ))

      await Promise.all(campaignInstances.map(
        (campaignInstance) => campaignInstance.donate({
          from: donor,
          value: 10
        })
      ))

      await new Promise(resolve => setTimeout(resolve, 1000))

      const count = await Donation.count()
      assert.equal(count, 3)

      const countForOneCampaign = await Donation.count({ campaignAddress: campaignInstances[0].address })
      assert.equal(countForOneCampaign, 1)
    })
  })
})
