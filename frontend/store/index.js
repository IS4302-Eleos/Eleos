export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async isWalletConnected (context) {
    // Check if browser can access the ethereum network
    if (!window.ethereum) {
      console.info(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
      return false
    }

    window.web3 = new this.$Web3(window.ethereum)

    // Connect wallet
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      // Connected if accounts is not empty
      return !!accounts[0]
    } catch (error) {
      console.error(error)
      return false
    }
  },
  async getWalletAddress (context) {
    if (await this.dispatch('isWalletConnected')) {
      const accounts = await window.web3.eth.getAccounts()
      return accounts[0]
    }
  }
}
