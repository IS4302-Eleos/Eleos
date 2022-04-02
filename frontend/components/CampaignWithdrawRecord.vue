<template>
  <div class="block">
    <div class="columns is-mobile mb-0">
      <div class="column">
        <p>
          <ethereum-address :address="withdrawerAddress" address-type="is-primary is-light" show-reputation class="mb-0 is-inline-flex" />
          <b-icon
            icon="chevron-triple-right"
            style="vertical-align: sub"
          />
          <ethereum-address :address="beneficiaryAddress" address-type="is-primary is-light" show-reputation class="mb-0 is-inline-flex" />
        </p>
        <p class="subtitle has-text-grey is-size-7">
          Withdrawn on: {{ timestampPretty }}
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
  name: 'CampaigWithdrawRecord',
  props: {
    withdrawerAddress: {
      type: String,
      default: null,
      required: true
    },
    beneficiaryAddress: {
      type: String,
      default: null,
      required: true
    },
    amount: {
      type: String,
      default: null,
      required: true
    },
    timestamp: {
      type: String,
      default: null
    }
  },
  computed: {
    timestampPretty () {
      return this.$dayjs(this.timestamp).format('YYYY/MM/DD hh:mm A')
    }
  }
}
</script>
