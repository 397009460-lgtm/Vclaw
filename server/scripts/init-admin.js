const fs = require('fs');
const path = require('path');
const config = require('../src/config');
const { hashPassword } = require('../src/utils/password');
const { getUsersDb, saveUsersDb } = require('../src/repositories/user.repository');

(async () => {
  const db = getUsersDb();
  const now = new Date().toISOString();
  db.admin.id = 'admin';
  db.admin.username = config.defaultAdminUsername;
  db.admin.passwordHash = await hashPassword(config.defaultAdminPassword);
  db.admin.role = 'admin';
  db.admin.status = 'active';
  db.admin.tokens = -1;
  db.admin.createdAt = db.admin.createdAt || now;
  db.admin.updatedAt = now;
  saveUsersDb(db);
  fs.mkdirSync(config.uploadsDir, { recursive: true });
  fs.mkdirSync(config.logsDir, { recursive: true });
  console.log('管理员初始化完成:', config.defaultAdminUsername);
})();
