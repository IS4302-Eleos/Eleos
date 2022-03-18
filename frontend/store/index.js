import { NotificationProgrammatic as Notification } from 'buefy'

export const state = () => ({
  isConnected: false,
  hasPreviouslyConnected: (window.localStorage.getItem('hasPreviouslyConnected') === 'true') || false
})

export const getters = {
}

export const mutations = {
  setConnected (state, isConnected) {
    state.isConnected = isConnected
  },
  setPreviouslyConnected (state, previouslyConnected) {
    state.hasPreviouslyConnected = previouslyConnected
    window.localStorage.setItem('hasPreviouslyConnected', previouslyConnected)
  }
}

export const actions = {
  // Check if the browser can access the ethereum network
  async checkHasProvider (context) {
    const ethereumProvider = window.ethereum
    if (ethereumProvider) {
      // Inject web3
      window.web3 = new this.$Web3(window.ethereum)

      // Log the user back in if they already have logged in previously.
      if (!context.state.isConnected && context.state.hasPreviouslyConnected) {
        await this.dispatch('_requestAccounts')
      }

      return true
    } else {
      return false
    }
  },
  // Request account access from user
  async safelyRequestAccounts (context) {
    if (await !this.dispatch('checkHasProvider')) {
      return false
    }
    return await this.dispatch('_requestAccounts')
  },
  async _requestAccounts (context) {
  // Request account access
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      // Connected if accounts is not empty
      if (accounts.length > 0) {
        this.commit('setConnected', true)
        this.commit('setPreviouslyConnected', true)
        return accounts
      } else {
        Notification.open({
          type: 'is-warning',
          message: 'No accounts found within your wallet!'
        })
        this.commit('setConnected', false)
        this.commit('setPreviouslyConnected', false)
        return false
      }
    } catch (error) {
      console.error(error)
      Notification.open({
        type: 'is-danger',
        message: 'Failed to connect to your wallet!'
      })
      this.commit('setConnected', false)
      this.commit('setPreviouslyConnected', false)
      return false
    }
  }
}
