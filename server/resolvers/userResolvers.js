const { AuthenticationError } = require('apollo-server-express')
const { PubSub } = require('graphql-subscriptions')

const utils = require("../utils.js")
const db = require('../db/db.js')
const knexFile = require('../knexfile.js')
const knex = require('knex')(knexFile.development)

const pubsub = new PubSub()

const userResolvers = {
  Query: {
    me: (parent, args, context) => {
      if (context.loggedIn) {
        const t = localStorage.getItem('token');
        console.log(t)

        return context.user
      } else {
        throw new AuthenticationError("Login Again!")
      }
    },
    getAllPermissions: () => {
      return knex.select().from('permissions')
    }
  },
  Mutation: {
    insertPermission: async (parent, args) => {
      let permission = await knex('permissions').where('permission_name', args.permission_name)

      if (!permission[0]) {
        permission = await knex('permissions')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            permission_name: args.permission_name,
          })
      }

      return permission[0]
    },
    deletePermission: async (parent, args) => {
      let permission = await knex('permissions').where('permission_name', args.permission_name)

      await knex('permissions')
        .returning('*')
        .where('id', permission[0].id)
        .update({ deleted_at: 'deleted' })

      return permission[0]
    },
    insertRole: async (parent, args) => {
      let permissions = []
      for ( let i = 0; i < args.permissions.length; i++ ) {
        permissions = await knex('permissions').where('permission_name', args.permissions[i])
        if ( !permissions[0] ){
          await knex('permissions')
            .returning('*')
            .insert({
              id: knex.raw('uuid_generate_v4()'),
              permission_name: args.permissions[i],
            })
        }
      }

      let role = await knex('roles').where('role_name', args.role_name)
      if ( !role[0] ) {
        role = await knex('roles')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            role_name: args.role_name,
            permissions: args.permissions
          })
      }

      // role[0].pemissions = permissions[0]
      return role[0]
    },
    deleteRole: async (parent, args) => {
      let role = await knex('roles').where('role_name', args.role_name)

      await knex('role')
        .returning('*')
        .where('id', role[0].id)
        .update({ deleted_at: 'deleted' })

      return role[0]
    },
    insertUser: async (parent, args) => {
      let user = await knex('users').where('username', args.username)
      if ( !user[0] ) {
        let password = await utils.encryptPassword(args.password)
        let role = await knex('roles').where('role_name', args.role_name)

        user = await knex('users')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            username: args.username,
            password: password,
            role: role[0].id,
          })

        user[0].role = role[0]
      }

      return user[0]
    },
    deleteUser: async (parent, args) => {
      let user = await knex('users')
        .returning('*')
        .where('username', args.username)
        .update({ deleted_at: 'deleted' })

      return user[0]
    },
  //   register: async (parent, args) => {
  //     const newUser = {username: args.username, password: await encryptPassword(args.password)}
  //     // Check conditions
  //     const user = await db.getCollection('users').findOne({username: args.username})
  //     if (user) {
  //       throw new AuthenticationError("User Already Exists!")
  //     }
  //
  //     try {
  //       const regUser = (await db.getCollection('users').insertOne(newUser)).ops[0]
  //       const token = getToken(regUser)
  //       return { ...regUser, token }
  //     } catch (e) {
  //       throw e
  //     }
  //   },
    login: async (parent, args) => {
      const user = await knex('users').where('username', args.username)
      let role = await knex('roles').where('id', user[0].role)

      const isMatch = await utils.comparePassword(args.password, user[0].password)
      if (isMatch) {
        user[0].role = role[0]
        const token = utils.getToken(user[0])
        user[0].token = token
        // await pubsub.publish('USER_AUTHORIZED', { userAuthorized: user[0] })
        return { ...user[0], token }
      } else {
        throw new AuthenticationError("Wrong Password!")
      }
    },
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
