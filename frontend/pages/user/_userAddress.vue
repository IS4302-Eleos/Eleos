<template>
  <div>
    <section class="section container">
      <div class="container">
        <div class="card">
          <div class="hero is-success">
            <div class="hero-body">
              <figure class="image is-128x128">
                <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt="Placeholder image">
              </figure>
              <p class="subtitle mt-6">
                {{ $route.params.userAddress }}
              </p>
            </div>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <div class="level">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">
                        Reputation
                      </p>
                      <p class="title">
                        123
                      </p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">
                        No. of Donations Made
                      </p>
                      <p class="title">
                        {{ donations.length }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <b-tabs position="is-centered" class="block">
              <b-tab-item label="Donation Records">
                <div v-for="d in donations" :key="d.transactionHash" class="media">
                  <div class="media-left">
                    Donated {{ d.amount }} ether to Campaign
                    <NuxtLink :to="`/campaign/${d.campaignAddress}/info`">
                      {{ d.campaignAddress }}
                    </NuxtLink>
                  </div>
                </div>
              </b-tab-item>

              <b-tab-item label="Benefitted Campaigns">
                <div v-for="b in beneficiary" :key="b.campaignAddress" class="media">
                  <div class="media-left">
                    Added as beneficiary to Campaign at
                    <NuxtLink :to="`/campaign/${b.campaignAddress}/info`">
                      {{ b.campaignAddress }}
                    </NuxtLink>
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </section>
    <!--end of me-->
  </div>
</template>

<script>
import { ethers } from 'ethers'
export default {
  name: 'UserPage',
  async asyncData ({ store, route, redirect }) {
    const userAddress = route.params.userAddress
    if (!userAddress || !ethers.utils.isAddress(userAddress)) {
      return redirect('/')
    }
    const beneficiary = await store.dispatch('api/getCampaignByBeneficiaryAddress', route.params.userAddress)
    let donations = await store.dispatch('api/getDonations', route.params.userAddress)
    donations = donations.map((d) => {
      d.amount = ethers.utils.formatEther(d.amount, 'ether')
      return d
    })
    return {
      donations,
      beneficiary
    }
  }
}
</script>
