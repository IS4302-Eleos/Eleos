import { NotificationProgrammatic as Notification } from 'buefy'

import factoryArtifacts from '../../blockchain/build/contracts/CampaignFactory.json'

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
      // Set an "impossible" end date - Tuesday, January 19, 2038 3:14:07 AM
      timestamp = 2147483647
    }

    // 1 eth = 1000000000000000000 wei
    const targetAmountInWei = targetAmount * 1000000000000000000
    // Need to find a way to abstract this part out, since its common use
    // Web3 instance connecting to ganache
    const web3 = new this.$Web3(new this.$Web3(this.$config.ganache_url))
    // Gets the network ID of the ganache
    const networkId = await web3.eth.net.getId()
    // End of web3 and necessary set ups

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
