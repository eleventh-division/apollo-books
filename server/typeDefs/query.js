import { gql } from "apollo-server-express"

export const query = gql`
  type Query {
    me: User
    getAllBooks: [Book]
    getBook(_id: ID!): Book
    getSortedBooks(title: String, author: String, year: Int, sort: String!): [Book]
  }

  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): User
    addBook(title: String!, author: String!, year: Int!): Book
  }

  type Subscription {
    bookAdded: Book
    userAuthorized: User
  }
`
