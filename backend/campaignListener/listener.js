import initdb from '../src/database.js'
import Donation from '../src/models/donation.js'
import Campaign from '../src/models/campaign.js'

import util from './util.js'
import constants from './constants.js'

async function getPastCampaigns (campaignFactoryInstance) {
  const pastCampaignStartedEvents = await util.getAllEvents(campaignFactoryInstance, constants.EVENT_CAMPAIGN_STARTED)
  return Promise.all(pastCampaignStartedEvents.map(async (event) => {
    const campaignInstance = await constants.campaignContract.at(event.returnValues.campaignAddress)
    return util.getCampaignInfo(campaignInstance)
  }))
}

async function getPastDonations (campaignFactoryInstance) {
  const pastDonateEvents = await util.getAllEvents(campaignFactoryInstance, constants.EVENT_DONATE)
  return Promise.all(pastDonateEvents.map(async (event) => {
    const { donorAddress, amount } = event.returnValues
    return { transactionHash: event.transactionHash, campaignAddress: event.address, donorAddress, amount }
  }))
}

async function restorePastRecords (campaignFactoryInstance) {
  return Promise.all([
    util.writeBulkDocuments((await getPastCampaigns(campaignFactoryInstance)), Campaign),
    util.writeBulkDocuments((await getPastDonations(campaignFactoryInstance)), Donation)
  ])
}

function getCampaignFactoryInstance () {
  return process.env.CAMPAIGN_FACTORY_ADDRESS
    ? constants.campaignFactoryContract.at(process.env.CAMPAIGN_FACTORY_ADDRESS)
    : constants.campaignFactoryContract.deployed()
}

function startListening (campaignFactoryInstance) {
  return {
    campaignStartedSubscription: util.subscribeToContract(campaignFactoryInstance, constants.EVENT_CAMPAIGN_STARTED, async (event) => {
      const campaignInstance = await constants.campaignContract.at(event.returnValues.campaignAddress)
      const campaignInfo = await util.getCampaignInfo(campaignInstance)
      util.writeSingleDocument(campaignInfo, Campaign)
    }),
    donateSubscription: util.subscribeToContract(campaignFactoryInstance, constants.EVENT_DONATE, async (event) => {
      const { campaignAddress, donorAddress, amount } = event.returnValues
      const donationInfo = { transactionHash: event.transactionHash, campaignAddress, donorAddress, amount }
      util.writeSingleDocument(donationInfo, Donation)
    })
  }
}

(async function main () {
  initdb()

  const campaignFactoryInstance = await getCampaignFactoryInstance()

  startListening(campaignFactoryInstance)
  console.log('[+] Listener Ready')

  await restorePastRecords(campaignFactoryInstance)
  console.log('[+] Database updated')
})()
