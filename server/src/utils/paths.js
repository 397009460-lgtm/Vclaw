const path = require('path');
const config = require('../config');

function getUserUploadDir(userId) {
  return path.join(config.uploadsDir, userId);
}

function sanitizeFilename(filename) {
  return path.basename(filename || '').replace(/[\\/]/g, '_');
}

module.exports = { getUserUploadDir, sanitizeFilename };
