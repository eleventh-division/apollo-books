import { AuthenticationError } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'
import getFieldNames from 'graphql-list-fields'

import db from '../db.js'

const pubsub = new PubSub()

export const bookResolvers = {
  Query: {
    getAllBooks: async () => {
      return await db.getCollection('books').find({}).toArray()
    },
    getBook: async (parent, args) => {
      let books = await db.getCollection('books').findOne({ "_id": db.ObjectId(args._id) })
      console.log("________________________________________________")
      console.log(books)
      return books
    },
    getSortedBooks: async (parent, args, context, info) => {
      let query = {}
      let options = {
        // sort returned documents in ascending order by title (A->Z)
        sort: {},
        // Include only the `title` and `author` fields in each returned document
        projection: { _id: 0 },
      }

      let fields = Object.keys(args)
      query[fields[0]] = args[fields[0]]

      options.sort[args.sort] = 1
      fields = getFieldNames(info)
      for (let key = 0; key < fields.length; key++) {
        options.projection[fields[key]] = 1
      }

      let books = await db.getCollection('books').find(query, options).toArray()
      console.log("________________________________________________")
      console.log(books)
      return books
    },
  },
  Mutation: {
    addBook: async (parent, args, context, info) => {
      assertPermission(user, 'create_book')

      if (context.loggedIn) {
        await db.getCollection('books').insertOne(args)
        await pubsub.publish('BOOK_ADDED', { bookAdded: args })
        return args
      } else {
        throw new AuthenticationError("Please Login Again!")
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

const notAuthorizedPermissions = ['get_books', 'get_genres']

const roles = [{
  id: 'UUID',
  title: 'Admin',
  permissions: ['create_author', 'create_moderator'],
} ...]

function assertPermission(user, operation) {
  let can

  if (!user) {
    can = notAuthorizedPermissions.includes(operation)
  } else {
    can = user.role.includes(operation)
  }

  if (!can) {
    throw new AuthenticationError("Authorization required!")
  }
}
