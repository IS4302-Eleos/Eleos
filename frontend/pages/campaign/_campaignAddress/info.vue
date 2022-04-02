<template>
  <section class="section container">
    <div class="container">
      <b-message v-if="hasError" type="is-danger" has-icon>
        <p>We are unable to get details of this Campaign. </p>
        <p>Please check if the address is a valid Campaign contract created by Eleos.</p>
      </b-message>
      <div class="card">
        <!-- <div class="card-image">
          <figure class="image is-16by9">
            <img src="https://bulma.io/images/placeholders/640x360.png" alt="Placeholder image">
          </figure>
        </div> -->
        <div class="card-content">
          <ethereum-address
            prefix="Contract Address"
            class="mb-0"
            :address="campaignAddress"
            address-type="is-success is-light"
            size="is-small"
            type="campaign"
          />
          <div class="columns">
            <div class="column is-two-thirds">
              <p class="title is-3">
                <template v-if="campaignName">
                  {{ campaignName }}
                </template>
                <b-skeleton :active="!campaignName" size="is-large" />
              </p>
              <div class="subtitle is-6">
                <a :href="organisationUrl" target="_blank">{{ organisationUrl }}</a>
              </div>
              <div class="subtitle is-6">
                <p class="my-1">
                  <template v-if="beneficiaryAddress">
                    <span class="has-text-weight-medium">Beneficiary:</span>
                    <ethereum-address
                      :address="beneficiaryAddress"
                      address-type="is-light"
                      show-reputation
                      class="is-inline-flex"
                      size="is-medium"
                    />
                  </template>
                  <b-skeleton :active="!beneficiaryAddress" width="50%" />
                </p>
              </div>
            </div>
            <div v-if="hasProvider" class="column is-one-third">
              <b-field v-if="!isBeneficiary" grouped :message="currentBalance">
                <b-numberinput
                  v-model="newDonationAmount"
                  controls-position="compact"
                  :min="0"
                  :step="0.01"
                  expanded
                />
                <p class="control">
                  <b-button class="button is-success" @click="submitDonation">
                    Donate
                  </b-button>
                </p>
              </b-field>
              <b-field v-if="isCampaignOwnerOrBeneficiary" grouped>
                <b-numberinput
                  v-model="newWithdrawalAmount"
                  controls-position="compact"
                  :min="0"
                  :max="withdrawalBalance"
                  :step="0.01"
                  expanded
                />
                <p class="control">
                  <b-button class="button is-success" @click="submitWithdrawal">
                    Withdraw
                  </b-button>
                </p>
              </b-field>
            </div>
          </div>
          <hr>
          <div class="mb-6">
            <template v-if="totalDonationAmount">
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
            </template>
            <b-skeleton :active="!hasProvider" size="is-large" />
          </div>
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
                  Withdrawal Balance
                </p>
                <p class="title">
                  <template v-if="withdrawalBalance">
                    {{ withdrawalBalance }} ETH
                  </template>
                  <b-skeleton :active="!withdrawalBalance" size="is-large" />
                </p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">
                  Total Amount
                </p>
                <p class="title">
                  <template v-if="totalDonationAmount !== null">
                    {{ totalDonationAmount }} ETH
                  </template>
                  <b-skeleton :active="totalDonationAmount === null" size="is-large" />
                </p>
              </div>
            </div>
            <div v-if="targetDonationAmount === null || targetDonationAmount" class="level-item has-text-centered">
              <div>
                <p class="heading">
                  Target Amount
                </p>
                <p class="title">
                  <template v-if="targetDonationAmount !== null">
                    <span>{{ targetDonationAmount }} ETH</span>
                  </template>
                  <b-skeleton :active="targetDonationAmount === null" size="is-large" />
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
          <b-tabs position="is-centered" class="block">
            <b-tab-item label="Description">
              <p class="block">
                <template v-if="campaignOwnerAddress">
                  <span class="has-text-weight-medium">Started By:</span> <ethereum-address :address="campaignOwnerAddress" address-type="is-light" show-reputation class="is-inline-flex" size="is-small" />
                </template>
                <b-skeleton :active="!campaignOwnerAddress" width="50%" />
              </p>
              <p class="block">
                <template v-if="campaignDescription">
                  {{ campaignDescription }}
                </template>
                <b-skeleton :active="!campaignDescription" :count="3" />
              </p>
            </b-tab-item>
            <b-tab-item label="Donations">
              <h5 class="title is-5">
                List of Donations
              </h5>
              <div v-if="donationRecords.length">
                <div v-for="donation in donationRecords" :key="donation.transactionHash">
                  <campaign-donation-record :address="donation.donorAddress" :amount="donation.amount" :timestamp="donation.timestamp" />
                </div>
              </div>
              <div v-else>
                No donations to this campaign yet...
              </div>
            </b-tab-item>

            <b-tab-item label="Withdraws">
              <h5 class="title is-5">
                List of Withdrawals
              </h5>
              <div v-if="Object.keys(withdrawRecords).length">
                <div v-for="withdrawRecord, i in withdrawRecords" :key="i">
                  <campaign-withdraw-record :withdrawer-address="withdrawRecord.withdrawerAddress" :beneficiary-address="beneficiaryAddress" :amount="withdrawRecord.amount" :timestamp="withdrawRecord.timestamp" />
                </div>
              </div>
              <div v-else>
                No withdraws initiated yet...
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
import { ethers } from 'ethers'
import EthereumAddress from '~/components/EthereumAddress'
import CampaignDonationRecord from '~/components/CampaignDonationRecord.vue'

