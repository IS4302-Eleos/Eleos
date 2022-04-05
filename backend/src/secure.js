import Router from '@koa/router'
import kbv from 'koa-body-validator'
import config from '../config.js'
import jwt from 'koa-jwt'
import Campaign from './models/campaign.js'

const { Joi, bodySchema } = kbv
const router = new Router()

router.use(jwt({ secret: config.jwtSecret }))

// this function needs to be tested again after edit page is completed
// this function needs to sync with how listeners is storing campaigns
router.post('/edit', bodySchema({
  contractAddress: Joi.string().required(),
  description: Joi.string().required()
}), async ctx => {
  try {
    // validate the request body
    ctx.validate()

    // getting current user publickey and finding their campaign
    // update description if result is found
    const result = await Campaign.findOneAndUpdate({
      campaignOwnerAddress: ctx.state.user.publickey,
      campaignAddress: ctx.request.body.contractAddress
    }, {
      campaignDescription: ctx.request.body.description
    })
    if (!result) {
      // if no result, return error message
      ctx.throw(400, 'Invalid Campaign or Campaign Owner')
    }

    ctx.body = JSON.stringify({ success: true })
  } catch (e) {
    // if error, return error message
    ctx.status = 400
    ctx.body = JSON.stringify({ error: e.message })
  }
})

export default router
