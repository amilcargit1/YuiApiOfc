'use strict';

const express = require('express');
const router = express.Router();

const endpoints = [
  { method: 'GET', path: '/api', category: 'core', auth: false, description: 'Información general de YuiAPI.', test: true },
  { method: 'GET', path: '/api/health', category: 'core', auth: false, description: 'Estado y salud del servidor.', test: true },
  { method: 'GET', path: '/api/info', category: 'core', auth: false, description: 'Catálogo JSON de todos los endpoints.', test: true },
  { method: 'GET', path: '/api/auth/status', category: 'auth', auth: false, description: 'Estado del sistema de autenticación.', test: true },
  { method: 'POST', path: '/api/auth/register', category: 'auth', auth: false, description: 'Crea una cuenta Yui y devuelve sesión JWT + API key.', test: false },
  { method: 'POST', path: '/api/auth/login', category: 'auth', auth: false, description: 'Inicia sesión y devuelve JWT.', test: false },
  { method: 'POST', path: '/api/auth/logout', category: 'auth', auth: true, description: 'Cierra la sesión del cliente.', test: false },
  { method: 'GET', path: '/api/auth/me', category: 'auth', auth: true, description: 'Consulta el perfil de la sesión actual.', test: false },
  { method: 'PUT', path: '/api/auth/profile', category: 'auth', auth: true, description: 'Actualiza el perfil de la sesión.', test: false },
  { method: 'GET', path: '/api/auth/stats', category: 'auth', auth: false, description: 'Estadísticas públicas de YuiAPI.', test: true },
  { method: 'GET', path: '/api/auth/dashboard-global', category: 'auth-admin', auth: true, description: 'Estadísticas globales para administrador.', test: false },
  { method: 'GET', path: '/api/auth/admin/all', category: 'auth-admin', auth: true, description: 'Lista de usuarios para administrador.', test: false },
  { method: 'POST', path: '/api/auth/admin/update', category: 'auth-admin', auth: true, description: 'Actualiza un usuario desde administración.', test: false },
  { method: 'POST', path: '/api/auth/admin/delete', category: 'auth-admin', auth: true, description: 'Elimina un usuario desde administración.', test: false },
  { method: 'GET', path: '/api/ai/gemini?text=Hola', category: 'ai', auth: false, description: 'Generación de texto con Gemini.', test: true },
  { method: 'GET', path: '/api/tools/qr?text=Hola', category: 'tools', auth: false, description: 'Genera datos para un código QR.', test: true },
  { method: 'GET', path: '/api/tools/ssweb?url=https%3A%2F%2Fexample.com', category: 'tools', auth: false, description: 'Obtiene URL de captura web.', test: true },
  { method: 'GET', path: '/api/search/pinterest?query=anime', category: 'search', auth: false, description: 'Busca contenido público en Pinterest.', test: true },
  { method: 'GET', path: '/api/search/tiktok?query=anime', category: 'search', auth: false, description: 'Busca contenido público en TikTok.', test: true },
  { method: 'GET', path: '/api/download/facebook?url=URL', category: 'download', auth: false, description: 'Procesa medios públicos de Facebook.', test: true },
  { method: 'GET', path: '/api/download/instagram?url=URL', category: 'download', auth: false, description: 'Procesa medios públicos de Instagram.', test: true },
  { method: 'GET', path: '/api/download/twitter?url=URL', category: 'download', auth: false, description: 'Procesa medios públicos de X/Twitter.', test: true },
  { method: 'GET', path: '/api/download/pinterest?url=URL', category: 'download', auth: false, description: 'Procesa medios públicos de Pinterest.', test: true },
  { method: 'GET', path: '/api/download/tiktok?url=URL', category: 'download', auth: false, description: 'Procesa contenido público de TikTok.', test: true },
  { method: 'GET', path: '/api/download/ytaudio?url=URL', category: 'download', auth: false, description: 'Procesa audio de una URL de YouTube.', test: true },
  { method: 'GET', path: '/api/download/ytvideo?url=URL', category: 'download', auth: false, description: 'Procesa video de una URL de YouTube.', test: true }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    api: { name: 'YuiAPI OFC', creator: 'Yui', version: '1.3.0', style: 'YuiBot-MD', runtime: 'Node.js', framework: 'Express', database: 'JSON local', orm: null, authentication: ['API key', 'JWT'], publicApi: true },
    categories: [...new Set(endpoints.map(endpoint => endpoint.category))],
    totalEndpoints: endpoints.length,
    endpoints,
    responseFormat: { success: true, creator: 'YuiAPI', data: {} }
  });
});

module.exports = router;
