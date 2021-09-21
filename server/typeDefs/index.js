const { query } = require("./query.js")
const { types } = require("./types/index.js")

const typeDefs = [query, types]

module.exports = {
  typeDefs
}
