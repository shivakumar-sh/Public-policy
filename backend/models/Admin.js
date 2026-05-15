const mongoose = require('mongoose');

// Used for platform wide settings or logs since users have 'role' for admin
const adminSchema = new mongoose.Schema(
  {
    settingName: {
      type: String,
      required: true,
      unique: true,
    },
    settingValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
