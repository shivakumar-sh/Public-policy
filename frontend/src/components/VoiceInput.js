// frontend/src/components/VoiceInput.js
// Purpose: Microphone button component wrapping Web Speech API recognition for voice input

import React, { useState, useEffect } from 'react';
import { HiMicrophone, HiStop } from 'react-icons/hi';

const VoiceInput = ({ language, onResult, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    setRecognitionInstance(recognition);
  }, []);

  const getSpeechCode = (lang) => {
    const map = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN' };
    return map[lang] || 'en-IN';
  };

  const startRecording = () => {
    if (!recognitionInstance) return;
    recognitionInstance.lang = getSpeechCode(language);
    recognitionInstance.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
      setIsRecording(false);
    };
    recognitionInstance.onerror = () => setIsRecording(false);
    recognitionInstance.onend = () => setIsRecording(false);
    recognitionInstance.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recognitionInstance) return;
    recognitionInstance.stop();
    setIsRecording(false);
  };

  if (!isSupported) {
    return (
      <button disabled title="Voice not supported in this browser" className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 opacity-40 cursor-not-allowed">
        <HiMicrophone size={20} />
      </button>
    );
  }

  if (isRecording) {
    return (
      <button onClick={stopRecording} title="Click to stop recording" className="p-3 rounded-xl bg-danger text-white animate-pulse shadow-md">
        <HiStop size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={startRecording}
      disabled={disabled}
      title="Click to speak"
      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-all text-slate-600 dark:text-slate-300"
    >
      <HiMicrophone size={20} />
    </button>
  );
};

export default VoiceInput;
