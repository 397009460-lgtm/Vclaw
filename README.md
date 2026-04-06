# 维克斯 AI 助手网页版（重构部署版）

这是基于你提供的完整版做出的工程化重构版，重点解决了这些问题：

- 改为标准 JWT 认证
- 密码改为 bcrypt 加密
- 使用 Express 重构后端
- 使用 multer 处理文件上传
- 把真实用户数据从交付包里剥离
- 增加 `.env` 配置和独立部署文档
- 保持原有前端页面和主要接口兼容，方便直接替换部署

## 目录说明

- `public/`：前端页面
- `server/`：Node.js 后端
- `data/`：运行数据目录
- `deploy/`：PM2 / Nginx / 一键部署脚本
- `docs/`：部署说明

## 快速开始

```bash
cp .env.example .env
cd server
npm install --omit=dev
node scripts/init-admin.js
npm start
```

详细步骤见：`docs/DEPLOYMENT.md`
