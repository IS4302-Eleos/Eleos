import { NotificationProgrammatic as Notification } from 'buefy'
import Web3 from 'web3'

export const state = () => ({
  isConnected: false,
  web3: null,
  hasPreviouslyConnected: (window.localStorage.getItem('hasPreviouslyConnected') === 'true') || false
})

export const getters = {
  getProvider (state, getters) {
    return window.ethereum
  },
  hasProvider (state, getters) {
    return Boolean(getters.getProvider)
  }
}

export const mutations = {
  setConnected (state, isConnected) {
    state.isConnected = isConnected
  },
  setPreviouslyConnected (state, previouslyConnected) {
    state.hasPreviouslyConnected = previouslyConnected
    window.localStorage.setItem('hasPreviouslyConnected', previouslyConnected)
  },
  setWeb3 (state, web3) {
    state.web3 = web3
  }
}

export const actions = {
  // Request account access from user
  async safelyRequestAccounts (context) {
    if (!context.rootGetters.hasProvider) {
      return false
    }

    context.commit('setWeb3', Object.freeze(new Web3(context.rootGetters.getProvider)))
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
