const { handleChat } = require('../services/chat.service');

async function chat(req, res) {
  const message = String(req.body?.message || '').trim();
  if (!message) {
    return res.status(400).json({ success: false, error: '消息不能为空' });
  }
  const result = await handleChat({ userId: req.currentUser.id, message, currentUser: req.currentUser });
  return res.json(result);
}

module.exports = { chat };
