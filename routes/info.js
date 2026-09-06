'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    api: {
      name: 'YuiAPI OFC',
      version: '1.0.0',
      style: 'YuiBot-MD',
      runtime: 'Node.js',
      framework: 'Express',
      database: null,
      orm: null,
    },
    categories: [],
    endpoints: [],
  });
});

module.exports = router;
