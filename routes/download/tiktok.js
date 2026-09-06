'use strict';
const express = require('express');
const router = express.Router();

function ok(res, data, message = 'Success') {
  return res.json({ status: true, code: 200, creator: 'YuiAPI', message, data });
}

function fail(res, code, message, error = null) {
  return res.status(code).json({ status: false, code, creator: 'YuiAPI', message, data: null, ...(error ? { error } : {}) });
}

router.get('/', async (req, res) => {
  const url = String(req.query.url || '').trim();
  if (!url) return fail(res, 400, 'Debes proporcionar una URL de TikTok.');
  try {
    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'YuiAPI/1.0' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(15000)
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.code === 0 && data?.data) {
      const v = data.data;
      return ok(res, {
        id: v.id,
        title: v.title,
        duration: v.duration,
        author: v.author ? { username: v.author.unique_id, nickname: v.author.nickname, avatar: v.author.avatar } : null,
        music: v.music_info ? { title: v.music_info.title, author: v.music_info.author, url: v.music } : null,
        media: { no_watermark: v.play, watermark: v.wmplay, hd: v.hdplay }
      });
    }
  } catch {}

  // Fallback: jer-api usa otro proveedor y puede funcionar cuando TikWM no responde.
  try {
    const { tiktok } = require('jer-api');
    const data = await tiktok(url);
    if (data) return ok(res, data, 'TikTok procesado mediante proveedor alternativo.');
  } catch {}

  return fail(res, 502, 'Los proveedores de TikTok no respondieron correctamente. Intenta nuevamente más tarde.');
});

module.exports = router;
