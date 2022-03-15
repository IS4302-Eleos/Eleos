import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'
import config from './config.js'
import initdb from './src/database.js'

initdb()
const app = new Koa()
const router = new Router()

// routes to be developed
router.get('/', async (ctx) => {
  ctx.body = JSON.stringify({ api_version: '1.0.0' })
})

app.use(koaBody())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(config.app.port)
