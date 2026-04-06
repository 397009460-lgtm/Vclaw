# 维克斯 AI 助手网页版：一键部署说明

## 推荐部署方式（最稳）

### 1）上传压缩包到服务器
把 `vicks-ai-assistant-ui-2026-full-deploy.zip` 上传到服务器，例如放到 `/opt`。

### 2）解压
```bash
cd /opt
unzip -o vicks-ai-assistant-ui-2026-full-deploy.zip
cd /opt/vicks_ai_assistant_refactor
```

### 3）复制环境变量并修改
```bash
cp .env.example .env
nano .env
```

必须修改：
- `JWT_SECRET`
- `DEFAULT_ADMIN_PASSWORD`
- `OPENCLAW_CMD`

### 4）安装依赖并初始化管理员
```bash
cd /opt/vicks_ai_assistant_refactor/server
npm install --omit=dev
node scripts/init-admin.js
```

### 5）启动服务
```bash
npm install -g pm2
pm2 start src/app.js --name vicks-ai-web
pm2 save
pm2 startup
```

### 6）配置 Nginx（可选但推荐）
站点配置参考：
- `/opt/vicks_ai_assistant_refactor/deploy/nginx.conf`

测试并重载：
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 访问地址
- 登录页：`http://你的服务器IP/`
- 聊天页：`http://你的服务器IP/chat.html`
- 管理后台：`http://你的服务器IP/admin.html`

## Docker 部署（可选）
项目已附带：
- `deploy/docker-compose.yml`
- `deploy/Dockerfile`

在 `vicks_ai_assistant_refactor` 根目录执行：
```bash
cp .env.example .env
# 修改 .env 后：
docker compose -f deploy/docker-compose.yml up -d --build
```

## 重要说明
- 本包已经包含前端页面、后端代码、环境变量模板、Nginx 配置、PM2 配置、Docker 部署文件、初始化脚本和部署文档。
- 本包不包含真实用户数据，适合直接交给 OpenClaw 执行部署。
