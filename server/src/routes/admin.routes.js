const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');
const { listUsers, createUser, rechargeTokens, toggleUser, approveUser, rejectUser } = require('../controllers/admin.controller');

const router = express.Router();
router.use(requireAuth, requireAdmin);
router.get('/users', listUsers);
router.post('/users', createUser);
router.post('/users/:userId/recharge-tokens', rechargeTokens);
router.post('/users/:userId/toggle', toggleUser);
router.post('/users/:userId/approve', approveUser);
router.post('/users/:userId/reject', rejectUser);
module.exports = router;
