<template>
  <section class="section container">
    <div class="container">
      <div class="card">
        <div class="card-image">
          <figure class="image is-16by9">
            <img src="https://bulma.io/images/placeholders/640x360.png" alt="Placeholder image">
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">
                {{ campaignName }}
              </p>
              <p class="subtitle is-6">
                {{ $route.params.campaignAddress }} </br>
                <a :href=organisationUrl target="_blank">Organisation Site</a>
              </p>
              <p class="subtitle is-6">
                Started by:
                <NuxtLink :to="`/user/${campaignOwnerAddress}`">
                  {{ campaignOwnerAddress }}
                </NuxtLink>
                </br>
                Beneficiary:
                <NuxtLink :to="`/user/${beneficiaryAddress}`">
                  {{ beneficiaryAddress }}
                </NuxtLink>
              </p>
              <p>
                {{ campaignDescription }}
              </p>
            </div>
            <div class="media-content">
              <b-field v-if=!isCampaignOwnerOrBeneficiary>
                <b-input placeholder="Donate ETH..." type="search"></b-input>
                <p class="control">
                  <b-button class="button is-success" @click="donate">Donate</b-button>
                </p>
              </b-field>
              <b-field v-else>
                <b-input placeholder="Withdraw ETH..." type="search"></b-input>
                <p class="control">
                  <b-button class="button is-success" @click="withdraw">Withdraw</b-button>
                </p>
              </b-field>
              <!--
              <b-button type="is-success" to="/" tag="NuxtLink" class="level-item">
                Back to home!
              </b-button>
              -->
            </div>
          </div>
          <hr>
          <div v-if="!isCampaignOwnerOrBeneficiary">
            <b-progress
              v-if="donationProgress < 100"
              type="is-primary"
              :value=donationProgress
              show-value
              format="percent"
              >
              {{ donationProgress }}% of {{ targetDonationAmount }} ETH
            </b-progress>
            <b-progress
              type="is-success"
              v-else
              value=100
              show-value
              format="percent"
              >
              Target Achieved
            </b-progress>
          </br>
          </div>
          <div class="media">
            <div class="media-content">
              <div class="level">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">No. of Donors</p>
                    <p class="title"> {{ noOfDonors }}</p>
                  </div>
                </div>
                <div v-if="isCampaignOwnerOrBeneficiary" class="level-item has-text-centered">
                  <div>
                    <p class="heading">Available Donations Amt</p>
                    <p class="title">{{ availableDonationAmount }} ETH</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Total Donations Amt</p>
                    <p class="title">{{ totalDonationAmount }} ETH</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Target Donations Amt</p>
                    <p class="title">{{ targetDonationAmount }} ETH</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Days Left</p>
                    <p class="title">{{ daysLeft  }} Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-tabs position="is-centered" class="block">
            <b-tab-item label="Donations">
              <div class="media" v-for="(donationAmount, donor) in sampleDonationRecords" :key="donor">
                <div class="media-left">
                  {{ donor }} donated {{ donationAmount }} ETH!
                </div>
              </div>
            </b-tab-item>

            <b-tab-item label="Withdraws">
              Withdraw Records here...
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InfoPage',
  data () {
    return {
      title: 'CampaignInfoPage',
      campaignName: 'Save the Trees from Schools ',
      organisationUrl: 'http://thisisfine.com',
      endTimestamp: 1648606037,
      beneficiaryAddress: '0x607A4494dEA3F221328F44e03843BEb1493F4180',
      campaignOwnerAddress: '0xC4AbB558ca7Da88D115d27548fBAaCB566173aeB',
      targetDonationAmount: 10,
      campaignDescription: 'This is a sample campaign description. Lorem ipsum dolor sit amet, consectetur adipiscing elit Phasellus nec iaculis mauris.',
      noOfDonors: 0,
      totalDonationAmount: 0,
      availableDonationAmount: 0,
      donationProgress: 0,
      daysLeft: '',
      sampleDonationRecords: {},
      selectedAddress: '0xDEAD',
      isCampaignOwnerOrBeneficiary: false
    }
  },
  mounted () {
    this.setDaysLeft()
    this.setDonationRecords()
    this.setNoOfDonors()
    this.setTotalDonationAmount()
    this.setAvailableDonationAmount()
    this.isCampaignOwnerOrBeneficiary = this.selectedAddress === this.campaignOwnerAddress || this.selectedAddress === this.beneficiaryAddress
    this.donationProgress = (this.totalDonationAmount / this.targetDonationAmount) * 100
    // Currently assuming all other parameters not set here are from backend db
  },
  methods: {
    donate () {
      console.log('donate!')
    },
    withdraw () {
      console.log('withdraw!')
    },
    setDaysLeft () {
      const endDateInMs = (new Date(this.endTimestamp)).getTime() * 1000
      const diff = endDateInMs - Date.now()
      this.daysLeft = Math.round(diff / (1000 * 3600 * 24))
    },
    setNoOfDonors () {
      // Gets the list of donations
      this.noOfDonors = Object.keys(this.sampleDonationRecords).length
    },
    setDonationRecords () {
      // Replace with logic to get donation records from Blockchain
      this.sampleDonationRecords = {
        '0xabdc': 2,
        '0xdead': 1,
        '0x5050': 3
      }
    },
    setTotalDonationAmount () {
      // Replace with logic to get total donation amount from blockchain
      this.totalDonationAmount = 6
    },
    setAvailableDonationAmount () {
      // Replace with logic to get available donation amount
      // I realise we also need the withdraw records... Need to modify campaign.sol next.
      this.availableDonationAmount = 3
    }
  }
}
</script>
