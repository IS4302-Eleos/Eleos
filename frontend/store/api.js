import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const state = () => ({
  campaigns: []
})

export const mutations = {
  setCampaigns (state, campaigns) {
    campaigns.forEach((campaign) => {
      if (!campaign.donations) {
        campaign.donations = 0
      }
    })
    state.campaigns = campaigns
  }
}

export const actions = {
  async getCampagins ({ commit }) {
    const query = {
      query: {
        campaigns: {
          campaignAddress: true,
          campaignName: true,
          endTimestamp: true,
          campaignOwnerAddress: true,
          beneficiaryAddress: true,
          targetDonationAmount: true,
          campaignDescription: true
        }
      }
    }
    const res = await this.$graphql.default.request(jsonToGraphQLQuery(query))
    commit('setCampaigns', res.campaigns)
    return res.campaigns
  },
  async getCampaginsByDate ({ commit }, date) {
    const query = {
      query: {
        campaigns: {
          __args: {
            filter: {
              _operators: {
                endTimestamp: {
                  gte: date.toISOString()
                }
              }
            }
          },
          campaignAddress: true,
          campaignName: true,
          endTimestamp: true,
          campaignOwnerAddress: true,
          beneficiaryAddress: true,
          targetDonationAmount: true,
          campaignDescription: true
        }
      }
    }
    const res = await this.$graphql.default.request(jsonToGraphQLQuery(query))
    commit('setCampaigns', res.campaigns)
    return res.campaigns
  }
}
