const openai = require('../config/openai');

/**
 * Basic OpenAI call with error handling
 */
const callOpenAI = async (messages, options = {}) => {
  const { 
    model = "gpt-3.5-turbo", 
    temperature = 0.7, 
    max_tokens = 1500 
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    
    if (error.status === 429) {
      console.warn('⚠️ OpenAI Quota Exceeded. Falling back to Mock Response for testing.');
      return getMockResponse(messages);
    }
    if (error.status === 400 && error.code === 'context_length_exceeded') {
      throw new Error('Message too long, please shorten your request');
    }
    if (error.status === 401) {
      throw new Error('AI service configuration error - invalid API key');
    }
    
    throw new Error('Failed to generate AI response');
  }
};

/**
 * Simple mock responses for testing when API is down
 */
const getMockResponse = (messages) => {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  
  if (lastMessage.includes('kisan')) {
    return "## PM Kisan Samman Nidhi (Demo Mode)\n**What is it?**\nA government scheme providing ₹6,000 per year to farmers to support their agricultural needs.\n\n**Who benefits?**\n- All landholding farmer families across the country.\n\n**How to apply:**\n1. Visit the official PM-Kisan portal.\n2. Register using your Aadhaar number and bank details.\n\n*Note: This is a pre-written demo response because your OpenAI quota has been exceeded.*";
  }

  if (lastMessage.includes('ayushman') || lastMessage.includes('health')) {
    return "## Ayushman Bharat (Demo Mode)\n**What is it?**\nThe world's largest health insurance scheme providing ₹5 Lakhs per family per year for hospitalisation.\n\n**Who benefits?**\n- Low-income families identified by the SECC database.\n\n**Key features:**\n- Cashless treatment at all empanelled hospitals.\n\n*Note: This is a pre-written demo response because your OpenAI quota has been exceeded.*";
  }
  
  return "### ⚠️ Quota Exceeded (Demo Mode)\nI am currently running in **Offline Demo Mode** because your OpenAI API account has run out of credits (Error 429).\n\n**How to fix this:**\n1. Go to [OpenAI Dashboard](https://platform.openai.com/account/billing)\n2. Add at least $5 to your credit balance.\n3. Your AI will start working instantly after that!\n\n**You can still test me by asking about:**\n- PM Kisan\n- Ayushman Bharat\n- General policy questions";
};

/**
 * OpenAI call with automatic model fallback
 */
const callOpenAIWithFallback = async (messages, options = {}) => {
  try {
    // Defaulting to gpt-3.5-turbo as it's verified to work for user
    return await callOpenAI(messages, { ...options, model: "gpt-3.5-turbo" });
  } catch (error) {
    console.warn('Model failed, retrying with guaranteed fallback...');
    return await callOpenAI(messages, { ...options, model: "gpt-3.5-turbo" });
  }
};

/**
 * SSE Streaming for OpenAI responses
 */
const streamOpenAI = async (messages, res, options = {}) => {
  const { 
    model = "gpt-3.5-turbo", 
    temperature = 0.7 
  } = options;

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      stream: true,
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Streaming Error:', error);
    
    if (error.status === 429) {
      const mock = getMockResponse(messages);
      res.write(`data: ${JSON.stringify({ content: mock })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Utility to extract JSON from AI response
 */
const parseJSONResponse = (text) => {
  try {
    const jsonString = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

module.exports = {
  callOpenAI,
  callOpenAIWithFallback,
  streamOpenAI,
  parseJSONResponse
};
