import { schemaComposer } from 'graphql-compose'
import { composeMongoose } from 'graphql-compose-mongoose'
import Campaign from '../models/campaign.js'

const CampaignTC = composeMongoose(Campaign, {})

schemaComposer.Query.addFields({
  campaigns: CampaignTC.mongooseResolvers.findMany({
    filter:{
      operators:{
        endTimestamp:['gt','gte']
      }
    }
  })
})
// Possible custom route can be done this way
// testroute: {
//   type: CampaignTC,
//   args:{address: 'String'},
//   resolve: async (source,args,context,info) =>{
//     const result = await Campaign.findOne({address: args.address});
//     return result;
//   }
// }


export default schemaComposer.buildSchema()
