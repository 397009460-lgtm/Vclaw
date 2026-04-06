const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const { errorMiddleware } = require('./middleware/error.middleware');
const { log } = require('./utils/logger');
const { getUsersDb, saveUsersDb, getSettings, saveSettings } = require('./repositories/user.repository');
const { hashPassword } = require('./utils/password');

async function ensureBootstrap() {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.mkdirSync(config.dbDir, { recursive: true });
  fs.mkdirSync(config.uploadsDir, { recursive: true });
  fs.mkdirSync(config.logsDir, { recursive: true });

  const settings = getSettings();
  settings.allowRegistration = settings.allowRegistration ?? config.allowRegistration;
  settings.defaultInitialTokens = settings.defaultInitialTokens ?? config.defaultInitialTokens;
  settings.chatCostPerMessage = settings.chatCostPerMessage ?? config.chatCostPerMessage;
  settings.maxUploadSizeMB = settings.maxUploadSizeMB ?? config.maxUploadSizeMb;
  saveSettings(settings);

  const db = getUsersDb();
  if (!db.admin.passwordHash) {
    db.admin.id = 'admin';
    db.admin.username = config.defaultAdminUsername;
    db.admin.passwordHash = await hashPassword(config.defaultAdminPassword);
    db.admin.role = 'admin';
    db.admin.status = 'active';
    db.admin.tokens = -1;
    db.admin.createdAt = db.admin.createdAt || new Date().toISOString();
    db.admin.updatedAt = new Date().toISOString();
    saveUsersDb(db);
  }
}

async function main() {
  await ensureBootstrap();
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan('combined'));

  app.use('/api', routes);
  
  // 静态文件缓存控制（双保险）
  const staticOptions = {
    extensions: ['html'],
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
      }
    }
  };
  app.use(express.static(config.publicDir, staticOptions));
  
  // 全局中间件：对 html/css/js 设置缓存控制
  app.use((req, res, next) => {
    const url = req.url.toLowerCase();
    if (url.endsWith('.html') || url.endsWith('.css') || url.endsWith('.js') || url === '/') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
    next();
  });

  app.get('/health', (req, res) => {
    res.json({ success: true, app: config.appName, time: new Date().toISOString() });
  });

  app.get('/build', (req, res) => {
    res.json({ success: true, build: config.buildVersion, nodeEnv: config.nodeEnv });
  });

  app.use((req, res) => {
    res.status(404).sendFile(path.join(config.publicDir, 'index.html'));
  });

  app.use(errorMiddleware);

  app.listen(config.port, config.host, () => {
    log(`${config.appName} 已启动: http://${config.host}:${config.port}`);
    log(`管理员后台: http://127.0.0.1:${config.port}/admin.html`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
