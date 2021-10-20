const Author = require('./Author')
const Genre = require('./Genre')
const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize('postgres://admin:11031999@localhost:5432/base_of_books')

class Authors_Genres extends Model {}

Authors_Genres.init({
  author_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Author,
      key: 'id',
    },
  },
  genre_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Genre,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'authors_genres',
  tableName: 'authors_genres',
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at',
})

Genre.belongsToMany(Author, {
  through: 'authors_genres',
  foreignKey: 'genre_id',
})
Author.belongsToMany(Genre, {
  through: 'authors_genres',
  foreignKey: 'author_id',
})

module.exports = Authors_Genres
