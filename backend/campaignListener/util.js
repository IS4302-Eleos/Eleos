import Campaign from '../src/models/campaign.js'

function subscribeToContractEvents (contractInstance, event, callback) {
  const subscription = contractInstance[event]({})
  subscription.on('data', callback)
  return subscription
}

async function getCampaignInfo (campaignInstance) {
  const res = await Promise.all([
    campaignInstance.getCampaignName.call(),
    campaignInstance.getorganisationUrl.call(),
    campaignInstance.getEndTimeStamp.call(),
    campaignInstance.getBeneficiaryAddress.call(),
    campaignInstance.getCampaignOwnerAddress.call(),
    campaignInstance.getTargetDonationAmount.call(),
    campaignInstance.getCampaignDescription.call()
  ])

  return {
    campaignAddress: campaignInstance.address.toLowerCase(),
    campaignName: res[0],
    organisationUrl: res[1],
    endTimestamp: res[2].toNumber(),
    beneficiaryAddress: res[3].toLowerCase(),
    campaignOwnerAddress: res[4].toLowerCase(),
    targetDonationAmount: res[5].toString(),
    campaignDescription: res[6]
  }
}

async function storeCampaignInfo (campaignInfo) {
  const campaignDocument = new Campaign(campaignInfo)
  return await campaignDocument.save()
}

export { subscribeToContractEvents, getCampaignInfo, storeCampaignInfo }
