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
          <b-button v-if="isConnected" type="is-primary" icon-left="plus-circle" tag="NuxtLink" to="/campaign/add">
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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EleosNavbar',
  data () {
    return {
      hasProvider: false,
      isLoading: true
    }
  },
  computed: {
    ...mapState([
      'isConnected'
    ])
  },
  async mounted () {
    const results = await this.checkHasProvider()
    this.hasProvider = !!results
    this.isLoading = false
  },
  methods: {
    ...mapActions([
      'checkHasProvider',
      'safelyRequestAccounts'
    ]),
    async login () {
      this.isLoading = true
      await this.safelyRequestAccounts()
      this.isLoading = false
    }
  }
}
</script>
