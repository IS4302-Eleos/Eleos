<template>
  <div>
    <section class="section container">
      <div class="container">
        <div class="card">
          <user-header :address="$route.params.userAddress" />
          <div class="card-content">
            <div class="block">
              <user-stats
                :reputation="reputation"
                :no-of-donations="donations ? donations.length : -1"
                :wallet-amount="walletAmount"
              />
            </div>
            <b-tabs position="is-centered" class="block">
              <b-tab-item label="Donation Records">
                <div v-if="donations && donations.length">
                  <user-donation-record
                    v-for="donation in donations"
                    :key="donation.transactionHash"
                    :campaign-address="donation.campaignAddress"
                    :amount="donation.amount"
                    :timestamp="donation.timestamp"
                  />
                </div>
                <div v-else>
                  No donations made...
                </div>
              </b-tab-item>
              <b-tab-item label="Benefitted Campaigns">
                <div v-if="beneficiary && beneficiary.length">
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
    try {
      const [walletAmount, beneficiary, reputation, rawDonations] = await Promise.all([
        store.dispatch('getUserWalletAmount', userAddress),
        store.dispatch('api/getCampaignByBeneficiaryAddress', userAddress),
        store.dispatch('contract/reputation/getReputation', userAddress),
        store.dispatch('api/getDonations', userAddress)
      ])
      const donations = rawDonations.map((d) => {
        d.amount = ethers.utils.formatEther(d.amount, 'ether')
        return d
      })
      return {
        donations,
        beneficiary,
        walletAmount,
        reputation
      }
    } catch (err) {
      return {
        donations: null,
        beneficiary: null,
        walletAmount: -1,
        reputation: '-1'
      }
    }
  }
}
</script>
