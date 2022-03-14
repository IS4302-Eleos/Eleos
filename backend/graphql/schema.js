import { schemaComposer } from 'graphql-compose'
import { composeMongoose } from 'graphql-compose-mongoose'
import Campaign from '../models/campaign.js'

const CampaignTC = composeMongoose(Campaign, {})

schemaComposer.Query.addFields({
  campaigns: CampaignTC.mongooseResolvers.findMany()
  // testroute: {
  //   type: CampaignTC,
  //   args:{address: 'String'},
  //   resolve: async (source,args,context,info) =>{
  //     const result = await Campaign.findOne({address: args.address});
  //     return result;
  //   }
  // }
})

schemaComposer.Mutation.addFields({
  createCampaign: CampaignTC.mongooseResolvers.createOne()
})

export default schemaComposer.buildSchema()
