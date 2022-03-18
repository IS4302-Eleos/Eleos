export const state = () => ({
  isAPIEndpointActive: false,
  jwt: window.localStorage.getItem('jwt') || null
})

export const getters = {
  isAuthenticated (state, getters) {
    return !!state.jwt
  }
}

export const mutations = {
  setJWT (state, jwt) {
    state.jwt = jwt
    if (jwt === null) {
      window.localStorage.removeItem('jwt')
    } else {
      window.localStorage.setItem('jwt', jwt)
    }
  },
  setAPIEndpointActive (state, isAPIEndpointActive) {
    state.isAPIEndpointActive = isAPIEndpointActive
  }
}

export const actions = {
  async checkAPIEndpoint (context) {
    const res = await fetch(this.$config.api_url)
    if (!res.ok) {
      this.commit('auth/setAPIEndpointActive', false)
    } else {
      this.commit('auth/setAPIEndpointActive', true)
    }
  },
  async init (context) {
    if (context.rootState.hasPreviouslyConnected) {
      return await context.dispatch('handleLogin')
    }
    return false
  },
  async handleLogin (context) {
    // Check if provider exist first
    if (!context.rootGetters.hasProvider) {
      context.commit('setJWT', null)
      context.commit('setConnected', false, { root: true })
      context.commit('setPreviouslyConnected', false, { root: true })
      return false
    }
    const accounts = await this.dispatch('safelyRequestAccounts')
    if (!accounts || accounts.length < 1) {
      context.commit('setJWT', null)
      context.commit('setConnected', false, { root: true })
      context.commit('setPreviouslyConnected', false, { root: true })
      return false
    }

    if (context.state.jwt) {
      // Add validity check for JWT here
      return true
    }

    // Currently Metamask only supports 1 account, so just take the first account
    const account = accounts[0]

    try {
      // Get the challenge nonce from the server to sign
      const nonceRes = await fetch(this.$config.api_url + '/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pubkey: account
        })
      })

      if (!nonceRes.ok) {
        return false
      }

      // Sign the challenge and send it back
      const web3 = context.rootState.web3 // Change to state after addCampaign changed
      const challenge = (await nonceRes.json()).challenge
      const signature = await web3.eth.personal.sign(challenge, account) // Sign the challenge

      const jwtRes = await fetch(this.$config.api_url + '/auth/authenticate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pubkey: account,
          signature
        })
      })

      if (!jwtRes.ok) {
        return false
      }

      const jwt = (await jwtRes.json()).token
      context.commit('setJWT', jwt)
      return true
    } catch (err) {
      context.commit('setConnected', false, { root: true })
      context.commit('setPreviouslyConnected', false, { root: true })
      return false
    }
  }
}
