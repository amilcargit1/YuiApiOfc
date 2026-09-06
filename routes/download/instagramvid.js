'use strict';
const express = require('express');
const router = express.Router();
const { igdl } = require('jer-api');
router.get('/', async (req, res) => {
  const url = String(req.query.url || '').trim();
  if (!url) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Debes proporcionar una URL de Instagram.' });
  try {
    const data = await igdl(url);
    const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    if (!items.length) return res.status(404).json({ status: false, creator: 'YuiAPI', error: 'No se encontraron medios públicos.' });
    res.json({ status: true, creator: 'YuiAPI', data: items });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'No se pudo procesar Instagram.' }); }
});
module.exports = router;
