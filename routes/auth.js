'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const { authHandler, adminOnly } = require('../middleware/auth');
const { findUser, createUser, updateUser, deleteUser, getAllUsers, sanitizeUser } = require('../lib/store');

const router = express.Router();
const startTime = Date.now();

function jwtSecret() {
  return process.env.YUI_JWT_SECRET || process.env.JWT_SECRET || '';
}

function makeKey() {
  return `yui-${crypto.randomBytes(10).toString('hex')}`;
}

function issueToken(user) {
  const secret = jwtSecret();
  if (!secret) throw new Error('YUI_JWT_SECRET no está configurado.');
  return jwt.sign({ sub: user.id, role: user.role, plan: user.plan, creator: 'YuiAPI' }, secret, { expiresIn: process.env.YUI_SESSION_EXPIRES || '7d' });
}

function publicUser(user) {
  const safe = sanitizeUser(user);
  if (!safe) return null;
  return {
    id: safe.id,
    username: safe.username,
    email: safe.email,
    key: safe.key,
    role: safe.role,
    plan: safe.plan,
    limit: safe.limit,
    profile_img: safe.profile_img,
    createdAt: safe.createdAt,
    vipSince: safe.vipSince,
    vipExpires: safe.vipExpires,
    requests: {
      today: safe.requestToday || 0,
      total: safe.totalRequest || 0,
      limit: safe.limit || 100,
      remaining: Math.max(0, (safe.limit || 100) - (safe.requestToday || 0))
    }
  };
}

router.get('/status', (req, res) => {
  res.json({
    status: true,
    creator: 'YuiAPI',
    authentication: ['YUI_API_KEY', 'Bearer JWT'],
    registration: true,
    sessions: true,
    jwtConfigured: Boolean(jwtSecret()),
    apiKeyConfigured: Boolean(process.env.YUI_API_KEY || process.env.API_KEY),
    message: 'YuiAPI tiene registro, inicio de sesión y sesiones JWT.'
  });
});

router.post('/register', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(username)) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Usuario inválido. Usa 3-24 caracteres.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Correo inválido.' });
  if (password.length < 8 || password.length > 72) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'La contraseña debe tener entre 8 y 72 caracteres.' });
  if (findUser('email', email) || findUser('username', username)) return res.status(409).json({ status: false, creator: 'YuiAPI', error: 'El correo o usuario ya está registrado.' });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = createUser({ username, email, passwordHash, key: makeKey(), limit: 100 });
    const token = issueToken(user);
    res.status(201).json({ status: true, creator: 'YuiAPI', message: 'Registro exitoso.', token, data: publicUser(user) });
  } catch (error) {
    console.error('[YuiAPI] register:', error);
    res.status(500).json({ status: false, creator: 'YuiAPI', error: 'No se pudo completar el registro.' });
  }
});

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Email y contraseña son obligatorios.' });

  const adminEmail = String(process.env.YUI_ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(process.env.YUI_ADMIN_PASSWORD || '');
  if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
    if (!jwtSecret()) return res.status(503).json({ status: false, creator: 'YuiAPI', error: 'YUI_JWT_SECRET no está configurado.' });
    const admin = { id: 'env-admin', username: process.env.YUI_ADMIN_USERNAME || 'Yui', email: adminEmail, key: process.env.YUI_API_KEY || '', role: 'admin', plan: 'admin', limit: 1000000 };
    const token = jwt.sign({ sub: admin.id, role: 'admin', plan: 'admin', creator: 'YuiAPI' }, jwtSecret(), { expiresIn: process.env.YUI_SESSION_EXPIRES || '7d' });
    return res.json({ status: true, creator: 'YuiAPI', message: 'Inicio de sesión de administrador exitoso.', token, data: admin });
  }

  const user = findUser('email', email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash || ''))) return res.status(401).json({ status: false, creator: 'YuiAPI', error: 'Credenciales incorrectas.' });

  try {
    const token = issueToken(user);
    res.json({ status: true, creator: 'YuiAPI', message: 'Inicio de sesión exitoso.', token, data: publicUser(user) });
  } catch (error) {
    res.status(503).json({ status: false, creator: 'YuiAPI', error: error.message });
  }
});

