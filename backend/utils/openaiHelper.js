// backend/utils/openaiHelper.js
// Purpose: Wraps OpenAI API calls with retry, fallback, streaming, and error handling

const openai = require('../config/openai');
const { estimateTokens } = require('./tokenCounter');

const getErrorMessage = (errorCode) => {
  const ERROR_CODE_MAP = {
    'AI_RATE_LIMIT': 'Our AI is very busy right now. Please wait 1 minute and try again.',
    'AI_CONTEXT_TOO_LONG': 'This conversation is too long. Please start a new chat.',
    'AI_INVALID_KEY': 'AI service is not configured correctly. Please contact support.',
    'AI_SERVER_ERROR': 'AI service is temporarily down. Please try again in a moment.',
    'AI_NETWORK_ERROR': 'Could not connect to AI service. Please check your internet connection.',
    'AI_UNKNOWN_ERROR': 'Something went wrong with the AI. Please try again.'
  };
  return ERROR_CODE_MAP[errorCode] || 'AI is not available right now. Please try again later.';
};

/**
 * Fallback mock response generator when API quotas are exceeded
 */
const getMockResponse = (messages) => {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  if (lastMsg.includes('kisan')) {
    return "## PM Kisan Samman Nidhi (Demo Mode)\n**What is it?**\nA government scheme providing ₹6,000 per year to farmers to support their agricultural needs.\n\n**Who benefits?**\n- All landholding farmer families across the country.\n\n**How to apply:**\n1. Visit the official PM-Kisan portal.\n2. Register using your Aadhaar number and bank details.\n\n*Note: This is a pre-written demo response because your OpenAI quota has been exceeded.*";
  }
  if (lastMsg.includes('ayushman') || lastMsg.includes('health')) {
    return "## Ayushman Bharat (Demo Mode)\n**What is it?**\nThe world's largest health insurance scheme providing ₹5 Lakhs per family per year for hospitalisation.\n\n**Who benefits?**\n- Low-income families identified by the SECC database.\n\n**Key features:**\n- Cashless treatment at all empanelled hospitals.\n\n*Note: This is a pre-written demo response because your OpenAI quota has been exceeded.*";
  }
  return "### ⚠️ Quota Exceeded (Demo Mode)\nI am currently running in **Offline Demo Mode** because your OpenAI API account has run out of credits (Error 429).\n\n**How to fix this:**\n1. Go to [OpenAI Dashboard](https://platform.openai.com/account/billing)\n2. Add at least $5 to your credit balance.\n3. Your AI will start working instantly after that!\n\n**You can still test me by asking about:**\n- PM Kisan\n- Ayushman Bharat\n- General policy questions";
};

const callOpenAI = async (messages, options = {}) => {
  const defaultOptions = {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    max_tokens: 1500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  const finalOptions = { ...defaultOptions, ...options };
  const startTime = Date.now();

  try {
    console.log(`OpenAI call: model=${finalOptions.model} messages=${messages.length}`);
    
    // Check if running in mock mode
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('mock')) {
      console.log('ℹ️ Mock mode active: Returning simulated response.');
      return getMockResponse(messages);
    }

    const response = await openai.chat.completions.create({
      model: finalOptions.model,
      messages,
      temperature: finalOptions.temperature,
      max_tokens: finalOptions.max_tokens,
      top_p: finalOptions.top_p,
      frequency_penalty: finalOptions.frequency_penalty,
      presence_penalty: finalOptions.presence_penalty
    });

    const duration = Date.now() - startTime;
    console.log(`OpenAI response: tokens=${response.usage?.total_tokens || estimateTokens(response.choices[0].message.content)} time=${duration}ms`);
    return response.choices[0].message.content;

  } catch (error) {
    console.error('OpenAI API Error:', error.message);

    if (error.status === 429) {
      console.warn('⚠️ OpenAI Quota Exceeded. Falling back to Mock Response for testing.');
      return getMockResponse(messages);
    }
    if (error.status === 400 && error.message.includes('context length')) {
      throw new Error('AI_CONTEXT_TOO_LONG');
    }
    if (error.status === 401) {
      throw new Error('AI_INVALID_KEY');
    }
    if (error.status === 500) {
      throw new Error('AI_SERVER_ERROR');
    }
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      throw new Error('AI_NETWORK_ERROR');
    }

    throw new Error('AI_UNKNOWN_ERROR');
  }
};

const callOpenAIWithFallback = async (messages, options = {}) => {
  try {
    return await callOpenAI(messages, { ...options, model: 'gpt-4-turbo-preview' });
  } catch (error) {
    if (error.message === 'AI_RATE_LIMIT' || error.message === 'AI_SERVER_ERROR' || error.message === 'AI_UNKNOWN_ERROR') {
      console.log('Falling back to gpt-3.5-turbo');
      return await callOpenAI(messages, { ...options, model: 'gpt-3.5-turbo' });
    }
    throw error;
  }
};

const callOpenAIForJSON = async (messages, options = {}) => {
  try {
    const jsonOptions = { ...options, response_format: { type: 'json_object' } };
    const responseText = await callOpenAI(messages, jsonOptions);
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      const arrayMatch = responseText.match(/\[[\s\S]*\]/);
      if (arrayMatch) return JSON.parse(arrayMatch[0]);

      const objectMatch = responseText.match(/\{[\s\S]*\}/);
      if (objectMatch) return JSON.parse(objectMatch[0]);

      return null;
    }
  } catch (error) {
    console.error('❌ callOpenAIForJSON Error:', error.message);
    return null;
  }
};

const createStreamingResponse = async (messages, options = {}) => {
  const defaultOptions = {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    stream: true
  };
  const finalOptions = { ...defaultOptions, ...options, stream: true };

  // Check if running in mock mode
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('mock')) {
    const mockText = getMockResponse(messages);
    // Return a simulated async iterable stream
    return {
      async *[Symbol.asyncIterator]() {
        const words = mockText.split(' ');
        for (const word of words) {
          await new Promise(r => setTimeout(r, 20));
          yield { choices: [{ delta: { content: word + ' ' } }] };
        }
      }
    };
  }

  return await openai.chat.completions.create({
    model: finalOptions.model,
    messages,
    temperature: finalOptions.temperature,
    stream: true
  });
};

module.exports = {
  callOpenAI,
  callOpenAIWithFallback,
  callOpenAIForJSON,
  createStreamingResponse,
  getErrorMessage
};
