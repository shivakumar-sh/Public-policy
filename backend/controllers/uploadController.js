const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const { extractTextFromPDF } = require('../utils/pdfParser');
const { summarizeDocument } = require('../utils/openaiHelper');
const path = require('path');
const fs = require('fs');

// @desc    Upload PDF and extract text
// @route   POST /api/upload/pdf
// @access  Private
const uploadPDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const filePath = req.file.path;

  // Create document entry
  const document = await Document.create({
    user: req.user._id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    filePath: filePath,
    fileSize: req.file.size,
    status: 'processing',
  });

  try {
    // Extract text
    const text = await extractTextFromPDF(filePath);
    document.extractedText = text;

    // Summarize
    const summary = await summarizeDocument(text);
    document.summary = summary;
    document.status = 'completed';
    
    await document.save();

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    document.status = 'failed';
    await document.save();
    res.status(500);
    throw new Error('File processing failed: ' + error.message);
  }
});

// @desc    Get user's uploaded documents
// @route   GET /api/upload/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id }).sort('-createdAt');
  res.json({
    success: true,
    data: documents,
  });
});

// @desc    Delete a document
// @route   DELETE /api/upload/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

  if (document) {
    // Remove file from storage
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    await document.deleteOne();
    res.json({
      success: true,
      message: 'Document removed',
    });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

module.exports = {
  uploadPDF,
  getDocuments,
  deleteDocument,
};
