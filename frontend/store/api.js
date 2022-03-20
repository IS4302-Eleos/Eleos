import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const state = () => ({
  campaigns: []
})

export const mutations = {
  // Setting campaigns to state variables
  setCampaigns (state, payload) {
    const rootState = payload.rootState
    const campaigns = payload.campaigns

    campaigns.forEach((campaign) => {
      // Set temp donation value
      if (!campaign.donations) {
        campaign.donations = 0
      }

      // Convert date string to date object
      campaign.endTimestamp = new Date(campaign.endTimestamp)

      // Convert target donation amount to eth
      campaign.targetDonationAmount = Number(
        rootState.web3.utils.fromWei(
          campaign.targetDonationAmount.toString(),
          'ether'
        ))
    })
    state.campaigns = campaigns
  }
}

export const actions = {
  // Getting all the campaigns from the database
  async getCampaigns (context) {
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
    context.commit('setCampaigns', {
      rootState: context.rootState, campaigns: res.campaigns
    })
    return res.campaigns
  },
  // Getting the campaign from the database filtered by a date
  // Note this function expects a nodejs date object
  async getCampaignsByDate (context, date) {
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
    context.commit('setCampaigns', {
      rootState: context.rootState, campaigns: res.campaigns
    })
    return res.campaigns
  }
}
