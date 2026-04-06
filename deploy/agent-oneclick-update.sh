#!/bin/bash
set -e

echo "🚀 维克斯 AI 助手 - 一键更新脚本"
echo "================================"

cd /opt/vicks-ai-assistant

# 1. 拉取最新代码
echo ""
echo "📥 正在拉取最新代码..."
git fetch --all --prune
git pull --ff-only || echo "⚠️  代码已是最新"

# 2. 安装依赖
echo ""
echo "📦 正在安装依赖..."
cd server
npm install --production

# 3. 重启服务
echo ""
echo "🔄 正在重启服务..."
pm2 restart vicks-ai-web

# 4. 检查状态
echo ""
echo "✅ 服务状态:"
pm2 status vicks-ai-web

echo ""
echo "🎉 更新完成！"
echo "访问地址：http://39.102.63.42:8889/"
