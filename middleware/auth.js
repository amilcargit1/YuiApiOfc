'use strict';

const { findUser, updateUser } = require('../lib/store');

function getApiKey(req) {
  const header = req.get('x-api-key');
  if (header) return header.trim();
  const auth = req.get('authorization');
  if (auth && /^Bearer\s+/i.test(auth)) return auth.replace(/^Bearer\s+/i, '').trim();
  if (req.query.apiKey) return String(req.query.apiKey).trim();
  return '';
}

function authHandler(req, res, next) {
  const key = getApiKey(req);
  const adminKey = process.env.YUI_ADMIN_KEY || '';
  const user = key && adminKey && key === adminKey ? { role: 'admin', key } : findUser('key', key);
  if (!user) return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'API key inválida o faltante.' });
  req.apiKey = key;
  req.apiUser = user;
  next();
}

function adminOnly(req, res, next) {
  if (req.apiUser?.role !== 'admin') return res.status(403).json({ status: false, creator: 'YuiAPI', error: 'Se requiere acceso de administrador.' });
  next();
}

function countRequest(req) {
  if (!req.apiUser?.id) return;
  const user = findUser('id', req.apiUser.id);
  if (!user) return;
  const today = new Date().toISOString().slice(0, 10);
  const requestToday = user.lastRequestDate === today ? (user.requestToday || 0) + 1 : 1;
  updateUser(user.id, { requestToday, totalRequest: (user.totalRequest || 0) + 1, lastRequestDate: today });
}

module.exports = { authHandler, adminOnly, countRequest, getApiKey };
