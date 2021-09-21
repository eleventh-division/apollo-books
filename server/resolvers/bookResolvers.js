const { AuthenticationError } = require('apollo-server-express')
const { PubSub } = require('graphql-subscriptions')
const getFieldNames = require('graphql-list-fields')

const db = require('../db/db.js')
const knexFile = require('../knexfile.js')
const knex = require('knex')(knexFile.development)

const pubsub = new PubSub()

const bookResolvers = {
  Query: {
    getAllBooks: async () => {
      let books = await knex.select().from('books')
      let author = []
      let genre = []
      for ( let i = 0; i < books.length; i++ ) {
        author = await knex('authors').where('id', books[i].author)
        genre = await knex('genres').where('id', books[i].genre)
        books[i].author = author[0]
        books[i].author.genre = genre[0]
        books[i].genre = genre[0]
      }

      return books
    },
    getAllAuthors: async () => {
      let authors = await knex.select().from('authors')
      let genre = []
      for ( let i = 0; i < authors.length; i++ ) {
        genre = await knex('genres').where('id', authors[i].genre)
        authors[i].genre = genre[0]
      }

      return authors

      // let sql = "SELECT * FROM authors"
      // let result = await db.query(sql)
      //
      // return result.rows
    },
    getAllGenres: async () => {
      let genres = await knex.select().from('genres')

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
      let genre = await knex('genres').where('genre_name', args.genre)
      if (!genre[0]) {
        genre = await knex('genres')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            genre_name: args.genre,
          })
      }

      let author = await knex('authors').where('author_name', args.author)
      if (!author[0]) {
        author = await knex('authors')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            author_name: args.author,
            genre: genre[0].id
          })
      }

      let book = await knex('books').where({ author: author[0].id, title: args.title })
      if (!book[0]) {
        book = await knex('books')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            title: args.title,
            author: author[0].id,
            year: args.year,
            genre: genre[0].id
          })
      }

      book[0].author = author[0]
      book[0].author.genre = genre[0]
      book[0].genre = genre[0]
      return book[0]

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
      let author = await knex('authors')
        .returning('*')
        .where('author_name', args.author)

      let book = await knex('books')
        .returning('*')
        .where({ title: args.title, author: author[0].id })
        .del()

      book[0].author = author[0]
      return book[0]

      // DELETE FROM books WHERE title = 'Мастер времени';
    },
    insertAuthor: async (parent, args, context, info) => {
      let genre = await knex('genres').where('genre_name', args.genre)
      if (!genre[0]) {
        genre = await knex('genres')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            genre_name: args.genre,
          })
      }

      let author = await knex('authors').where('author_name', args.author_name)
      if (!author[0]) {
        author = await knex('authors')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            author_name: args.author_name,
            genre: genre[0].id
          })
      }

      author[0].genre = genre[0]
      return author[0]

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
      let author = await knex('authors').where('author_name', args.author_name)
      let genre = await knex('genres').where('id', author[0].genre)
      author[0].genre = genre[0]

      await knex('authors')
        .returning('*')
        .where('id', author[0].id)
        .del()

      return author[0]

      // let sql = "DELETE FROM authors WHERE author_name = " + "'" + args.author_name + "'" + " RETURNING * ;"
      // let result = await db.query(sql)
      // return result.rows[0]
    },
    insertGenre: async (parent, args) => {
      let genre = await knex('genres').where('genre_name', args.genre_name)

      if (!genre[0]) {
        genre = await knex('genres')
          .returning('*')
          .insert({
            id: knex.raw('uuid_generate_v4()'),
            genre_name: args.genre_name,
          })
      }

      return genre[0]
    },
    deleteGenre: async (parent, args) => {
      let genre = await knex('genres').where('genre_name', args.genre_name)

      await knex('genres')
        .returning('*')
        .where('id', genre[0].id)
        .del()

      return genre[0]
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
