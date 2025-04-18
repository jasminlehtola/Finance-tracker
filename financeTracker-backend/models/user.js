const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')


class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  sequelize,
  underscored: true,
  timestamps: false,  
  modelName: 'user'
})


module.exports = { User, sequelize }