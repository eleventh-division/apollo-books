import { gql } from "apollo-server-express"

export const types = gql`
  type User {
    username: String!
    password: String!
    token: String
  }

  type Book {
    _id: ID
    title: String
    author: String
    year: Int
  }
`
