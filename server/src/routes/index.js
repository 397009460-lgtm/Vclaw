const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const chatRoutes = require('./chat.routes');
const fileRoutes = require('./file.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();
router.use(authRoutes);
router.use(userRoutes);
router.use(chatRoutes);
router.use(fileRoutes);
router.use(adminRoutes);

router.use((req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' });
});

module.exports = router;
