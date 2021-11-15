const { gql } = require("apollo-server-express")

const query = gql`
  type Query {
#    me: User
#    (filter: Filter!)
    getGenres(filter: Filter!): [Genre]
    getAuthors(filter: Filter!): [Author]
    getBooks(filter: Filter!): [Book]
  }
  type Mutation {
    Upload: Upload!

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
  #    userAuthorized: User
  #    bookAdded: Book
  #  }
`
module.exports = {
  query
}
