const fs = require('fs');
const { getUsersDb, saveUsersDb, getSettings } = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password');
const { getUserUploadDir } = require('../utils/paths');

function listUsers(req, res) {
  const db = getUsersDb();
  const admin = { ...db.admin };
  delete admin.passwordHash;
  const users = db.users.map((u) => {
    const copy = { ...u };
    delete copy.passwordHash;
    return copy;
  });
  return res.json({ success: true, users, admin });
}

async function createUser(req, res) {
  const { username, password, initialTokens } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: '用户名和密码不能为空' });
  }
  const db = getUsersDb();
  if (db.admin.username === username || db.users.some((u) => u.username === username)) {
    return res.status(400).json({ success: false, error: '用户名已存在' });
  }
  const user = {
    id: `user_${Date.now()}`,
    username,
    passwordHash: await hashPassword(password),
    role: 'user',
    status: 'active',
    tokens: Number(initialTokens || getSettings().defaultInitialTokens),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null
  };
  db.users.push(user);
  saveUsersDb(db);
  fs.mkdirSync(getUserUploadDir(user.id), { recursive: true });
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return res.json({ success: true, user: safeUser });
}

function rechargeTokens(req, res) {
  const amount = Number(req.body?.tokens || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ success: false, error: '充值额度必须大于 0' });
  }
  const db = getUsersDb();
  const user = db.users.find((u) => u.id === req.params.userId);
  if (!user) return res.status(404).json({ success: false, error: '用户不存在' });
  user.tokens = Number(user.tokens || 0) + amount;
  user.updatedAt = new Date().toISOString();
  saveUsersDb(db);
  return res.json({ success: true, tokens: user.tokens });
}

function toggleUser(req, res) {
  const db = getUsersDb();
  const user = db.users.find((u) => u.id === req.params.userId);
  if (!user) return res.status(404).json({ success: false, error: '用户不存在' });
  user.status = user.status === 'active' ? 'disabled' : 'active';
  user.updatedAt = new Date().toISOString();
  saveUsersDb(db);
  return res.json({ success: true, status: user.status });
}

function approveUser(req, res) {
  const db = getUsersDb();
  const user = db.users.find((u) => u.id === req.params.userId);
  if (!user) return res.status(404).json({ success: false, error: '用户不存在' });
  user.status = 'active';
  user.tokens = Number(getSettings().defaultInitialTokens);
  user.updatedAt = new Date().toISOString();
  saveUsersDb(db);
  return res.json({ success: true });
}

function rejectUser(req, res) {
  const db = getUsersDb();
  const idx = db.users.findIndex((u) => u.id === req.params.userId);
  if (idx === -1) return res.status(404).json({ success: false, error: '用户不存在' });
  db.users.splice(idx, 1);
  saveUsersDb(db);
  return res.json({ success: true });
}

module.exports = { listUsers, createUser, rechargeTokens, toggleUser, approveUser, rejectUser };
