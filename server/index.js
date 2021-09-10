import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";
import { getPayload } from './util.js';
import db from './db.js';
import config from './config/index.js';

async function startServer() {
    const app = express();

    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const server = new ApolloServer({
        schema,
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }],
        context: ({ req }) => {
            // Connect to DB
            db.connect(config.database, (err) => {
                if (err) {
                    console.error(err)
                }
            })

            // get the user token from the headers
            const token = req.headers.authorization || '';
            // try to retrieve a user with the token
            const { payload: user, loggedIn } = getPayload(token);

            // add the user to the context
            return { user, loggedIn };
        },
    });

    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    await server.start();
    server.applyMiddleware({
        app,

        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        // path: '/'
    });

    const PORT = 4000;
    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    );
}

startServer();