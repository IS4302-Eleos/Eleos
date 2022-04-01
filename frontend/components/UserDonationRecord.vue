<template>
  <div class="block">
    <span>Donated <strong>{{ amount }}</strong> ETH</span>
    <b-icon
      icon="chevron-triple-right"
      style="vertical-align: sub"
    />
    <ethereum-address
      prefix="Campaign"
      :address="campaignAddress"
      type="campaign"
      address-type="is-light is-success"
      class="is-inline-flex"
      size="is-medium"
    />
    <hr class="my-0">
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
    }
  }
}
</script>
