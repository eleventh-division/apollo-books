const { gql } = require("apollo-server-express")

const query = gql`
  type Query {
#    me: User
#    (filter: Filter!)
    getBooks(filter: Filter!): [Book]
    getAuthors(filter: Filter!): [Author]
    getGenres(filter: Filter!): [Genre]
  }
  type Mutation {
    Upload: Upload!

#    upsertRole(name: String!, permissions: [String!]!): Role
#    upsertModerator(username: String!, password: String!): User
#    register(username: String!, password: String!): User
#    login(username: String!, password: String!): User

    upsertGenre( genre: String! ): Genre
    deleteGenres( genres_id: [ID!]! ): [Genre]
    upsertAuthor( author: String!, genres_id: [ID!]! ): Author
    deleteAuthors( authors_id: [ID!]! ): [Author]
    upsertBook( title: String!, description: String!, author_id: ID!, year: Int!, genre_id: ID!, file: Upload): Book
    deleteBooks( books_id: [ID!]! ): [Book]
  }
  #  type Subscription {
  #    bookAdded: Book
  #    userAuthorized: User
  #  }
`
module.exports = {
  query
}
