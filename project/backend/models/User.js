const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Online gaming points and statistics
  onlinePoints: {
    type: Number,
    default: 0
  },
  onlineGamesPlayed: {
    type: Number,
    default: 0
  },
  onlineGamesWon: {
    type: Number,
    default: 0
  },
  onlineWinRate: {
    type: Number,
    default: 0
  },
  // Overall statistics
  totalGamesPlayed: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastOverallPlayed: {
    type: Date,
    default: null
  },
  // Game-specific statistics
  games: {
    globle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    population: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    findle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    flagle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    worldle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    capitals: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    hangman: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    shaple: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    usstates: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    namle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    },
    satle: {
      gamesPlayed: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      lastPlayed: { type: Date, default: null }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update online points
userSchema.methods.updateOnlinePoints = async function(pointsChange, isWin = false) {
  this.onlinePoints += pointsChange;
  this.onlineGamesPlayed += 1;
  
  if (isWin) {
    this.onlineGamesWon += 1;
  }
  
  this.onlineWinRate = (this.onlineGamesWon / this.onlineGamesPlayed) * 100;
  
  return await this.save();
};

module.exports = mongoose.model('User', userSchema); 