import constants from './constants.js'

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

async function extractDonationInfoFromEvent (event) {
  const { campaignAddress, donorAddress, amount } = event.returnValues
  const transactionHash = event.transactionHash
  const timestamp = (await constants.web3.eth.getBlock(event.blockNumber)).timestamp * 1000
  return {
    transactionHash,
    timestamp,
    campaignAddress,
    donorAddress,
    amount
  }
}

async function extractWithdrawalInfoFromEvent (event) {
  const { campaignAddress, withdrawerAddress, amount, toAddress: beneficiaryAddress } = event.returnValues
  const transactionHash = event.transactionHash
  const timestamp = (await constants.web3.eth.getBlock(event.blockNumber)).timestamp * 1000
  return {
    transactionHash,
    timestamp,
    campaignAddress,
    withdrawerAddress,
    amount,
    beneficiaryAddress
  }
}

async function extractCampaignInfoFromEvent (event) {
  const campaignAddress = event.returnValues.campaignAddress
  const campaignInstance = await constants.campaignContract.at(campaignAddress)

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

export default {
  extractDonationInfoFromEvent,
  extractWithdrawalInfoFromEvent,
  extractCampaignInfoFromEvent,
  writeSingleDocument,
  writeBulkDocuments,
  getAllEvents,
  subscribeToContract
}