export default {
  name: 'InfoPage',
  components: {
    EthereumAddress,
    CampaignDonationRecord
  },
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
      totalDonationAmount: null,
      withdrawalBalance: null,
      donationRecords: [],
      withdrawRecords: [],
      // Information on page
      newDonationAmount: 0,
      newWithdrawalAmount: 0,
      hasError: false
    }
  },
  computed: {
    ...mapState('api', [
      'campaigns'
    ]),
    hasProvider () {
      return this.$wallet.provider
    },
    timeLeft () {
      if (this.endTimestamp === 8640000000000000) {
        return 'Indefinite'
      } else if (this.$dayjs(this.endTimestamp).isBefore(this.$dayjs())) {
        return 'Ended'
      }
      return this.$dayjs(this.endTimestamp).fromNow(true)
    },
    donationProgress () {
      if (this.totalDonationAmount >= this.targetDonationAmount) {
        return 100
      }
      return Math.round(Math.min((this.totalDonationAmount / this.targetDonationAmount), 1) * 100)
    },
    isBeneficiary () {
      return this.$wallet.account === this.beneficiaryAddress
    },
    isCampaignOwnerOrBeneficiary () {
      return this.$wallet.account === this.campaignOwnerAddress || this.$wallet.account === this.beneficiaryAddress
    },
    currentBalance () {
      return this.$wallet.balance ? 'Balance: ' + this.$wallet.balance + ' ETH' : ''
    },
    noOfDonors () {
      return this.donationRecords === null ? null : this.donationRecords.map(x => x.donorAddress).filter((v, i, a) => a.indexOf(v) === i).length
    }
  },
  async mounted () {
    if (!this.hasProvider) {
      this.$buefy.toast.open({
        duration: 5000,
        message: 'You are not connected to the blockchain. Please connect to the blockchain and refresh the page.',
        type: 'is-warning'
      })
    }

    // Set campaign address from route
    this.campaignAddress = this.$route.params.campaignAddress

    try {
      // Retrieve campaigns if not already in api store's state
      // To be replaced with graphql api call to get single campaign if possible
      if (Object.entries(this.campaigns).length === 0 || !(this.campaignAddress in this.campaigns)) {
        await this.getCampaigns()
      }

      if (!(this.campaignAddress in this.campaigns)) {
        this.hasError = true
        return
      }

      // Update campaign info in state
      this.setFixedCampaignDetails()
      if (this.hasProvider && await this.$wallet.provider.ready) {
        this.campaignInstance = await this.getCampaignInstance(this.campaignAddress)
        this.loadBlockchainCampaignDetails()
      }
    } catch (err) {
      this.hasError = true
    }
  },
  methods: {
    ...mapActions('api', [
      'getCampaigns',
      'getDonationsByCampaign',
      'getWithdrawals'
    ]),
    ...mapActions('contract/campaign', [
      'getTargetAmount',
      'getTotalDonations',
      'getDonationRecords',
      'getWithdrawRecords',
      'getCampaignInstance',
      'getWithdrawalBalance',
      'donate',
      'withdraw'
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
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to donate. Please try again later.',
          type: 'is-danger'
        })
      }
    },
    async submitWithdrawal () {
      if (this.withdrawalBalance === 0) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'All donations have been withdrawn.',
          type: 'is-danger'
        })
        return
      }

      if (this.newWithdrawalAmount === 0) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Please withdraw at least 0.01 ETH',
          type: 'is-warning'
        })
        return
      }

      try {
        // Submit withdrawal
        await this.withdraw({
          campaignInstance: this.campaignInstance,
          amountInEth: this.newWithdrawalAmount
        })

        // Update withdrawal records
        this.loadBlockchainCampaignDetails()

        this.$buefy.toast.open({
          duration: 5000,
          message: 'Withdrawal successful!',
          type: 'is-success'
        })
      } catch (err) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to withdraw. Please try again later.',
          type: 'is-danger'
        })
      }
    },
    setDonationRecords (donationRecords) {
      donationRecords = donationRecords.map((m) => {
        m.amount = ethers.utils.formatEther(m.amount)
        return m
      })
      this.donationRecords = donationRecords
    },
    setWithdrawRecords (withdrawRecords) {
      withdrawRecords = withdrawRecords.map((m) => {
        m.amount = ethers.utils.formatEther(m.amount)
        return m
      })
      this.withdrawRecords = withdrawRecords
    },
    async loadBlockchainCampaignDetails () {
      // Retrieve information from campaign on the blockchain
      try {
        const results = await Promise.all(
          [
            this.getDonationsByCampaign(this.campaignAddress),
            this.getTotalDonations(this.campaignInstance),
            this.getWithdrawals(this.campaignAddress),
            this.getWithdrawalBalance(this.campaignInstance)
          ]
        )
        this.setDonationRecords(results[0])
        this.totalDonationAmount = results[1]
        this.setWithdrawRecords(results[2])
        this.withdrawalBalance = results[3]
      } catch (err) {
        this.hasError = true
      }
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
