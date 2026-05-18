// backend/config/openai.js
// Purpose: Initialize and export OpenAI client
// Used by: All AI service files

const OpenAI = require('openai');
require('dotenv').config();

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set in environment variables. AI features will use fallback mock mode.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-build',
  timeout: 30000, // 30 seconds
  maxRetRetries: 2,
});

/**
 * Test OpenAI API connection on startup
 */
const testOpenAIConnection = async () => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('mock')) {
      console.log('ℹ️ OpenAI Connection Test skipped: Using Mock/Demo mode.');
      return false;
    }
    const response = await openai.models.list();
    console.log('✓ OpenAI API Connection Successful. Available models count:', response.data.length);
    return true;
  } catch (error) {
    console.error('❌ OpenAI API Connection Failed:', error.message);
    return false;
  }
};

// Execute connection test on startup
testOpenAIConnection();

module.exports = openai;
module.exports.testOpenAIConnection = testOpenAIConnection;
