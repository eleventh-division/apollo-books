const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const config = require('./config/index.js')

exports.writeBook = ({ stream, filename }) => {
  const uploadDir = './books';
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ path }))
  );
}

exports.createOrUpdate = async (model, filter, includes, values) => {
  // First try to find the record
  const foundItem = await model.findOne({ where: filter });
  if (!foundItem) {
    // Item not found, create a new one
    await model.create(values)
    const item = (await model.findOne({ where: filter, include: includes })).toJSON()
    return  { item, created: true };
  }
  // Found an item, update it
  await foundItem.update(values);
  const item = (await model.findOne({ where: filter, include: includes })).toJSON()
  return { item, created: false };
}

exports.createOrRestore = async (model, filter, includes, values) => {
  // First try to find the record
  const foundItem = await model.findOne({ where: filter, paranoid: false });
  if (!foundItem) {
    // Item not found, create a new one
    await model.create(values)
    const item = (await model.findOne({ where: filter, include: includes })).toJSON()
    return  { item, created: true };
  }
  // Found an item, update it
  await foundItem.restore({ where: filter });
  const item = (await model.findOne({ where: filter, include: includes })).toJSON()
  return { item, created: false };
}

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
