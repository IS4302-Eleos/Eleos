import { NotificationProgrammatic as Notification } from 'buefy'
import Web3 from 'web3'
import factoryArtifacts from '../../blockchain/build/contracts/CampaignFactory.json'

export const state = () => ({
  web3: null,
  isConnected: false,
  isCorrectChain: true,
  hasRegisteredEvents: false,
  hasPreviouslyConnected: (window.localStorage.getItem('hasPreviouslyConnected') === 'true') || false
})

export const getters = {

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
  setIsCorrectChain (state, isCorrectChain) {
    state.isCorrectChain = isCorrectChain
  },
  setRegisteredEvents (state, hasRegisteredEvents) {
    state.hasRegisteredEvents = hasRegisteredEvents
  }
}

export const actions = {
  // Check if the browser can access the ethereum network
  async checkHasProvider (context) {
    const ethereumProvider = window.ethereum
    if (ethereumProvider) {
      // Log the user back in if they already have logged in previously.
      if (!context.state.isConnected && context.state.hasPreviouslyConnected) {
        this.dispatch('_requestAccounts')
      }
      // Inject web3
      this.commit('setWeb3', Object.freeze(new Web3(window.ethereum)))
      const currentChainId = await context.state.web3.eth.getChainId()
      if (Number(currentChainId) !== Number(this.$config.chain_id)) {
        Notification.open({
          type: 'is-warning',
          message: 'Please change your chain network in your provider.'
        })
        this.commit('setIsCorrectChain', false)
      } else {
        this.commit('setIsCorrectChain', true)
      }

      // Register events to listen for chain change or disconnects
      if (!context.state.hasRegisteredEvents) {
        window.ethereum.on('chainChanged', (chainId) => {
          if (Number(chainId) !== Number(this.$config.chain_id)) {
            this.commit('setIsCorrectChain', false)
          } else {
            this.commit('setIsCorrectChain', true)
          }
        })
        this.commit('setRegisteredEvents', true)
      }
      return true
    } else {
      this.commit('setWeb3', null)
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
  async _switchChains (context) {
    const ethereum = window.ethereum
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.$config.chain_id }]
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: this.$config.chain_id,
              chainName: 'Eleos Chain',
              rpcUrls: [this.$config.ganache_url]
            }
          ]
        })
      } else {
        throw switchError
      }
    }
    return true
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
  },
  async callToCampaignFactory (
    context,
    {
      campaignName,
      beneficiaryUrl,
      endDate,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetAmount
    }
  ) {
    // Format date to timestamp
    let timestamp
    if (endDate !== null) {
      timestamp = Date.parse(endDate) / 1000
    } else {
      // Set an "impossible" end date
      timestamp = String(Math.pow(2, 63) - 1)
    }

    // 1 eth = 1000000000000000000 wei
    const targetAmountInWei = targetAmount * 1000000000000000000

    // Web3 instance connecting to ganache
    const web3 = context.state.web3

    // Gets the network ID of the ganache
    const networkId = await web3.eth.net.getId()

    // Creates the CampaignFactory Instance
    const contract = new web3.eth.Contract(
      factoryArtifacts.abi,
      factoryArtifacts.networks[networkId].address
    )

    // Calls the startCampaign() method
    const res = await contract.methods.startCampaign(
      campaignName,
      beneficiaryUrl,
      timestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      String(targetAmountInWei)
    ).send({
      from: campaignOwnerAddress,
      gas: 2500000
    })
    const newCampaignAddress = res.events.CampaignStarted.returnValues.campaignAddress
    return (newCampaignAddress)
  }
}
