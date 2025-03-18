const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')


class Event extends Model {}

Event.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_income: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  sum: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }

}, {
  sequelize,
  underscored: true,
  timestamps: false,  
  modelName: 'event'
})


module.exports = { Event, sequelize }