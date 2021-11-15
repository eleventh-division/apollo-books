const { AuthenticationError } = require('apollo-server-express')
const { PubSub } = require('graphql-subscriptions')
const { v4: uuid } = require('uuid')

const utils = require("../utils.js")
const User = require('../db/models/User')
const Role = require('../db/models/Role')

const pubsub = new PubSub()

const userResolvers = {
  Query: {
    // me: (args, context) => {
    //   if (context.loggedIn) {
    //     return context.user
    //   } else {
    //     throw new AuthenticationError("Please Login Again!")
    //   }
    // },
  },
  Mutation: {
    // register: async (args) => {
    //   const newUser = {
    //     id: uuid(),
    //     username: args.username,
    //     password: await utils.encryptPassword(args.password),
    //   }
    //   // Check conditions
    //   const user = await User.findOne({
    //     where: { username: args.username }
    //   })
    //   if (user) {
    //     throw new AuthenticationError("User is exist!")
    //   }
    //
    //   try {
    //     await User.create(newUser)
    //     const regUser = await User.findOne({
    //       where: { username: newUser.username },
    //       include: [Role]
    //     })
    //     const token = utils.getToken(regUser.toJSON())
    //     return { ...regUser.toJSON(), token }
    //   } catch (err) {
    //     throw err
    //   }
    // },
    // login: async (args) => {
    //   const user = (await User.findOne({
    //     where: { username: args.username },
    //     include: [Role]
    //   })).toJSON()
    //   const isMatch = await utils.comparePassword(args.password, user.password)
    //
    //   if (isMatch) {
    //     const token = utils.getToken(user)
    //     user.token = token
    //     // await pubsub.publish('USER_AUTHORIZED', { userAuthorized: user.toJSON() })
    //     return { ...user, token }
    //   } else {
    //     throw new AuthenticationError("Wrong Password!")
    //   }
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
