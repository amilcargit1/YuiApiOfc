'use strict';
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  const query = String(req.query.query || '').trim();
  const type = String(req.query.type || '').trim().toLowerCase();
  if (!query) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'El parámetro query es requerido.' });
  if (query.length > 100) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'La búsqueda es demasiado larga.' });
  try {
    const source = `/search/pins/?q=${encodeURIComponent(query)}&rs=typed`;
    const params = new URLSearchParams({ source_url: source, query, _: String(Date.now()), data: JSON.stringify({ options: { query, rs: 'typed', scope: 'pins', redux_normalize_feed: true, source_url: source }, context: {} }) });
    const response = await fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?${params.toString()}`, { headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0', 'x-requested-with': 'XMLHttpRequest' } });
    const payload = await response.json();
    let results = payload?.resource_response?.data?.results || [];
    results = results.map((item) => ({ id: item.id || '', pin: item.id ? `https://www.pinterest.com/pin/${item.id}` : null, title: item.grid_title || '', description: item.description || '', image_url: item.images?.orig?.url || null, link: item.link || null, type: item.videos ? 'video' : item.embed?.type === 'gif' ? 'gif' : 'image', video_url: item.videos ? item.videos.video_list?.V_HLSV4?.url || Object.values(item.videos.video_list || {})[0]?.url || null : null }));
    if (type) results = results.filter((item) => item.type === type);
    res.json({ status: true, creator: 'YuiAPI', data: results });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'Proveedor de búsqueda Pinterest no disponible.' }); }
});
module.exports = router;
