const StockMove = require('../models/StockMove');
const Product = require('../models/Product');
const Location = require('../models/Location');
const sequelize = require('../config/database');

exports.createOperation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { product_id, source_location_id, dest_location_id, quantity, type, reference } = req.body;

    // Create Stock Move
    const move = await StockMove.create(
      {
        product_id,
        source_location_id,
        dest_location_id,
        quantity,
        type,
        reference,
        status: 'Done', // Auto-validate for now
      },
      { transaction: t }
    );

    // Update Stock Levels (Logic would go here if we were maintaining a separate stock count table,
    // but for now we calculate stock on the fly or rely on moves)
    // For a real system, we might update a 'stock_quant' table.
    // Since SRS says "stock increases automatically", we'll assume the move log IS the source of truth
    // or we'd update a summary table. For simplicity in this MVP, we'll stick to logging moves.

    await t.commit();
    res.json(move);
  } catch (err) {
    await t.rollback();
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getOperations = async (req, res) => {
  try {
    const { type } = req.query;
    const where = type ? { type } : {};
    
    const moves = await StockMove.findAll({
      where,
      include: [
        { model: Product },
        { model: Location, as: 'SourceLocation' },
        { model: Location, as: 'DestLocation' },
      ],
    });
    res.json(moves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
