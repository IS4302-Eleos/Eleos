<template>
  <div>
    <span>Added as a <strong> Beneficiary </strong> of </span>
    <ethereum-address
      prefix="Campaign"
      :address="campaignAddress"
      type="campaign"
      address-type="is-light is-success"
      class="is-inline-flex"
      size="is-medium"
    />
    <hr class="mt-0">
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
