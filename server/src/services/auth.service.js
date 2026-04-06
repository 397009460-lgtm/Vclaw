const crypto = require('crypto');
const { getUsersDb, saveUsersDb, findUserByUsername, getSettings } = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');

function makeUserId() {
  return `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

async function registerUser({ username, password }) {
  const settings = getSettings();
  if (!settings.allowRegistration) {
    throw new Error('当前已关闭注册');
  }
  if (!username || !password) throw new Error('用户名和密码不能为空');
  if (findUserByUsername(username)) throw new Error('用户名已存在');

  const db = getUsersDb();
  const now = new Date().toISOString();
  const user = {
    id: makeUserId(),
    username,
    passwordHash: await hashPassword(password),
    role: 'user',
    status: 'active',
    tokens: settings.defaultInitialTokens,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null
  };
  db.users.push(user);
  saveUsersDb(db);
  return user;
}

async function login({ username, password }) {
  const user = findUserByUsername(username);
  if (!user) throw new Error('用户名或密码错误');
  const ok = await comparePassword(password, user.passwordHash || '');
  if (!ok) throw new Error('用户名或密码错误');
  if (user.status !== 'active') throw new Error('账号已被禁用，请联系管理员');

  const db = getUsersDb();
  if (user.id === 'admin') {
    db.admin.lastLoginAt = new Date().toISOString();
    db.admin.updatedAt = new Date().toISOString();
  } else {
    const target = db.users.find((u) => u.id === user.id);
    target.lastLoginAt = new Date().toISOString();
    target.updatedAt = new Date().toISOString();
  }
  saveUsersDb(db);

  const token = signAccessToken(user);
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      tokens: user.tokens
    }
  };
}

module.exports = { registerUser, login };
