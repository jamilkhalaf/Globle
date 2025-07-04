const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/games/update-stats
// @desc    Update user game statistics
// @access  Private
router.post('/update-stats', [
  body('gameId').isIn(['globle', 'population', 'findle', 'flagle', 'worldle', 'capitals'])
    .withMessage('Invalid game ID'),
  body('score').isNumeric().withMessage('Score must be a number'),
  body('gameTime').optional().isNumeric().withMessage('Game time must be a number'),
  body('attempts').optional().isNumeric().withMessage('Attempts must be a number'),
  body('streak').optional().isNumeric().withMessage('Streak must be a number')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gameId, score, gameTime, attempts, streak } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure games object exists
    if (!user.games) {
      user.games = {};
    }

    // Update game statistics
    const gameStats = user.games[gameId] || {
      gamesPlayed: 0,
      bestScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageScore: 0,
      lastPlayed: null
    };
    const newGamesPlayed = gameStats.gamesPlayed + 1;
    
    // Calculate new average score
    let newAverageScore;
    if (gameId === 'globle') {
      // For Globle, average is based on attempts (lower is better)
      const attempts = req.body.attempts || 0;
      const newTotalAttempts = gameStats.averageScore * gameStats.gamesPlayed + attempts;
      newAverageScore = newTotalAttempts / newGamesPlayed;
    } else {
      // For other games, average is based on score (higher is better)
      const newTotalScore = gameStats.averageScore * gameStats.gamesPlayed + score;
      newAverageScore = newTotalScore / newGamesPlayed;
    }

    // Update best score logic
    let newBestScore;
    if (gameId === 'globle') {
      // For Globle, best score is fewest attempts (lower is better)
      const attempts = req.body.attempts || 0;
      newBestScore = gameStats.bestScore === 0 ? attempts : Math.min(gameStats.bestScore, attempts);
    } else {
      // For other games, best score is highest score (higher is better)
      newBestScore = Math.max(gameStats.bestScore, score);
    }

    // Update streak logic - only increment on wins
    const today = new Date();
    const lastPlayed = gameStats.lastPlayed;
    const isConsecutiveDay = lastPlayed && 
      (today - new Date(lastPlayed)) <= 24 * 60 * 60 * 1000; // 24 hours

    // Determine if this was a win based on game type and score
    let isWin = false;
    if (gameId === 'globle') {
      // For Globle, any completed game is a win (they found the country)
      isWin = score > 0;
    } else if (gameId === 'population') {
      // For Population, a win is getting at least one correct answer
      isWin = score > 0;
    } else if (gameId === 'findle') {
      // For Findle, a win is getting the correct country
      isWin = score > 0;
    } else if (gameId === 'flagle') {
      // For Flagle, a win is guessing the country correctly
      isWin = score > 0;
    } else if (gameId === 'worldle') {
      // For Worldle, a win is guessing the country correctly
      isWin = score > 0;
    } else if (gameId === 'capitals') {
      // For Capitals, a win is getting at least one correct answer
      isWin = score > 0;
    }

    let newCurrentStreak = gameStats.currentStreak;
    if (isWin) {
      // Only increment streak on wins
      if (isConsecutiveDay) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1;
      }
    } else {
      // Reset streak on losses
      newCurrentStreak = 0;
    }

    const newLongestStreak = Math.max(gameStats.longestStreak, newCurrentStreak);

    // Update user statistics
    user.games[gameId] = {
      gamesPlayed: newGamesPlayed,
      bestScore: newBestScore,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      averageScore: newAverageScore,
      lastPlayed: today
    };

    // Update overall statistics
    user.totalGamesPlayed += 1;
    if (gameId === 'globle') {
      // For Globle, add attempts to total score (for tracking purposes)
      const attempts = req.body.attempts || 0;
      user.totalScore += attempts;
    } else {
      // For other games, add the actual score
      user.totalScore += score;
    }
    
    // Update overall streak logic - track daily streaks across all games
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to start of day
    
    // Check if user has played today already
    const lastOverallPlayed = user.lastOverallPlayed ? new Date(user.lastOverallPlayed) : null;
    const lastOverallPlayedDay = lastOverallPlayed ? new Date(lastOverallPlayed) : null;
    if (lastOverallPlayedDay) {
      lastOverallPlayedDay.setHours(0, 0, 0, 0);
    }
    
    let newOverallCurrentStreak = user.currentStreak;
    if (!lastOverallPlayedDay || todayStart.getTime() !== lastOverallPlayedDay.getTime()) {
      // First game of the day or different day
      if (lastOverallPlayedDay && (todayStart.getTime() - lastOverallPlayedDay.getTime()) === 24 * 60 * 60 * 1000) {
        // Consecutive day
        newOverallCurrentStreak += 1;
      } else {
        // Not consecutive or first time playing
        newOverallCurrentStreak = 1;
      }
      user.lastOverallPlayed = new Date();
    }
    // If same day, keep current streak (don't increment)
    
    user.currentStreak = newOverallCurrentStreak;
    user.longestStreak = Math.max(user.longestStreak, newOverallCurrentStreak);

    await user.save();

    res.json({
      message: 'Statistics updated successfully',
      gameStats: user.games[gameId],
      overallStats: {
        totalGamesPlayed: user.totalGamesPlayed,
        totalScore: user.totalScore,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/games/stats
// @desc    Get user game statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      overall: {
        totalGamesPlayed: user.totalGamesPlayed,
        totalScore: user.totalScore,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        joinDate: user.joinDate
      },
      games: user.games
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 