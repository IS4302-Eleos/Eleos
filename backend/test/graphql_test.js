import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import chaiGraphql from 'chai-graphql'
import server from '../index.js'
import Campaign from '../src/models/campaign.js'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

chai.should()
chai.use(chaiGraphql)
chai.use(chaiHttp)
describe('Campaigns test ', () => {
  before(async () => {
    // Removing all other entries in database
    await Campaign.deleteMany({})

    // Adding test entries
    const campaign1 = new Campaign({
      campaignAddress: '0xdeadbeef',
      campaignName: 'Test campaign 1',
      organisationUrl: 'Eleos',
      endTimestamp: '2022-03-15T16:00:00Z',
      beneficiaryAddress: '0xdeadc0de',
      campaignOwnerAddress: '0xc0debeef',
      targetDonationAmount: 9999,
      campaignDescription: 'This is a test campaign'
    })
    await campaign1.save()

    const campaign2 = new Campaign({
      campaignAddress: '0xdeadbeef2a',
      campaignName: 'Test campaign 2',
      organisationUrl: 'Eleos',
      endTimestamp: '2022-05-15T16:00:00Z',
      beneficiaryAddress: '0xdeadc0dedeadc0de',
      campaignOwnerAddress: '0xc0debeefdead',
      targetDonationAmount: 9999,
      campaignDescription: 'This is a test campaign'
    })
    await campaign2.save()

    const campaign3 = new Campaign({
      campaignAddress: '0xdeadbeef2ad',
      campaignName: 'Test campaign 3',
      organisationUrl: 'Eleos',
      endTimestamp: '2023-03-15T16:00:00Z',
      beneficiaryAddress: '0xdeadc0dedeadc0de',
      campaignOwnerAddress: '0xc0debeefdead',
      targetDonationAmount: 9999,
      campaignDescription: 'This is a test campaign 3'
    })
    await campaign3.save()

  })

  describe('Get all campaigns', () => {

    it('API alive check', async () => {
      // API status check
      const res = await chai.request(server).get('/graphql')
      res.should.have.status(200)
    })

    it('should return all campaigns', async () => {
      // creating graphql query
      const query = {
        query: {
          campaigns: {
            campaignAddress: true,
            campaignName: true,
            endTimestamp: true,
            campaignOwnerAddress: true
          }
        }
      }
      // Sending http request to api
      const res = await chai.request(server).post('/graphql').send({
        query: jsonToGraphQLQuery(query)
      })

      // Checking response
      res.should.have.status(200)
      res.body.should.have.property('data')
      res.body.data.should.have.property('campaigns')
      res.body.data.campaigns.should.have.length(3)

      // Checking if the data is correct
      assert.graphQL(res.body, {
        campaigns: [
          {
            campaignAddress: '0xdeadbeef',
            campaignName: 'Test campaign 1',
            endTimestamp: '2022-03-15T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeef'
          },
          {
            campaignAddress: '0xdeadbeef2a',
            campaignName: 'Test campaign 2',
            endTimestamp: '2022-05-15T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead'
          },
          {
            campaignAddress: '0xdeadbeef2ad',
            campaignName: 'Test campaign 3',
            endTimestamp: '2023-03-15T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead'
          }
        ]
      })
    })

    it('filter by date', async () => {
      // Creating a campaign query with date filter
      const query = {
        query: {
          campaigns: {
            __args: {
              filter: {
                _operators: {
                  endTimestamp: {
                    gte: '2022-03-16T16:00:00Z'
                  }
                }
              }
            },
            campaignAddress: true,
            campaignName: true,
            endTimestamp: true,
            campaignOwnerAddress: true
          }
        }
      }

      // Sending http request to api
      const res = await chai.request(server).post('/graphql').send({
        query: jsonToGraphQLQuery(query)
      })

      // Checking response
      res.should.have.status(200)
      res.body.should.have.property('data')
      res.body.data.should.have.property('campaigns')
      res.body.data.campaigns.should.have.length(2)

      // Checking if the data is correct
      assert.graphQL(res.body, {
        campaigns: [
          {
            campaignAddress: '0xdeadbeef2a',
            campaignName: 'Test campaign 2',
            endTimestamp: '2022-05-15T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead'
          },
          {
            campaignAddress: '0xdeadbeef2ad',
            campaignName: 'Test campaign 3',
            endTimestamp: '2023-03-15T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead'
          }
        ]
      })
    })
  })
})
