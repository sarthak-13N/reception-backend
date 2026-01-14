// reception-backend/src/controllers/visitor.controller.js
const pool = require('../config/db');

exports.checkInVisitor = async (req, res) => {
  try {
    const {
      name,
      mobile,
      referral,
      reason,
      interviewRole,
      privacyConsent,
    } = req.body;

    if (!name || !mobile || !reason || privacyConsent !== true) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // ✅ Role required for Interview & Inquiry
    if (
      ['Interview', 'Inquiry'].includes(reason) &&
      !interviewRole
    ) {
      return res.status(400).json({
        message: 'Role is required for Interview and Inquiry',
      });
    }

    const query = `
      INSERT INTO visitor_entries
      (
        name,
        mobile,
        referral,
        reason,
        interview_role,
        privacy_consent,
        in_time,
        interview_status,
        visit_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'pending', 'inside')
      RETURNING id, in_time
    `;

    const values = [
      name,
      mobile,
      referral || null,
      reason,
      ['Interview', 'Inquiry'].includes(reason)
        ? interviewRole
        : null,
      privacyConsent,
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: 'Check-in successful',
      data: rows[0],
    });
  } catch (error) {
    console.error('Visitor check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
