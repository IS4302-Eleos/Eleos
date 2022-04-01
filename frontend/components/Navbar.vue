<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="NuxtLink" :to="{ name: 'index' }">
        <h2 class="title is-4">
          Eleos
        </h2>
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="div">
        <b-message v-if="error.length" type="is-danger" has-icon size="is-small">
          <p v-for="e in error" :key="e">
            {{ e }}
          </p>
        </b-message>
      </b-navbar-item>
    </template>

    <template #end>
      <!-- TODO -->
      <!-- <b-navbar-item tag="div">
        <b-field>
          <b-input rounded placeholder="Search..." type="search" icon="magnify" disabled />
          <p class="control">
            <b-button rounded outlined label="Search" disabled />
          </p>
        </b-field>
      </b-navbar-item> -->
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button v-if="isConnected && isAuthenticated" type="is-primary" icon-left="plus-circle" tag="NuxtLink" to="/campaign/add">
            Start a Campaign
          </b-button>
          <b-button v-if="!isLoggedIn" type="is-success" :disabled="!hasProvider || isConnected || !isCorrectChain || !isAPIEndpointActive" :loading="isConnecting" @click="login">
            {{ hasProvider ? (isConnected ? 'Connected' : 'Connect') : 'No Provider' }}
          </b-button>
          <b-button
            v-else
            type="is-info"
            icon-left="account"
            rounded
            :disabled="!hasProvider || !isCorrectChain"
            tag="nuxt-link"
            :to="`/user/${userAddress}`"
          >
            My Account
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'EleosNavbar',
  data () {
    return {
      error: []
    }
  },
  computed: {
    ...mapState({
      isConnected: 'isConnected',
      isConnecting: 'isConnecting',
      isCorrectChain: 'isCorrectChain',
      isAPIEndpointActive: state => state.auth.isAPIEndpointActive,
      isLoggedIn: state => state.auth.jwt
    }),
    ...mapGetters({
      hasProvider: 'hasProvider',
      isAuthenticated: 'auth/isAuthenticated'
    }),
    userAddress () {
      return this.$wallet.account
    }
  },
  mounted () {
    this['auth/init']().then(() => {
      this.$store.commit('setConnecting', false)
    }).catch(() => {
      this.$store.commit('setConnecting', false)
    })
    this['auth/checkAPIEndpoint']().then(() => {
      if (!this.isAPIEndpointActive) {
        this.error.push('We are unable to connect to our backend API services. Please check if you are connected to the network. ')
      }
    })
    this.$wallet.isCorrectChain(this.$config).then((res) => {
      if (!res) {
        this.error.push(`Please change the your provider's chain to the supported chain (Supported Chain ID :${Number(this.$config.chain_id)}). `)
      }
    })
  },
  methods: {
    ...mapActions([
      'auth/checkAPIEndpoint',
      'auth/handleLogin',
      'auth/init'
    ]),
    async login () {
      this.$store.commit('setConnecting', true)
      await this['auth/handleLogin']()
      this.$store.commit('setConnecting', false)
    }
  }
}
</script>
