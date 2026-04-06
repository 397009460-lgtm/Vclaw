#!/bin/bash
set -e

echo "🔄 开始更新维克斯 AI 助手..."

cd /opt/vicks-ai-assistant

# 拉取最新代码
echo "📥 拉取最新代码..."
git fetch --all --prune
git pull --ff-only || echo "⚠️  代码已是最新"

# 安装依赖
echo "📦 安装依赖..."
cd server
npm install --production

# 重启服务
echo "🔄 重启服务..."
pm2 restart vicks-ai-web

# 检查状态
echo "✅ 检查服务状态..."
pm2 status vicks-ai-web

echo "🎉 更新完成！"
