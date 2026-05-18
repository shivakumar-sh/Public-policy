// backend/utils/streamHandler.js
// Purpose: Manages Server-Sent Events (SSE) streaming responses to the frontend

const { createStreamingResponse } = require('./openaiHelper');

const setupSSEHeaders = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
};

const sendChunk = (res, content) => {
  res.write(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`);
};

const sendMetadata = (res, metadata) => {
  res.write(`data: ${JSON.stringify({ type: 'metadata', ...metadata })}\n\n`);
};

const sendDone = (res) => {
  res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  res.end();
};

const sendError = (res, errorMessage) => {
  res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
  res.end();
};

const streamChatResponse = async (res, messages, options, onComplete) => {
  try {
    const stream = await createStreamingResponse(messages, options);
    setupSSEHeaders(res);
    let fullContent = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        sendChunk(res, delta);
      }
    }

    if (onComplete) {
      await onComplete(fullContent);
    }
  } catch (error) {
    console.error('❌ Streaming Error:', error.message);
    sendError(res, error.message || 'Error during streaming response');
  }
};

module.exports = {
  setupSSEHeaders,
  sendChunk,
  sendMetadata,
  sendDone,
  sendError,
  streamChatResponse
};
