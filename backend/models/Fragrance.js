const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// create our User model
class Fragrance extends Model {}

// Create fields/columns for User model
Fragrance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    make: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    series: {
      type: DataTypes.STRING
    },
    photoLink: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    }, 
  },
  {
    hooks: {},
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'fragrance'
  }
);

module.exports = Fragrance;
