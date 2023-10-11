const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// create our User model
class UserFragrance extends Model {}

// Create fields/columns for User model
UserFragrance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    fragranceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'fragrance',
        key: 'id'
      }
    },
  },
  {
    hooks: {},
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_fragrance'
  }
);

module.exports = UserFragrance;