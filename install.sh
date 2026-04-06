#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "[提示] 已创建 .env，请先修改 JWT_SECRET、DEFAULT_ADMIN_PASSWORD、OPENCLAW_CMD"
fi
cd server
npm install --omit=dev
node scripts/init-admin.js
if command -v pm2 >/dev/null 2>&1; then
  pm2 start src/app.js --name vicks-ai-web || pm2 restart vicks-ai-web
  pm2 save || true
  echo "[完成] 已使用 PM2 启动。"
else
  echo "[提示] 未安装 pm2，请执行：cd $ROOT_DIR/server && npm start"
fi
