const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderLine = sequelize.define('OrderLine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stock_move_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'StockMoves',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
}, {
  tableName: 'OrderLines',
  timestamps: true,
});

module.exports = OrderLine;
