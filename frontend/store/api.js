import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const state = () => ({
  campaigns: []
})

export const mutations = {
  // Setting campaigns to state variables
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
  // Getting all the campaigns from the database
  async getCampaigns ({ commit }) {
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
  // Getting the campaign from the database filtered by a date
  // Note this function expects a nodejs date object
  async getCampaignsByDate ({ commit }, date) {
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
