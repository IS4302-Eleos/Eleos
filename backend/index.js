import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'
import { graphqlHTTP } from 'koa-graphql'
import config from './config.js'
import schema from './src/graphql/schema.js'
import initdb from './src/database.js'

// Initialize the database and connect to mongodb
initdb()
const app = new Koa()
const router = new Router()

// routes to be developed
router.get('/', async (ctx) => {
  ctx.body = JSON.stringify({ api_version: '1.0.0' })
})

// mounting graohql endpoint to the router
router.all('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: config.graphiql
}))

app.use(koaBody()).use(router.routes()).use(router.allowedMethods())
app.listen(config.app.port)
