<template>
  <section class="section container">
    <div class="mb-6">
      <h1 class="title is-1">
        Start a Campaign
      </h1>
      <h4 class="subtitle">
        Please key in some neccessary information on your campaign.
      </h4>
    </div>
    <article v-if="!isCorrectChain" class="message is-danger">
      <div class="message-header">
        <p>Incorrect chain network detected!</p>
      </div>
      <div class="message-body">
        Please ensure that the chain network you have selected in your provider matches the chain used for Eleos.
      </div>
    </article>
    <b-steps
      v-model="activeStep"
      :has-navigation="false"
      mobile-mode="minimalist"
    >
      <b-step-item step="0" label="Select Wallet" :clickable="false">
        <h1 class="title has-text-centered">
          Select Wallet
        </h1>
        <h1 class="subtitle is-6 has-text-centered">
          Choose who will be receiving the money during the campaign.
        </h1>
        <div class="columns my-5">
          <div class="column is-half">
            <h4 class="title is-4">
              Use Your Wallet Address in Provider
            </h4>
            <b-field label="Wallet Address">
              <b-select v-model="selectedWalletAddress" placeholder="Select a wallet" expanded>
                <option
                  v-for="option in walletAddresses"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </b-select>
            </b-field>
            <b-button type="is-success" @click="moveToBasicInfo(selectedWalletAddress)">
              Continue
            </b-button>
          </div>
          <div class="column is-half">
            <h4 class="title is-4">
              Use External Wallet Address
            </h4>
            <b-field label="External Wallet Address">
              <b-input v-model="externalAddress" validation-message="Please check your wallet address!" pattern="0x[0-9a-fA-F]{40}" />
            </b-field>
            <b-button type="is-success" @click="moveToBasicInfo(externalAddress)">
              Continue
            </b-button>
          </div>
        </div>
        <hr>
        <div>
          <h4 class="title is-4">
            Import Existing Campaign
          </h4>
          <h4 class="subtitle is-6">
            If you have an existing campaign contract, you may import it directly without keying in the details above.
          </h4>
          <b-field label="External Campaign Address">
            <b-input disabled />
          </b-field>
          <b-button type="is-success" disabled>
            Continue
          </b-button>
        </div>
      </b-step-item>
      <b-step-item step="1" label="Basic Info" :clickable="false">
        <div>
          <h1 class="title has-text-centered">
            Basic Information
          </h1>
          <h1 class="subtitle is-6 has-text-centered">
            Let everyone know what you are trying to raise funds for.
          </h1>
        </div>
        <div class="block my-5">
          <h6 class="title is-5">
            Required Details
          </h6>
          <b-field label="Campaign Name" horizontal>
            <b-input v-model="campaignName" placeholder="Fund research on reducing micoplastics in our oceans!" />
          </b-field>
          <b-field label="Beneficiary Address" horizontal>
            <b-input disabled :value="beneficiaryAddress" />
          </b-field>
          <b-field label="Beneficiary URL" horizontal>
            <b-input v-model="beneficiaryURL" type="url" placeholder="https://example.com" />
          </b-field>
          <b-field label="Description" horizontal>
            <b-input v-model="campaignDescription" type="textarea" />
          </b-field>
          <hr>
          <h6 class="title is-5">
            Optional Details
          </h6>
          <b-field label="Target Amount" horizontal grouped>
            <b-input v-model="targetAmount" type="number" step="any" min="0" />
            <p class="control">
              <span class="button is-static">ETH</span>
            </p>
          </b-field>
          <b-field label="End Date" horizontal>
            <b-datepicker
              v-model="endDate"
              placeholder="Click to select..."
              :min-date="new Date()"
            >
              <b-button
                label="Clear"
                type="is-danger"
                icon-left="close"
                outlined
                @click="endDate = null"
              />
            </b-datepicker>
          </b-field>
        </div>
        <b-button @click="moveBack">
          Back
        </b-button>
        <b-button type="is-success" :disabled="!isValidated" @click="moveToReview">
          Next
        </b-button>
      </b-step-item>

      <b-step-item step="2" label="Review &amp; Deploy" :clickable="false">
        <div>
          <h1 class="title has-text-centered">
            Review &amp; Deploy
          </h1>
          <h1 class="subtitle is-6 has-text-centered">
            Check your new campaign details carefully.
          </h1>
        </div>
        <article class="message is-warning my-5">
          <div class="message-header">
            <p>
              Please check your <strong>Beneficiary Address</strong> carefully!
            </p>
          </div>
          <div class="message-body">
            After the contract is deployed, the address will not be editable and there will <strong>no refunds</strong> for any funds sent to the wrong address.
          </div>
        </article>
        <div class="box">
          <h1 class="subtitle is-5">
            Beneficiary Address: <strong class="has-text-danger">{{ beneficiaryAddress }}</strong>
          </h1>
          <hr>
          <h1 class="title">
            Campaign: {{ campaignName }}
          </h1>
          <h1 class="subtitle is-6">
            <a :href="beneficiaryURL" target="_blank">{{ beneficiaryURL }}</a>
            <div class="columns my-0">
              <div class="column is-half">
                <strong>End Date</strong>: {{ endDatePretty }}
              </div>
              <div class="column is-half">
                <strong>Target Amount</strong>: {{ targetAmount }} ETH
              </div>
            </div>
          </h1>
          <p>
            {{ campaignDescription }}
          </p>
        </div>
        <b-button :disabled="isLoading" @click="moveBack">
          Back
        </b-button>
        <b-button type="is-success" :disabled="!isValidated || isLoading || !isCorrectChain" :loading="isLoading" @click="deploy">
          Deploy
        </b-button>
      </b-step-item>

      <b-step-item step="3" label="Finish" :clickable="false">
        <div>
          <h1 class="title has-text-centered">
            Contract Deployed!
          </h1>
          <h1 class="subtitle is-6 has-text-centered">
            Your contract has been successfully deployed.
          </h1>
        </div>
        <div class="has-text-centered my-6">
          <b-button type="is-primary" tag="NuxtLink" :to="campaignPath">
            Go to Campaign
          </b-button>
        </div>
      </b-step-item>
    </b-steps>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AddPage',
  beforeRouteLeave (to, from, next) {
    if (this.activeStep === 3) {
      next()
      return
    }
    const answer = window.confirm('Are you sure you want to leave? You have unsaved changed in this page.')
    if (answer) {
      next()
    } else {
      next(false)
    }
  },
  async middleware ({ store, redirect }) {
    if (!await store.dispatch('checkHasProvider') || !store.state.isConnected) {
      redirect('/')
    }
  },
  data () {
    return {
      isValidChain: true,
      walletAddresses: [],
      selectedWalletAddress: '',
      externalAddress: '',
      beneficiaryAddress: '',
      activeStep: 0,
      campaignName: '',
      campaignDescription: '',
      beneficiaryURL: '',
      targetAmount: 0,
      endDate: null,
      isLoading: false,
      isCompleted: false,
      campaignPath: ''
    }
  },
  computed: {
    ...mapState([
      'isCorrectChain'
    ]),
    isValidated () {
      if (this.beneficiaryAddress === null || this.beneficiaryAddress.length === 0) {
        return false
      } else if (this.campaignName === null || this.campaignName.length === 0) {
        return false
      } else if (this.campaignDescription === null || this.campaignDescription.length === 0) {
        return false
      } else if (this.beneficiaryURL === null || this.beneficiaryURL.length === 0 || !this.isValidURL(this.beneficiaryURL)) {
        return false
      } else if (this.targetAmount < 0) {
        return false
      } else if (this.endDate !== null && this.$dayjs().isAfter(this.$dayjs(this.endDate))) {
        return false
      }
      return true
    },
    endDatePretty () {
      if (this.endDate === null) {
        return 'None'
      }
      return this.$dayjs(this.endDate).format('YYYY/MM/DD')
    }
  },
  async mounted () {
    this.walletAddresses = await this.$store.dispatch('safelyRequestAccounts')
    this.selectedWalletAddress = this.walletAddresses[0]
  },
  methods: {
    isValidURL (val) {
      let url

      try {
        url = new URL(val)
      } catch (_) {
        return false
      }

      return url.protocol === 'http:' || url.protocol === 'https:'
    },
    moveToBasicInfo (beneficiaryAddress) {
      if (beneficiaryAddress.match(/0x[0-9a-zA-Z]{40}/g)) {
        this.beneficiaryAddress = beneficiaryAddress
        this.activeStep = 1
      }
    },
    moveBack () {
      this.activeStep = Math.max(this.activeStep - 1, 0)
    },
    moveToReview () {
      if (this.isValidated) {
        this.activeStep = 2
      }
    },
    async deploy () {
      this.isLoading = true
      // Need the parameters from the fields, called by this.VALUE
      // Only field we don't need is the description in the campaign.sol
      const campaignDetails = {
        campaignName: this.campaignName,
        beneficiaryUrl: this.beneficiaryURL,
        endDate: this.endDate,
        beneficiaryAddress: this.beneficiaryAddress,
        campaignOwnerAddress: this.selectedWalletAddress, // Perhaps to be removed if we using the sender address
        targetAmount: this.targetAmount,
        campaignDescription: this.campaignDescription
      }

      try {
        // Check if the user is using the correct chain and prompt to switch.
        // await this.$store.dispatch('_switchChains')
        const newCampaignAddress = await this.$store.dispatch(
          'contract/campaignFactory/callToCampaignFactory',
          campaignDetails
        )
        this.campaignPath = '/campaign/' + newCampaignAddress + '/info'
        this.isLoading = false
        this.activeStep = 3
        this.isCompleted = true
      } catch (err) {
        this.isLoading = false
        console.error(err)
      }
    }
  }
}
</script>
