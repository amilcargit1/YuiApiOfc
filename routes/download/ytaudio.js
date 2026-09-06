'use strict';
const express = require('express');
const router = express.Router();
const { ytmp3 } = require('jer-api');
router.get('/', async (req, res) => {
  const url = String(req.query.url || '').trim();
  if (!url) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'URL de YouTube requerida.' });
  try {
    const data = await ytmp3(url);
    res.json({ status: true, creator: 'YuiAPI', data });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'No se pudo procesar el audio de YouTube.' }); }
});
module.exports = router;
