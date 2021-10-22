const fs = require('fs')

// module.exports = {
  function writeMigrations() {
    const files = fs.readdirSync('../migrations')
    if(!files) {
      throw Error(`Write migrations error, because migrations undefined!`)
    }
    let filesEdited = []
    for(let item of files) {
      filesEdited.push(item.split('.')[0])
    }
    let counts = filesEdited.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1
      return acc
    }, {})

    for(let prop in counts) {
      if(counts[prop] !== 2) {
        throw Error(`Write migrations error, because ${ prop } not 2`)
      }
    }

    const migrations = Object.keys(counts)
    let data = ``
    for(let item of migrations) {
      data =
`const fs = require('fs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sql = fs.readFileSync('./migrations/${ item }.up.sql', { encoding: 'utf-8' })
    return await queryInterface.sequelize.query(sql)
  },
  down: async (queryInterface, Sequelize) => {
    const sql = fs.readFileSync('./migrations/${ item }.down.sql', { encoding: 'utf-8' })
    return await queryInterface.sequelize.query(sql)
  }
};`

      fs.writeFileSync(`../migrations/${ item }.js`, data)
      console.log(`./migrations/${ item }.js has been created!`)
    }
  }
// }

writeMigrations()
