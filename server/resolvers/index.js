const { userResolvers } = require('./userResolvers.js')
const { bookResolvers } = require('./bookResolvers.js')

const resolvers = [userResolvers, bookResolvers]

module.exports = {
  resolvers
}
