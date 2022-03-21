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
                {{ campaignAddress }} </br>
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
            <div class="media-right">
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
import { mapActions } from 'vuex'

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
      targetDonationAmount: 0,
      campaignDescription: 'This is a sample campaign description. Lorem ipsum dolor sit amet, consectetur adipiscing elit Phasellus nec iaculis mauris.',
      noOfDonors: 0,
      totalDonationAmount: 0,
      availableDonationAmount: 0,
      donationProgress: 0,
      daysLeft: '',
      sampleDonationRecords: {},
      selectedAddress: '0xDEAD', // 0xDEAD to test for normal users
      isCampaignOwnerOrBeneficiary: false,
      weiPerEth: 1000000000000000000,
      campaignAddress: ''
    }
  },
  async mounted () {
    this.campaignAddress = this.$route.params.campaignAddress
    const campaignInstance = await this.getCampaignInstance(this.campaignAddress)
    const donationRecords = await this.getCampaignDonationRecords(campaignInstance)
    const totalDonationAmount = await this.getCampaignTotalDonations(campaignInstance)
    const targetDonationAmount = await this.getCampaignTargetAmount(campaignInstance)
    this.setTargetDonationAmount(targetDonationAmount)
    this.setDonationRecords(donationRecords)
    this.setTotalDonationAmount(totalDonationAmount)
    this.setAvailableDonationAmount()
    await this.setOtherCampaignDetails()
    this.isCampaignOwnerOrBeneficiary = this.selectedAddress === this.campaignOwnerAddress || this.selectedAddress === this.beneficiaryAddress
    this.donationProgress = (this.totalDonationAmount / this.targetDonationAmount) * 100
  },
  methods: {
    ...mapActions('api', [
      'getCampaigns'
    ]),
    ...mapActions('contract/campaign', [
      'getCampaignTargetAmount',
      'getCampaignTotalDonations',
      'getCampaignDonationRecords',
      'getCampaignInstance'
    ]),
    donate () {
      console.log('donate!')
    },
    withdraw () {
      console.log('withdraw!')
    },
    convertToEth (value) {
      return value / this.weiPerEth
    },
    setDonationRecords (donationRecords) {
      const donors = donationRecords[0]
      const donationAmounts = donationRecords[1]
      for (let i = 0; i < donors.length; i++) {
        this.sampleDonationRecords[donors[i]] = this.convertToEth(donationAmounts[i])
      }
      this.noOfDonors = donors.length
    },
    setTargetDonationAmount (targetDonationAmount) {
      this.targetDonationAmount = this.convertToEth(targetDonationAmount)
    },
    setTotalDonationAmount (totalDonationAmount) {
      this.totalDonationAmount = this.convertToEth(totalDonationAmount)
    },
    setAvailableDonationAmount () {
      // Replace with logic to get available donation amount
      // I realise we also need the withdraw records... Need to modify campaign.sol next.
      this.availableDonationAmount = 3
    },
    async setOtherCampaignDetails () {
      let campaignDetails
      // To be replaced with graphql api call to get single campaign if possible
      const campaigns = await this.getCampaigns()
      await campaigns.forEach((campaign) => {
        if (campaign.campaignAddress === this.campaignAddress.toLowerCase()) {
          campaignDetails = campaign
        }
      })
      this.campaignDescription = campaignDetails.campaignDescription
      this.beneficiaryAddress = campaignDetails.beneficiaryAddress
      this.campaignOwnerAddress = campaignDetails.campaignOwnerAddress
      // Url doesn't seem to be in the graphql response
      // this.organisationUrl = campaignDetails.organisationUrl
      const endDateInMs = (new Date(campaignDetails.endTimestamp)).getTime() * 1000
      const diff = endDateInMs - Date.now()
      this.daysLeft = Math.round(diff / (1000 * 3600 * 24))
      console.log(campaignDetails)
    }
  }
}
</script>
