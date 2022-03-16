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
    campaignInstance.getCampaignOwnerAddress.call()
  ])

  return {
    campaignAddress: campaignInstance.address,
    campaignName: res[0],
    organisationUrl: res[1],
    endTimestamp: res[2],
    beneficiaryAddress: res[3],
    campaignOwnerAddress: res[4]
  }
}

export { subscribeToContractEvents, getCampaignDetails }
