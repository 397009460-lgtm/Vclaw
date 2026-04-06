const fs = require('fs');
const path = require('path');
const { addFileMeta, listUserFiles, getUserFile, removeUserFile } = require('../repositories/file.repository');
const { getUserUploadDir } = require('../utils/paths');

function recordUploadedFile({ userId, file }) {
  const meta = {
    userId,
    storedName: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    createdAt: new Date().toISOString()
  };
  addFileMeta(meta);
  return meta;
}

function listFilesForUser(userId) {
  return listUserFiles(userId).map((item) => ({
    name: item.storedName,
    originalName: item.originalName,
    size: item.size,
    createdAt: item.createdAt
  }));
}

function resolveUserFile(userId, storedName) {
  const meta = getUserFile(userId, storedName);
  if (!meta) return null;
  const filePath = path.join(getUserUploadDir(userId), storedName);
  if (!fs.existsSync(filePath)) return null;
  return { ...meta, filePath };
}

function deleteUserFile(userId, storedName) {
  const found = resolveUserFile(userId, storedName);
  if (!found) return false;
  fs.unlinkSync(found.filePath);
  removeUserFile(userId, storedName);
  return true;
}

module.exports = { recordUploadedFile, listFilesForUser, resolveUserFile, deleteUserFile };
