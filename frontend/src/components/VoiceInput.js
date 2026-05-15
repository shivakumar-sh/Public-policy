import React, { useState, useEffect } from 'react';
import { HiMicrophone, HiStop } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const VoiceInput = ({ onResult, language = 'en' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      // Map app language to speech recognition locale
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN'
      };
      recognitionInstance.lang = langMap[language] || 'en-IN';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Could not hear you. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, onResult]);

  const toggleRecording = () => {
    if (!recognition) {
      toast.error('Voice recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        recognition.stop();
        setIsRecording(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`p-2.5 rounded-xl transition-all relative ${
        isRecording 
        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
        : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
      title={isRecording ? 'Stop Recording' : 'Voice Input'}
    >
      {isRecording ? <HiStop size={20} /> : <HiMicrophone size={20} />}
      {isRecording && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceInput;
