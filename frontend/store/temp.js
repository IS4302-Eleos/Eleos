// Just temporary, in case of merge conflicts, will be combined with campaign.js
import campaignArtifact from 'static/Campaign.json'

export const actions = {
  getCampaignInstance (context, address) {
    const campaignInstance = new context.rootState.web3.eth.Contract(
      campaignArtifact.abi,
      address
    )
    return campaignInstance
  },
  async getCampaignTotalDonations (context, campaignInstance) {
    const totalDonations = await campaignInstance.methods.getTotalDonationAmount().call()
    return totalDonations
  },
  async getCampaignDonationRecords (context, campaignInstance) {
    const test = await campaignInstance.methods.getDonationRecords().call()
    return test
  },
  // Temporarily get target amount from blockchain...
  async getCampaignTargetAmount (context, campaignInstance) {
    const targetAmount = await campaignInstance.methods.getTargetDonationAmount().call()
    return targetAmount
  }
}
