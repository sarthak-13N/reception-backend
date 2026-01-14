// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const visitorRoutes = require('./routes/visitor.routes');
const adminRoutes = require('./routes/admin.routes');
const adminAuthRoutes = require('./routes/admin.auth.routes');

const app = express();

/* ---------- GLOBAL MIDDLEWARE (MUST COME FIRST) ---------- */
app.use(cors());
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use('/api/admin/auth', adminAuthRoutes); // login
app.use('/api/visitor', visitorRoutes);      // public
app.use('/api/admin', adminRoutes);           // protected

/* ---------- HEALTH ---------- */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;
