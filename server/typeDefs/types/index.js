const { gql } = require("apollo-server-express")

const types = gql`
  #  type User {
  #    username: String
  #    password: String
  #    token: String
  #  }

  type Genre {
    id: ID
    genre_name: String
  }

  type Author {
    id: ID
    author_name: String
    genre: Genre
  }

  type Book {
    id: ID
    title: String
    author: Author
    year: Int
    genre: Genre
  }
`
module.exports = {
  types
}
