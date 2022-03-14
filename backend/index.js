import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'
import { graphqlHTTP } from 'koa-graphql'
import config from './config.js'
import schema from './graphql/schema.js'
import initdb from './database.js'

initdb()
const app = new Koa()
const router = new Router()

// routes to be developed
router.get('/', async (ctx) => {
  ctx.body = JSON.stringify({ api_version: '1.0.0' })
})

router.all('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: config.graphiql
}))
app.use(koaBody()).use(router.routes()).use(router.allowedMethods())
app.listen(config.app.port)
