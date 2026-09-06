'use strict';
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  const url = String(req.query.url || '').trim();
  if (!url) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Debes proporcionar una URL de Pinterest.' });
  try {
    const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0', accept: 'text/html,application/xhtml+xml' } });
    const html = await response.text();
    const match = html.match(/<meta[^>]+property=["']og:(?:video|image)["'][^>]+content=["']([^"']+)/i);
    const title = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] || '';
    if (!match) return res.status(404).json({ status: false, creator: 'YuiAPI', error: 'No se encontró un medio público en el Pin.' });
    res.json({ status: true, creator: 'YuiAPI', data: { title, media: match[1], original_url: url } });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'No se pudo procesar Pinterest.' }); }
});
module.exports = router;
