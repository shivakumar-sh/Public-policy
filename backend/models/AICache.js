// backend/models/AICache.js
// Purpose: Mongoose schema for caching AI responses to reduce API costs and latency

const mongoose = require('mongoose');
const crypto = require('crypto');

const aiCacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  feature: {
    type: String,
    required: true
  },
  inputHash: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  hitCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  }
}, { timestamps: true });

const generateHash = (text) => {
  return crypto.createHash('md5').update(text || '').digest('hex');
};

aiCacheSchema.statics.getCached = async function(feature, inputText, language = 'en') {
  const hash = generateHash(inputText);
  const cacheKey = `${feature}:${language}:${hash}`;
  const cached = await this.findOne({ cacheKey });
  if (cached) {
    cached.hitCount += 1;
    await cached.save();
    return cached.response;
  }
  return null;
};

aiCacheSchema.statics.setCached = async function(feature, inputText, language = 'en', response, ttlHours = 24) {
  const hash = generateHash(inputText);
  const cacheKey = `${feature}:${language}:${hash}`;
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  return await this.findOneAndUpdate(
    { cacheKey },
    { feature, inputHash: hash, response, language, expiresAt, $setOnInsert: { hitCount: 0 } },
    { upsert: true, new: true }
  );
};

const AICache = mongoose.models.AICache || mongoose.model('AICache', aiCacheSchema);
module.exports = AICache;
module.exports.generateHash = generateHash;
