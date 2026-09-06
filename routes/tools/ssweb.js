'use strict';
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  const target = String(req.query.url || '').trim();
  if (!target) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Debes proporcionar ?url=' });
  let parsed;
  try { parsed = new URL(target); } catch { return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'URL inválida.' }); }
  if (!/^https?:$/.test(parsed.protocol)) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Solo se permiten URLs HTTP/HTTPS.' });
  const width = Math.min(Math.max(Number(req.query.width) || 1280, 320), 2000);
  const screenshot = `https://image.thum.io/get/width/${width}/fullpage/${encodeURIComponent(parsed.href)}`;
  if (String(req.query.redirect) === 'true') return res.redirect(screenshot);
  res.json({ status: true, creator: 'YuiAPI', data: { url: parsed.href, screenshot } });
});
module.exports = router;
