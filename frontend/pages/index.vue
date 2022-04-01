<template>
  <div>
    <section class="hero is-warning is-large">
      <div class="hero-head">
        <eleos-navbar />
      </div>

      <div class="hero-body">
        <div class="has-text-centered">
          <p class="title">
            Welcome to Eleos
          </p>
          <p class="subtitle">
            The decentralized charity fundraiser platform
          </p>
        </div>
      </div>
    </section>
    <section class="section container">
      <h3 class="title is-3">
        Active Campaigns
      </h3>
      <div v-if="activeCampaigns.length" class="columns is-multiline">
        <campaign-card
          v-for="campaign in activeCampaigns"
          :key="campaign.campaignAddress"
          class="column is-one-third"
          :address="campaign.campaignAddress"
          :title="campaign.campaignName"
          :target-amount="campaign.targetDonationAmount"
          :end-date="campaign.endTimestamp"
        />
      </div>
      <div v-else class="block has-text-grey">
        No active campaigns found!
      </div>
    </section>
    <section class="section container">
      <h3 class="title is-3">
        Past Campaigns
      </h3>
      <div v-if="pastCampaigns.length" class="columns is-multiline">
        <campaign-card
          v-for="campaign in pastCampaigns"
          :key="campaign.campaignAddress"
          class="column is-one-third"
          :address="campaign.campaignAddress"
          :title="campaign.campaignName"
          :target-amount="campaign.targetDonationAmount"
          :end-date="campaign.endTimestamp"
        />
      </div>
      <div v-else class="block has-text-grey">
        No past campaigns found!
      </div>
    </section>
    <eleos-footer class="mt-6" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import EleosNavbar from '~/components/Navbar'
import CampaignCard from '~/components/CampaignCard'
import EleosFooter from '~/components/Footer'

export default {
  name: 'IndexPage',
  components: {
    EleosNavbar,
    EleosFooter,
    CampaignCard
  },
  layout: 'empty',
  data () {
    return {
      activeCampaigns: [],
      pastCampaigns: []
    }
  },
  async mounted () {
    // Get all campaigns
    try {
      const campaigns = await this.getCampaigns()
      // Filter active and past campaigns
      campaigns.forEach((campaign) => {
        if (!this.$dayjs().isAfter(this.$dayjs(campaign.endTimestamp), 'day')) {
          this.activeCampaigns.push(campaign)
        } else {
          this.pastCampaigns.push(campaign)
        }
      })
    } catch (err) {

    }
  },
  methods: {
    ...mapActions('api', [
      'getCampaigns'
    ])
  }
}

</script>
