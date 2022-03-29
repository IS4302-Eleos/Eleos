<template>
  <div class="level">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">
          Reputation
        </p>
        <p class="title">
          {{ reputation }}
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">
          No. of Donations Made
        </p>
        <p class="title">
          {{ noOfDonations }}
        </p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">
          Wallet Amt
        </p>
        <p class="title">
          {{ walletAmount }}
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
      type: Number,
      default: 0
    },
    walletAmount: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>
