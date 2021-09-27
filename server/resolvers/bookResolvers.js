const { AuthenticationError } = require('apollo-server-express')
const { PubSub } = require('graphql-subscriptions')
const getFieldNames = require('graphql-list-fields')
const { v4: uuid } = require('uuid')
// const { knex } = require('../db/db.js')
const db = require('../db/models/index.js')


const pubsub = new PubSub()

const bookResolvers = {
  Query: {
    getAllBooks: async (parent, args, context) => {
      // if ( context.user.role.role_name === "user" )
      // db.Genre.hasMany(db.Book, {foreignKey: 'book_id'})
      db.Book.belongsTo(db.Author, { foreignKey: 'author_id' })
      db.Book.belongsTo(db.Genre, { foreignKey: 'genre_id' })
      let books = []
      await db.Book.findAll({ include: db.Genre, include: db.Author })
        .then(result => {
          result.forEach((item, index) => {
            books.push(item.dataValues)
            books[index].author = item.dataValues.Author.dataValues
            // console.log(item.dataValues)
            // books[index].genre = item.dataValues.Genre.dataValues
          })
        })
        .catch(err => console.error(err))

      return books
      // } else {
      //   return new AuthenticationError('Login Again!')
      // }
    },
    getAllAuthors: async () => {


      // let sql = "SELECT * FROM authors"
      // let result = await db.query(sql)
      //
      // return result.rows
    },
    getAllGenres: async () => {
      let genres = []
      await db.Genre.findAll({})
        .then(result => {
          result.forEach((item) => {
            genres.push(item.dataValues)
          })
        })
        .catch(err => console.error(err))

      return genres
    },
    // getBook: async (parent, args) => {
    // let books = await db.getCollection('books').findOne({ "_id": db.ObjectId(args._id) })
    // console.log("________________________________________________")
    // console.log(books)
    // return books
    // },
    // getSortedBooks: async (parent, args, context, info) => {
    // let query = {}
    // let options = {
    //   // sort returned documents in ascending order by title (A->Z)
    //   sort: {},
    //   // Include only the `title` and `author` fields in each returned document
    //   projection: { _id: 0 },
    // }
    //
    // let fields = Object.keys(args)
    // query[fields[0]] = args[fields[0]]
    //
    // options.sort[args.sort] = 1
    // fields = getFieldNames(info)
    // for (let key = 0; key < fields.length; key++) {
    //   options.projection[fields[key]] = 1
    // }
    //
    // let books = await db.getCollection('books').find(query, options).toArray()
    // console.log("________________________________________________")
    // console.log(books)
    // return books
    // },
  },
  Mutation: {
    insertBook: async (parent, args) => {
      let book = {}
      db.Book.belongsTo(db.Author, { foreignKey: 'author_id' })
      db.Book.belongsTo(db.Genre, { foreignKey: 'genre_id' })
      await db.Book.create({
        id: uuid(),
        title: args.title,
        author_id: args.author,
        year: args.year,
        genre_id: args.genre
      }).then(result => {
        book = result.dataValues
      }).catch(err => console.error(err))

      return book

      // assertPermission(user, 'create_book')
      //
      // if (context.loggedIn) {
      //   await db.getCollection('books').insertOne(args)
      //   await pubsub.publish('BOOK_ADDED', { bookAdded: args })
      //   return args
      // } else {
      //   throw new AuthenticationError("Please Login Again!")
      // }
    },
    deleteBook: async (parent, args) => {


      // DELETE FROM books WHERE title = 'Мастер времени';
    },
    insertAuthor: async (parent, args, context, info) => {
      let author = {}
      await db.Author.create({
        id: uuid(),
        author_name: args.author_name
      }).then(result => {
        author = result.dataValues
      }).catch(err => console.error(err))

      return author

      // let sql = "SELECT * FROM authors WHERE author_name = " + "'" + args.author_name + "'"
      // let result = await db.query(sql)
      // if (result.rows[0]) {
      //   return result.rows[0]
      // } else {
      //   sql = "INSERT INTO authors VALUES ( uuid_generate_v4(), \n" +
      //     "'" + args.author_name + "'," + "'" + args.genre + "' ) RETURNING * ;"
      //   result = await db.query(sql)
      //   return result.rows[0]
      // }
    },
    deleteAuthor: async (parent, args) => {


      // let sql = "DELETE FROM authors WHERE author_name = " + "'" + args.author_name + "'" + " RETURNING * ;"
      // let result = await db.query(sql)
      // return result.rows[0]
    },
    insertGenre: async (parent, args) => {
      let genre = {}
      await db.Genre.create({
        id: uuid(),
        genre_name: args.genre_name
      }).then(result => {
          genre = result.dataValues
      }).catch(err => console.error(err))

      return genre
    },
    deleteGenre: async (parent, args) => {
      let genres = []
      await db.Genre.destroy({
        where: {
          genre_name: args.genre_name
        },
        returning: true
      }).then(result => {
        result.forEach((item) => {
          genres.push(item.dataValues)
        })
      }).catch(err => console.error(err))

      return genres
    }
  },
  // Subscription: {
  // bookAdded: {
  // subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
  // },
  // },
}

module.exports = {
  bookResolvers
}

// const notAuthorizedPermissions = ['get_books', 'get_genres']
//
// const roles = [{
//   id: 'UUID',
//   title: 'Admin',
//   permissions: ['create_author', 'create_moderator'],
// } ...]
//
// function assertPermission(user, operation) {
//   let can
//
//   if (!user) {
//     can = notAuthorizedPermissions.includes(operation)
//   } else {
//     can = user.role.includes(operation)
//   }
//
//   if (!can) {
//     throw new AuthenticationError("Authorization required!")
//   }
// }
