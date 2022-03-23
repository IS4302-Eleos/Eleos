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
                <a :href="organisationUrl" target="_blank">{{ organisationUrl }}</a>
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
              <b-field v-if="!isCampaignOwnerOrBeneficiary" grouped>
                <b-numberinput v-model="newDonationAmount" controls-position="compact" :min="0" :step="0.01" />
                <p class="control">
                  <b-button class="button is-success" @click="submitDonation">
                    Donate
                  </b-button>
                </p>
              </b-field>
              <b-field v-else grouped>
                <b-input placeholder="Withdraw ETH..." type="search" />
                <p class="control">
                  <b-button class="button is-success" @click="submitWithdrawal">
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
                  <NuxtLink :to="`/user/${donor}`">
                    {{ donor }}
                  </NuxtLink>
                  donated {{ donationAmount }} ETH!
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
import { mapState, mapActions } from 'vuex'
import Web3 from 'web3'

export default {
  name: 'InfoPage',
  middleware: 'validCampaign',
  data () {
    return {
      campaignInstance: null,
      // Information from backend
      campaignAddress: '',
      campaignName: null,
      endTimestamp: null,
      organisationUrl: null,
      beneficiaryAddress: null,
      campaignOwnerAddress: null,
      targetDonationAmount: null,
      campaignDescription: null,
      // Information from blockchain
      noOfDonors: 0,
      totalDonationAmount: 0,
      availableDonationAmount: 0,
      sampleDonationRecords: {},
      withdrawRecords: {},
      // Information on page
      newDonationAmount: 0
    }
  },
  computed: {
    ...mapState([
      'account'
    ]),
    ...mapState('api', [
      'campaigns'
    ]),
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
      return this.account === this.campaignOwnerAddress || this.account === this.beneficiaryAddress
    }
  },
  async mounted () {
    this.campaignAddress = this.$route.params.campaignAddress
    this.campaignInstance = await this.getCampaignInstance(this.campaignAddress)

    // Retrieve campaigns if not already in api store's state
    // To be replaced with graphql api call to get single campaign if possible
    if (Object.entries(this.campaigns).length === 0 || !(this.campaignAddress in this.campaigns)) {
      await this.getCampaigns()
    }

    // Update campaign info in state
    this.setFixedCampaignDetails()
    this.loadBlockchainCampaignDetails()
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
      'getCampaignInstance',
      'donate'
    ]),
    async submitDonation () {
      if (this.newDonationAmount === 0) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Please donate at least 0.01 ETH',
          type: 'is-warning'
        })
        return
      }

      try {
        // Submit donation
        await this.donate({
          campaignInstance: this.campaignInstance,
          amountInEth: this.newDonationAmount
        })

        // Update donation records
        this.loadBlockchainCampaignDetails()

        this.$buefy.toast.open({
          duration: 5000,
          message: 'Donation successful!',
          type: 'is-success'
        })
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to donate. Please try again later.',
          type: 'is-danger'
        })
      }
    },
    submitWithdrawal () {
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
    },
    async loadBlockchainCampaignDetails () {
      // Retrieve information from campaign on the blockchain
      const results = await Promise.all(
        [
          this.getCampaignDonationRecords(this.campaignInstance),
          this.getCampaignTotalDonations(this.campaignInstance),
          this.getCampaignWithdrawRecords(this.campaignInstance)
        ]
      )
      this.setDonationRecords(results[0])
      this.totalDonationAmount = results[1]
      this.setWithdrawRecords(results[2])
    },
    setFixedCampaignDetails () {
      // Update campaign info in state
      const campaign = this.campaigns[this.campaignAddress]
      this.campaignName = campaign.campaignName
      this.endTimestamp = campaign.endTimestamp.getTime()
      this.organisationUrl = campaign.organisationUrl
      this.beneficiaryAddress = campaign.beneficiaryAddress
      this.campaignOwnerAddress = campaign.campaignOwnerAddress
      this.targetDonationAmount = campaign.targetDonationAmount
      this.campaignDescription = campaign.campaignDescription
    }
  }
}
</script>
