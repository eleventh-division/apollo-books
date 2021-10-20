const { createServer } = require("https")
const fs = require('fs')
const { execute, subscribe } = require("graphql")
const { SubscriptionServer } = require("subscriptions-transport-ws")
const { makeExecutableSchema } = require("@graphql-tools/schema")
// const depthLimit = require('graphql-depth-limit')
const express = require("express")
const app = express()
const multer = require("multer")
const upload = multer({ dest: './server/uploads/' })
const { ApolloServer } = require("apollo-server-express")

const { resolvers } = require("./resolvers/index.js")
const { typeDefs } = require("./typeDefs/index.js")
const utils = require('./utils.js')
const db = require('./db/db.js')

const config = require('./config/index.js')

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}

async function startServer() {
  const httpServer = createServer(options, app)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const server = new ApolloServer({
    schema,
    // validationRules: [ depthLimit(2) ],
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
      db.connect

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
    console.log(`Server is now running on https://${ HOST }:${ PORT }/graphql`)
  })
}

app.get('/', (req, res, next) => {
  let options = {
    root: './client'
  };
  let fileName = 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.post('/submit', upload.fields([]), (req, res) => {
  console.log( req.body );
  // console.log( req.files );
  res.sendStatus(200);
});

startServer().catch(console.error)
