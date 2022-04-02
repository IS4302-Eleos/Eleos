<template>
  <div class="level">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">
          Reputation
        </p>
        <p class="title">
          <template v-if="reputation > -1">
            {{ reputation }}
          </template>
          <b-skeleton :active="reputation < 0" size="is-large" />
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">
          No. of Donations Made
        </p>
        <p class="title">
          <template v-if="noOfDonations > -1">
            {{ noOfDonations }}
          </template>
          <b-skeleton :active="noOfDonations < 0" size="is-large" />
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">
          Wallet Amt
        </p>
        <p class="title">
          <template v-if="walletAmount > -1">
            {{ walletAmount }}
          </template>
          <b-skeleton :active="walletAmount < 0" size="is-large" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserStats',
  props: {
    noOfDonations: {
      type: Number,
      default: 0
    },
    reputation: {
      type: String,
      default: '0'
    },
    walletAmount: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>
