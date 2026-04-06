const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const rootDir = path.resolve(__dirname, '../..');

module.exports = {
  rootDir,
  nodeEnv: process.env.NODE_ENV || 'production',
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 8889),
  appName: process.env.APP_NAME || '维克斯 AI 助手网页版',
  jwtSecret: process.env.JWT_SECRET || 'please-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  openclawCmd: process.env.OPENCLAW_CMD || 'openclaw',
  openclawTimeoutMs: Number(process.env.OPENCLAW_TIMEOUT_MS || 180000),
  defaultAdminUsername: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMe123!',
  defaultInitialTokens: Number(process.env.DEFAULT_INITIAL_TOKENS || 10000),
  chatCostPerMessage: Number(process.env.CHAT_COST_PER_MESSAGE || 10),
  allowRegistration: String(process.env.ALLOW_REGISTRATION || 'true') === 'true',
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 20),
  buildVersion: process.env.BUILD_VERSION || '2026.04.06-r5',
  publicDir: path.resolve(rootDir, 'public'),
  dataDir: path.resolve(rootDir, 'data'),
  dbDir: path.resolve(rootDir, 'data/db'),
  uploadsDir: path.resolve(rootDir, 'data/uploads'),
  logsDir: path.resolve(rootDir, 'data/logs')
};
