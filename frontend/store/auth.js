import jwtDecode from 'jwt-decode'
import Web3 from 'web3'

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

    const account = context.rootState.account

    if (context.state.jwt) {
      // Check if JWT has expired and is using the account of the current user.
      const JWTdecoded = jwtDecode(context.state.jwt)
      if (JWTdecoded.exp && JWTdecoded.exp > (Date.now() / 1000) && JWTdecoded.publickey && Web3.utils.toChecksumAddress(JWTdecoded.publickey) === account) {
        return true
      }

      context.commit('setJWT', null)
    }

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
