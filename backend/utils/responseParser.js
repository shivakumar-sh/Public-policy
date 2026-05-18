// backend/utils/responseParser.js
// Purpose: Parses and cleans AI responses into structured formats

const parseJSONResponse = (text) => {
  if (!text) return null;
  if (typeof text === 'object') return text;

  try {
    // Strip markdown code blocks if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      // Fallback regex for JSON array
      const arrayMatch = text.match(/\[[\s\S]*\]/);
      if (arrayMatch) return JSON.parse(arrayMatch[0]);
    } catch (err) {
      try {
        // Fallback regex for JSON object
        const objectMatch = text.match(/\{[\s\S]*\}/);
        if (objectMatch) return JSON.parse(objectMatch[0]);
      } catch (err2) {
        console.error('❌ Failed to parse JSON response:', e.message);
        return null;
      }
    }
    return null;
  }
};

const parseFollowUpQuestions = (text) => {
  const parsed = parseJSONResponse(text);
  if (Array.isArray(parsed)) {
    return parsed.filter(item => typeof item === 'string').slice(0, 3);
  }
  return [];
};

const parseFAQResponse = (text) => {
  const parsed = parseJSONResponse(text);
  if (Array.isArray(parsed)) {
    return parsed.filter(item => item && typeof item.question === 'string' && typeof item.answer === 'string');
  }
  return [];
};

const parseRecommendationsResponse = (text) => {
  const parsed = parseJSONResponse(text);
  if (parsed && Array.isArray(parsed.recommendations)) {
    return parsed.recommendations;
  }
  return [];
};

const parseTopicsResponse = (text) => {
  const parsed = parseJSONResponse(text);
  if (Array.isArray(parsed)) {
    return parsed.filter(item => typeof item === 'string' && item.trim().length > 0);
  }
  return [];
};

const cleanMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
    .trim();
};

module.exports = {
  parseJSONResponse,
  parseFollowUpQuestions,
  parseFAQResponse,
  parseRecommendationsResponse,
  parseTopicsResponse,
  cleanMarkdown
};
