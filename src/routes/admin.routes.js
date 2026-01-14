const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getAllVisitors,
  updateInterviewStatus,
  checkoutVisitor,
  deleteVisitor,
} = require('../controllers/admin.controller');

// ALL routes below are protected
router.use(authMiddleware);

router.get('/visitors', getAllVisitors);
router.patch('/interview-status/:id', updateInterviewStatus);
router.patch('/checkout/:id', checkoutVisitor);
router.delete('/visitor/:id', deleteVisitor);

module.exports = router;
