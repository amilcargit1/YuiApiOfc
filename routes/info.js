'use strict';

const express = require('express');
const router = express.Router();

const endpoints = [
  { method: 'GET', path: '/api', category: 'core', auth: false },
  { method: 'GET', path: '/api/health', category: 'core', auth: false },
  { method: 'GET', path: '/api/info', category: 'core', auth: false },
  { method: 'GET', path: '/api/auth/status', category: 'auth', auth: false },
  { method: 'POST', path: '/api/auth/register', category: 'auth', auth: false },
  { method: 'POST', path: '/api/auth/login', category: 'auth', auth: false },
  { method: 'POST', path: '/api/auth/logout', category: 'auth', auth: true },
  { method: 'GET', path: '/api/auth/me', category: 'auth', auth: true },
  { method: 'PUT', path: '/api/auth/profile', category: 'auth', auth: true },
  { method: 'GET', path: '/api/auth/stats', category: 'auth', auth: false },
  { method: 'GET', path: '/api/auth/dashboard-global', category: 'auth', auth: false },
  { method: 'GET', path: '/api/auth/admin/all', category: 'auth-admin', auth: true },
  { method: 'POST', path: '/api/auth/admin/update', category: 'auth-admin', auth: true },
  { method: 'POST', path: '/api/auth/admin/delete', category: 'auth-admin', auth: true },
  { method: 'GET', path: '/api/ai/gemini?text=Hola', category: 'ai', auth: true },
  { method: 'GET', path: '/api/tools/qr?text=Hola', category: 'tools', auth: true },
  { method: 'GET', path: '/api/tools/ssweb?url=https://example.com', category: 'tools', auth: true },
  { method: 'GET', path: '/api/search/pinterest?query=anime', category: 'search', auth: true },
  { method: 'GET', path: '/api/search/tiktok?query=anime', category: 'search', auth: true },
  { method: 'GET', path: '/api/download/facebook?url=URL', category: 'download', auth: true },
  { method: 'GET', path: '/api/download/instagram?url=URL', category: 'download', auth: true },
  { method: 'GET', path: '/api/download/twitter?url=URL', category: 'download', auth: true },
  { method: 'GET', path: '/api/download/pinterest?url=URL', category: 'download', auth: true },
  { method: 'GET', path: '/api/download/tiktok?url=URL', category: 'download', auth: true },
  { method: 'GET', path: '/api/download/ytaudio?url=URL', category: 'download', auth: true },
  { method: 'GET', path: '/api/download/ytvideo?url=URL', category: 'download', auth: true }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    api: { name: 'YuiAPI OFC', creator: 'Yui', version: '1.2.0', style: 'YuiBot-MD', runtime: 'Node.js', framework: 'Express', database: 'JSON local', orm: null, authentication: ['API key', 'JWT'] },
    categories: [...new Set(endpoints.map(endpoint => endpoint.category))],
    totalEndpoints: endpoints.length,
    endpoints
  });
});

module.exports = router;
