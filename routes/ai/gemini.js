'use strict';
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const text = String(req.query.text || '').trim();
  if (!text) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'El parámetro text es requerido.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ status: false, creator: 'YuiAPI', error: 'GEMINI_API_KEY no está configurada en Render.' });
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
    const prompt = String(req.query.promptSystem || '').trim();
    const contents = [];
    if (prompt) contents.push({ role: 'user', parts: [{ text: prompt }] });
    contents.push({ role: 'user', parts: [{ text }] });
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents }) });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ status: false, creator: 'YuiAPI', error: data.error?.message || 'Gemini rechazó la solicitud.' });
    const answer = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim() || '';
    res.json({ status: true, creator: 'YuiAPI', data: { response: answer, model } });
  } catch { res.status(502).json({ status: false, creator: 'YuiAPI', error: 'No se pudo conectar con Gemini.' }); }
});
module.exports = router;
