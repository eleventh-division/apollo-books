const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Authors_Genres', {
    // Model attributes are defined here
    author_id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    genre_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: "authors_genres",
    // timestamps: false
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
    // Other model options go here
  });
}
