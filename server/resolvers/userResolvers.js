const {AuthenticationError} = require('apollo-server-express')
const {PubSub} = require('graphql-subscriptions')

const {getToken, encryptPassword, comparePassword, getPayload} = require("../util.js")
const db = require('../db/db.js')

const pubsub = new PubSub()

const userResolvers = {
  // Query: {
  // me: (parent, args, context) => {
  // if (context.loggedIn) {
  //   return context.user
  // } else {
  //   throw new AuthenticationError("Please Login Again!")
  // }
  // },
  // },
  Mutation: {
    // register: async (parent, args) => {
    // const newUser = {username: args.username, password: await encryptPassword(args.password)}
    // // Check conditions
    // const user = await db.getCollection('users').findOne({username: args.username})
    // if (user) {
    //   throw new AuthenticationError("User Already Exists!")
    // }
    //
    // try {
    //   const regUser = (await db.getCollection('users').insertOne(newUser)).ops[0]
    //   const token = getToken(regUser)
    //   return { ...regUser, token }
    // } catch (e) {
    //   throw e
    // }
    // },
    // login: async (parent, args) => {
    // const user = await db.getCollection('users').findOne({username: args.username})
    // const isMatch = await comparePassword(args.password, user.password)
    //
    // if (isMatch) {
    //   const token = getToken(user)
    //   user.token = token
    //   await pubsub.publish('USER_AUTHORIZED', {userAuthorized: user})
    //   return { ...user, token }
    // } else {
    //   throw new AuthenticationError("Wrong Password!")
    // }
    // },
  },
  // Subscription: {
  // userAuthorized: {
  // subscribe: () => pubsub.asyncIterator(['USER_AUTHORIZED']),
  // },
  // },
}

module.exports = {
  userResolvers
}
