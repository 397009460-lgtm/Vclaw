const path = require('path');
const { getUsersDb, saveUsersDb, getSettings } = require('../repositories/user.repository');
const { appendUsage } = require('../repositories/usage.repository');
const { listUserFilesForPrompt } = (() => {
  function formatUserFiles(files, userId) {
    if (!files.length) return '';
    const lines = files.slice(0, 10).map((f) => `- ${f.originalName || f.name} | 存储名: ${f.name} | 路径: ${path.join('data/uploads', userId, f.name)}`);
    return `\n\n用户最近上传的文件：\n${lines.join('\n')}\n如需处理文件，请优先根据路径读取。`;
  }
  return { listUserFilesForPrompt: formatUserFiles };
})();
const { listFilesForUser } = require('./file.service');
const { callOpenClaw } = require('./openclaw.service');

async function handleChat({ userId, message, currentUser }) {
  const settings = getSettings();
  const db = getUsersDb();
  let user = userId === 'admin' ? db.admin : db.users.find((u) => u.id === userId);
  if (!user) throw new Error('用户不存在');

  const usageCost = settings.chatCostPerMessage;
  if (user.id !== 'admin') {
    const currentTokens = Number(user.tokens || 0);
    if (currentTokens < usageCost) {
      return {
        success: true,
        reply: '⚠️ 你的 tokens 已耗尽，请联系管理员充值。',
        tokens: Math.max(currentTokens, 0),
        tokensExhausted: true
      };
    }
  }

  if (currentUser.role !== 'admin' && /安装/.test(message) && /(插件|技能)/.test(message)) {
    return {
      success: true,
      reply: '⚠️ 权限不足\n\n插件/技能安装仅限管理员操作。\n请联系管理员进行配置。',
      tokens: currentUser.tokens
    };
  }

  const files = listFilesForUser(userId);
  const fullPrompt = `${message}${listUserFilesForPrompt(files, userId)}`;
  const result = await callOpenClaw({ message: `你是维克斯-Vclaw，提供友好专业的帮助。回复要简洁有用。用户消息：${fullPrompt}`, userId });

  if (result.success && user.id !== 'admin') {
    user.tokens = Number(user.tokens || 0) - usageCost;
    user.updatedAt = new Date().toISOString();
    saveUsersDb(db);
  }

  appendUsage({
    userId,
    username: user.username,
    type: 'chat',
    cost: user.id === 'admin' ? 0 : usageCost,
    success: result.success,
    createdAt: new Date().toISOString()
  });

  if (!result.success) {
    return {
      success: true,
      reply: `⚠️ ${result.message || 'AI 服务暂时不可用'}`,
      tokens: user.id === 'admin' ? -1 : Number(user.tokens || 0)
    };
  }

  return {
    success: true,
    reply: result.content,
    tokens: user.id === 'admin' ? -1 : Number(user.tokens || 0)
  };
}

module.exports = { handleChat };
