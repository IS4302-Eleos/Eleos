import { schemaComposer } from 'graphql-compose'
import { composeMongoose } from 'graphql-compose-mongoose'
import Campaign from '../models/campaign.js'

// Converting a mongoose model to a graphql schema object
const CampaignTC = composeMongoose(Campaign, {})

// Adding a new field to the enable queries of the schema
schemaComposer.Query.addFields({
  // Creating the find many campaigns route to search and filter by endTimestamp
  campaigns: CampaignTC.mongooseResolvers.findMany({
    filter: {
      operators: {
        endTimestamp: ['gt', 'gte']
      }
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
