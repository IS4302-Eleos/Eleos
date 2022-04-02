import initdb from '../src/database.js'
import Donation from '../src/models/donation.js'
import Withdrawal from '../src/models/withdrawal.js'
import Campaign from '../src/models/campaign.js'

import util from './util.js'
import constants from './constants.js'

async function getPastCampaigns (campaignFactoryInstance) {
  const pastCampaignStartedEvents = await util.getAllEvents(campaignFactoryInstance, constants.EVENT_CAMPAIGN_STARTED)
  return Promise.all(pastCampaignStartedEvents.map(util.extractCampaignInfoFromEvent))
}

async function getPastDonations (campaignFactoryInstance) {
  const pastDonateEvents = await util.getAllEvents(campaignFactoryInstance, constants.EVENT_DONATE)
  return pastDonateEvents.map(util.extractDonationInfoFromEvent)
}

async function getPastWithdrawals (campaignFactoryInstance) {
  const pastWithdrawEvents = await util.getAllEvents(campaignFactoryInstance, constants.EVENT_WITHDRAW)
  return pastWithdrawEvents.map(util.extractWithdrawalInfoFromEvent)
}

async function restorePastRecords (campaignFactoryInstance) {
  const [pastCampaigns, pastDonations, pastWithdrawals] = await Promise.all([
    getPastCampaigns(campaignFactoryInstance),
    getPastDonations(campaignFactoryInstance),
    getPastWithdrawals(campaignFactoryInstance)
  ])

  const promises = [
    [pastCampaigns, Campaign],
    [pastDonations, Donation],
    [pastWithdrawals, Withdrawal]
  ].map(
    (records, model) => util.writeBulkDocuments(records, model)
  )

  return Promise.all(promises)
}

function getCampaignFactoryInstance () {
  return process.env.CAMPAIGN_FACTORY_ADDRESS
    ? constants.campaignFactoryContract.at(process.env.CAMPAIGN_FACTORY_ADDRESS)
    : constants.campaignFactoryContract.deployed()
}

function startListening (campaignFactoryInstance) {
  return {
    campaignStartedSubscription: util.subscribeToContract(campaignFactoryInstance, constants.EVENT_CAMPAIGN_STARTED, async (event) => {
      const campaignInfo = await util.extractCampaignInfoFromEvent(event)
      util.writeSingleDocument(campaignInfo, Campaign)
    }),
    donateSubscription: util.subscribeToContract(campaignFactoryInstance, constants.EVENT_DONATE, async (event) => {
      const donationInfo = await util.extractDonationInfoFromEvent(event)
      util.writeSingleDocument(donationInfo, Donation)
    }),
    withdrawSubscription: util.subscribeToContract(campaignFactoryInstance, constants.EVENT_WITHDRAW, async (event) => {
      const withdrawalInfo = await util.extractWithdrawalInfoFromEvent(event)
      util.writeSingleDocument(withdrawalInfo, Withdrawal)
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
