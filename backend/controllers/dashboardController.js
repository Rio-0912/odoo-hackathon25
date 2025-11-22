const Product = require('../models/Product');
const StockMove = require('../models/StockMove');
const { Op } = require('sequelize');

exports.getKPIs = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.count();

    // Pending Receipts (Stock Moves IN with status Draft)
    const pendingReceipts = await StockMove.count({
      where: { type: 'IN', status: 'Draft' },
    });

    // Pending Deliveries (Stock Moves OUT with status Draft)
    const pendingDeliveries = await StockMove.count({
      where: { type: 'OUT', status: 'Draft' },
    });

    // Low Stock (This would require a more complex query or a 'min_stock' field in Product, 
    // for now we'll just return 0 or a mock value as we haven't implemented stock levels per product yet)
    const lowStock = 0; 

    res.json({
      totalProducts,
      pendingReceipts,
      pendingDeliveries,
      lowStock,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentMoves = await StockMove.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Product }],
    });
    res.json(recentMoves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
