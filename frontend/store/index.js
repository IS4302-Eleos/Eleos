import { NotificationProgrammatic as Notification } from 'buefy'
import Web3 from 'web3'

export const state = () => ({
  web3: null,
  isConnected: false,
  isConnecting: true,
  isCorrectChain: true,
  hasRegisteredEvents: false,
  hasPreviouslyConnected: (window.localStorage.getItem('hasPreviouslyConnected') === 'true') || false,
  account: null
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
  setWeb3 (state, web3) {
    state.web3 = web3
  },
  setConnected (state, isConnected) {
    state.isConnected = isConnected
  },
  setPreviouslyConnected (state, previouslyConnected) {
    state.hasPreviouslyConnected = previouslyConnected
    window.localStorage.setItem('hasPreviouslyConnected', previouslyConnected)
  },
  setAccount (state, account) {
    state.account = Web3.utils.toChecksumAddress(account)
  },
  setIsCorrectChain (state, isCorrectChain) {
    state.isCorrectChain = isCorrectChain
  },
  setRegisteredEvents (state, hasRegisteredEvents) {
    state.hasRegisteredEvents = hasRegisteredEvents
  },
  setConnecting (state, isConnecting) {
    state.isConnecting = isConnecting
  }
}

export const actions = {
  async verifyCurrentChain (context, chainId) {
    if (!chainId) {
      chainId = await context.state.web3.eth.getChainId()
    }

    if (Number(chainId) !== Number(this.$config.chain_id)) {
      Notification.open({
        type: 'is-danger',
        hasIcon: true,
        duration: 5000,
        progressBar: true,
        size: 'is-small',
        position: 'is-bottom-right',
        message: 'Please change to the chain supported by Eleos!'
      })
      this.commit('setIsCorrectChain', false)
      return false
    } else {
      this.commit('setIsCorrectChain', true)
      return true
    }
  },
  // Request account access from user
  async safelyRequestAccounts (context) {
    if (!context.rootGetters.hasProvider) {
      return false
    }

    context.commit('setWeb3', Object.freeze(new Web3(context.rootGetters.getProvider)))

    if (!context.state.hasRegisteredEvents) {
      context.getters.getProvider.on('chainChanged', async (chainId) => {
        if (!(await this.dispatch('verifyCurrentChain', chainId))) {
          this.dispatch('auth/handleLogin')
        }
      })
      context.getters.getProvider.on('accountsChanged', (accounts) => {
        // Check if the user completely disconnect from the provider.
        // If they are disconnected, unset everything.
        if (accounts.length < 1) {
          this.commit('setConnected', false)
          this.commit('setPreviouslyConnected', false)
          return
        }

        // Do not call anything if validation of accounts are already occurring.
        if (this.state.isConnecting) {
          return
        }

        // Set the status to be reconnecting to network
        this.commit('setConnected', false)
        this.commit('setConnecting', true)
        this.commit('setPreviouslyConnected', false)

        Notification.open({
          type: 'is-warning',
          hasIcon: true,
          duration: 5000,
          progressBar: true,
          size: 'is-small',
          position: 'is-bottom-right',
          message: 'Please re-authenticate with your new account.'
        })
        this.dispatch('auth/handleLogin').then(() => {
          this.commit('setConnecting', false)
        }).catch(() => {
          this.commit('setConnecting', false)
        })
      })
      this.commit('setRegisteredEvents', true)
    }

    // Check if the chain is correct
    if (!await context.dispatch('verifyCurrentChain')) {
      this.commit('setConnected', false)
      this.commit('setPreviouslyConnected', false)
      return false
    }

    // Request account access
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      // Connected if accounts is not empty
      if (accounts.length > 0) {
        this.commit('setConnected', true)
        this.commit('setPreviouslyConnected', true)
        // Currently Metamask only supports 1 account, so just take the first account
        this.commit('setAccount', accounts[0])
        return accounts
      } else {
        Notification.open({
          type: 'is-warning',
          hasIcon: true,
          duration: 5000,
          progressBar: true,
          size: 'is-small',
          position: 'is-bottom-right',
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
        hasIcon: true,
        duration: 5000,
        progressBar: true,
        size: 'is-small',
        position: 'is-bottom-right',
        message: 'Failed to connect to your wallet!'
      })
      this.commit('setConnected', false)
      this.commit('setPreviouslyConnected', false)
      return false
    }
  }
}
