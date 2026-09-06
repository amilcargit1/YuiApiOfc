'use strict';

require('dotenv').config();

const express = require('express');
const path = require('node:path');
const { authHandler, countRequest } = require('./middleware/auth');

const healthRouter = require('./routes/health');
const infoRouter = require('./routes/info');
const testRouter = require('./routes/core/test');
const authRouter = require('./routes/auth');
const geminiRouter = require('./routes/ai/gemini');
const qrRouter = require('./routes/tools/qrcode');
const sswebRouter = require('./routes/tools/ssweb');
const pinterestSearchRouter = require('./routes/search/pinterest');
const tiktokSearchRouter = require('./routes/search/tiktok');
const facebookRouter = require('./routes/download/facebookvid');
const instagramRouter = require('./routes/download/instagramvid');
const twitterRouter = require('./routes/download/twitter');
const pinterestRouter = require('./routes/download/pinterest');
const tiktokRouter = require('./routes/download/tiktok');
const ytAudioRouter = require('./routes/download/ytaudio');
const ytVideoRouter = require('./routes/download/ytvideo');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const startedAt = Date.now();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.use('/api/health', healthRouter);
app.use('/api/info', infoRouter);
app.use('/api/test', testRouter);
app.use('/api/auth', authRouter);

// Los endpoints de herramientas, búsquedas y descargas son públicos.
// authHandler solo identifica opcionalmente al usuario para estadísticas/límites.
const publicRoutes = [
  ['/api/ai/gemini', geminiRouter],
  ['/api/tools/qr', qrRouter],
  ['/api/tools/ssweb', sswebRouter],
  ['/api/search/pinterest', pinterestSearchRouter],
  ['/api/search/tiktok', tiktokSearchRouter],
  ['/api/download/facebook', facebookRouter],
  ['/api/download/instagram', instagramRouter],
  ['/api/download/twitter', twitterRouter],
  ['/api/download/pinterest', pinterestRouter],
  ['/api/download/tiktok', tiktokRouter],
  ['/api/download/ytaudio', ytAudioRouter],
  ['/api/download/ytvideo', ytVideoRouter]
];

for (const [route, handler] of publicRoutes) {
  app.use(route, authHandler, countRequest, handler);
}

app.get('/api', (req, res) => {
  res.json({
    status: true,
    code: 200,
    creator: 'YuiAPI',
    message: 'YuiAPI está funcionando correctamente.',
    data: {
      name: 'YuiAPI OFC',
      version: '1.4.0',
      status: 'online',
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      publicApi: true,
      authentication: ['API key', 'JWT session']
    }
  });
});

app.use((req, res) => res.status(404).json({ status: false, code: 404, creator: 'YuiAPI', message: 'Endpoint no encontrado.', data: null, path: req.originalUrl }));
app.use((err, req, res, next) => {
  console.error('[YuiAPI] Error:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ status: false, code: err.status || 500, creator: 'YuiAPI', message: 'Error interno del servidor.', data: null });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`🌸 YuiAPI OFC escuchando en ${HOST}:${PORT}`);
  console.log('✨ YuiAPI pública, con registro/login opcional y sin Prisma.');
});

function shutdown(signal) {
  console.log(`[YuiAPI] ${signal}: cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = { app, server };
