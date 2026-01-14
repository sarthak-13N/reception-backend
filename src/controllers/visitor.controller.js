const pool = require('../config/db');

exports.checkInVisitor = async (req, res) => {
  try {
    const { name, mobile, referral, reason, privacyConsent } = req.body;

    if (!name || !mobile || !reason || privacyConsent !== true) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const query = `
      INSERT INTO visitor_entries
      (name, mobile, referral, reason, privacy_consent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, in_time
    `;

    const values = [name, mobile, referral, reason, privacyConsent];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: 'Check-in successful',
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
