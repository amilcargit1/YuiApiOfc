'use strict';
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  const query = String(req.query.query || '').trim();
  if (!query) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'El parámetro query es requerido.' });
  if (query.length > 100) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'La búsqueda es demasiado larga.' });
  try {
    const body = new URLSearchParams({ keywords: query, count: '10', cursor: '0', HD: '1' });
    const response = await fetch('https://www.tikwm.com/api/feed/search', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'user-agent': 'YuiAPI/1.0' }, body });
    const data = await response.json();
    res.json({ status: true, creator: 'YuiAPI', data: data?.data?.videos || [], timestamp: new Date().toISOString() });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'Proveedor de búsqueda TikTok no disponible.' }); }
});
module.exports = router;
