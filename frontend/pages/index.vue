<template>
  <div>
    <section class="hero is-success is-large">
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
      <div class="columns is-multiline">
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
    </section>
    <section class="section container">
      <h3 class="title is-3">
        Past Campaigns
      </h3>
      <div class="columns is-multiline">
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
    </section>
    <eleos-footer />
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
  computed: {
    dateNow () {
      return new Date()
    }
  },
  async mounted () {
    // Get all campaigns
    const campaigns = await this.getCampaigns()

    // Filter active and past campaigns
    campaigns.forEach((campaign) => {
      if (campaign.endTimestamp > this.dateNow) {
        this.activeCampaigns.push(campaign)
      } else {
        this.pastCampaigns.push(campaign)
      }
    })
  },
  methods: {
    ...mapActions('api', [
      'getCampaigns'
    ])
  }
}

</script>
