const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../config');
const { getUserUploadDir, sanitizeFilename } = require('../utils/paths');

const allowedExts = new Set(['.txt', '.md', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.zip']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUserUploadDir(req.currentUser.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.dat';
    cb(null, `file_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const safeOriginal = sanitizeFilename(file.originalname || 'file.dat');
    file.originalname = safeOriginal;
    const ext = path.extname(safeOriginal).toLowerCase();
    if (!allowedExts.has(ext)) {
      return cb(new Error('不支持的文件类型'));
    }
    return cb(null, true);
  }
});

module.exports = { upload };
