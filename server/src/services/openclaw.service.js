const { exec } = require('child_process');
const config = require('../config');

function escapeMessage(input) {
  return String(input).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/`/g, '\\`');
}

function parseReply(stdout) {
  const text = String(stdout || '').trim();
  if (!text) return '抱歉，暂时没有拿到有效回复。';
  try {
    const data = JSON.parse(text);
    return data.result?.payloads?.[0]?.text || data.payloads?.[0]?.text || text;
  } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const data = JSON.parse(match[0]);
      return data.result?.payloads?.[0]?.text || data.payloads?.[0]?.text || text;
    } catch {}
  }
  return text;
}

async function callOpenClaw({ message, userId }) {
  const sessionId = `vicks_${userId}`;
  const command = `${config.openclawCmd} agent --session-id ${sessionId} --message "${escapeMessage(message)}" --json`;

  return new Promise((resolve) => {
    exec(command, { timeout: config.openclawTimeoutMs, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        const timeout = err.killed || err.signal === 'SIGTERM';
        return resolve({
          success: false,
          code: timeout ? 'OPENCLAW_TIMEOUT' : 'OPENCLAW_ERROR',
          message: timeout ? 'AI 响应超时' : (stderr || err.message || 'OpenClaw 调用失败')
        });
      }
      return resolve({ success: true, content: parseReply(stdout) });
    });
  });
}

module.exports = { callOpenClaw };
