import campaignFactoryArtifacts from 'static/CampaignFactory.json'

export const actions = {
  async callToCampaignFactory (
    context,
    {
      campaignName,
      beneficiaryUrl,
      endDate,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetAmount,
      campaignDescription
    }
  ) {
    // Format date to timestamp
    let timestamp
    if (endDate !== null) {
      timestamp = Date.parse(endDate)
    } else {
      // Set an "impossible" end date
      timestamp = String(Math.pow(2, 63) - 1)
    }
    // Web3 instance connecting to ganache
    const web3 = context.rootState.web3

    const targetAmountInWei = web3.utils.toWei(String(targetAmount))

    // Gets the network ID of the ganache
    const networkId = await web3.eth.net.getId()

    // Creates the CampaignFactory Instance
    const contract = new web3.eth.Contract(
      campaignFactoryArtifacts.abi,
      campaignFactoryArtifacts.networks[networkId].address
    )
    // Calls the startCampaign() method
    const res = await contract.methods.startCampaign(
      campaignName,
      beneficiaryUrl,
      timestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetAmountInWei,
      campaignDescription
    ).send({
      from: campaignOwnerAddress,
      gas: 2500000
    })
    const newCampaignAddress = res.events.CampaignStarted.returnValues.campaignAddress
    return (newCampaignAddress)
  }
}
