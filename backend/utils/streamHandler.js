/**
 * SSE (Server-Sent Events) Stream Handler
 */

const setupSSEHeaders = (res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
};

const sendSSEChunk = (res, data) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const sendSSEDone = (res) => {
  res.write('data: [DONE]\n\n');
  res.end();
};

const sendSSEError = (res, error) => {
  res.write(`data: ${JSON.stringify({ error: error.message || 'Streaming Error' })}\n\n`);
  res.end();
};

const streamChatResponse = async (res, openai, messages, options = {}) => {
  setupSSEHeaders(res);
  
  try {
    const stream = await openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages,
      temperature: options.temperature || 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        sendSSEChunk(res, { content });
      }
    }

    sendSSEDone(res);
  } catch (error) {
    console.error('SSE Stream Error:', error);
    sendSSEError(res, error);
  }
};

module.exports = {
  setupSSEHeaders,
  sendSSEChunk,
  sendSSEDone,
  sendSSEError,
  streamChatResponse
};
