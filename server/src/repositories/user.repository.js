const path = require('path');
const config = require('../config');
const { readJson, writeJson } = require('./json.repository');

const usersFile = path.join(config.dbDir, 'users.json');
const settingsFile = path.join(config.dbDir, 'settings.json');

function defaultUsers() {
  return {
    admin: {
      id: 'admin',
      username: config.defaultAdminUsername,
      passwordHash: '',
      role: 'admin',
      status: 'active',
      tokens: -1,
      createdAt: '',
      updatedAt: ''
    },
    users: []
  };
}

function defaultSettings() {
  return {
    allowRegistration: config.allowRegistration,
    defaultInitialTokens: config.defaultInitialTokens,
    chatCostPerMessage: config.chatCostPerMessage,
    maxUploadSizeMB: config.maxUploadSizeMb
  };
}

function getUsersDb() {
  return readJson(usersFile, defaultUsers());
}

function saveUsersDb(db) {
  writeJson(usersFile, db);
}

function getSettings() {
  return readJson(settingsFile, defaultSettings());
}

function saveSettings(settings) {
  writeJson(settingsFile, settings);
}

function findUserByUsername(username) {
  const db = getUsersDb();
  if (db.admin.username === username) return db.admin;
  return db.users.find((u) => u.username === username) || null;
}

function findUserById(id) {
  const db = getUsersDb();
  if (id === 'admin') return db.admin;
  return db.users.find((u) => u.id === id) || null;
}

function listUsers() {
  const db = getUsersDb();
  return { admin: db.admin, users: db.users };
}

module.exports = {
  getUsersDb,
  saveUsersDb,
  getSettings,
  saveSettings,
  findUserByUsername,
  findUserById,
  listUsers
};
