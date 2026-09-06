'use strict';

const jwt = require('jsonwebtoken');
const { findUser, updateUser } = require('../lib/store');

function getApiKey(req) {
  const header = req.get('x-api-key');
  if (header) return header.trim();
  const auth = req.get('authorization');
  if (auth && /^Bearer\s+/i.test(auth)) return auth.replace(/^Bearer\s+/i, '').trim();
  if (req.query.apiKey) return String(req.query.apiKey).trim();
  return '';
}

function getJwt(req) {
  const auth = req.get('authorization');
  if (!auth || !/^Bearer\s+/i.test(auth)) return '';
  return auth.replace(/^Bearer\s+/i, '').trim();
}

function authHandler(req, res, next) {
  const apiKey = getApiKey(req);
  const expected = process.env.YUI_API_KEY || process.env.API_KEY || '';

  if (expected && apiKey === expected) {
    req.apiKey = apiKey;
    req.apiUser = { id: 'env-admin', username: process.env.YUI_ADMIN_USERNAME || 'Yui', email: process.env.YUI_ADMIN_EMAIL || '', role: 'admin', plan: 'admin', limit: 1000000, source: 'api-key' };
    return next();
  }

  const token = getJwt(req);
  const secret = process.env.YUI_JWT_SECRET || process.env.JWT_SECRET || '';
  if (!token || !secret) return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'Autenticación requerida. Usa API key o Bearer token.' });

  try {
    const payload = jwt.verify(token, secret);
    if (payload.sub === 'env-admin' && process.env.YUI_ADMIN_EMAIL) {
      req.apiUser = { id: 'env-admin', username: process.env.YUI_ADMIN_USERNAME || 'Yui', email: process.env.YUI_ADMIN_EMAIL, role: 'admin', plan: 'admin', limit: 1000000, source: 'jwt' };
      req.authType = 'jwt';
      return next();
    }

    const user = findUser('id', payload.sub);
    if (!user) return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'Sesión inválida.' });

    if (user.vipExpires && new Date() > new Date(user.vipExpires)) {
      updateUser(user.id, { role: 'user', plan: 'free', limit: 100, vipSince: null, vipExpires: null });
      user.role = 'user'; user.plan = 'free'; user.limit = 100; user.vipSince = null; user.vipExpires = null;
    }

    req.apiKey = user.key;
    req.apiUser = user;
    req.authType = 'jwt';
    next();
  } catch {
    return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'Token inválido o expirado.' });
  }
}

function adminOnly(req, res, next) {
  if (req.apiUser?.role !== 'admin') return res.status(403).json({ status: false, creator: 'YuiAPI', error: 'Se requiere acceso de administrador.' });
  next();
}

function countRequest(req, res, next) {
  if (!req.apiUser?.id || req.apiUser.id === 'env-admin') return next();
  const user = findUser('id', req.apiUser.id);
  if (!user) return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'Usuario no encontrado.' });
  const today = new Date().toISOString().slice(0, 10);
  const requestToday = user.lastRequestDate === today ? (user.requestToday || 0) : 0;
  if (requestToday >= (user.limit || 100)) return res.status(429).json({ status: false, creator: 'YuiAPI', error: `Límite diario alcanzado (${user.limit || 100}).` });
  updateUser(user.id, { requestToday: requestToday + 1, totalRequest: (user.totalRequest || 0) + 1, lastRequestDate: today });
  next();
}

module.exports = { authHandler, adminOnly, countRequest, getApiKey, getJwt };
