const { gql } = require("apollo-server-express")

const types = gql`
  scalar Upload
  scalar Object
  input Filter {
    where: Object
    offset: Int
    limit: Int
  }

  type Role {
    id: ID
    name: String
    permissions: [String]
  }

  type User {
    id: ID
    username: String
    password: String
    role: Role
    token: String
  }

#  type BookData {
#    id: ID
#    title: String
#    description: String
#    year: Int
#    genre: Genre
#    file_id: ID
#  }
#
#  type AuthorData {
#    id: ID
#    name: String
#    genres: [Genre]
#  }

  type Genre {
    id: ID
    name: String
  }

  type Author {
    id: ID
    name: String
    genres: [Genre]
    books: [Book]
  }

  type Book {
    id: ID
    title: String
    description: String
    author: Author
    year: Int
    genre: Genre
    file_id: ID
  }
`
module.exports = {
  types,
}
