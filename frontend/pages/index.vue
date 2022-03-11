<template>
  <div>
    <section class="hero is-success is-large">
      <!-- Hero head: will stick at the top -->
      <div class="hero-head">
        <eleos-navbar />
      </div>

      <!-- Hero content: will be in the middle -->
      <div class="hero-body">
        <div class="has-text-centered">
          <p class="title">
            Welcome to Eleos
          </p>
          <p class="subtitle">
            The decentralized charity fundraiser platform
          </p>
        </div>
      </div>
    </section>
    <section class="section container">
      <div>
        <b-field label="Sign with your key">
          <b-input v-model="signData" />
          <p class="control">
            <b-button type="is-primary" label="Sign" @click="sign" />
          </p>
        </b-field>
      </div>
      <div v-if="signature">
        {{ signature }}
      </div>
    </section>
  </div>
</template>

<script>
import EleosNavbar from '~/components/Navbar'

export default {
  name: 'IndexPage',
  components: {
    EleosNavbar
  },
  layout: 'empty',
  data () {
    return {
      ethereumSupported: false,
      signData: '',
      signature: ''
    }
  },
  methods: {
    async sign () {
      if (await this.isEthereumSupported()) {
        const account = await window.web3.eth.getAccounts()
        try {
          this.signature = await window.web3.eth.personal.sign(this.signData, account[0])
        } catch (err) {
          this.signature = 'Signing operation declined.'
        }
      } else {
        this.signature = 'No ethereum wallet extension detected! Please install an ethereum wallet extension (e.g. Metamask)!'
      }
    },
    async isEthereumSupported () {
      if (window.ethereum) {
        window.web3 = new this.$Web3(window.ethereum)
        try {
          // Request account access
          await window.ethereum.enable()
          console.log('This browser is supported for ethereum')
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }
  }
}

</script>
