const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// create our User model
class FragranceListing extends Model {}

// Create fields/columns for User model
FragranceListing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fragranceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'fragrance',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    discount: {
      type: DataTypes.INTEGER
    },
    stock: {
      type: DataTypes.INTEGER
    },
    sizeoz: {
      type: DataTypes.STRING
    },
    sizeml: {
      type: DataTypes.STRING
    },
    reviews: {
      type: DataTypes.STRING
    },
    site: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    }
  },
  {
    hooks: {},
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'fragrance_listing'
  }
);

module.exports = FragranceListing;
