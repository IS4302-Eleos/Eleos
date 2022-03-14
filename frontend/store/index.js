export const state = () => ({
  isConnected: false
})

export const getters = {
}

export const mutations = {
  setConnected (state, isConnected) {
    state.isConnected = isConnected
  }
}

export const actions = {
  // Check if the browser can access the ethereum network
  checkHasProvider (context) {
    const ethereumProvider = window.ethereum
    if (ethereumProvider) {
      // Inject web3
      window.web3 = new this.$Web3(window.ethereum)
      return true
    } else {
      console.info('Non-Ethereum browser detected. You should consider trying MetaMask!')
      return false
    }
  },
  // Request account access from user
  async requestAccounts (context) {
    if (await !this.dispatch('checkHasProvider')) {
      return false
    }

    // Request account access
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      // Connected if accounts is not empty
      if (accounts.length > 0) {
        this.commit('setConnected', true)
        return accounts
      } else {
        this.commit('setConnected', false)
        return false
      }
    } catch (error) {
      console.error(error)
      this.commit('setConnected', false)
      return false
    }
  }
}
