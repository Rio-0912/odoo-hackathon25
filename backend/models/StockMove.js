const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Location = require('./Location');

const StockMove = sequelize.define('StockMove', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('IN', 'OUT', 'INT', 'ADJ'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'),
    defaultValue: 'Draft',
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  responsible: {
    type: DataTypes.STRING,
  },
  schedule_date: {
    type: DataTypes.DATE,
  },
  delivery_address: {
    type: DataTypes.TEXT,
  },
  contact_person: {
    type: DataTypes.STRING,
  },
});

StockMove.belongsTo(Product, { foreignKey: 'product_id' });
StockMove.belongsTo(Location, { as: 'SourceLocation', foreignKey: 'source_location_id' });
StockMove.belongsTo(Location, { as: 'DestLocation', foreignKey: 'dest_location_id' });

module.exports = StockMove;
