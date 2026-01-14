// src/controllers/admin.controller.js
const pool = require('../config/db');

/**
 * GET all visitors
 */
exports.getAllVisitors = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM visitor_entries
      ORDER BY in_time DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('getAllVisitors error:', error);
    res.status(500).json({ message: 'Failed to fetch visitors' });
  }
};

/**
 * Update interview status (pending / completed)
 */
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid interview status' });
    }

    const result = await pool.query(
      `
      UPDATE visitor_entries
      SET interview_status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.status(200).json({ message: 'Interview status updated successfully' });
  } catch (error) {
    console.error('updateInterviewStatus error:', error);
    res.status(500).json({ message: 'Failed to update interview status' });
  }
};

/**
 * Checkout visitor
 */
exports.checkoutVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE visitor_entries
      SET out_time = NOW(),
          visit_status = 'checked_out',
          updated_at = NOW()
      WHERE id = $1
        AND out_time IS NULL
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: 'Visitor already checked out or not found',
      });
    }

    res.status(200).json({ message: 'Visitor checked out successfully' });
  } catch (error) {
    console.error('checkoutVisitor error:', error);
    res.status(500).json({ message: 'Failed to checkout visitor' });
  }
};

/**
 * Delete visitor entry
 */
exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM visitor_entries WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('deleteVisitor error:', error);
    res.status(500).json({ message: 'Failed to delete visitor' });
  }
};
