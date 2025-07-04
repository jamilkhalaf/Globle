const express = require('express');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/badges
// @desc    Get all badges for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.user.id });
    
    // Group badges by category
    const badgesByCategory = {
      overall: badges.filter(badge => badge.category === 'overall'),
      globle: badges.filter(badge => badge.category === 'globle'),
      population: badges.filter(badge => badge.category === 'population'),
      findle: badges.filter(badge => badge.category === 'findle'),
      flagle: badges.filter(badge => badge.category === 'flagle'),
      worldle: badges.filter(badge => badge.category === 'worldle'),
      capitals: badges.filter(badge => badge.category === 'capitals')
    };

    res.json(badgesByCategory);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/badges/progress
// @desc    Get badge progress summary
// @access  Private
router.get('/progress', auth, async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.user.id });
    
    const totalBadges = badges.length;
    const unlockedBadges = badges.filter(badge => badge.unlocked).length;
    const progressPercentage = totalBadges > 0 ? (unlockedBadges / totalBadges) * 100 : 0;

    res.json({
      totalBadges,
      unlockedBadges,
      progressPercentage: Math.round(progressPercentage),
      badgesByCategory: {
        overall: badges.filter(badge => badge.category === 'overall').length,
        globle: badges.filter(badge => badge.category === 'globle').length,
        population: badges.filter(badge => badge.category === 'population').length,
        findle: badges.filter(badge => badge.category === 'findle').length,
        flagle: badges.filter(badge => badge.category === 'flagle').length,
        worldle: badges.filter(badge => badge.category === 'worldle').length,
        capitals: badges.filter(badge => badge.category === 'capitals').length
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/badges/update
// @desc    Update badge progress based on user stats
// @access  Private
router.post('/update', auth, async (req, res) => {
  try {
    const { gameId, score, attempts, streak } = req.body;
    
    // Get user stats to check badge conditions
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Debug logging
    console.log(`Updating badges for user ${user.username}, game: ${gameId}`);
    console.log(`User stats:`, user.games);

    const badgesToCheck = [];
    
    // Overall badges
    badgesToCheck.push(
      { id: 'first_game', category: 'overall', condition: user.totalGamesPlayed >= 1 },
      { id: 'games_10', category: 'overall', condition: user.totalGamesPlayed >= 10 },
      { id: 'games_50', category: 'overall', condition: user.totalGamesPlayed >= 50 },
      { id: 'games_100', category: 'overall', condition: user.totalGamesPlayed >= 100 },
      { id: 'games_500', category: 'overall', condition: user.totalGamesPlayed >= 500 }
    );

    // Only check streak badges if user has a current streak
    if (user.currentStreak > 0) {
      badgesToCheck.push(
        { id: 'streak_3', category: 'overall', condition: user.currentStreak >= 3 },
        { id: 'streak_7', category: 'overall', condition: user.currentStreak >= 7 },
        { id: 'streak_30', category: 'overall', condition: user.currentStreak >= 30 },
        { id: 'streak_100', category: 'overall', condition: user.currentStreak >= 100 }
      );
    }

    // Game-specific badges
    if (gameId === 'globle') {
      const gameStats = user.games?.globle || {};
      console.log(`Globle stats:`, gameStats);
      badgesToCheck.push(
        { id: 'globle_first_win', category: 'globle', condition: gameStats.gamesPlayed >= 1 },
        { id: 'globle_10_games', category: 'globle', condition: gameStats.gamesPlayed >= 10 },
        { id: 'globle_50_games', category: 'globle', condition: gameStats.gamesPlayed >= 50 },
        { id: 'globle_5_attempts', category: 'globle', condition: gameStats.bestScore > 0 && gameStats.bestScore <= 5 },
        { id: 'globle_4_attempts', category: 'globle', condition: gameStats.bestScore > 0 && gameStats.bestScore <= 4 },
        { id: 'globle_3_attempts', category: 'globle', condition: gameStats.bestScore > 0 && gameStats.bestScore <= 3 },
        { id: 'globle_2_attempts', category: 'globle', condition: gameStats.bestScore > 0 && gameStats.bestScore <= 2 },
        { id: 'globle_1_attempt', category: 'globle', condition: gameStats.bestScore === 1 },
        { id: 'globle_streak_5', category: 'globle', condition: gameStats.currentStreak >= 5 },
        { id: 'globle_streak_10', category: 'globle', condition: gameStats.currentStreak >= 10 }
      );
    } else if (gameId === 'population') {
      const gameStats = user.games?.population || {};
      badgesToCheck.push(
        { id: 'population_first_win', category: 'population', condition: gameStats.gamesPlayed >= 1 },
        { id: 'population_10_games', category: 'population', condition: gameStats.gamesPlayed >= 10 },
        { id: 'population_50_games', category: 'population', condition: gameStats.gamesPlayed >= 50 },
        { id: 'population_score_50', category: 'population', condition: gameStats.bestScore >= 50 },
        { id: 'population_score_80', category: 'population', condition: gameStats.bestScore >= 80 },
        { id: 'population_score_100', category: 'population', condition: gameStats.bestScore >= 100 },
        { id: 'population_score_150', category: 'population', condition: gameStats.bestScore >= 150 },
        { id: 'population_score_200', category: 'population', condition: gameStats.bestScore >= 200 },
        { id: 'population_streak_5', category: 'population', condition: gameStats.currentStreak >= 5 },
        { id: 'population_streak_10', category: 'population', condition: gameStats.currentStreak >= 10 },
        { id: 'population_streak_20', category: 'population', condition: gameStats.currentStreak >= 20 }
      );
    } else if (gameId === 'findle') {
      const gameStats = user.games?.findle || {};
      badgesToCheck.push(
        { id: 'findle_first_win', category: 'findle', condition: gameStats.gamesPlayed >= 1 },
        { id: 'findle_10_games', category: 'findle', condition: gameStats.gamesPlayed >= 10 },
        { id: 'findle_50_games', category: 'findle', condition: gameStats.gamesPlayed >= 50 },
        { id: 'findle_score_3', category: 'findle', condition: gameStats.bestScore >= 3 },
        { id: 'findle_score_5', category: 'findle', condition: gameStats.bestScore >= 5 },
        { id: 'findle_score_7', category: 'findle', condition: gameStats.bestScore >= 7 },
        { id: 'findle_score_10', category: 'findle', condition: gameStats.bestScore >= 10 },
        { id: 'findle_score_15', category: 'findle', condition: gameStats.bestScore >= 15 },
        { id: 'findle_streak_3', category: 'findle', condition: gameStats.currentStreak >= 3 },
        { id: 'findle_streak_5', category: 'findle', condition: gameStats.currentStreak >= 5 }
      );
    } else if (gameId === 'flagle') {
      const gameStats = user.games?.flagle || {};
      badgesToCheck.push(
        { id: 'flagle_first_win', category: 'flagle', condition: gameStats.gamesPlayed >= 1 },
        { id: 'flagle_10_games', category: 'flagle', condition: gameStats.gamesPlayed >= 10 },
        { id: 'flagle_50_games', category: 'flagle', condition: gameStats.gamesPlayed >= 50 },
        { id: 'flagle_score_3', category: 'flagle', condition: gameStats.bestScore >= 3 },
        { id: 'flagle_score_5', category: 'flagle', condition: gameStats.bestScore >= 5 },
        { id: 'flagle_score_8', category: 'flagle', condition: gameStats.bestScore >= 8 },
        { id: 'flagle_score_10', category: 'flagle', condition: gameStats.bestScore >= 10 },
        { id: 'flagle_score_15', category: 'flagle', condition: gameStats.bestScore >= 15 },
        { id: 'flagle_streak_3', category: 'flagle', condition: gameStats.currentStreak >= 3 },
        { id: 'flagle_streak_5', category: 'flagle', condition: gameStats.currentStreak >= 5 }
      );
    } else if (gameId === 'worldle') {
      const gameStats = user.games?.worldle || {};
      badgesToCheck.push(
        { id: 'worldle_first_win', category: 'worldle', condition: gameStats.gamesPlayed >= 1 },
        { id: 'worldle_10_games', category: 'worldle', condition: gameStats.gamesPlayed >= 10 },
        { id: 'worldle_50_games', category: 'worldle', condition: gameStats.gamesPlayed >= 50 },
        { id: 'worldle_score_2', category: 'worldle', condition: gameStats.bestScore >= 2 },
        { id: 'worldle_score_3', category: 'worldle', condition: gameStats.bestScore >= 3 },
        { id: 'worldle_score_5', category: 'worldle', condition: gameStats.bestScore >= 5 },
        { id: 'worldle_score_8', category: 'worldle', condition: gameStats.bestScore >= 8 },
        { id: 'worldle_score_10', category: 'worldle', condition: gameStats.bestScore >= 10 },
        { id: 'worldle_streak_3', category: 'worldle', condition: gameStats.currentStreak >= 3 },
        { id: 'worldle_streak_5', category: 'worldle', condition: gameStats.currentStreak >= 5 }
      );
    } else if (gameId === 'capitals') {
      const gameStats = user.games?.capitals || {};
      badgesToCheck.push(
        { id: 'capitals_first_win', category: 'capitals', condition: gameStats.gamesPlayed >= 1 },
        { id: 'capitals_10_games', category: 'capitals', condition: gameStats.gamesPlayed >= 10 },
        { id: 'capitals_50_games', category: 'capitals', condition: gameStats.gamesPlayed >= 50 },
        { id: 'capitals_score_5', category: 'capitals', condition: gameStats.bestScore >= 5 },
        { id: 'capitals_score_7', category: 'capitals', condition: gameStats.bestScore >= 7 },
        { id: 'capitals_score_8', category: 'capitals', condition: gameStats.bestScore >= 8 },
        { id: 'capitals_score_9', category: 'capitals', condition: gameStats.bestScore >= 9 },
        { id: 'capitals_score_10', category: 'capitals', condition: gameStats.bestScore >= 10 },
        { id: 'capitals_streak_3', category: 'capitals', condition: gameStats.currentStreak >= 3 },
        { id: 'capitals_streak_5', category: 'capitals', condition: gameStats.currentStreak >= 5 },
        { id: 'capitals_streak_10', category: 'capitals', condition: gameStats.currentStreak >= 10 }
      );
    }

    // Check and create/update badges
    const newlyUnlockedBadges = [];
    
    for (const badgeCheck of badgesToCheck) {
      console.log(`Checking badge ${badgeCheck.id}: condition = ${badgeCheck.condition}`);
      if (badgeCheck.condition) {
        let badge = await Badge.findOne({ 
          userId: req.user.id, 
          badgeId: badgeCheck.id 
        });

        if (!badge) {
          // Create new badge
          badge = new Badge({
            userId: req.user.id,
            badgeId: badgeCheck.id,
            category: badgeCheck.category,
            unlocked: true,
            unlockedAt: new Date()
          });
          await badge.save();
          newlyUnlockedBadges.push(badgeCheck.id);
          console.log(`Created new badge: ${badgeCheck.id}`);
        } else if (!badge.unlocked) {
          // Unlock existing badge
          badge.unlocked = true;
          badge.unlockedAt = new Date();
          await badge.save();
          newlyUnlockedBadges.push(badgeCheck.id);
          console.log(`Unlocked existing badge: ${badgeCheck.id}`);
        }
      }
    }

    res.json({ 
      message: 'Badge progress updated',
      newlyUnlockedBadges,
      totalNewBadges: newlyUnlockedBadges.length
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/badges/cleanup
// @desc    Clean up incorrectly created badges
// @access  Private
router.post('/cleanup', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User stats for cleanup:', user.games);

    // Get all badges for this user
    const badges = await Badge.find({ userId: req.user.id });
    const badgesToRemove = [];

    // Check each badge against current user stats
    for (const badge of badges) {
      let shouldRemove = false;
      
      if (badge.category === 'globle') {
        const gameStats = user.games?.globle || {};
        console.log(`Checking badge ${badge.badgeId}, user bestScore: ${gameStats.bestScore}`);
        
        switch (badge.badgeId) {
          case 'globle_5_attempts':
            shouldRemove = gameStats.bestScore > 5 || gameStats.bestScore === 0;
            break;
          case 'globle_4_attempts':
            shouldRemove = gameStats.bestScore > 4 || gameStats.bestScore === 0;
            break;
          case 'globle_3_attempts':
            shouldRemove = gameStats.bestScore > 3 || gameStats.bestScore === 0;
            break;
          case 'globle_2_attempts':
            shouldRemove = gameStats.bestScore > 2 || gameStats.bestScore === 0;
            break;
          case 'globle_1_attempt':
            shouldRemove = gameStats.bestScore !== 1;
            break;
        }
      }
      
      if (shouldRemove) {
        badgesToRemove.push(badge.badgeId);
        await Badge.findByIdAndDelete(badge._id);
        console.log(`Removing badge: ${badge.badgeId}`);
      }
    }

    res.json({ 
      message: 'Badge cleanup completed',
      removedBadges: badgesToRemove,
      totalRemoved: badgesToRemove.length
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 