router.post('/logout', authHandler, (req, res) => {
  res.json({ status: true, creator: 'YuiAPI', message: 'Sesión cerrada. El cliente debe eliminar el Bearer token.' });
});

router.get('/me', authHandler, (req, res) => {
  res.json({ status: true, creator: 'YuiAPI', data: req.apiUser.id === 'env-admin' ? req.apiUser : publicUser(req.apiUser) });
});

router.put('/profile', authHandler, async (req, res) => {
  if (req.apiUser.id === 'env-admin') return res.status(403).json({ status: false, creator: 'YuiAPI', error: 'El administrador configurado por Render se modifica mediante variables de entorno.' });
  const patch = {};
  if (req.body?.username !== undefined) {
    const username = String(req.body.username).trim();
    if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(username)) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Usuario inválido.' });
    const other = findUser('username', username);
    if (other && other.id !== req.apiUser.id) return res.status(409).json({ status: false, creator: 'YuiAPI', error: 'Ese usuario ya existe.' });
    patch.username = username;
  }
  if (req.body?.email !== undefined) {
    const email = String(req.body.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'Correo inválido.' });
    const other = findUser('email', email);
    if (other && other.id !== req.apiUser.id) return res.status(409).json({ status: false, creator: 'YuiAPI', error: 'Ese correo ya existe.' });
    patch.email = email;
  }
  if (req.body?.profile_img !== undefined) patch.profile_img = String(req.body.profile_img).slice(0, 500);
  if (req.body?.password) {
    if (String(req.body.password).length < 8) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
    patch.passwordHash = await bcrypt.hash(String(req.body.password), 12);
  }
  if (!Object.keys(patch).length) return res.status(400).json({ status: false, creator: 'YuiAPI', error: 'No hay cambios para guardar.' });
  const updated = updateUser(req.apiUser.id, patch);
  res.json({ status: true, creator: 'YuiAPI', message: 'Perfil actualizado.', data: publicUser(updated) });
});

router.get('/stats', (req, res) => {
  const users = getAllUsers();
  res.json({ status: true, creator: 'YuiAPI', users: users.length, endpoints: 21, uptime: Math.floor((Date.now() - startTime) / 1000), mode: 'JWT + API key' });
});

router.get('/dashboard-global', (req, res) => {
  const users = getAllUsers();
  const globalRequests = users.reduce((sum, user) => sum + (user.totalRequest || 0), 0);
  const top5 = users.filter(user => user.totalRequest > 0).sort((a, b) => b.totalRequest - a.totalRequest).slice(0, 5).map(user => ({ username: user.username, total: user.totalRequest }));
  res.json({ status: true, creator: 'YuiAPI', totalUsers: users.length, globalRequests, uptime: Math.floor((Date.now() - startTime) / 1000), top5 });
});

router.get('/admin/all', authHandler, adminOnly, (req, res) => {
  res.json({ status: true, creator: 'YuiAPI', users: getAllUsers().map(publicUser) });
});

router.post('/admin/update', authHandler, adminOnly, async (req, res) => {
  const email = String(req.body?.targetEmail || '').trim().toLowerCase();
  const user = findUser('email', email);
  if (!user) return res.status(404).json({ status: false, creator: 'YuiAPI', error: 'Usuario no encontrado.' });
  const allowed = {};
  for (const field of ['role', 'plan', 'limit', 'vipSince', 'vipExpires', 'profile_img']) if (req.body?.newData?.[field] !== undefined) allowed[field] = req.body.newData[field];
  if (req.body?.newData?.password) allowed.passwordHash = await bcrypt.hash(String(req.body.newData.password), 12);
  const updated = updateUser(user.id, allowed);
  res.json({ status: true, creator: 'YuiAPI', message: 'Usuario actualizado.', data: publicUser(updated) });
});

router.post('/admin/delete', authHandler, adminOnly, (req, res) => {
  const email = String(req.body?.targetEmail || '').trim().toLowerCase();
  const user = findUser('email', email);
  if (!user) return res.status(404).json({ status: false, creator: 'YuiAPI', error: 'Usuario no encontrado.' });
  deleteUser(user.id);
  res.json({ status: true, creator: 'YuiAPI', message: 'Usuario eliminado.' });
});

module.exports = router;
