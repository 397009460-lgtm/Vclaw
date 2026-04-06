const { error } = require('../utils/logger');

function errorMiddleware(err, req, res, next) {
  error('[HTTP]', err);
  if (res.headersSent) return next(err);
  return res.status(500).json({ success: false, error: '服务器错误' });
}

module.exports = { errorMiddleware };
