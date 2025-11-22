const Location = require('../models/Location');
const Warehouse = require('../models/Warehouse');

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: [{ model: Warehouse }]
    });
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id, {
      include: [{ model: Warehouse }]
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create location
exports.createLocation = async (req, res) => {
  try {
    const { warehouse_id, name, type } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Location name is required' });
    }
    
    const location = await Location.create({ warehouse_id, name, type });
    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouse_id, name, type } = req.body;
    
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    location.warehouse_id = warehouse_id !== undefined ? warehouse_id : location.warehouse_id;
    location.name = name || location.name;
    location.type = type || location.type;
    await location.save();
    
    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    await location.destroy();
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = exports;
