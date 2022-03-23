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
                <template v-if="campaignName">
                  {{ campaignName }}
                </template>
                <b-skeleton :active="!campaignName" size="is-large" />
              </p>
              <div class="subtitle is-6">
                <p>{{ campaignAddress }}</p>
                <p><a :href="organisationUrl" target="_blank">Organisation Site</a></p>
              </div>
              <div class="subtitle is-6">
                <p>
                  <template v-if="campaignOwnerAddress">
                    Started by:
                    <NuxtLink :to="`/user/${campaignOwnerAddress}`">
                      {{ campaignOwnerAddress }}
                    </NuxtLink>
                  </template>
                  <b-skeleton :active="!campaignOwnerAddress" width="50%" />
                </p>
                <p>
                  <template v-if="beneficiaryAddress">
                    Beneficiary:
                    <NuxtLink :to="`/user/${beneficiaryAddress}`">
                      {{ beneficiaryAddress }}
                    </NuxtLink>
                  </template>
                  <b-skeleton :active="!beneficiaryAddress" width="50%" />
                </p>
              </div>
              <p>
                <template v-if="campaignDescription">
                  {{ campaignDescription }}
                </template>
                <b-skeleton :active="!campaignDescription" :count="3" />
              </p>
            </div>
            <div class="media-right">
              <b-field v-if="!isCampaignOwnerOrBeneficiary">
                <b-input placeholder="Donate ETH..." type="search" />
                <p class="control">
                  <b-button class="button is-success" @click="donate">
                    Donate
                  </b-button>
                </p>
              </b-field>
              <b-field v-else>
                <b-input placeholder="Withdraw ETH..." type="search" />
                <p class="control">
                  <b-button class="button is-success" @click="withdraw">
                    Withdraw
                  </b-button>
                </p>
              </b-field>
            </div>
          </div>
          <hr>
          <div v-if="!isCampaignOwnerOrBeneficiary" class="mb-6">
            <b-progress
              v-if="donationProgress < 100"
              type="is-primary"
              :value="donationProgress"
              show-value
              format="percent"
              size="is-large"
            >
              {{ donationProgress }}% of {{ targetDonationAmount }} ETH
            </b-progress>
            <b-progress
              v-else
              type="is-success"
              :value="100"
              show-value
              format="percent"
              size="is-large"
            >
              Target Achieved
            </b-progress>
          </div>
          <div class="media">
            <div class="media-content">
              <div class="level">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">
                      No. of Donors
                    </p>
                    <p class="title">
                      <template v-if="noOfDonors !== null">
                        {{ noOfDonors }}
                      </template>
                      <b-skeleton :active="noOfDonors === null" size="is-large" />
                    </p>
                  </div>
                </div>
                <div v-if="isCampaignOwnerOrBeneficiary" class="level-item has-text-centered">
                  <div>
                    <p class="heading">
                      Available Donations Amt
                    </p>
                    <p class="title">
                      <template v-if="availableDonationAmount">
                        {{ availableDonationAmount }} ETH
                      </template>
                      <b-skeleton :active="!availableDonationAmount" size="is-large" />
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">
                      Total Donations Amt
                    </p>
                    <p class="title">
                      <template v-if="totalDonationAmount !== null">
                        {{ totalDonationAmount }} ETH
                      </template>
                      <b-skeleton :active="totalDonationAmount === null" size="is-large" />
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">
                      Target Donations Amt
                    </p>
                    <p class="title">
                      <template v-if="targetDonationAmount">
                        {{ targetDonationAmount }} ETH
                      </template>
                      <b-skeleton :active="!targetDonationAmount" size="is-large" />
                    </p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">
                      Time Left
                    </p>
                    <p class="title">
                      <template v-if="endTimestamp">
                        {{ timeLeft }}
                      </template>
                      <b-skeleton :active="!endTimestamp" size="is-large" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-tabs position="is-centered" class="block">
            <b-tab-item label="Donations">
              <div v-for="(donationAmount, donor) in sampleDonationRecords" :key="donor" class="media">
                <div class="media-left">
                  {{ donor }} donated {{ donationAmount }} ETH!
                </div>
              </div>
            </b-tab-item>

            <b-tab-item label="Withdraws">
              <div v-for="withdrawRecord, i in withdrawRecords" :key="i" class="media">
                <div class="media-left">
                  {{ withdrawRecord[0] }} started the withdraw. {{ withdrawRecord[1] }} ETH withdrawn to {{ beneficiaryAddress }}!
                </div>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import Web3 from 'web3'

