const express = require('express');
const router = express.Router();
const { checkInVisitor } = require('../controllers/visitor.controller');

router.post('/checkin', checkInVisitor);

module.exports = router;
