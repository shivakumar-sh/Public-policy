const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * Extracts text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - The extracted text
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

module.exports = { extractTextFromPDF };
