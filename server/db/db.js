const { Client } = require("pg")
const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'base_of_books',
  user: 'admin',
  password: '11031999',
})

exports.connect = client.connect((err) => {
  if (err) {
    console.error(err)
  } else {
    console.log("Connected to PostgreSQL")
  }
})
