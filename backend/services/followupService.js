// backend/services/followupService.js
// Purpose: Generates intelligent, conversational follow-up questions for citizens

const { buildFollowUpMessages } = require('../utils/promptBuilder');
const { callOpenAI } = require('../utils/openaiHelper');
const { parseFollowUpQuestions } = require('../utils/responseParser');

const generateDefaultFollowUps = (topic = '') => {
  const t = topic.toLowerCase();
  if (t.includes('farmer') || t.includes('agriculture') || t.includes('kisan')) {
    return [
      "How much money do farmers get under PM Kisan?",
      "How to apply for PM Kisan scheme?",
      "What documents do farmers need?"
    ];
  }
  if (t.includes('health') || t.includes('medical') || t.includes('hospital')) {
    return [
      "How to get Ayushman Bharat card?",
      "Which hospitals accept this health scheme?",
      "What medical treatments are covered?"
    ];
  }
  if (t.includes('education') || t.includes('school') || t.includes('scholarship')) {
    return [
      "How to apply for government scholarship?",
      "What is the income limit for scholarships?",
      "When is the scholarship application deadline?"
    ];
  }
  return [
    "How do I apply for this scheme?",
    "What documents do I need?",
    "Is there an official website to apply?"
  ];
};

const generateFollowUps = async (chatMessages) => {
  if (!Array.isArray(chatMessages) || chatMessages.length < 2) {
    return [
      "What is PM Kisan Yojana?",
      "Tell me about Ayushman Bharat health scheme",
      "How to apply for MNREGA?"
    ];
  }

  try {
    const messages = buildFollowUpMessages(chatMessages);
    const responseText = await callOpenAI(messages, { temperature: 0.8, max_tokens: 100 });
    const questions = parseFollowUpQuestions(responseText);
    if (questions.length > 0) return questions;
    return generateDefaultFollowUps(chatMessages[chatMessages.length - 1]?.content || '');
  } catch (error) {
    return generateDefaultFollowUps(chatMessages[chatMessages.length - 1]?.content || '');
  }
};

const generateContextualFollowUps = async (lastAIResponse) => {
  try {
    const messages = [
      { role: 'system', content: 'Generate 3 short follow-up questions a citizen might ask after reading this AI response. Return JSON array of strings only.' },
      { role: 'user', content: (lastAIResponse || '').slice(0, 500) }
    ];
    const responseText = await callOpenAI(messages, { temperature: 0.8, max_tokens: 100 });
    const questions = parseFollowUpQuestions(responseText);
    if (questions.length > 0) return questions;
    return generateDefaultFollowUps();
  } catch (error) {
    return generateDefaultFollowUps();
  }
};

module.exports = {
  generateFollowUps,
  generateDefaultFollowUps,
  generateContextualFollowUps
};
