const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Warehouse = require('./Warehouse');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('View', 'Internal', 'Customer', 'Vendor', 'Inventory Loss'),
    defaultValue: 'Internal',
  },
});

Location.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
Warehouse.hasMany(Location, { foreignKey: 'warehouse_id' });

module.exports = Location;
