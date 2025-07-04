const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function addHangmanToUsers() {
  await mongoose.connect(process.env.MONGODB_URI);

  const users = await User.find({});
  let updated = 0;

  for (const user of users) {
    if (!user.games) user.games = {};
    if (!user.games.hangman) {
      user.games.hangman = {
        gamesPlayed: 0,
        bestScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageScore: 0,
        lastPlayed: null
      };
      user.markModified('games');
      await user.save();
      console.log('After save, user.games:', user.games);
      updated++;
      console.log(`Updated user: ${user.username || user._id}`);
    }
  }

  console.log(`Done. Updated ${updated} users.`);
  mongoose.disconnect();
}

addHangmanToUsers();