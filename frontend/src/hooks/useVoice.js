import { useState, useEffect } from 'react';

const useVoice = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const startListening = (lang = 'en-US') => {
    if (!recognition) {
      setError('Speech recognition not supported');
      return;
    }
    recognition.lang = lang;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    error,
    isSupported: !!SpeechRecognition,
  };
};

export default useVoice;
