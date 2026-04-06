const path = require('path');
const { recordUploadedFile, listFilesForUser, resolveUserFile, deleteUserFile } = require('../services/file.service');

function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: '请选择文件' });
  }
  const meta = recordUploadedFile({ userId: req.currentUser.id, file: req.file });
  return res.json({
    success: true,
    filename: meta.storedName,
    originalName: meta.originalName,
    path: '/api/files/' + encodeURIComponent(meta.storedName),
    message: '文件上传成功，请描述您的需求',
    size: meta.size
  });
}

function listFiles(req, res) {
  return res.json({ success: true, files: listFilesForUser(req.currentUser.id) });
}

function downloadFile(req, res) {
  const storedName = req.params.filename;
  const found = resolveUserFile(req.currentUser.id, storedName);
  if (!found) {
    return res.status(404).json({ success: false, error: '文件不存在' });
  }
  return res.download(found.filePath, found.originalName || found.storedName);
}

function removeFile(req, res) {
  const ok = deleteUserFile(req.currentUser.id, req.params.filename);
  if (!ok) {
    return res.status(404).json({ success: false, error: '文件不存在' });
  }
  return res.json({ success: true });
}

module.exports = { uploadFile, listFiles, downloadFile, removeFile };
