const path = require('path');
const config = require('../config');
const { readJson, writeJson } = require('./json.repository');

const indexFile = path.join(config.dbDir, 'file_index.json');

function getFileIndex() {
  return readJson(indexFile, { items: [] });
}

function saveFileIndex(data) {
  writeJson(indexFile, data);
}

function addFileMeta(meta) {
  const db = getFileIndex();
  db.items.unshift(meta);
  saveFileIndex(db);
}

function listUserFiles(userId) {
  return getFileIndex().items.filter((item) => item.userId === userId);
}

function getUserFile(userId, storedName) {
  return getFileIndex().items.find((item) => item.userId === userId && item.storedName === storedName) || null;
}

function removeUserFile(userId, storedName) {
  const db = getFileIndex();
  db.items = db.items.filter((item) => !(item.userId === userId && item.storedName === storedName));
  saveFileIndex(db);
}

module.exports = { addFileMeta, listUserFiles, getUserFile, removeUserFile };
