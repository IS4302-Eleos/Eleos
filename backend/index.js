import Koa from 'koa'
import Router from '@koa/router'
import koaBody from 'koa-body'
import { graphqlHTTP } from 'koa-graphql'
import config from './config.js'
import schema from './src/graphql/schema.js'
import initdb from './src/database.js'
import { NoSchemaIntrospectionCustomRule } from 'graphql'
import cors from '@koa/cors'

// Initialize the database and connect to mongodb
initdb()
const app = new Koa()
const router = new Router()

// Allow cross origin requests
app.use(cors())

// routes to be developed
router.get('/', async (ctx) => {
  ctx.body = JSON.stringify({ api_version: '1.0.0' })
})

// mounting graphql endpoint to the router
router.all('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: config.graphiql,
  validationRules: [NoSchemaIntrospectionCustomRule] // prevents introspection queries
}))

app.use(koaBody()).use(router.routes()).use(router.allowedMethods())
const server = app.listen(config.app.port)
export default {
  server: app.callback(),
  instance: server
}
