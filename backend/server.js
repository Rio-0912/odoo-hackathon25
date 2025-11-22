const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Warehouse = require('./models/Warehouse');
const Location = require('./models/Location');
const StockMove = require('./models/StockMove');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/operations', require('./routes/operationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.send('Inventory Management System API is running...');
});

// Sync Database and Start Server
db.sync({ force: false }) // Set force: true to drop tables on restart (dev only)
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
