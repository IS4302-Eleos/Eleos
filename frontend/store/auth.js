import jwtDecode from 'jwt-decode'
import { ethers } from 'ethers'

export const state = () => ({
  isAPIEndpointActive: true,
  jwt: window.localStorage.getItem('jwt') || null
})

export const getters = {
  isAuthenticated (state, getters, $wallet) {
    return !!state.jwt && $wallet.account
  },
  isJWTExpired (state, getters, $wallet) {
    if (!state.jwt) {
      return true
    }

    const JWTdecoded = jwtDecode(state.jwt)
    if (JWTdecoded.exp && JWTdecoded.exp > (Date.now() / 1000) && JWTdecoded.publickey) {
      return false
    }

    return true
  }
}

export const mutations = {
  setJWT (state, jwt) {
    state.jwt = jwt
    this.$http.setToken(state.jwt, 'Bearer')
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
    // Force set JWT to nuxt/http
    context.commit('setJWT', context.state.jwt)

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

    const account = ethers.utils.getAddress(this.$wallet.account)

    if (context.state.jwt) {
      // Check if JWT has expired and is using the account of the current user.
      const JWTdecoded = jwtDecode(context.state.jwt)
      if (JWTdecoded.exp && JWTdecoded.exp > (Date.now() / 1000) && JWTdecoded.publickey && ethers.utils.getAddress(JWTdecoded.publickey) === account) {
        return true
      }

      context.commit('setJWT', null)
    }

    try {
      // Get the challenge nonce from the server to sign
      const nonceRes = await this.$http.$post('/auth/login', {
        pubkey: account
      })

      // Sign the challenge and send it back
      // const ethers = context.rootState.ethers // Change to state after addCampaign changed
      const challenge = ethers.utils.arrayify(nonceRes.challenge)
      const signature = await this.$wallet.provider.getSigner().signMessage(challenge) // Sign the challenge

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
  },
  async saveDescription (context, payload) {
    if (context.getters.isJWTExpired && !await context.dispatch('handleLogin')) {
      return false
    }

    const res = await this.$http.$post('/campaign/edit', payload)
    return !!res.success
  }
}
