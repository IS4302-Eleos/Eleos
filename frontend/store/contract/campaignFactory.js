import { ethers } from 'ethers'

export const state = () => ({
  campaignFactoryArtifacts: null
})

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

    const targetAmountInWei = Number(targetAmount) > 0 ? ethers.utils.parseEther(targetAmount, 'ether') : ethers.constants.Zero

    // Gets the network ID of the ganache
    const networkId = (await provider.send('net_version', []))

    // Pull the compiled contract JSON and cache it
    if (context.state.campaignFactoryArtifacts === null) {
      context.state.campaignFactoryArtifacts = await this.$http.$get('CampaignFactory.json', { prefixUrl: '/' })
    }

    // Creates the CampaignFactory Instance
    const contract = new ethers.Contract(
      context.state.campaignFactoryArtifacts.networks[networkId].address,
      context.state.campaignFactoryArtifacts.abi,
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
