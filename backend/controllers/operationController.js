const StockMove = require('../models/StockMove');
const OrderLine = require('../models/OrderLine');
const Product = require('../models/Product');
const Location = require('../models/Location');
const StockQuant = require('../models/StockQuant');
const sequelize = require('../config/database');

// Helper function to update product quantity
async function updateProductQuantity(product_id, quantity_change, transaction) {
  const product = await Product.findByPk(product_id, { transaction });
  if (product) {
    product.quantity = Math.max(0, product.quantity + quantity_change);
    await product.save({ transaction });
  }
  return product;
}

// Helper function to update stock quants
async function updateStockQuantity(product_id, location_id, quantity_change, transaction) {
  let stockQuant = await StockQuant.findOne({
    where: { product_id, location_id },
    transaction
  });

  if (!stockQuant) {
    stockQuant = await StockQuant.create({
      product_id,
      location_id,
      quantity: Math.max(0, quantity_change)
    }, { transaction });
  } else {
    stockQuant.quantity = Math.max(0, stockQuant.quantity + quantity_change);
    await stockQuant.save({ transaction });
  }

  return stockQuant;
}

exports.createOperation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      type,
      product_id,
      source_location_id,
      dest_location_id,
      quantity,
      reference,
      supplier,
      responsible,
      schedule_date,
      delivery_address,
      contact_person,
      order_lines // Array of { product_id, quantity, unit_price }
    } = req.body;

    // Validation
    if (!type) {
      await t.rollback();
      return res.status(400).json({ message: 'Operation type is required' });
    }

    // Create Stock Move (header)
    const move = await StockMove.create(
      {
        product_id: product_id || null,
        source_location_id: source_location_id || null,
        dest_location_id: dest_location_id || null,
        quantity: quantity || 0,
        type,
        reference: reference || `${type}/${Date.now()}`,
        status: 'Draft',
        responsible,
        schedule_date,
        delivery_address,
        contact_person,
      },
      { transaction: t }
    );

    // Handle multi-product operations (order lines)
    if (order_lines && Array.isArray(order_lines) && order_lines.length > 0) {
      for (const line of order_lines) {
        if (!line.product_id || !line.quantity || line.quantity <= 0) {
          await t.rollback();
          return res.status(400).json({ message: 'Invalid product or quantity in order lines' });
        }

        // Create order line
        await OrderLine.create({
          stock_move_id: move.id,
          product_id: line.product_id,
          quantity: line.quantity,
          unit_price: line.unit_price || 0,
          subtotal: (line.quantity || 0) * (line.unit_price || 0),
        }, { transaction: t });

        // Update stock based on operation type
        switch (type) {
          case 'IN': // Receipt
            if (!dest_location_id) {
              await t.rollback();
              return res.status(400).json({ message: 'Destination location required for receipts' });
            }
            await updateProductQuantity(line.product_id, line.quantity, t);
            await updateStockQuantity(line.product_id, dest_location_id, line.quantity, t);
            break;

          case 'OUT': // Delivery
            if (!source_location_id) {
              await t.rollback();
              return res.status(400).json({ message: 'Source location required for deliveries' });
            }
            await updateProductQuantity(line.product_id, -line.quantity, t);
            await updateStockQuantity(line.product_id, source_location_id, -line.quantity, t);
            break;

          case 'INT': // Transfer
            if (!source_location_id || !dest_location_id) {
              await t.rollback();
              return res.status(400).json({ message: 'Both locations required for transfers' });
            }
            await updateStockQuantity(line.product_id, source_location_id, -line.quantity, t);
            await updateStockQuantity(line.product_id, dest_location_id, line.quantity, t);
            break;

          case 'ADJ': // Adjustment
            if (!dest_location_id) {
              await t.rollback();
              return res.status(400).json({ message: 'Location required for adjustments' });
            }
            const currentQuant = await StockQuant.findOne({
              where: { product_id: line.product_id, location_id: dest_location_id },
              transaction: t
            });
            const currentQty = currentQuant ? currentQuant.quantity : 0;
            const adjustment = line.quantity - currentQty;
            await updateProductQuantity(line.product_id, adjustment, t);
            await updateStockQuantity(line.product_id, dest_location_id, adjustment, t);
            break;
        }
      }
    } else if (product_id && quantity) {
      // Single product operation (legacy support)
      switch (type) {
        case 'IN':
          if (!dest_location_id) {
            await t.rollback();
            return res.status(400).json({ message: 'Destination location required for receipts' });
          }
          await updateProductQuantity(product_id, quantity, t);
          await updateStockQuantity(product_id, dest_location_id, quantity, t);
          break;

        case 'OUT':
          if (!source_location_id) {
            await t.rollback();
            return res.status(400).json({ message: 'Source location required for deliveries' });
          }
          await updateProductQuantity(product_id, -quantity, t);
          await updateStockQuantity(product_id, source_location_id, -quantity, t);
          break;

        case 'INT':
          if (!source_location_id || !dest_location_id) {
            await t.rollback();
            return res.status(400).json({ message: 'Both locations required for transfers' });
          }
          await updateStockQuantity(product_id, source_location_id, -quantity, t);
          await updateStockQuantity(product_id, dest_location_id, quantity, t);
          break;

        case 'ADJ':
          if (!dest_location_id) {
            await t.rollback();
            return res.status(400).json({ message: 'Location required for adjustments' });
          }
          const currentQuant = await StockQuant.findOne({
            where: { product_id, location_id: dest_location_id },
            transaction: t
          });
          const currentQty = currentQuant ? currentQuant.quantity : 0;
          const adjustment = quantity - currentQty;
          await updateProductQuantity(product_id, adjustment, t);
          await updateStockQuantity(product_id, dest_location_id, adjustment, t);
          break;
      }
    }

    // Update move status to Done
    move.status = 'Done';
    await move.save({ transaction: t });

    await t.commit();

    // Fetch complete move with associations
    const completedMove = await StockMove.findByPk(move.id, {
      include: [
        { model: Product },
        { model: Location, as: 'SourceLocation' },
        { model: Location, as: 'DestLocation' },
        { model: OrderLine, include: [Product] },
      ],
    });

    res.json(completedMove);
  } catch (err) {
    await t.rollback();
    console.error('Operation Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getOperations = async (req, res) => {
  try {
    const { type, status, warehouse, location } = req.query;
    const where = {};

    if (type && type !== 'all') where.type = type;
    if (status && status !== 'all') where.status = status;

    const moves = await StockMove.findAll({
      where,
      include: [
        { model: Product },
        { model: Location, as: 'SourceLocation' },
        { model: Location, as: 'DestLocation' },
        { model: OrderLine, include: [Product] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(moves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getOperationById = async (req, res) => {
  try {
    const { id } = req.params;
    const move = await StockMove.findByPk(id, {
      include: [
        { model: Product },
        { model: Location, as: 'SourceLocation' },
        { model: Location, as: 'DestLocation' },
        { model: OrderLine, include: [Product] },
      ],
    });

    if (!move) {
      return res.status(404).json({ message: 'Operation not found' });
    }

    res.json(move);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateOperationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const move = await StockMove.findByPk(id);
    if (!move) {
      return res.status(404).json({ message: 'Operation not found' });
    }

    move.status = status;
    await move.save();

    const updatedMove = await StockMove.findByPk(id, {
      include: [
        { model: Product },
        { model: Location, as: 'SourceLocation' },
        { model: Location, as: 'DestLocation' },
        { model: OrderLine, include: [Product] },
      ],
    });

    res.json(updatedMove);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get stock quantities
exports.getProductStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stockQuants = await StockQuant.findAll({
      where: { product_id: id },
      include: [
        { model: Location },
        { model: Product }
      ]
    });

    const totalStock = stockQuants.reduce((sum, quant) => sum + quant.quantity, 0);

    res.json({
      product_id: id,
      total_quantity: totalStock,
      by_location: stockQuants
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllStock = async (req, res) => {
  try {
    const { location_id, product_id } = req.query;
    const where = {};

    if (location_id) where.location_id = location_id;
    if (product_id) where.product_id = product_id;

    const stockQuants = await StockQuant.findAll({
      where,
      include: [
        { model: Location },
        { model: Product }
      ],
      order: [['product_id', 'ASC']],
    });

    res.json(stockQuants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = exports;
