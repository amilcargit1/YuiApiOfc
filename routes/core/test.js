'use strict';
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const checks = [];
  const started = Date.now();

  checks.push({ name: 'server', status: 'ok', latencyMs: Date.now() - started });

  try {
    const response = await fetch('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=YuiAPI', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    checks.push({ name: 'qr-provider', status: response.ok ? 'ok' : 'degraded', http: response.status });
  } catch (error) {
    checks.push({ name: 'qr-provider', status: 'degraded', error: error.name === 'TimeoutError' ? 'timeout' : 'unreachable' });
  }

  const healthy = checks.every(check => check.status === 'ok');
  res.status(healthy ? 200 : 207).json({
    status: healthy,
    code: healthy ? 200 : 207,
    creator: 'YuiAPI',
    message: healthy ? 'Todos los checks básicos están operativos.' : 'El servidor está operativo, pero algún proveedor externo está degradado.',
    data: {
      server: 'online',
      publicApi: true,
      prisma: false,
      checks,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
