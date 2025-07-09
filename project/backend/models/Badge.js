const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeId: {
    type: String,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0
  },
  maxProgress: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['overall', 'globle', 'population', 'findle', 'flagle', 'worldle', 'capitals', 'hangman', 'shaple', 'usstates', 'namle']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique badge per user
badgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema); 