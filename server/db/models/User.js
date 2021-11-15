const Role = require('./Role')
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://admin:11031999@localhost:5432/base_of_books')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'user',
  tableName: 'users',
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at',
});

User.belongsTo(Role, { foreignKey: 'role_id'})
Role.hasMany(User, { foreignKey: 'role_id'})

module.exports = User
