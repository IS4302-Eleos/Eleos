import { schemaComposer } from 'graphql-compose'
import { composeMongoose } from 'graphql-compose-mongoose'
import Campaign from '../models/campaign.js'
import Donation from '../models/donation.js'
import Withdrawal from '../models/withdrawal.js'

// Converting a mongoose model to a graphql schema object
const options = {
  removeFields: ['_id', '__v']
}
const CampaignTC = composeMongoose(Campaign, options)
const DonationTC = composeMongoose(Donation, options)
const WithdrawalTC = composeMongoose(Withdrawal, options)

// Adding a new field to the enable queries of the schema
schemaComposer.Query.addFields({
  // Creating the find many campaigns route to search and filter by endTimestamp
  campaigns: CampaignTC.mongooseResolvers.findMany({
    lean: true,
    filter: {
      removeFields: ['campaignAddress', 'campaignName', 'organisationUrl', 'campaignOwnerAddress', 'targetDonationAmount', 'campaignDescription'],
      operators: {
        endTimestamp: ['gt', 'gte']
      }
    }
  }),
  // Creating the donation route to search and filter by donorAddress
  donations: DonationTC.mongooseResolvers.findMany({
    lean: true,
    filter: {
      removeFields: ['transactionHash', 'amount', 'timestamp'],
      isRequired: true,
      operators: false
    }
  }),
  withdrawals: WithdrawalTC.mongooseResolvers.findMany({
    lean: true,
    filter: {
      requiredFields: ['campaignAddress'],
      removeFields: ['transactionHash', 'amount', 'timestamp', 'withdrawerAddress', 'amount', 'beneficiaryAddress'],
      isRequired: true,
      operators: false
    }
  })
})

// Possible custom route can be done this way
// functions wrap around with wrapResolve to alter the output
// testroute: {
//   type: CampaignTC,
//   args:{address: 'String'},
//   resolve: async (source,args,context,info) =>{
//     const result = await Campaign.findOne({address: args.address});
//     return result;
//   }
// }

// Building the root schema for the graphql server
export default schemaComposer.buildSchema()
