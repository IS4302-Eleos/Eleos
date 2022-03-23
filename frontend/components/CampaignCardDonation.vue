<template>
  <div>
    <h6 class="subtitle is-5">
      <strong>{{ currentAmount }}</strong> ETH raised <span v-if="targetAmount > 0">of {{ targetAmount }} ETH</span>
    </h6>
    <b-progress class="mb-1" size="is-small" :type="progressBarColor" :value="donationPercentage" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CampaignCardDonation',
  props: {
    address: {
      type: String,
      default: null,
      required: true
    },
    targetAmount: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      currentAmount: -1
    }
  },
  computed: {
    ...mapState([
      'isConnected'
    ]),
    hasDonationAmount () {
      return this.currentAmount !== -1 && this.targetAmount !== -1
    },
    donationPercentage () {
      if (!this.hasDonationAmount) {
        return undefined
      } else if (this.targetAmount === 0) {
        return 100
      } else {
        return Math.min(100, (this.currentAmount / this.targetAmount) * 100)
      }
    },
    progressBarColor () {
      if (!this.hasDonationAmount) {
        return 'is-light'
      }
      if (this.$dayjs().isAfter(this.$dayjs(this.endDate), 'day')) {
        return 'is-warning'
      }
      return 'is-success'
    }
  },
  async mounted () {
    if (this.isConnected) {
      // Get current donation amount of campaign
      const campaignInstance = await this.getCampaignInstance(this.address)
      const totalDonationAmount = await this.getTotalDonations(campaignInstance)
      this.currentAmount = totalDonationAmount
    }
  },
  methods: {
    ...mapActions('contract/campaign', [
      'getCampaignInstance',
      'getTotalDonations'
    ])
  }
}
</script>
