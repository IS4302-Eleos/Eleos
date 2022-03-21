import campaignArtifact from 'static/Campaign.json'
import Web3 from 'web3'

export const actions = {
  getCampaignInstance (context, address) {
    const campaignInstance = new context.rootState.web3.eth.Contract(
      campaignArtifact.abi,
      address
    )
    return campaignInstance
  },
  async getCampaignTotalDonations (context, campaignInstance) {
    const totalDonationsWei = await campaignInstance.methods.getTotalDonationAmount().call()
    const totalDonationsEth = Web3.utils.fromWei(totalDonationsWei, 'ether')
    return Number(totalDonationsEth)
  }
}
