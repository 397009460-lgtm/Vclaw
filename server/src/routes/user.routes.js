const express = require('express');
const { me } = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();
router.get('/me', requireAuth, me);
module.exports = router;
