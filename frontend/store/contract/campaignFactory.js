export const actions = {
  async callToCampaignFactory (
    context,
    {
      campaignName,
      beneficiaryUrl,
      endDate,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetAmount
    }
  ) {
    // Format date to timestamp
    let timestamp
    if (endDate !== null) {
      timestamp = Date.parse(endDate) / 1000
    } else {
      // Set an "impossible" end date
      timestamp = String(Math.pow(2, 63) - 1)
    }

    // 1 eth = 1000000000000000000 wei
    const targetAmountInWei = String(targetAmount * 1000000000000000000)

    // Web3 instance connecting to ganache
    const web3 = context.rootState.web3

    // Gets the network ID of the ganache
    const networkId = await web3.eth.net.getId()

    // Fetches the contract json file
    let factoryArtifacts = ''
    await fetch('/CampaignFactory.json')
      .then(response => response.json())
      .then((data) => {
        factoryArtifacts = data
      })
    // Creates the CampaignFactory Instance
    const contract = new web3.eth.Contract(
      factoryArtifacts.abi,
      factoryArtifacts.networks[networkId].address
    )

    // Calls the startCampaign() method
    const res = await contract.methods.startCampaign(
      campaignName,
      beneficiaryUrl,
      timestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetAmountInWei
    ).send({
      from: campaignOwnerAddress,
      gas: 2500000
    })
    const newCampaignAddress = res.events.CampaignStarted.returnValues.campaignAddress
    return (newCampaignAddress)
  }
}
