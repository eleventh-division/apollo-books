const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Book', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author_id: {
      type: DataTypes.UUIDV4,
      // allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre_id: {
      type: DataTypes.UUIDV4,
      // allowNull: false
    }
  }, {
    tableName: "books",
    // timestamps: false
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
    // Other model options go here
  });
}
