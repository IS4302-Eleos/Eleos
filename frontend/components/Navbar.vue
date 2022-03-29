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
        <b-message v-if="!isAPIEndpointActive" type="is-danger" has-icon size="is-small">
          We are unable to connect to our backend API services. Please check if you are connected to the network.
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
          <b-button v-if="!isConnected" type="is-success" :disabled="!hasProvider || isConnected || !isCorrectChain" :loading="isConnecting" @click="login">
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
  computed: {
    ...mapState({
      isConnected: 'isConnected',
      isConnecting: 'isConnecting',
      isCorrectChain: 'isCorrectChain',
      isAPIEndpointActive: state => state.auth.isAPIEndpointActive
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
    }).catch((err) => {
      console.error(err)
      this.$store.commit('setConnecting', false)
    })
    this['auth/checkAPIEndpoint']().catch((err) => {
      console.error(err)
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
