'use strict';
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  const url = String(req.query.url || '').trim();
  if (!url) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'URL requerida.' });
  try {
    const response = await fetch(`https://api.vreden.my.id/api/twitter?url=${encodeURIComponent(url)}`, { headers: { accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok || !data?.result) return res.status(502).json({ status: false, creator: 'YuiAPI', error: 'No se pudo procesar X/Twitter.' });
    res.json({ status: true, creator: 'YuiAPI', data: data.result });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'Proveedor de X/Twitter no disponible.' }); }
});
module.exports = router;
