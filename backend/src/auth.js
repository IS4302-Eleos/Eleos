import Router from '@koa/router'
import Web3 from 'web3'
import { randomBytes } from 'crypto'
import User from './models/user.js'
import kbv from 'koa-body-validator'
import config from '../config.js'
import jwt from 'jsonwebtoken'

const { Joi, bodySchema } = kbv
const { utils } = Web3
const web3 = new Web3(`http://${config.bc.host}:${config.bc.port}`)
const router = new Router()

router.post('/login', bodySchema({
  pubkey: Joi.string().required()
}), async ctx => {
  try {
    // validate the request body
    ctx.validate()

    // convert publickey to lowercase and verify
    const publickey = ctx.request.body.pubkey.toLowerCase()
    if (!utils.isAddress(publickey)) {
      ctx.throw(400, 'Invalid public key')
    }

    // generating random challenge
    const nonce = randomBytes(32).toString('hex')
    await User.findOneAndUpdate({ publickey }, { nonce }, { upsert: true })
    const hashed = utils.soliditySha3(nonce)

    // sending challenge to the user
    ctx.body = JSON.stringify({ challenge: hashed })
  } catch (e) {

    // if error, return error message
    ctx.status = 400
    ctx.body = JSON.stringify({ error: e.message })
  }
})

router.post('/authenticate', bodySchema({
  pubkey: Joi.string().required(),
  signature: Joi.string().required()
}), async ctx => {
  try {

    // validate the request body
    ctx.validate()

    // convert publickey to lowercase and verify
    const publickey = ctx.request.body.pubkey.toLowerCase()
    const sig = ctx.request.body.signature
    const resetNonce = randomBytes(32).toString('hex')

    // check if user exists and get their nonce
    const user = await User.findOne({ publickey })
    if (!user) {
      ctx.throw(400, 'Failed Authentication')
    }

    // hash their nonce to get the challenge and verify key
    const hashed = utils.soliditySha3(user.nonce)
    const checkKey = web3.eth.accounts.recover(hashed, sig)
    if (checkKey.toLowerCase() === publickey) {
      // if verified, reset their nonce and return jwt token
      await User.updateOne({publickey}, {nonce: resetNonce})
      const token = jwt.sign({ publickey }, config.jwtSecret, {
        expiresIn: '1h'
      })
      ctx.body = JSON.stringify({ token: token })
    } else {

      // if not verified, return error message
      ctx.throw(400, 'Invalid Signature')
    }
  } catch (e) {

    // if error, return error message
    ctx.status = 400
    ctx.body = JSON.stringify({ error: e.message })
  }
})

export default router
