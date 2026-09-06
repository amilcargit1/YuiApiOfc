'use strict';
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  const url = String(req.query.url || '').trim();
  if (!url) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Debes proporcionar una URL de TikTok.' });
  try {
    const response = await fetch('https://www.tikwm.com/api/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url }) });
    const data = await response.json();
    if (!response.ok || data.code !== 0 || !data.data) return res.status(502).json({ status: false, creator: 'YuiAPI', error: data.msg || 'No se pudo procesar TikTok.' });
    const v = data.data;
    res.json({ status: true, creator: 'YuiAPI', data: { id: v.id, title: v.title, duration: v.duration, author: v.author ? { username: v.author.unique_id, nickname: v.author.nickname, avatar: v.author.avatar } : null, music: v.music_info ? { title: v.music_info.title, author: v.music_info.author, url: v.music } : null, media: { no_watermark: v.play, watermark: v.wmplay, hd: v.hdplay } } });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'Proveedor de TikTok no disponible.' }); }
});
module.exports = router;
