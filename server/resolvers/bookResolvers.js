const { AuthenticationError } = require('apollo-server-express')
const { GraphQLUpload } = require('graphql-upload')
const { PubSub } = require('graphql-subscriptions')
const getFieldNames = require('graphql-list-fields')
const { v4: uuid } = require('uuid')

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Genre = require('../db/models/Genre')
const Author = require('../db/models/Author')
const Authors_Genres = require('../db/models/Authors_Genres')
const Book = require('../db/models/Book')
const utils = require('../utils')
const { where } = require('sequelize')

// const pubsub = new PubSub()

const bookResolvers = {
  Query: {
    getBooks: async (parent, args, context) => {
      return (await Book.findAll(
        {
          where: args.filter.where,
          offset: args.filter.offset,
          limit: args.filter.limit,
          include: [
            {
              model: Author,
              include: [Genre],
            },
            { model: Genre },
          ],
      })).map((item) => item.toJSON())
    },
    getAuthors: async (parent, args, context) => {
      return (await Author
        .findAll({
          where: args.filter.where,
          offset: args.filter.offset,
          limit: args.filter.limit,
          include: [Genre, Book]
        }))
        .map((item) => item.toJSON())
    },

    // __getAllAuthors: async () => (await Author
    //   .findAll({ include: [Genre] }))
    //   .map((item) => item.toJSON()),

    getGenres: async (parent, args, context) => {

      return (await Genre
        .findAll({
          where: args.filter.where,
          offset: args.filter.offset,
          limit: args.filter.limit
        }))
        .map((item) => item.toJSON())
    },
  },
  Mutation: {
    Upload: GraphQLUpload,
    upsertBook: async (parent, args, content) => {
      // if (content.loggedIn && content.user.role.name === 'author') {
        const genre = (await Genre.findOne({
          where: { id: args.genre_id },
        })).toJSON()

        const author = (await Author.findOne({
          where: { id: args.author_id },
          include: [Genre],
        })).toJSON()

        if (genre && author) {
          // const { mimetype, createReadStream } = await args.file;
          const filename = uuid()
          // const stream = createReadStream();
          // await utils.writeBook({ stream, filename })

          const book = await utils.createOrUpdate(
            Book,
            {
              title: args.title, author_id: author.id,
            },
            [
              { model: Author, include: [Genre] },
              { model: Genre },
            ],
            {
              id: uuid(),
              title: args.title,
              description: args.description,
              author_id: author.id,
              year: args.year,
              genre_id: genre.id,
              file_id: filename,
            })
          return book.item
        } else {
          return new Error('Не удалось создать книгу. Жанр и/или автор не найдены!')
        }
      // } else {
      //   return new AuthenticationError('Login Again!')
      // }
    },
    deleteBook: async (parent, args) => {
      const book = Book.findOne({
        where: { id: args.book_id },
        include: [
          { model: Author, include: [Genre] },
          { model: Genre },
        ],
      })

      await Book.destroy({
        where: { id: args.book_id },
      })

      return book
    },
    upsertAuthor: async (parent, args, context, info) => {
      const genres = (await Genre.findAll({
        where: {
          id: {
            [Op.or]: args.genres_id
          }
        },
      })).map((item) => item.toJSON())
      if (genres.length > 0) {
        const author = await utils.createOrUpdate(
          Author,
          { name: args.author },
          [Genre],
          {
            id: uuid(),
            name: args.author,
          })
        await Authors_Genres.destroy({
          where: { author_id: author.item.id }
        })
        for(let item of genres) {
          await utils.createOrRestore(
            Authors_Genres,
            { author_id: author.item.id, genre_id: item.id },
            [],
            {
              author_id: author.item.id,
              genre_id: item.id,
            },
          )
        }

        author.item.genres = genres
        return author.item
      } else {
        return new Error('Не удалось создать автора. Жанры не найдены!')
      }
    },
    deleteAuthor: async (parent, args) => {
      const author = (await Author.findOne({
        where: { id: args.author_id },
        include: [Genre],
      })).toJSON()

      const books = (await Book.findAll({
        where: { author_id: author.id },
      })).map((item) => item.toJSON())

      if (books.length > 0) {
        return Error('Невозможно удалить автора, так как у него имеются книги!')
      } else {
        await Author.destroy({
          where: { id: author.id },
        })
        await Authors_Genres.destroy({
          where: { author_id: author.id },
        })
        return author
      }
    },
    upsertGenre: async (parent, args) => {
      const genre = await utils.createOrUpdate(
        Genre,
        { name: args.genre },
        [],
        {
          id: uuid(),
          name: args.genre,
        })

      return genre.item
    },
    deleteGenre: async (parent, args) => {
      let genres = (await Genre.findAll({
        where: {
          id: {
            [Op.or]: args.genres_id
          }
        },
      })).map((item) => {
        return item.toJSON()
      })

      for(let genre of genres) {
        let books = (await Book.findAll({
          where: { genre_id: genre.id },
        })).map((item) => item.toJSON())

        if (books.length > 0) {
          genre.error = Error('Невозможно удалить жанр, так как у него имеются книги!').message
        } else {
          await Authors_Genres.destroy({
            where: { genre_id: genre.id },
          })
          await Genre.destroy({
            where: { id: genre.id },
          })
        }
      }

      return genres
    },
  },
  // Subscription: {
  // bookAdded: {
  // subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
  // },
  // },
}

module.exports = {
  bookResolvers,
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
