const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  language: { type: String, enum: ['en', 'hi', 'kn', 'ta'], default: 'en' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  bookmarkCount: { type: Number, default: 0 },
  lastLoginAt: { type: Date },
  totalChats: { type: Number, default: 0 },
  totalMessages: { type: Number, default: 0 },
  documentsUploaded: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
