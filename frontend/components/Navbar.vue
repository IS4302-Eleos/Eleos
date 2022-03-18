<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="NuxtLink" :to="{ name: 'index' }">
        <h2 class="title is-4">
          Eleos
        </h2>
      </b-navbar-item>
    </template>
    <template #start />

    <template #end>
      <b-navbar-item tag="div">
        <b-field>
          <b-input rounded placeholder="Search..." type="search" icon="magnify" disabled />
          <p class="control">
            <b-button rounded outlined label="Search" disabled />
          </p>
        </b-field>
      </b-navbar-item>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button v-if="hasProvider && isConnected && isAuthenticated" type="is-primary" icon-left="plus-circle">
            Start a Campaign
          </b-button>
          <b-button type="is-success" :disabled="!hasProvider || isConnected || isLoading" :loading="isLoading" @click="login">
            {{ hasProvider ? (isConnected ? 'Connected' : 'Connect') : 'No Provider' }}
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
      isLoading: true
    }
  },
  computed: {
    ...mapState([
      'isConnected'
    ]),
    ...mapGetters({
      hasProvider: 'hasProvider',
      isAuthenticated: 'auth/isAuthenticated'
    })
  },
  mounted () {
    this['auth/init']().then(() => {
      this.isLoading = false
    }).catch((err) => {
      console.error(err)
      this.loading = false
    })
    this['auth/checkAPIEndpoint']().then(() => {
      // console.log('asdf')
    }).catch((err) => {
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
      this.isLoading = true
      await this['auth/handleLogin']()
      this.isLoading = false
    }
  }
}
</script>
