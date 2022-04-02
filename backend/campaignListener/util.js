async function getCampaignInfo (campaignInstance) {
  const res = await Promise.all([
    campaignInstance.getCampaignName.call(),
    campaignInstance.getOrganisationUrl.call(),
    campaignInstance.getEndTimeStamp.call(),
    campaignInstance.getBeneficiaryAddress.call(),
    campaignInstance.getCampaignOwnerAddress.call(),
    campaignInstance.getTargetDonationAmount.call(),
    campaignInstance.getCampaignDescription.call()
  ])

  return {
    campaignAddress: campaignInstance.address,
    campaignName: res[0],
    organisationUrl: res[1],
    endTimestamp: res[2].toNumber(),
    beneficiaryAddress: res[3],
    campaignOwnerAddress: res[4],
    targetDonationAmount: res[5].toString(),
    campaignDescription: res[6]
  }
}

async function writeSingleDocument (json, model) {
  try {
    return await model.create(json)
  } catch (err) {}
}

async function writeBulkDocuments (jsonList, model) {
  try {
    return await model.insertMany(jsonList, { ordered: false })
  } catch (err) {}
}

function getAllEvents (contractInstance, eventName) {
  const options = { fromBlock: 0, toBlock: 'latest' }
  return contractInstance.getPastEvents(eventName, options)
}

function subscribeToContract (contractInstance, eventName, callback) {
  return contractInstance[eventName]({})
    .on('data', callback)
}

export default {
  getCampaignInfo,
  writeSingleDocument,
  writeBulkDocuments,
  getAllEvents,
  subscribeToContract
}
