// backend/utils/languageMapper.js
// Purpose: Maps language codes to full names, native scripts, and speech configurations

const LANGUAGE_MAP = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechCode: 'en-IN',
    direction: 'ltr'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    speechCode: 'hi-IN',
    direction: 'ltr'
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechCode: 'kn-IN',
    direction: 'ltr'
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    direction: 'ltr'
  }
};

const getLanguageName = (code) => {
  return LANGUAGE_MAP[code]?.name || 'English';
};

const getNativeName = (code) => {
  return LANGUAGE_MAP[code]?.nativeName || 'English';
};

const getSpeechCode = (code) => {
  return LANGUAGE_MAP[code]?.speechCode || 'en-IN';
};

const isSupported = (code) => {
  return !!LANGUAGE_MAP[code];
};

const getAllLanguages = () => {
  return Object.values(LANGUAGE_MAP);
};

const getLanguageInstruction = (code) => {
  const name = getLanguageName(code);
  return `Respond entirely in ${name}.`;
};

module.exports = {
  LANGUAGE_MAP,
  getLanguageName,
  getNativeName,
  getSpeechCode,
  isSupported,
  getAllLanguages,
  getLanguageInstruction
};
