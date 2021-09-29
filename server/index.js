const { createServer } = require("http")
const { execute, subscribe } = require("graphql")
const { SubscriptionServer } = require("subscriptions-transport-ws")
const { makeExecutableSchema } = require("@graphql-tools/schema")
const express = require("express")
const { ApolloServer } = require("apollo-server-express")

const { resolvers } = require("./resolvers/index.js")
const { typeDefs } = require("./typeDefs/index.js")
const { getPayload } = require('./utils.js')
const db = require('./db/db.js')



const config = require('./config/index.js')

async function startServer() {
  const app = express()

  const httpServer = createServer(app)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close()
          },
        }
      },
    }],
    context: ({ req }) => {
      // Connect to DB
      db: db.connect

      // get the user token from the headers
      const token = req.headers.authorization || ''
      // try to retrieve a user with the token
      const { payload: user, loggedIn } = getPayload(token)

      // add the user to the context
      return { user, loggedIn }
    },
  })

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath },
  )

  await server.start()
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    // path: '/'
  })

  const HOST = 'localhost'
  const PORT = 4000
  httpServer.listen(PORT, HOST,() => {
    console.log(`Server is now running on http://${ HOST }:${ PORT }/graphql`)
  })
}

startServer().catch(console.error)
