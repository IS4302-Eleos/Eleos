<template>
  <nuxt-link :to="id ? { name: 'campaign-campaignAddress-info', params: { campaignAddress: id } } : '/'">
    <div class="box">
      <h4 class="title is-4 mb-2">
        <template v-if="title != null">
          {{ title }}
        </template>
        <b-skeleton :active="title == null" />
      </h4>
      <campaign-card-donation v-if="isConnected" :id="id" :target-amount="targetAmount" />
      <b-skeleton :active="!isConnected" />
      <b-skeleton :active="!isConnected" size="is-small" />
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
import { mapState } from 'vuex'

import CampaignCardDonation from '~/components/CampaignCardDonation'

export default {
  name: 'CampaignCard',
  components: {
    CampaignCardDonation
  },
  props: {
    id: {
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
    ...mapState([
      'isConnected'
    ]),
    endDatePretty () {
      return this.$dayjs(this.endDate).format('YYYY/MM/DD')
    }
  }
}
</script>
