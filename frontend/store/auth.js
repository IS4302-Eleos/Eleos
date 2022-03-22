import jwtDecode from 'jwt-decode'
import Web3 from 'web3'

export const state = () => ({
  isAPIEndpointActive: true,
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
    this.$http.setBaseURL(this.$config.api_url)
    try {
      await this.$http.$get('/')
      this.commit('auth/setAPIEndpointActive', true)
    } catch (err) {
      this.commit('auth/setAPIEndpointActive', false)
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

    await context.dispatch('checkAPIEndpoint')
    if (!context.state.isAPIEndpointActive) {
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
      this.$http.setBaseURL(this.$config.api_url)
      // Get the challenge nonce from the server to sign
      const nonceRes = await this.$http.$post('/auth/login', {
        pubkey: account
      })

      // Sign the challenge and send it back
      const web3 = context.rootState.web3 // Change to state after addCampaign changed
      const challenge = nonceRes.challenge
      const signature = await web3.eth.personal.sign(challenge, account) // Sign the challenge

      const jwtRes = await this.$http.$post('/auth/authenticate', {
        pubkey: account,
        signature
      })

      const jwt = jwtRes.token
      context.commit('setJWT', jwt)
      return true
    } catch (err) {
      context.commit('setConnected', false, { root: true })
      context.commit('setPreviouslyConnected', false, { root: true })
      return false
    }
  }
}
