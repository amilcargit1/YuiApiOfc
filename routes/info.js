'use strict';
const express = require('express');
const router = express.Router();

const endpoints = [
  { method: 'POST', path: '/api/auth/register', auth: false },
  { method: 'POST', path: '/api/auth/login', auth: false },
  { method: 'GET', path: '/api/auth/me', auth: true },
  { method: 'POST', path: '/api/auth/update-profile', auth: true },
  { method: 'GET', path: '/api/auth/stats', auth: true },
  { method: 'GET', path: '/api/auth/dashboard-global', auth: true },
  { method: 'GET', path: '/api/auth/admin/all', auth: true },
  { method: 'POST', path: '/api/auth/admin/update', auth: true },
  { method: 'POST', path: '/api/auth/admin/delete', auth: true },
  { method: 'GET', path: '/api/ai/gemini?text=Hola', auth: true },
  { method: 'GET', path: '/api/tools/qr?text=Hola', auth: true },
  { method: 'GET', path: '/api/tools/ssweb?url=https://example.com', auth: true },
  { method: 'GET', path: '/api/search/pinterest?query=anime', auth: true },
  { method: 'GET', path: '/api/search/tiktok?query=anime', auth: true },
  { method: 'GET', path: '/api/download/facebook?url=URL', auth: true },
  { method: 'GET', path: '/api/download/instagram?url=URL', auth: true },
  { method: 'GET', path: '/api/download/twitter?url=URL', auth: true },
  { method: 'GET', path: '/api/download/pinterest?url=URL', auth: true },
  { method: 'GET', path: '/api/download/tiktok?url=URL', auth: true },
  { method: 'GET', path: '/api/download/ytaudio?url=URL', auth: true },
  { method: 'GET', path: '/api/download/ytvideo?url=URL', auth: true }
];

router.get('/', (req, res) => res.json({ success: true, api: { name: 'YuiAPI OFC', creator: 'Yui', version: '1.1.0', style: 'YuiBot-MD', runtime: 'Node.js', framework: 'Express', database: 'JSON local', orm: null }, categories: ['auth', 'ai', 'tools', 'search', 'download'], totalEndpoints: endpoints.length, endpoints }));
module.exports = router;
