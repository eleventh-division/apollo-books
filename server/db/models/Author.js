const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Author', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    author_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: "authors",
    // timestamps: false
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
    // Other model options go here
  });
}
