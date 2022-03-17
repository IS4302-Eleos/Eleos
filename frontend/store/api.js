import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const state = () => ({
  campagins: []
})

export const mutations = {

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
    return await this.$graphql.default.request(jsonToGraphQLQuery(query))
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
    return await this.$graphql.default.request(jsonToGraphQLQuery(query))
  }
}
