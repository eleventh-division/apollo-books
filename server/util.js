const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const config = require('./config/index.js')

const encryptPassword = password => new Promise((resolve, reject) => {
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

const comparePassword = (password, hash) => new Promise(async (resolve, reject) => {
  try {
    const isMatch = await bcrypt.compare(password, hash)
    resolve(isMatch)
    return true
  } catch (err) {
    reject(err)
    return false
  }
})

const getToken = payload => {
  return jwt.sign(payload, config.secret, {
    expiresIn: 604800, // 1 Week
  })
}

const getPayload = token => {
  try {
    const payload = jwt.verify(token, config.secret)
    return { loggedIn: true, payload }
  } catch (err) {
    // Add Err Message
    // console.error(err)
    return { loggedIn: false }
  }
}

module.exports = {
  encryptPassword,
  comparePassword,
  getToken,
  getPayload
}
