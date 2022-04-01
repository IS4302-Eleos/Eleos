<template>
  <nuxt-link :to="address ? { name: 'campaign-campaignAddress-info', params: { campaignAddress: address } } : '/'">
    <div class="box">
      <h4 class="title is-4 mb-2">
        <template v-if="title != null">
          {{ title }}
        </template>
        <b-skeleton :active="title == null" />
      </h4>
      <campaign-card-donation :address="address" :target-amount="targetAmount" />
      <p>
        <template v-if="endDate != null ">
          <span v-if="Date.parse(endDate) !== 8640000000000000">{{ endDate > dateNow ? 'Ending' : 'Ended' }} on: {{ endDatePretty }}</span>
          <span v-else>Ongoing Campaign</span>
        </template>
        <b-skeleton :active="endDate == null" />
      </p>
    </div>
  </nuxt-link>
</template>

<script>
import CampaignCardDonation from '~/components/CampaignCardDonation'

export default {
  name: 'CampaignCard',
  components: {
    CampaignCardDonation
  },
  props: {
    address: {
      type: String,
      default: null,
      required: true
    },
    title: {
      type: String,
      default: null,
      required: true
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
  computed: {
    dateNow () {
      return new Date()
    },
    endDatePretty () {
      return this.$dayjs(this.endDate).format('YYYY/MM/DD')
    }
  }
}
</script>
