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
      let authors = []
      db.Genre.belongsToMany(db.Author, {
        through: 'authors_genres',
        foreignKey: 'genre_id'
      })
      db.Author.belongsToMany(db.Genre, {
        through: 'authors_genres',
        foreignKey: 'author_id'
      })

      db.Author.findAll({ include: [db.Genre] })
        .then(result => {
          result.forEach((item, index) => {
            authors.push(item.toJSON())
            // authors[index].genre = item.dataValues.Genre.dataValues
          })
        })
        .catch(err => console.error(err))

      return authors
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
            genres.push(item.toJSON())
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
      // db.Author.hasMany(db.Book)
      db.Genre.belongsToMany(db.Author, {
        through: 'authors_genres',
        foreignKey: 'genre_id'
      })
      db.Author.belongsToMany(db.Genre, {
        through: 'authors_genres',
        foreignKey: 'author_id'
      })
      db.Book.belongsTo(db.Genre, { foreignKey: 'genre_id'})
      // db.Genre.hasMany(db.Book)

      await db.Author.findAll({
        limit: 1,
        where: { author_name: args.author_name }
      }).then( async (authorTemp) => {
        if (authorTemp[0]) {
          await db.Book.findAll({
            limit: 1,
            where: { title: args.title, author_id: authorTemp[0].toJSON().id },
            include: [
              {
                model: db.Author,
                include: [db.Genre]
              },
              { model: db.Genre }
            ],
          }).then( bookTemp => {
            if (bookTemp[0]) {
              book = bookTemp[0].toJSON()
            } else {
              book = null
            }
          }).catch(err => console.error(err))
        } else {
          book = null
        }
      }).catch(err => console.error(err))

      if (!book) {
        book = {}
        await db.Genre.findOrCreate({
          where: { genre_name: args.genre_name },
          defaults: {
            id: uuid(),
            genre_name: args.genre_name,
          },
        }).then(async (genreTemp) => {
          await db.Author.findOrCreate({
            where: { author_name: args.author_name },
            defaults: {
              id: uuid(),
              author_name: args.author_name,
            },
            include: [db.Genre],
          }).then(async (authorTemp) => {
            await db.Authors_Genres.findOrCreate({
              where: { author_id: authorTemp[0].dataValues.id, genre_id: genreTemp[0].dataValues.id },
              defaults: {
                author_id: authorTemp[0].toJSON().id,
                genre_id: genreTemp[0].toJSON().id,
              },
            }).catch(err => console.error(err))
            await db.Book.findOrCreate({
              where: { title: args.title, author_id: authorTemp[0].toJSON().id },
              defaults: {
                id: uuid(),
                title: args.title,
                author_id: authorTemp[0].toJSON().id,
                year: args.year,
                genre_id: genreTemp[0].toJSON().id,
              },
              include: [
                { model: db.Author },
                { model: db.Genre },
              ],
            }).then(bookTemp => {
              book = bookTemp[0].toJSON()

              if (authorTemp[0]._options.isNewRecord) {
                book.Author = authorTemp[0].toJSON()
                book.Author.Genres = []
              } else {
                book.Author = authorTemp[0].toJSON()
              }
              if (genreTemp[0]._options.isNewRecord || authorTemp[0]._options.isNewRecord) {
                book.Author.Genres.push(genreTemp[0].toJSON())
              }
              if (bookTemp[0]._options.isNewRecord) {
                book.Genre = genreTemp[0].toJSON()
              }

            }).catch(err => console.error(err))
          }).catch(err => console.error(err))
        }).catch(err => console.error(err))
      }

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
      db.Genre.belongsToMany(db.Author, {
        through: 'authors_genres',
        foreignKey: 'genre_id'
      })
      db.Author.belongsToMany(db.Genre, {
        through: 'authors_genres',
        foreignKey: 'author_id'
      })

      await db.Genre.findOrCreate({
        where: { genre_name: args.genre_name },
        defaults: {
          id: uuid(),
          genre_name: args.genre_name
        }
      }).then( async (genreTemp) => {
        await db.Author.findOrCreate({
          where: { author_name: args.author_name },
          defaults: {
            id: uuid(),
            author_name: args.author_name
          },
          include: [db.Genre]
        }).then( async (authorTemp) => {
          await db.Authors_Genres.findOrCreate({
            where: { author_id: authorTemp[0].dataValues.id, genre_id: genreTemp[0].dataValues.id },
            defaults: {
              author_id: authorTemp[0].toJSON().id,
              genre_id: genreTemp[0].toJSON().id
            }
          }).catch(err => console.error(err))
          if ( authorTemp[0]._options.isNewRecord ) {
            author = authorTemp[0].toJSON()
            author.Genres = []
          } else {
            author = authorTemp[0].toJSON()
          }
          if ( genreTemp[0]._options.isNewRecord || authorTemp[0]._options.isNewRecord  ) {
            author.Genres.push(genreTemp[0].toJSON())
          }
        }).catch(err => console.error(err))
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
      await db.Genre.findOrCreate({
        where: { genre_name: args.genre_name },
        defaults: {
          id: uuid(),
          genre_name: args.genre_name
        }
      }).then(result => {
          genre = result[0].dataValues
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
