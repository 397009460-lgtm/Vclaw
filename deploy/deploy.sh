#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/vicks-ai-assistant
SERVER_DIR="$APP_DIR/server"

mkdir -p "$APP_DIR"
cp -r . "$APP_DIR"
cd "$SERVER_DIR"

if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo "[提示] 已生成 $APP_DIR/.env，请先修改管理员密码和 JWT_SECRET。"
fi

npm install --omit=dev
node scripts/init-admin.js

if command -v pm2 >/dev/null 2>&1; then
  pm2 start "$APP_DIR/deploy/ecosystem.config.js" || pm2 restart vicks-ai-web
  pm2 save
  echo "[完成] PM2 已启动服务。"
else
  echo "[提示] 未检测到 pm2，请手动执行："
  echo "cd $SERVER_DIR && npm start"
fi
