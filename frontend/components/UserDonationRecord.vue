<template>
  <div class="block">
    <div class="columns is-mobile mb-0">
      <div class="column">
        <ethereum-address
          prefix="Campaign"
          :address="campaignAddress"
          type="campaign"
          address-type="is-light is-success"
          class="is-inline-flex mb-0"
          size="is-medium"
        />
        <p class="subtitle has-text-grey is-size-7">
          Donated on: {{ timestampPretty }}
        </p>
      </div>
      <div class="column is-narrow">
        <div class="level-item has-text-centered">
          <div>
            <p class="title has-text-weight-bold is-size-3">
              <template v-if="amount !== null">
                {{ amount }}
              </template>
              <b-skeleton :active="amount === null" width="3rem" />
            </p>
            <p class="heading has-text-weight-semibold">
              ETH
            </p>
          </div>
        </div>
      </div>
    </div>
    <hr class="mt-0">
  </div>
</template>

<script>

export default {
  name: 'UserDonationRecords',
  props: {
    amount: {
      type: [Number, String],
      default: 0
    },
    campaignAddress: {
      type: String,
      default: null
    },
    timestamp: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    timestampPretty () {
      return this.$dayjs(this.timestamp).format('YYYY/MM/DD hh:mm A')
    }
  }
}
</script>
