const { gql } = require("apollo-server-express")

const query = gql`
  type Query {
  #    me: User
    getAllBooks: [Book]
    getAllAuthors: [Author]
    getAllGenres: [Genre]
  #    getBook(_id: ID!): Book
  #    getSortedBooks(title: String, author: String, year: Int, sort: String!): [Book]
  }
  type Mutation {
  #    register(username: String!, password: String!): User
  #    login(username: String!, password: String!): User
    insertBook( title: String!, author_name: String!, year: Int!, genre_name: String! ): Book
    deleteBook( title: String! ): Book
    insertAuthor( author_name: String!, genre_name: String! ): Author
    deleteAuthor( author_name: String! ): Author
    insertGenre( genre_name: String! ): Genre
    deleteGenre( genre_name: String! ): Genre
  }
  #  type Subscription {
  #    bookAdded: Book
  #    userAuthorized: User
  #  }
`
module.exports = {
  query
}
