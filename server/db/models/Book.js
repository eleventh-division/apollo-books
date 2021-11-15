const Author = require('./Author')
const Genre = require('./Genre')
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://admin:11031999@localhost:5432/base_of_books')

class Book extends Model {}
Book.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author_id: {
    type: DataTypes.UUIDV4,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  genre_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  file_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'book',
  tableName: 'books',
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at',
});

Book.belongsTo(Author, {
  foreignKey: 'author_id',
})
Author.hasMany(Book, {
  foreignKey: 'author_id',
})
Book.belongsTo(Genre, { foreignKey: 'genre_id'})
Genre.hasMany(Book, { foreignKey: 'genre_id'})

module.exports = Book
