const db = require('./config/database');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Warehouse = require('./models/Warehouse');
const Location = require('./models/Location');
const Product = require('./models/Product');
const StockMove = require('./models/StockMove');

async function seed() {
  try {
    await db.authenticate();
    console.log('DB Connected.');
    await db.sync({ force: true }); // Reset DB
    console.log('DB Synced.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await User.bulkCreate([
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'Manager' },
      { name: 'Staff User', email: 'staff@example.com', password: hashedPassword, role: 'Staff' }
    ]);
    console.log('Users seeded.');

    const warehouses = await Warehouse.bulkCreate([
      { name: 'Main Warehouse', address: '123 Industrial Park' },
      { name: 'Secondary Warehouse', address: '456 Logistics Way' }
    ]);

    await Location.bulkCreate([
      { warehouse_id: warehouses[0].id, name: 'Stock', type: 'Internal' },
      { warehouse_id: warehouses[0].id, name: 'Vendor', type: 'Vendor' },
      { warehouse_id: warehouses[0].id, name: 'Customer', type: 'Customer' }
    ]);
    console.log('Locations seeded.');

    await Product.bulkCreate([
      { name: 'Steel Rod', sku: 'SR-001', category: 'Raw Material', uom: 'kg', description: 'High quality' },
      { name: 'Office Chair', sku: 'FUR-001', category: 'Furniture', uom: 'Unit', description: 'Ergonomic' }
    ]);
    console.log('Products seeded.');

    console.log('Seeding Complete.');
  } catch (err) {
    console.error('Seeding Failed:', err);
  } finally {
    process.exit();
  }
}

seed();
