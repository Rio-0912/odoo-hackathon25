const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

// Get all warehouses
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      include: [{ model: Location }]
    });
    res.json(warehouses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get warehouse by ID
exports.getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findByPk(id, {
      include: [{ model: Location }]
    });
    
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    
    res.json(warehouse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create warehouse
exports.createWarehouse = async (req, res) => {
  try {
    const { name, address } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Warehouse name is required' });
    }
    
    const warehouse = await Warehouse.create({ name, address });
    res.json(warehouse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update warehouse
exports.updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    
    warehouse.name = name || warehouse.name;
    warehouse.address = address || warehouse.address;
    await warehouse.save();
    
    res.json(warehouse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete warehouse
exports.deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findByPk(id);
    
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    
    await warehouse.destroy();
    res.json({ message: 'Warehouse deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = exports;
