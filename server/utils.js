const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const config = require('./config/index.js')

const knexFile = require('./knexfile.js')
const knex = require('knex')(knexFile.development)

// exports.deleteStr = (table, returnColumns, query) => {
//   let del = knex('genres')
//     .returning('*')
//     .where('id', 'Самосовершенствование')
//     .del()
//   console.log(del)
//   return del[0]
// }

// exports.insertStr = (table, columns, data) => {
//   return knex(table)
//     .returning(columns)
//     .insert(data)
// }



exports.encryptPassword = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      reject(err)
      return false
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err)
        return false
      }
      resolve(hash)
      return true
    })
  })
})

exports.comparePassword = (password, hash) => new Promise(async (resolve, reject) => {
  try {
    const isMatch = await bcrypt.compare(password, hash)
    resolve(isMatch)
    return true
  } catch (err) {
    reject(err)
    return false
  }
})

exports.getToken = payload => {
  return jwt.sign(payload, config.secret, {
    expiresIn: 604800, // 1 Week
  })
}

exports.getPayload = token => {
  try {
    const payload = jwt.verify(token, config.secret)
    payload.token = token
    return { loggedIn: true, payload }
  } catch (err) {
    // Add Err Message
    // console.error(err)
    return { loggedIn: false }
  }
}

// module.exports = {
//   encryptPassword,
//   comparePassword,
//   getToken,
//   getPayload
// }
