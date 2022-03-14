import {buildSchema} from 'graphql';

export default buildSchema(`
type Campaign {
    id: ID,
    address: String,
    title: String
    allDay: Boolean
    start: String,
    end: String
  }
  type Query {
    campaigns: [Campaign]
  }
  type Mutation {
    createCampaign(address: String!, title: String!, start: String, end: String): Campaign
  }
`)