import { ethers } from 'ethers'

export const state = () => ({
  campaigns: {},
  campaignArtifact: null
})

export const actions = {
  // Get campaign instance from the blockchain
  async getCampaignInstance (context, address) {
    if (context.state.campaignArtifact === null) {
      context.state.campaignArtifact = await this.$http.$get('Campaign.json', { 'prefixUrl': '/' })
    }
    const campaignInstance = new ethers.Contract(
      address,
      context.state.campaignArtifact.abi,
      this.$wallet.provider
    )
    return campaignInstance
  },
  // Get donation amount of a campaign
  async getTotalDonations (context, campaignInstance) {
    const totalDonationsWei = await campaignInstance.getTotalDonationAmount()
    const totalDonationsEth = ethers.utils.formatUnits(totalDonationsWei, 'ether')
    return Number(totalDonationsEth)
  },
  async getDonationRecords (context, campaignInstance) {
    const donationRecords = await campaignInstance.getDonationRecords()
    return donationRecords
  },
  async getWithdrawRecords (context, campaignInstance) {
    const withdrawRecords = await campaignInstance.getWithdrawRecords()
    return withdrawRecords
  },
  // Temporarily get target amount from blockchain...
  async getTargetAmount (context, campaignInstance) {
    const targetAmount = await campaignInstance.getTargetDonationAmount()
    const targetAmountEth = ethers.utils.formatUnits(targetAmount, 'ether')
    return targetAmountEth
  },
  // Get withdrawal balance of campaign
  async getWithdrawalBalance (context, campaignInstance) {
    const withdrawBalance = await campaignInstance.getWithdrawalBalance()
    const withdrawBalanceEth = ethers.utils.formatUnits(withdrawBalance, 'ether')
    return withdrawBalanceEth
  },
  // Donate to campaign
  async donate (context, { campaignInstance, amountInEth }) {
    const amountInWei = ethers.utils.parseEther(amountInEth.toString(), 'ether')
    await (await campaignInstance.connect(this.$wallet.provider.getSigner()).donate({
      value: amountInWei
    })).wait()
  },
  async withdraw (context, { campaignInstance, amountInEth }) {
    const amountInWei = ethers.utils.parseEther(amountInEth.toString(), 'ether')
    await (await campaignInstance.connect(this.$wallet.provider.getSigner()).withdraw(amountInWei, {
      from: context.rootState.account
    })).wait()
  }
}
