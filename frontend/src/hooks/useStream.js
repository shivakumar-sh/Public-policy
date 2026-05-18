// frontend/src/hooks/useStream.js
// Purpose: Custom React hook managing streaming AI response state

import { useState, useCallback } from 'react';
import { streamMessage } from '../services/chatService';

const useStream = () => {
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  const startStream = useCallback((streamConfig, callbacks = {}) => {
    const { onComplete, onError, onMetadata } = callbacks;
    setStreamingText('');
    setIsStreaming(true);
    setIsComplete(false);
    setError(null);

    streamMessage(streamConfig, {
      onChunk: (chunk) => setStreamingText(prev => prev + chunk),
      onMetadata: (data) => { if (onMetadata) onMetadata(data); },
      onDone: () => { 
        setIsStreaming(false); 
        setIsComplete(true); 
        if (onComplete) {
          // Pass current state via functional updater or let parent handle
          onComplete(); 
        }
      },
      onError: (err) => { 
        setIsStreaming(false); 
        setError(err.message); 
        if (onError) onError(err); 
      }
    });
  }, []);

  const resetStream = useCallback(() => {
    setStreamingText('');
    setIsStreaming(false);
    setIsComplete(false);
    setError(null);
  }, []);

  const getStreamedContent = useCallback(() => {
    return streamingText;
  }, [streamingText]);

  return {
    streamingText,
    isStreaming,
    isComplete,
    error,
    startStream,
    resetStream,
    getStreamedContent
  };
};

export default useStream;
