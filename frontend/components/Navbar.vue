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
      <b-navbar-item tag="NuxtLink" :to="{ name: 'inspire' }">
        Test
      </b-navbar-item>
    </template>

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
          <a class="button is-success is-light" :disabled="!hasProvider || isConnected" @click="requestAccounts">
            {{ hasProvider ? (isConnected ? 'Connected' : 'Connect') : 'No Provider' }}
          </a>
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
      hasProvider: false
    }
  },
  computed: {
    ...mapState([
      'isConnected'
    ])
  },
  async mounted () {
    this.hasProvider = await this.checkHasProvider()
  },
  methods: {
    ...mapActions([
      'checkHasProvider',
      'requestAccounts'
    ])
  }
}
</script>
