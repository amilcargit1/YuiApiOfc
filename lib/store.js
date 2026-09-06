'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]\n', 'utf8');
}

function readUsers() {
  ensureStore();
  try {
    const data = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  ensureStore();
  const temp = `${usersFile}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(users, null, 2), 'utf8');
  fs.renameSync(temp, usersFile);
}

function findUser(field, value) {
  return readUsers().find(user => user[field] === value) || null;
}

function createUser(user) {
  const users = readUsers();
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    username: user.username,
    email: user.email.toLowerCase(),
    passwordHash: user.passwordHash,
    key: user.key,
    role: 'user',
    plan: 'free',
    limit: Number(user.limit) || 100,
    requestToday: 0,
    totalRequest: 0,
    lastRequestDate: now.slice(0, 10),
    profile_img: user.profile_img || null,
    createdAt: now,
    updatedAt: now,
    vipSince: null,
    vipExpires: null
  };
  users.push(record);
  writeUsers(users);
  return record;
}

function updateUser(id, patch) {
  const users = readUsers();
  const index = users.findIndex(user => user.id === id);
  if (index < 0) return null;
  users[index] = { ...users[index], ...patch, updatedAt: new Date().toISOString() };
  writeUsers(users);
  return users[index];
}

function deleteUser(id) {
  const users = readUsers();
  const next = users.filter(user => user.id !== id);
  if (next.length === users.length) return false;
  writeUsers(next);
  return true;
}

function getAllUsers() {
  return readUsers();
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { findUser, createUser, updateUser, deleteUser, getAllUsers, sanitizeUser, readUsers };
