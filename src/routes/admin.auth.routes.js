const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile
} = require('../controllers/admin.auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public
router.post('/login', loginAdmin);

// Protected
router.get('/me', authMiddleware, getAdminProfile);

module.exports = router;
