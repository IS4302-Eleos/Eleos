<template>
  <div class="media">
    <div class="media-left">
      Added as beneficiary to Campaign at
      <NuxtLink :to="`/campaign/${campaignAddress}/info`">
        {{ campaignAddress }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserBeneficiaryRecords',
  props: {
    campaignAddress: {
      type: String,
      default: null
    }
  }
}
</script>
