const https = require("https")
const fs = require('fs')
const { GraphQLError, execute, subscribe } = require("graphql")
const { SubscriptionServer } = require("subscriptions-transport-ws")
const { makeExecutableSchema } = require("@graphql-tools/schema")
const { createComplexityRule, simpleEstimator } = require("graphql-query-complexity")
// const depthLimit = require('graphql-depth-limit')
const express = require("express")
const app = express()
const { ApolloServer } = require("apollo-server-express")

const { resolvers } = require("./resolvers/index.js")
const { typeDefs } = require("./typeDefs/index.js")
const utils = require('./utils.js')
const db = require('./db/db.js')

// const config = require('./config/index.js')

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}

async function startServer() {
  const httpsServer = https.createServer(options, app)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const server = new ApolloServer({
    schema,
    // validationRules: validation.rules,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            await subscriptionServer.close()
          },
        }
      },
    }],
    context: async ({ req }) => {
      // Connect to DB
      await db.connect


      // get the user token from the headers
      const bearer = req.headers.authorization || ''
      const token = bearer.split(' ')[1]
      // const token = req.headers.authorization || ''
      // try to retrieve a user with the token
      const { payload: user, loggedIn } = utils.getPayload(token)

      // add the user to the context
      return { user, loggedIn }
    },
  })

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpsServer, path: server.graphqlPath },
  )

  await server.start()
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    // path: '/'
  })

  const HOST = '0.0.0.0'
  const PORT = 4000
  httpsServer.listen(PORT, HOST,() => {
    console.log(`Server is now running on https://${ HOST }:${ PORT }/graphql`)
  })
}

startServer().catch(console.error)
