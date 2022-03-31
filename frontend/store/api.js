import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ethers } from 'ethers'

export const state = () => ({
  campaigns: {}
})

export const mutations = {
  // Setting campaigns to state variables
  setCampaigns (state, campaigns) {
    campaigns.forEach((campaign) => {
      // Convert date string to date object
      campaign.endTimestamp = new Date(campaign.endTimestamp)

      // Convert target donation amount to eth
      campaign.targetDonationAmount = Number(
        ethers.utils.formatUnits(
          campaign.targetDonationAmount,
          'ether'
        )
      )

      state.campaigns[campaign.campaignAddress] = campaign
    })
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
          organisationUrl: true,
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
          organisationUrl: true,
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

  async getCampaignByBeneficiaryAddress ({ commit }, beneficiaryAddress) {
    const query = {
      query: {
        campaigns: {
          __args: {
            filter: {
              beneficiaryAddress
            }
          },
          campaignAddress: true,
          campaignName: true,
          endTimestamp: true,
          organisationUrl: true,
          campaignOwnerAddress: true,
          beneficiaryAddress: true,
          targetDonationAmount: true,
          campaignDescription: true
        }
      }
    }
    const res = await this.$graphql.default.request(jsonToGraphQLQuery(query))
    return res.campaigns
  },

  async getDonations ({ commit }, donorAddress) {
    const query = {
      query: {
        donations: {
          __args: {
            filter: {
              donorAddress
            }
          },
          transactionHash: true,
          donorAddress: true,
          amount: true,
          campaignAddress: true
        }
      }
    }
    const res = await this.$graphql.default.request(jsonToGraphQLQuery(query))
    return res.donations
  }
}
