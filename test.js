require('dotenv').config(); // ✅ REQUIRED

const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

(async () => {
  try {
    const email = 'rajni@careervala.com';
    const plainPassword = 'Admin@20';

    // Check if admin already exists
    const existing = await pool.query(
      'SELECT id FROM admins WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hash = await bcrypt.hash(plainPassword, 10);

    await pool.query(
      'INSERT INTO admins (email, password) VALUES ($1, $2)',
      [email, hash]
    );

    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
})();
