const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 1000 },
  category: {
    type: String,
    required: true,
    enum: ['Agriculture','Health','Finance','Housing','Employment',
           'Education','Environment','Technology','Other']
  },
  content: { type: String, required: true },
  simplifiedContent: { type: String, default: '' },
  simplifiedHi: { type: String, default: '' },
  simplifiedKn: { type: String, default: '' },
  simplifiedTa: { type: String, default: '' },
  tags: [{ type: String, trim: true, lowercase: true }],
  ministry: { type: String, trim: true },
  dateEnacted: { type: Date },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  officialUrl: { type: String, trim: true },
  faqs: [{
    question: String,
    answer: String,
    category: String,
    isImportant: Boolean
  }],
  faqsGeneratedAt: { type: Date }
}, { timestamps: true });

policySchema.index({ title: 'text', description: 'text', tags: 'text' });
policySchema.index({ category: 1 });
policySchema.index({ views: -1 });

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
