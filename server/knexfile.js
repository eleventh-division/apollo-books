module.exports = {
  development: {
    client: 'pg',
    version: '11.13',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'base_of_books',
      user: 'admin',
      password: '11031999',
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    }
  },
};
