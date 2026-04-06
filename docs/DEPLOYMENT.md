# 维克斯 AI 助手网页版部署文档

## 包含内容
本包已经包含：
- 前端页面（`public/`）
- 后端服务（`server/`）
- 数据目录（`data/`）
- 环境变量模板（`.env.example`）
- PM2 配置（`deploy/ecosystem.config.js`）
- Nginx 配置（`deploy/nginx.conf`）
- Docker 部署文件（`deploy/Dockerfile`、`deploy/docker-compose.yml`）
- 初始化管理员脚本（`server/scripts/init-admin.js`）

## 服务器要求
- Ubuntu 20.04 / 22.04 / 24.04
- Node.js 18 或 20
- npm
- OpenClaw 已安装，并且 `openclaw` 命令可直接执行
- 推荐安装 PM2 和 Nginx

## 推荐部署目录
- 项目目录：`/opt/vicks_ai_assistant_refactor`
- 反向代理：Nginx -> `127.0.0.1:8889`

## 一、手动部署

### 1. 上传并解压
```bash
cd /opt
unzip -o vicks-ai-assistant-ui-2026-full-deploy.zip
cd /opt/vicks_ai_assistant_refactor
```

### 2. 创建环境变量
```bash
cp .env.example .env
nano .env
```

必须修改：
- `JWT_SECRET`
- `DEFAULT_ADMIN_PASSWORD`
- `OPENCLAW_CMD`

### 3. 安装依赖
```bash
cd server
npm install --omit=dev
```

### 4. 初始化管理员
```bash
node scripts/init-admin.js
```

### 5. 启动服务
#### 方式 A：直接启动
```bash
npm start
```

#### 方式 B：PM2，推荐
```bash
npm install -g pm2
pm2 start src/app.js --name vicks-ai-web
pm2 save
pm2 startup
```

## 二、Nginx 反向代理
把 `deploy/nginx.conf` 内容复制到站点配置文件中，然后执行：
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 三、Docker 部署
在项目根目录执行：
```bash
cp .env.example .env
# 修改 .env 后
sudo docker compose -f deploy/docker-compose.yml up -d --build
```

## 四、访问地址
- 用户登录：`http://服务器IP/`
- 聊天页面：`http://服务器IP/chat.html`
- 管理后台：`http://服务器IP/admin.html`

## 五、数据目录
- 用户数据库：`data/db/users.json`
- 系统设置：`data/db/settings.json`
- 使用日志：`data/db/usage_logs.json`
- 文件索引：`data/db/file_index.json`
- 上传文件：`data/uploads/<userId>/`

## 六、OpenClaw 自检
在服务器执行：
```bash
openclaw --help
openclaw agent --session-id test --message "你好" --json
```
若失败，先修复 OpenClaw 环境，再部署网页端。
