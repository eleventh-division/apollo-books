import { AuthenticationError } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';

import { getToken, encryptPassword, comparePassword, getPayload } from "../util.js"
import db from '../db.js';
const pubsub = new PubSub();

export const userResolvers = {
    Query: {
        me: (parent, args, context, info) => {
            if (context.loggedIn) {
                return context.user
            } else {
                throw new AuthenticationError("Please Login Again!")
            }
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            const newUser = { username: args.username, password: await encryptPassword(args.password) }
            // Check conditions
            const user = await db.getCollection('users').findOne({ username: args.username })
            if (user) {
                throw new AuthenticationError("User Already Exists!")
            }
            try {
                const regUser = (await db.getCollection('users').insertOne(newUser)).ops[0]
                const token = getToken(regUser);
                return { ...regUser, token }
            } catch (e) {
                throw e
            }
        },
        login: async (parent, args, context, info) => {
            const user = await db.getCollection('users').findOne({ username: args.username })
            const isMatch = await comparePassword(args.password, user.password)
            if (isMatch) {
                const token = getToken(user)
                user.token = token
                pubsub.publish('USER_AUTHORIZED', { userAuthorized: user });
                return { ...user, token };
            } else {
                throw new AuthenticationError("Wrong Password!")
            }
        },
    },
    Subscription: {
        userAuthorized: {
            subscribe: () => pubsub.asyncIterator(['USER_AUTHORIZED']),
        }
    }
};
