<template>
  <div>
    <section class="section container">
      <div class="container">
        <div class="card">
          <user-header :address="$route.params.userAddress" />
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <user-stats
                  :no-of-donations="donations.length"
                  :wallet-amount="walletAmount"
                />
              </div>
            </div>
            <b-tabs position="is-centered" class="block">
              <b-tab-item label="Donation Records">
                <div v-if="donations.length">
                  <user-donation-record
                    v-for="donation in donations"
                    :key="donation.transactionHash"
                    :campaign-address="donation.campaignAddress"
                    :amount="donation.amount"
                  />
                </div>
                <div v-else>
                  No donations made...
                </div>
              </b-tab-item>
              <b-tab-item label="Benefitted Campaigns">
                <div v-if="beneficiary.length">
                  <user-beneficiary-record
                    v-for="b in beneficiary"
                    :key="b.campaignAddress"
                    :campaign-address="b.campaignAddress"
                  />
                </div>
                <div v-else>
                  Not beneficiary of any campaigns...
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import UserHeader from '~/components/UserHeader'
import UserStats from '~/components/UserStats'
import UserDonationRecord from '~/components/UserDonationRecord'
import UserBeneficiaryRecord from '~/components/UserBeneficiaryRecord'

export default {
  name: 'UserPage',
  components: {
    UserHeader,
    UserStats,
    UserDonationRecord,
    UserBeneficiaryRecord
  },
  async asyncData ({ store, route, redirect }) {
    const userAddress = route.params.userAddress
    if (!userAddress || !ethers.utils.isAddress(userAddress)) {
      return redirect('/')
    }
    const walletAmount = await store.dispatch('getUserWalletAmount', userAddress)
    const beneficiary = await store.dispatch('api/getCampaignByBeneficiaryAddress', userAddress)
    let donations = await store.dispatch('api/getDonations', userAddress)
    donations = donations.map((d) => {
      d.amount = ethers.utils.formatEther(d.amount, 'ether')
      return d
    })
    return {
      donations,
      beneficiary,
      walletAmount
    }
  }
}
</script>
