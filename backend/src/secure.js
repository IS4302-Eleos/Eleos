import Router from '@koa/router'
import kbv from 'koa-body-validator'
import config from '../config.js'
import jwt from 'koa-jwt'
import Campaign from './models/campaign.js'

const { Joi, bodySchema } = kbv
const router = new Router()

router.use(jwt({ secret: config.jwtSecret }))

router.post('/edit', bodySchema({
  contractAddress: Joi.string().required(),
  description: Joi.string().required()
}), async ctx => {
  try {
    ctx.validate()
    const result = await Campaign.findOneAndUpdate({
      campaignOwnerAddress: ctx.state.user.publickey,
      campaignAddress: ctx.request.body.contractAddress
    }, {
      campaignDescription: ctx.request.body.description
    })
    if (!result) {
      ctx.throw(400, 'Invalid Campaign or Campaign Owner')
    }

    ctx.body = JSON.stringify({ success: true })
  } catch (e) {
    ctx.status = 400
    ctx.body = JSON.stringify({ error: e.message })
  }
})

export default router
