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
    ctx.validate()
    const publickey = ctx.request.body.pubkey
    if (!utils.isAddress(publickey)) {
      ctx.throw(400, 'Invalid public key')
    }
    const nonce = randomBytes(32).toString('hex')
    await User.findOneAndUpdate({ publickey }, { nonce }, { upsert: true })
    const hashed = utils.soliditySha3(nonce)
    ctx.body = JSON.stringify({ challenge: hashed })
  } catch (e) {
    ctx.status = 400
    ctx.body = JSON.stringify({ error: e.message })
  }
})

router.post('/authenticate', bodySchema({
  pubkey: Joi.string().required(),
  signature: Joi.string().required()
}), async ctx => {
  try {
    ctx.validate()

    const publickey = ctx.request.body.pubkey
    const sig = ctx.request.body.signature
    const resetNonce = randomBytes(32).toString('hex')
    const user = await User.findOne({ publickey })
    if (!user) {
      ctx.throw(400, 'Failed Authentication')
    }
    const hashed = utils.soliditySha3(user.nonce)
    const checkKey = web3.eth.accounts.recover(hashed, sig)
    if (checkKey.toLowerCase() === publickey.toLowerCase()) {
      // await User.updateOne({publickey}, {nonce: resetNonce})
      const token = jwt.sign({ publickey }, config.jwtSecret)
      ctx.body = JSON.stringify({ token: token })
    } else {
      ctx.throw(400, 'Invalid Signature')
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = JSON.stringify({ error: e.message })
  }
})

router.post('/signer', async ctx => {
  const privkey = ctx.request.body.privkey
  const message = ctx.request.body.message
  ctx.body = JSON.stringify(web3.eth.accounts.sign(message, privkey))
})

export default router
