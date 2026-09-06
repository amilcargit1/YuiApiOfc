'use strict';

const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../lib/jwt');
const { findUser, updateUser } = require('../lib/store');

function getApiKey(req) {
  const header = req.get('x-api-key');
  if (header) return header.trim();
  if (req.query.apiKey) return String(req.query.apiKey).trim();
  return '';
}

function getJwt(req) {
  const auth = req.get('authorization');
  if (!auth || !/^Bearer\s+/i.test(auth)) return '';
  return auth.replace(/^Bearer\s+/i, '').trim();
}

function setAnonymous(req) {
  req.apiUser = null;
  req.apiKey = undefined;
  req.authType = 'anonymous';
}

function authHandler(req, res, next) {
  const apiKey = getApiKey(req);
  const token = getJwt(req);
  const hasCredentials = Boolean(apiKey || token);
  const expected = process.env.YUI_API_KEY || process.env.API_KEY || '';

  // YuiAPI es pública. Las credenciales son opcionales para endpoints públicos.
  if (!hasCredentials) {
    setAnonymous(req);
    return next();
  }

  if (expected && apiKey === expected) {
    req.apiKey = apiKey;
    req.apiUser = {
      id: 'env-admin',
      username: process.env.YUI_ADMIN_USERNAME || 'Yui',
      email: process.env.YUI_ADMIN_EMAIL || '',
      role: 'admin',
      plan: 'admin',
      limit: 1000000,
      source: 'api-key'
    };
    req.authType = 'api-key';
    return next();
  }

  const keyUser = apiKey ? findUser('key', apiKey) : null;
  if (keyUser) {
    if (keyUser.vipExpires && new Date() > new Date(keyUser.vipExpires)) {
      updateUser(keyUser.id, { role: 'user', plan: 'free', limit: 100, vipSince: null, vipExpires: null });
      keyUser.role = 'user';
      keyUser.plan = 'free';
      keyUser.limit = 100;
      keyUser.vipSince = null;
      keyUser.vipExpires = null;
    }
    req.apiKey = keyUser.key;
    req.apiUser = keyUser;
    req.authType = 'api-key';
    return next();
  }

  if (token) {
    try {
      const payload = jwt.verify(token, getJwtSecret());
      if (payload.sub === 'env-admin') {
        req.apiUser = {
          id: 'env-admin',
          username: process.env.YUI_ADMIN_USERNAME || 'Yui',
          email: process.env.YUI_ADMIN_EMAIL || '',
          key: process.env.YUI_API_KEY || '',
          role: 'admin',
          plan: 'admin',
          limit: 1000000,
          source: 'jwt'
        };
        req.authType = 'jwt';
        return next();
      }

      const user = findUser('id', payload.sub);
      if (user) {
        if (user.vipExpires && new Date() > new Date(user.vipExpires)) {
          updateUser(user.id, { role: 'user', plan: 'free', limit: 100, vipSince: null, vipExpires: null });
          user.role = 'user';
          user.plan = 'free';
          user.limit = 100;
          user.vipSince = null;
          user.vipExpires = null;
        }
        req.apiKey = user.key;
        req.apiUser = user;
        req.authType = 'jwt';
        return next();
      }
    } catch {
      // Token expirado/inválido: para una API pública se trata como visitante.
      // Los endpoints privados comprobarán req.apiUser y devolverán 401.
    }
  }

  setAnonymous(req);
  next();
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
