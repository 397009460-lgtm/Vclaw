module.exports = {
  apps: [
    {
      name: 'vicks-ai-web',
      cwd: '/opt/vicks-ai-assistant/server',
      script: 'src/app.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
