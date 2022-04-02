import { ethers } from 'ethers'
import Vue from 'vue'

export const state = () => ({
  reputationArtifact: null,
  userReputations: {}
})

export const mutations = {
  setReputationArtifact (state, reputationArtifact) {
    state.reputationArtifact = reputationArtifact
  },
  updateUserReputation (state, { userAddress, reputation }) {
    Vue.set(state.userReputations, userAddress, reputation)
  }
}

export const actions = {
  async getReputation (context, userAddress) {
    const provider = this.$wallet.provider
    const networkId = (await provider.send('net_version', []))
    if (context.state.reputationArtifact === null) {
      context.commit('setReputationArtifact', await this.$http.$get('Reputation.json', { prefixUrl: '/' }))
    }
    const reputationContract = new ethers.Contract(
      context.state.reputationArtifact.networks[networkId].address,
      context.state.reputationArtifact.abi,
      provider
    )
    const reputation = ethers.utils.formatUnits(await reputationContract.getReputation(userAddress), 16)
    context.commit('updateUserReputation', { userAddress, reputation })
    return reputation
  }
}
