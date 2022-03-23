import campaignArtifact from 'static/Campaign.json'
import Web3 from 'web3'

export const actions = {
  // Get campaign instance from the blockchain
  getCampaignInstance (context, address) {
    const campaignInstance = new context.rootState.web3.eth.Contract(
      campaignArtifact.abi,
      address
    )
    return campaignInstance
  },
  // Get donation amount of a campaign
  async getCampaignTotalDonations (context, campaignInstance) {
    const totalDonationsWei = await campaignInstance.methods.getTotalDonationAmount().call()
    const totalDonationsEth = Web3.utils.fromWei(totalDonationsWei, 'ether')
    return Number(totalDonationsEth)
  },
  async getCampaignDonationRecords (context, campaignInstance) {
    const donationRecords = await campaignInstance.methods.getDonationRecords().call()
    return donationRecords
  },
  async getCampaignWithdrawRecords (context, campaignInstance) {
    const withdrawRecords = await campaignInstance.methods.getWithdrawRecords().call()
    return withdrawRecords
  },
  // Temporarily get target amount from blockchain...
  async getCampaignTargetAmount (context, campaignInstance) {
    const targetAmount = await campaignInstance.methods.getTargetDonationAmount().call()
    const targetAmountEth = Web3.utils.fromWei(targetAmount, 'ether')
    return targetAmountEth
  },
  // Donate to campaign
  async donate (context, { campaignInstance, amountInEth }) {
    const amountInWei = Web3.utils.toWei(amountInEth.toString(), 'ether')
    await campaignInstance.methods.donate().send({
      from: context.rootState.account,
      value: amountInWei
    })
  }
}
