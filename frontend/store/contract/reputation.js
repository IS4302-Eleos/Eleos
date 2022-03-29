import { ethers } from 'ethers'

export const state = () => ({
  reputationArtifact: null
})

export const actions = {
  async getReputation (context, userAddress) {
    const provider = this.$wallet.provider
    const networkId = (await provider.send('net_version', []))
    if (context.state.reputationArtifact === null) {
      context.state.reputationArtifact = await this.$http.$get('Reputation.json', { prefixUrl: '/' })
    }
    const reputationContract = new ethers.Contract(
      context.state.reputationArtifact.networks[networkId].address,
      context.state.reputationArtifact.abi,
      provider
    )
    const reputation = ethers.utils.formatEther(await reputationContract.getReputation(userAddress))
    return reputation
  }
}
