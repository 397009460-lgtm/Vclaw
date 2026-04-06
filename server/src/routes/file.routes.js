const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const { uploadFile, listFiles, downloadFile, removeFile } = require('../controllers/file.controller');

const router = express.Router();

router.get('/files', requireAuth, listFiles);
router.get('/files/:filename', requireAuth, downloadFile);
router.delete('/files/:filename', requireAuth, removeFile);
router.post('/upload', requireAuth, upload.single('file'), uploadFile);

module.exports = router;
