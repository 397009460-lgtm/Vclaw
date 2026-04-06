const fs = require('fs');
const { registerUser, login } = require('../services/auth.service');
const { getUserUploadDir } = require('../utils/paths');

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body || {});
    fs.mkdirSync(getUserUploadDir(user.id), { recursive: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

async function loginController(req, res, next) {
  try {
    const result = await login(req.body || {});
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(401).json({ success: false, error: err.message });
  }
}

function verify(req, res) {
  return res.json({ valid: true });
}

module.exports = { register, loginController, verify };
