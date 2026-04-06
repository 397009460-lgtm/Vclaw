const { verifyAccessToken } = require('../utils/jwt');
const { findUserById } = require('../repositories/user.repository');

function extractToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  if (typeof req.query.token === 'string' && req.query.token) return req.query.token;
  return null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ success: false, error: '未登录' });
  try {
    const payload = verifyAccessToken(token);
    const user = findUserById(payload.sub);
    if (!user || user.status !== 'active') {
      return res.status(403).json({ success: false, error: '账号不可用' });
    }
    req.auth = payload;
    req.currentUser = user;
    req.rawToken = token;
    next();
  } catch {
    return res.status(401).json({ success: false, error: '登录状态已失效' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.currentUser || req.currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: '权限不足' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, extractToken };
