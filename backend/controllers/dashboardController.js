const Product = require('../models/Product');
const StockMove = require('../models/StockMove');
const { Op } = require('sequelize');

exports.getKPIs = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    
    // Low stock items (quantity < 10)
    const lowStock = await Product.count({
      where: {
        quantity: {
          [Op.lt]: 10
        }
      }
    });
    
    // Pending Receipts (IN operations that are not Done or Cancelled)
    const pendingReceipts = await StockMove.count({
      where: {
        type: 'IN',
        status: {
          [Op.notIn]: ['Done', 'Cancelled']
        }
      }
    });
    
    // Pending Deliveries (OUT operations that are not Done or Cancelled)
    const pendingDeliveries = await StockMove.count({
      where: {
        type: 'OUT',
        status: {
          [Op.notIn]: ['Done', 'Cancelled']
        }
      }
    });

    res.json({
      totalProducts,
      lowStock,
      pendingReceipts,
      pendingDeliveries,
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
