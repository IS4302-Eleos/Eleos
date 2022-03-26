<template>
  <div class="media">
    <div class="media-left">
      Donated {{ amount }} ether to campaign
      <NuxtLink :to="`/campaign/${campaignAddress}/info`">
        {{ campaignAddress }}
      </NuxtLink>
    </div>
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
