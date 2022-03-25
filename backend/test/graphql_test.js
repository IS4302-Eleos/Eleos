import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import chaiGraphql from 'chai-graphql'
import app from '../index.js'
import Campaign from '../src/models/campaign.js'
import Donation from '../src/models/donation.js'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import mongoose from 'mongoose'

const server = app.server
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
      campaignOwnerAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9',
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
      endTimestamp: '2023-03-14T16:00:00Z',
      beneficiaryAddress: '0xdeadc0dedeadc0de',
      campaignOwnerAddress: '0xc0debeefdead',
      targetDonationAmount: 9999,
      campaignDescription: 'This is a test campaign 3'
    })
    await campaign3.save()
  })

  // after(async () => {
  //   await Campaign.collection.drop()
  //   mongoose.connection.close()
  //   app.instance.close()
  // })

  describe('Get all campaigns', () => {
    it('API alive check', async () => {
      // API status check
      const res = await chai.request(server).get('/')
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
            campaignOwnerAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9'
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
            endTimestamp: '2023-03-14T16:00:00.000Z',
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
            endTimestamp: '2023-03-14T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead'
          }
        ]
      })
    })

    it('filter by beneficiary address', async () => {
      const query = {
        query: {
          campaigns: {
            __args: {
              filter: {
                beneficiaryAddress: '0xdeadc0dedeadc0de'
              }
            },
            campaignAddress: true,
            campaignName: true,
            endTimestamp: true,
            campaignOwnerAddress: true,
            beneficiaryAddress: true
          }
        }
      }

      const res = await chai.request(server).post('/graphql').send({
        query: jsonToGraphQLQuery(query)
      })
      res.should.have.status(200)
      res.body.should.have.property('data')
      res.body.data.should.have.property('campaigns')
      res.body.data.campaigns.should.have.length(2)

      assert.graphQL(res.body, {
        campaigns: [
          {
            campaignAddress: '0xdeadbeef2a',
            campaignName: 'Test campaign 2',
            endTimestamp: '2022-05-15T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead',
            beneficiaryAddress: '0xdeadc0dedeadc0de'
          },
          {
            campaignAddress: '0xdeadbeef2ad',
            campaignName: 'Test campaign 3',
            endTimestamp: '2023-03-14T16:00:00.000Z',
            campaignOwnerAddress: '0xc0debeefdead',
            beneficiaryAddress: '0xdeadc0dedeadc0de'
          }
        ]
      })
    })
  })
})

describe('Donations test', () => {
  before(async () => {
    // Removing all other entries in database
    await Donation.deleteMany({})

    // Adding test entries
    const donation1 = new Donation({
      transactionHash: '0x1234567890123456789012345678901234567890',
      campaignAddress: '0x7c09773E7F6228b0D069156549aD1c404C2C685D',
      donorAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9',
      amount: 999
    })
    await donation1.save()

    const donation2 = new Donation({
      transactionHash: '0x1234567890123456789012345678901234567891',
      campaignAddress: '0x01D112b8023894AdD0d9EbEF35EAa14F1A43Fdd6',
      donorAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9',
      amount: 9991
    })
    await donation2.save()

    const donation3 = new Donation({
      transactionHash: '0x123456789012345678901234567890123456789b',
      campaignAddress: '0x01D112b8023894AdD0d9EbEF35EAa14F1A43Fdd6',
      donorAddress: '0xDEA10514b546D865A16f9924da39cfE801338030',
      amount: 12345
    })
    await donation3.save()
  })

  after(async () => {
    await Campaign.collection.drop()
    mongoose.connection.close()
    app.instance.close()
  })

  it('donation test', async () => {
    const query = {
      query: {
        donations: {
          __args: {
            filter: {
              donorAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9'
            }
          },
          transactionHash: true,
          campaignAddress: true,
          donorAddress: true,
          amount: true
        }
      }
    }

    const res = await chai.request(server).post('/graphql').send({
      query: jsonToGraphQLQuery(query)
    })

    res.should.have.status(200)
    res.body.should.have.property('data')
    res.body.data.should.have.property('donations')
    res.body.data.donations.should.have.length(2)

    assert.graphQL(res.body, {
      donations: [
        {
          transactionHash: '0x1234567890123456789012345678901234567890',
          campaignAddress: '0x7c09773E7F6228b0D069156549aD1c404C2C685D',
          donorAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9',
          amount: '999'
        },
        {
          transactionHash: '0x1234567890123456789012345678901234567891',
          campaignAddress: '0x01D112b8023894AdD0d9EbEF35EAa14F1A43Fdd6',
          donorAddress: '0x1aeC06D4d8B8303b73bEe7A754d454Fe012057e9',
          amount: '9991'
        }
      ]
    })
  })
})
