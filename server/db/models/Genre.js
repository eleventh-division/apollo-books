const { DataTypes } = require('sequelize');
// const sequelize = new Sequelize('postgres://admin:11031999@localhost:5432/base_of_books')

// , DataTypes
module.exports = (sequelize) => {
  return sequelize.define('Genre', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    genre_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: "genres",
    // timestamps: false
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
    // Other model options go here
  });
}
