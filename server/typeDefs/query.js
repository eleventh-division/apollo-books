const { gql } = require("apollo-server-express")

const query = gql`
  type Query {
    me: User
    getBooks(filter: Filter!): [Book]
    getAuthors(filter: Filter!): [Author]
    getGenres(filter: Filter!): [Genre]
  }
  type Mutation {
    Upload: Upload!

    upsertRole(name: String!, permissions: [String!]!): Role
#    upsertModerator(username: String!, password: String!): User
    register(username: String!, password: String!): User
    login(username: String!, password: String!): User

    upsertBook( title: String!, description: String!, author_id: ID!, year: Int!, genre_id: ID!, file: Upload): Book
    deleteBook( book_id: ID! ): Book
    upsertAuthor( author: String!, genres_id: [ID!]! ): Author
    deleteAuthor( author_id: ID! ): Author
    upsertGenre( genre: String! ): Genre
    deleteGenre( genres_id: [ID!]! ): [Genre]
  }
  #  type Subscription {
  #    bookAdded: Book
  #    userAuthorized: User
  #  }
`
module.exports = {
  query
}
