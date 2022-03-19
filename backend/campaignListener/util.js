import Campaign from '../src/models/campaign.js'

function subscribeToContractEvents (contractInstance, event, callback) {
  const subscription = contractInstance[event]({})
  subscription.on('data', callback)
  return subscription
}

async function getCampaignDetails (campaignInstance) {
  const res = await Promise.all([
    campaignInstance.getCampaignName.call(),
    campaignInstance.getorganisationUrl.call(),
    campaignInstance.getEndTimeStamp.call(),
    campaignInstance.getBeneficiaryAddress.call(),
    campaignInstance.getCampaignOwnerAddress.call(),
    campaignInstance.getCampaignDescription.call()
  ])

  return {
    campaignAddress: campaignInstance.address.toLowerCase(),
    campaignName: res[0],
    organisationUrl: res[1],
    endTimestamp: res[2].toNumber(),
    beneficiaryAddress: res[3].toLowerCase(),
    campaignOwnerAddress: res[4].toLowerCase(),
    campaignDescription: res[5]
  }
}

async function storeCampaignDetails (campaignInstance) {
  const details = await getCampaignDetails(campaignInstance)
  const campaignDocument = new Campaign(details)
  return await campaignDocument.save()
}

export { subscribeToContractEvents, getCampaignDetails, storeCampaignDetails }
