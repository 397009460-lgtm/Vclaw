#!/bin/bash
set -e

echo "🤖 维克斯 AI 助手 - 自动化部署脚本"
echo "=================================="

cd /opt/vicks-ai-assistant

# 备份当前配置
echo "💾 备份配置..."
cp -n .env .env.backup 2>/dev/null || true

# 拉取最新代码
echo "📥 拉取代码..."
git fetch --all --prune
git pull --ff-only || echo "⚠️  代码已是最新"

# 检查 package.json 是否有更新
if [ -f "server/package.json" ]; then
  echo "📦 检查依赖..."
  cd server
  npm install --production
fi

# 重启服务
echo "🔄 重启服务..."
pm2 restart vicks-ai-web

# 等待服务启动
sleep 2

# 验证服务
echo "✅ 验证服务..."
pm2 status vicks-ai-web

# 健康检查
echo "🏥 健康检查..."
curl -s http://127.0.0.1:8889/api/health > /dev/null && echo "✅ 服务正常" || echo "⚠️  服务异常"

echo ""
echo "🎉 部署完成！"