export default {
  name: 'InfoPage',
  middleware: 'validCampaign',
  data () {
    return {
      campaignName: null,
      organisationUrl: null,
      endTimestamp: null,
      beneficiaryAddress: null,
      campaignOwnerAddress: null,
      targetDonationAmount: null,
      campaignDescription: null,
      noOfDonors: 0,
      totalDonationAmount: 0,
      availableDonationAmount: 0,
      sampleDonationRecords: {},
      withdrawRecords: {},
      selectedAddress: '0xDEAD', // 0xDEAD to test for normal users
      campaignAddress: ''
    }
  },
  computed: {
    timeLeft () {
      if (this.endTimestamp === 8640000000000000) {
        return 'Indefinite'
      }
      return this.$dayjs(this.endTimestamp).fromNow(true)
    },
    donationProgress () {
      if (this.totalDonationAmount >= this.targetDonationAmount) {
        return 100
      }
      return Math.min((this.totalDonationAmount / this.targetDonationAmount), 1) * 100
    },
    availableDonationsETH () {
      return Web3.utils.fromWei(this.availableDonationAmount, 'ether')
    },
    totalDonationsETH () {
      return Web3.utils.fromWei(this.totalDonationAmount, 'ether')
    },
    targetDonationsETH () {
      return Web3.utils.fromWei(this.targetDonationAmount, 'ether')
    },
    isCampaignOwnerOrBeneficiary () {
      return this.selectedAddress === this.campaignOwnerAddress || this.selectedAddress === this.beneficiaryAddress
    }
  },
  mounted () {
    this.campaignAddress = this.$route.params.campaignAddress
    this.loadCampaignDetails()
    this.setOtherCampaignDetails()
  },
  methods: {
    ...mapActions('api', [
      'getCampaigns'
    ]),
    ...mapActions('contract/campaign', [
      'getCampaignTargetAmount',
      'getCampaignTotalDonations',
      'getCampaignDonationRecords',
      'getCampaignWithdrawRecords',
      'getCampaignInstance'
    ]),
    donate () {
      console.log('donate!')
    },
    withdraw () {
      console.log('withdraw!')
    },
    setDonationRecords (donationRecords) {
      const donors = donationRecords[0]
      const donationAmounts = donationRecords[1]
      for (let i = 0; i < donors.length; i++) {
        this.sampleDonationRecords[donors[i]] = Web3.utils.fromWei(donationAmounts[i])
      }
      this.noOfDonors = donors.length
    },
    setWithdrawRecords (withdrawRecords) {
      const withdrawInstantiators = withdrawRecords[0]
      const withdrawAmounts = withdrawRecords[1]
      for (let i = 0; i < withdrawInstantiators.length; i++) {
        this.withdrawRecords[i] = [withdrawInstantiators[i], Web3.utils.fromWei(withdrawAmounts[i])]
      }
      console.log(this.withdrawRecords)
    },
    async loadCampaignDetails () {
      const campaignInstance = await this.getCampaignInstance(this.campaignAddress)
      const results = await Promise.all(
        [
          this.getCampaignDonationRecords(campaignInstance),
          this.getCampaignTotalDonations(campaignInstance),
          this.getCampaignTargetAmount(campaignInstance),
          this.getCampaignWithdrawRecords(campaignInstance)
        ]
      )
      this.setDonationRecords(results[0])
      this.totalDonationAmount = results[1]
      this.targetDonationAmount = results[2]
      this.setWithdrawRecords(results[3])
    },
    async setOtherCampaignDetails () {
      let campaignDetails
      // To be replaced with graphql api call to get single campaign if possible
      const campaigns = await this.getCampaigns()
      await campaigns.forEach((campaign) => {
        if (campaign.campaignAddress === this.campaignAddress) {
          campaignDetails = campaign
        }
      })
      this.campaignName = campaignDetails.campaignName
      this.campaignDescription = campaignDetails.campaignDescription
      this.beneficiaryAddress = campaignDetails.beneficiaryAddress
      this.campaignOwnerAddress = campaignDetails.campaignOwnerAddress
      this.endTimestamp = campaignDetails.endTimestamp.getTime()
      this.organisationUrl = campaignDetails.organisationUrl
      console.log(campaignDetails)
    }
  }
}
</script>
