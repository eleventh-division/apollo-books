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
    // defaultValue: "35589cb1-6af5-4ec2-9e08-e7ae3773dd38"
    // defaultValue: async () => {
    //   let role = (await Role.findOne({
    //     attributes: ['id'],
    //     where: { name: "user" }
    //   })).toJSON()
    //   return role.id
    // },
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
