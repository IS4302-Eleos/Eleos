<template>
  <div>
    <section class="section container">
      <ethereum-address
        prefix="Contract Address"
        class="mb-0"
        :address="campaignAddress"
        address-type="is-success is-light"
        size="is-small"
        type="campaign"
      />
      <h1 class="title is-2">
        Editing: {{ campaignName }}
      </h1>
      <div class="block">
        <h1 class="title is-4">
          Description
        </h1>
        <eleos-markdown-editor v-model="campaignDescription" class="mb-5" :disabled="isLoading" editor-name="Editor" />
        <div>
          <b-button type="is-success" :disabled="isLoading || !hasContent" icon-left="content-save" class="mr-2" @click="saveDescription">
            Save / Update
          </b-button>
          <b-button :disabled="isLoading" tag="nuxt-link" icon-left="close" :to="`/campaign/${campaignAddress}`">
            Close
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import EleosMarkdownEditor from '~/components/MarkdownEditor'
import EthereumAddress from '~/components/EthereumAddress'

export default {
  name: 'EditPage',
  components: {
    EleosMarkdownEditor,
    EthereumAddress
  },
  middleware: 'validCampaign',
  async asyncData ({ store, route, redirect, $wallet }) {
    const campaignAddress = route.params.campaignAddress
    if (Object.entries(store.state.api.campaigns).length === 0 || !(campaignAddress in store.state.api.campaigns)) {
      await store.dispatch('api/getCampaigns')
    }

    if (!(campaignAddress in store.state.api.campaigns)) {
      return redirect('/')
    }
    const campaignDetails = store.state.api.campaigns[campaignAddress]

    if (!$wallet.provider || !store.getters['auth/isAuthenticated'] || $wallet.account !== campaignDetails.campaignOwnerAddress) {
      return redirect('/campaign/' + campaignAddress)
    }
    const campaignName = campaignDetails.campaignName
    const campaignDescription = campaignDetails.campaignDescription
    return {
      campaignAddress,
      campaignName,
      campaignDescription
    }
  },
  data () {
    return {
      title: 'Sample Edit Page',
      isLoading: false
    }
  },
  computed: {
    hasContent () {
      return this.campaignDescription && this.campaignDescription.trim()
    }
  },
  methods: {
    async saveDescription () {
      if (!this.campaignAddress) {
        return
      }

      this.isLoading = true
      try {
        const res = await this.$store.dispatch('auth/saveDescription', {
          contractAddress: this.campaignAddress,
          description: this.campaignDescription
        })
        this.isLoading = false
        if (res) {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Description updated!',
            type: 'is-success'
          })
          await this.$store.dispatch('api/getCampaigns')
          this.$router.push('/campaign/' + this.campaignAddress)
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Unable to update description, please try again later.',
            type: 'is-danger'
          })
        }
      } catch (err) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to update description, please try again later.',
          type: 'is-danger'
        })
        this.isLoading = false
      }
    }
  }
}
</script>
