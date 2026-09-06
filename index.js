'use strict';

require('dotenv').config();

const express = require('express');
const path = require('node:path');

const healthRouter = require('./routes/health');
const infoRouter = require('./routes/info');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const startedAt = Date.now();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/health', healthRouter);
app.use('/api/info', infoRouter);

app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'YuiAPI OFC',
    version: '1.0.0',
    status: 'online',
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    message: 'YuiAPI está funcionando correctamente.',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Endpoint no encontrado.',
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error('[YuiAPI] Error:', err);

  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: 'Error interno del servidor.',
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`🌸 YuiAPI OFC escuchando en http://${HOST}:${PORT}`);
  console.log('✨ Base limpia iniciada sin Prisma ni base de datos.');
});

function shutdown(signal) {
  console.log(`[YuiAPI] ${signal}: cerrando servidor...`);
  server.close(() => {
    console.log('[YuiAPI] Servidor cerrado.');
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = { app, server };
