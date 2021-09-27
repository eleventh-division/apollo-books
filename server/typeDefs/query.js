const { gql } = require("apollo-server-express")

const query = gql`
  type Query {
    me: User
    getAllBooks: [Book]
    getAllAuthors: [Author]
    getAllGenres: [Genre]
#    getBook(_id: ID!): Book
#    getSortedBooks(title: String, author: String, year: Int, sort: String!): [Book]

    getAllUsers: [User]
    getAllRoles: [Role]
    getAllPermissions: [Permission]
  }
  type Mutation {
    insertBook( title: String!, author: String!, year: Int!, genre: String! ): Book
    deleteBook( title: String!, author: String! ): [Book]
    insertAuthor( author_name: String!, genre: String! ): Author
    deleteAuthor( author_name: String! ): [Author]
    insertGenre( genre_name: String! ): Genre
    deleteGenre( genre_name: String! ): [Genre]

    insertPermission( permission_name: String! ): Permission
    deletePermission( permission_name: String! ): Permission
    insertRole( role_name: String!, permissions: [String] ): Role
    deleteRole( role_name: String! ): Role
    insertUser( username: String! , password: String!, role_name: String! ): User
    deleteUser( username: String! ): User
#    register(username: String!, password: String!): User
    login(username: String!, password: String!): User
  }
#  type Subscription {
#    bookAdded: Book
#    userAuthorized: User
#  }
`
module.exports = {
  query
}
