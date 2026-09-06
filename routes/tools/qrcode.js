'use strict';
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  const text = String(req.query.text || '').trim();
  if (!text) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Debes proporcionar ?text=' });
  const size = Math.min(Math.max(Number(req.query.size) || 500, 100), 1200);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  if (String(req.query.redirect) === 'true') return res.redirect(url);
  res.json({ status: true, creator: 'YuiAPI', data: { text, size, format: 'png', url } });
});
module.exports = router;
