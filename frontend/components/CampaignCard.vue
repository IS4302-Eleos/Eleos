<template>
  <nuxt-link to="/">
    <div class="box">
      <h4 class="title is-4">
        <template v-if="title != null">
          {{ title }}
        </template>
        <b-skeleton :active="title == null" />
      </h4>
      <h6 class="subtitle is-5">
        <template v-if="hasDonationAmount">
          <strong>{{ currentAmount }}</strong> ETH raised <span v-if="targetAmount > 0">of {{ targetAmount }} ETH</span>
        </template>
        <b-skeleton :active="!hasDonationAmount" />
      </h6>
      <b-progress class="mb-1" size="is-small" :type="hasDonationAmount ? 'is-success' : 'is-light'" :value="donationPercentage" />
      <p>
        <template v-if="endDate != null">
          Ending on: {{ endDatePretty }}
        </template>
        <b-skeleton :active="endDate == null" />
      </p>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'CampaignCard',
  props: {
    id: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    currentAmount: {
      type: Number,
      default: -1
    },
    targetAmount: {
      type: Number,
      default: -1
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {
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
    endDatePretty () {
      return this.$dayjs(this.endDate).format('YYYY/MM/DD')
    }
  }
}
</script>

<style>

</style>
