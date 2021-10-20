const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://admin:11031999@localhost:5432/base_of_books')

class Role extends Model {}

Role.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'role',
  tableName: 'roles',
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at'
});

module.exports = Role
