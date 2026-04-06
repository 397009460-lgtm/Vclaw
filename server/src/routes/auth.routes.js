const express = require('express');
const { register, loginController, verify } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();
router.post('/register', register);
router.post('/login', loginController);
router.get('/verify', requireAuth, verify);
module.exports = router;
