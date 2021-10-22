const fs = require('fs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sql = fs.readFileSync('./migrations/20210915113942_initial.up.sql', { encoding: 'utf-8' })
    return await queryInterface.sequelize.query(sql)
  },
  down: async (queryInterface, Sequelize) => {
    const sql = fs.readFileSync('./migrations/20210915113942_initial.down.sql', { encoding: 'utf-8' })
    return await queryInterface.sequelize.query(sql)
  }
};