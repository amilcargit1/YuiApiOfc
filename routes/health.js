'use strict';

const express = require('express');

const router = express.Router();
const startedAt = Date.now();

router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'YuiAPI OFC',
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
