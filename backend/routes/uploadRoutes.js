const express = require('express');
const router = express.Router();
const {
  uploadPDF,
  getDocuments,
  deleteDocument,
} = require('../controllers/uploadController');
const { summarizeUploadedDocument: summarizeDocument } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/pdf', protect, upload.single('pdf'), uploadPDF);
router.get('/documents', protect, getDocuments);
router.delete('/:id', protect, deleteDocument);
router.post('/:id/summarize', protect, summarizeDocument);

module.exports = router;
