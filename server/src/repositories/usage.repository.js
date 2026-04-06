const path = require('path');
const config = require('../config');
const { readJson, writeJson } = require('./json.repository');

const usageFile = path.join(config.dbDir, 'usage_logs.json');

function appendUsage(item) {
  const db = readJson(usageFile, { items: [] });
  db.items.unshift(item);
  db.items = db.items.slice(0, 5000);
  writeJson(usageFile, db);
}

module.exports = { appendUsage };
