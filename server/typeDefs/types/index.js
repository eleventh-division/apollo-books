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
    Genres: [Genre]
  }

  type Book {
    id: ID
    title: String
    Author: Author
    year: Int
    Genre: Genre
  }
`
module.exports = {
  types
}
