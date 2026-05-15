const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a policy title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      enum: [
        'Agriculture',
        'Education',
        'Health',
        'Finance',
        'Housing',
        'Employment',
        'Environment',
        'Technology',
        'Other',
      ],
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please add the policy content'],
    },
    simplifiedContent: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    ministry: {
      type: String,
    },
    dateEnacted: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
