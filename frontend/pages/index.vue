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
        <campaign-card class="column is-one-third" />
        <campaign-card id="a" class="column is-one-third" title="Help Ukraine Now" />
        <campaign-card class="column is-one-third" title="Red Cross For Ukraine" :current-amount="1" :target-amount="100" :end-date="new Date('2022/05/15')" />
        <campaign-card class="column is-one-third" title="SPCA" :current-amount="1" :target-amount="0" :end-date="new Date('2022/12/12')" />
        <campaign-card class="column is-one-third" title="Lions Home for The Elders" :current-amount="10" :target-amount="5" :end-date="new Date('2022/04/01')" />
      </div>
    </section>
    <section class="section container">
      <h3 class="title is-3">
        Past Campaigns
      </h3>
      <div class="columns is-multiline">
        <campaign-card class="column is-one-third" />
        <campaign-card class="column is-one-third" title="Lions Home for The Elders" :current-amount="2" :target-amount="5" :end-date="new Date('2022/01/01')" />
      </div>
    </section>
    <eleos-footer />
  </div>
</template>

<script>
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
    return {}
  },
  methods: {}
}

</script>
