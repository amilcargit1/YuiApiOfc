'use strict';

const crypto = require('node:crypto');

// En producción se recomienda definir YUI_JWT_SECRET en Render.
// Si no existe, usamos un secreto aleatorio de esta ejecución para que
// registro/login sigan funcionando en una API pública sin romper el arranque.
const runtimeSecret = crypto.randomBytes(48).toString('hex');

function getJwtSecret() {
  return process.env.YUI_JWT_SECRET || process.env.JWT_SECRET || runtimeSecret;
}

function isConfigured() {
  return Boolean(process.env.YUI_JWT_SECRET || process.env.JWT_SECRET);
}

module.exports = { getJwtSecret, isConfigured };
