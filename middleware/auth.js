'use strict';

function getApiKey(req) {
  const header = req.get('x-api-key');
  if (header) return header.trim();
  const auth = req.get('authorization');
  if (auth && /^Bearer\s+/i.test(auth)) return auth.replace(/^Bearer\s+/i, '').trim();
  if (req.query.apiKey) return String(req.query.apiKey).trim();
  return '';
}

function authHandler(req, res, next) {
  const expected = process.env.YUI_API_KEY || process.env.API_KEY || '';
  const key = getApiKey(req);
  if (!expected) return res.status(503).json({ status: false, creator: 'YuiAPI', error: 'YUI_API_KEY no está configurada.' });
  if (!key || key !== expected) return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'API key inválida o faltante.' });
  req.apiKey = key;
  req.apiUser = { role: 'admin' };
  next();
}

function adminOnly(req, res, next) { next(); }
function countRequest() {}
module.exports = { authHandler, adminOnly, countRequest, getApiKey };
