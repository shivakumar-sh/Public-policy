// frontend/src/hooks/useVoice.js
// Purpose: Custom React hook for Web Speech API speech-to-text recognition and text-to-speech synthesis

import { useState, useEffect, useCallback, useRef } from 'react';

const useVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  const initializeSpeechRecognition = useCallback((language = 'en-IN') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => setError(event.error);
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);
  }, []);

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [initializeSpeechRecognition]);

  const startRecording = useCallback((language = 'en-IN') => {
    if (!isSupported) {
      setError('Speech recognition not supported');
      return;
    }
    initializeSpeechRecognition(language);
    setError(null);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      // ignore already started
    }
  }, [isSupported, initializeSpeechRecognition]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const speak = useCallback((text, languageCode = 'en') => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const SPEECH_CODE_MAP = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN'
    };

    utterance.lang = SPEECH_CODE_MAP[languageCode] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isRecording,
    isSupported,
    isSpeaking,
    transcript,
    error,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    clearTranscript
  };
};

export default useVoice;
