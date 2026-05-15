const { OpenAI } = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('CRITICAL ERROR: OPENAI_API_KEY is missing from .env file.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('✅ OpenAI Configuration Initialized');

module.exports = openai;
