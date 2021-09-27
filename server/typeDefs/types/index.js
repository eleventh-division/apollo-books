const { gql } = require("apollo-server-express")

const types = gql`
  type Permission {
    id: ID
    permission_name: String
  }

  type Role {
    id: ID
    role_name: String
    permissions: [String]
  }

  type User {
    id: ID
    username: String
    password: String
    role: Role
    token: String
  }

  type Genre {
    id: ID
    genre_name: String
  }

  type Author {
    id: ID
    author_name: String
    genres: [Genre]
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
