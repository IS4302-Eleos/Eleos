import campaignFactoryArtifacts from 'static/CampaignFactory.json'
import { ethers } from 'ethers'

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
      timestamp = 8640000000000000
    }
    // Ethers provider instance connecting to ganache
    const provider = this.$wallet.provider

    const targetAmountInWei = ethers.utils.parseEther(targetAmount, 'ether')

    // Gets the network ID of the ganache
    const networkId = (await provider.send('net_version', []))

    // Creates the CampaignFactory Instance
    const contract = new ethers.Contract(
      campaignFactoryArtifacts.networks[networkId].address,
      campaignFactoryArtifacts.abi,
      provider.getSigner()
    )
    // Calls the startCampaign() method
    const res = await (await contract.startCampaign(
      campaignName,
      beneficiaryUrl,
      timestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetAmountInWei,
      campaignDescription
    )).wait()

    return (res.events.find(e => e.event === 'CampaignStarted').args.campaignAddress)
  }
}
