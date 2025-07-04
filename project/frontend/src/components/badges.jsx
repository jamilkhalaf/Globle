import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Fade, 
  useTheme, 
  useMediaQuery, 
  Toolbar, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  LinearProgress,
  Avatar,
  Divider,
  Container,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from './Header';
import PublicIcon from '@mui/icons-material/Public';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import FlagIcon from '@mui/icons-material/Flag';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Badges = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [userStats, setUserStats] = useState(null);
  const [badges, setBadges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchBadges();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in or sign up to view your badges and track your progress!');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5051/api/games/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      } else if (response.status === 401) {
        setError('Please log in or sign up to view your badges and track your progress!');
      } else {
        setError('Failed to load user data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return; // Don't show error here, it's handled in fetchUserData
      }

      const response = await fetch('http://localhost:5051/api/badges', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBadges(data);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const calculateYearsPlaying = () => {
    if (!userStats?.overall?.joinDate) return 0;
    const joinDate = new Date(userStats.overall.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 365);
  };

  const yearsPlaying = calculateYearsPlaying();

  const getBadgeData = (badgeId) => {
    const allBadges = [
      ...(badges.overall || []),
      ...(badges.globle || []),
      ...(badges.population || []),
      ...(badges.findle || []),
      ...(badges.flagle || []),
      ...(badges.worldle || []),
      ...(badges.capitals || [])
    ];
    return allBadges.find(badge => badge.badgeId === badgeId);
  };

  const badgeCategories = [
    {
      name: 'Overall',
      icon: <EmojiEventsIcon />,
      badges: [
        {
          id: 'first_game',
          name: 'First Steps',
          description: 'Play your first game',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.overall?.totalGamesPlayed >= 1,
          progress: Math.min(userStats?.overall?.totalGamesPlayed || 0, 1),
          maxProgress: 1
        },
        {
          id: 'games_10',
          name: 'Getting Started',
          description: 'Play 10 games',
          icon: <TrendingUpIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.overall?.totalGamesPlayed >= 10,
          progress: Math.min(userStats?.overall?.totalGamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'games_50',
          name: 'Regular Player',
          description: 'Play 50 games',
          icon: <TrendingUpIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.overall?.totalGamesPlayed >= 50,
          progress: Math.min(userStats?.overall?.totalGamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'games_100',
          name: 'Dedicated Player',
          description: 'Play 100 games',
          icon: <TrendingUpIcon sx={{ fontSize: 24, color: '#9C27B0' }} />,
          color: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
          unlocked: userStats?.overall?.totalGamesPlayed >= 100,
          progress: Math.min(userStats?.overall?.totalGamesPlayed || 0, 100),
          maxProgress: 100
        },
        {
          id: 'games_500',
          name: 'Gaming Legend',
          description: 'Play 500 games',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#E91E63' }} />,
          color: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
          unlocked: userStats?.overall?.totalGamesPlayed >= 500,
          progress: Math.min(userStats?.overall?.totalGamesPlayed || 0, 500),
          maxProgress: 500
        },
        {
          id: 'streak_3',
          name: 'On Fire',
          description: 'Maintain a 3-day streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF5722' }} />,
          color: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
          unlocked: userStats?.overall?.currentStreak >= 3,
          progress: Math.min(userStats?.overall?.currentStreak || 0, 3),
          maxProgress: 3
        },
        {
          id: 'streak_7',
          name: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.overall?.currentStreak >= 7,
          progress: Math.min(userStats?.overall?.currentStreak || 0, 7),
          maxProgress: 7
        },
        {
          id: 'streak_30',
          name: 'Monthly Master',
          description: 'Maintain a 30-day streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.overall?.currentStreak >= 30,
          progress: Math.min(userStats?.overall?.currentStreak || 0, 30),
          maxProgress: 30
        },
        {
          id: 'streak_100',
          name: 'Streak God',
          description: 'Maintain a 100-day streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#9C27B0' }} />,
          color: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
          unlocked: userStats?.overall?.currentStreak >= 100,
          progress: Math.min(userStats?.overall?.currentStreak || 0, 100),
          maxProgress: 100
        },
        {
          id: 'veteran_1',
          name: 'Veteran',
          description: 'Play for 1 year',
          icon: <CalendarTodayIcon sx={{ fontSize: 24, color: '#607D8B' }} />,
          color: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
          unlocked: yearsPlaying >= 1,
          progress: yearsPlaying,
          maxProgress: 1
        },
        {
          id: 'veteran_3',
          name: 'Legendary Veteran',
          description: 'Play for 3 years',
          icon: <CalendarTodayIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: yearsPlaying >= 3,
          progress: yearsPlaying,
          maxProgress: 3
        }
      ]
    },
    {
      name: 'Globle',
      icon: <PublicIcon sx={{ fontSize: 20, color: '#1976d2' }} />,
      badges: [
        {
          id: 'globle_first_win',
          name: 'Globle Explorer',
          description: 'Win your first Globle game',
          icon: <PublicIcon sx={{ fontSize: 24, color: '#1976d2' }} />,
          color: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
          unlocked: userStats?.games?.globle?.gamesPlayed >= 1,
          progress: userStats?.games?.globle?.gamesPlayed || 0,
          maxProgress: 1
        },
        {
          id: 'globle_10_games',
          name: 'Globle Regular',
          description: 'Play 10 Globle games',
          icon: <PublicIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.globle?.gamesPlayed >= 10,
          progress: Math.min(userStats?.games?.globle?.gamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'globle_50_games',
          name: 'Globle Master',
          description: 'Play 50 Globle games',
          icon: <PublicIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.globle?.gamesPlayed >= 50,
          progress: Math.min(userStats?.games?.globle?.gamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'globle_5_attempts',
          name: 'Globle Sharpshooter',
          description: 'Find country in 5 attempts or less',
          icon: <StarIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.globle?.bestScore > 0 && userStats?.games?.globle?.bestScore <= 5,
          progress: userStats?.games?.globle?.bestScore || 999,
          maxProgress: 5,
          reverseProgress: true
        },
        {
          id: 'globle_4_attempts',
          name: 'Globle Expert',
          description: 'Find country in 4 attempts or less',
          icon: <StarIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.globle?.bestScore > 0 && userStats?.games?.globle?.bestScore <= 4,
          progress: userStats?.games?.globle?.bestScore || 999,
          maxProgress: 4,
          reverseProgress: true
        },
        {
          id: 'globle_3_attempts',
          name: 'Globle Pro',
          description: 'Find country in 3 attempts or less',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.globle?.bestScore > 0 && userStats?.games?.globle?.bestScore <= 3,
          progress: userStats?.games?.globle?.bestScore || 999,
          maxProgress: 3,
          reverseProgress: true
        },
        {
          id: 'globle_2_attempts',
          name: 'Globle Legend',
          description: 'Find country in 2 attempts or less',
          icon: <StarIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.globle?.bestScore > 0 && userStats?.games?.globle?.bestScore <= 2,
          progress: userStats?.games?.globle?.bestScore || 999,
          maxProgress: 2,
          reverseProgress: true
        },
        {
          id: 'globle_1_attempt',
          name: 'Globle God',
          description: 'Find country on first try',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.games?.globle?.bestScore === 1,
          progress: userStats?.games?.globle?.bestScore === 1 ? 1 : 0,
          maxProgress: 1
        },
        {
          id: 'globle_streak_5',
          name: 'Globle Streaker',
          description: 'Maintain a 5-game Globle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.globle?.currentStreak >= 5,
          progress: Math.min(userStats?.games?.globle?.currentStreak || 0, 5),
          maxProgress: 5
        },
        {
          id: 'globle_streak_10',
          name: 'Globle Fire',
          description: 'Maintain a 10-game Globle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.globle?.currentStreak >= 10,
          progress: Math.min(userStats?.games?.globle?.currentStreak || 0, 10),
          maxProgress: 10
        }
      ]
    },
    {
      name: 'Population',
      icon: <GroupsIcon sx={{ fontSize: 20, color: '#4caf50' }} />,
      badges: [
        {
          id: 'population_first_win',
          name: 'Population Learner',
          description: 'Play your first Population game',
          icon: <GroupsIcon sx={{ fontSize: 24, color: '#4caf50' }} />,
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          unlocked: userStats?.games?.population?.gamesPlayed >= 1,
          progress: userStats?.games?.population?.gamesPlayed || 0,
          maxProgress: 1
        },
        {
          id: 'population_10_games',
          name: 'Population Regular',
          description: 'Play 10 Population games',
          icon: <GroupsIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.population?.gamesPlayed >= 10,
          progress: Math.min(userStats?.games?.population?.gamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'population_50_games',
          name: 'Population Master',
          description: 'Play 50 Population games',
          icon: <GroupsIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.population?.gamesPlayed >= 50,
          progress: Math.min(userStats?.games?.population?.gamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'population_score_50',
          name: 'Population Novice',
          description: 'Score 50+ in Population',
          icon: <StarIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.population?.bestScore >= 50,
          progress: Math.min(userStats?.games?.population?.bestScore || 0, 50),
          maxProgress: 50
        },
        {
          id: 'population_score_80',
          name: 'Population Expert',
          description: 'Score 80+ in Population',
          icon: <StarIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.population?.bestScore >= 80,
          progress: Math.min(userStats?.games?.population?.bestScore || 0, 80),
          maxProgress: 80
        },
        {
          id: 'population_score_100',
          name: 'Population Pro',
          description: 'Score 100+ in Population',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.population?.bestScore >= 100,
          progress: Math.min(userStats?.games?.population?.bestScore || 0, 100),
          maxProgress: 100
        },
        {
          id: 'population_score_150',
          name: 'Population Legend',
          description: 'Score 150+ in Population',
          icon: <StarIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.population?.bestScore >= 150,
          progress: Math.min(userStats?.games?.population?.bestScore || 0, 150),
          maxProgress: 150
        },
        {
          id: 'population_score_200',
          name: 'Population God',
          description: 'Score 200+ in Population',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.games?.population?.bestScore >= 200,
          progress: Math.min(userStats?.games?.population?.bestScore || 0, 200),
          maxProgress: 200
        },
        {
          id: 'population_streak_5',
          name: 'Population Streaker',
          description: 'Maintain a 5-game Population streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.population?.currentStreak >= 5,
          progress: Math.min(userStats?.games?.population?.currentStreak || 0, 5),
          maxProgress: 5
        },
        {
          id: 'population_streak_10',
          name: 'Population Fire',
          description: 'Maintain a 10-game Population streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.population?.currentStreak >= 10,
          progress: Math.min(userStats?.games?.population?.currentStreak || 0, 10),
          maxProgress: 10
        },
        {
          id: 'population_streak_20',
          name: 'Population Inferno',
          description: 'Maintain a 20-game Population streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#9C27B0' }} />,
          color: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
          unlocked: userStats?.games?.population?.currentStreak >= 20,
          progress: Math.min(userStats?.games?.population?.currentStreak || 0, 20),
          maxProgress: 20
        }
      ]
    },
    {
      name: 'Findle',
      icon: <SportsEsportsIcon sx={{ fontSize: 20, color: '#9c27b0' }} />,
      badges: [
        {
          id: 'findle_first_win',
          name: 'Findle Finder',
          description: 'Play your first Findle game',
          icon: <SportsEsportsIcon sx={{ fontSize: 24, color: '#9c27b0' }} />,
          color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          unlocked: userStats?.games?.findle?.gamesPlayed >= 1,
          progress: userStats?.games?.findle?.gamesPlayed || 0,
          maxProgress: 1
        },
        {
          id: 'findle_10_games',
          name: 'Findle Regular',
          description: 'Play 10 Findle games',
          icon: <SportsEsportsIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.findle?.gamesPlayed >= 10,
          progress: Math.min(userStats?.games?.findle?.gamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'findle_50_games',
          name: 'Findle Master',
          description: 'Play 50 Findle games',
          icon: <SportsEsportsIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.findle?.gamesPlayed >= 50,
          progress: Math.min(userStats?.games?.findle?.gamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'findle_score_3',
          name: 'Findle Novice',
          description: 'Score 3+ in Findle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.findle?.bestScore >= 3,
          progress: Math.min(userStats?.games?.findle?.bestScore || 0, 3),
          maxProgress: 3
        },
        {
          id: 'findle_score_5',
          name: 'Findle Expert',
          description: 'Score 5+ in Findle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.findle?.bestScore >= 5,
          progress: Math.min(userStats?.games?.findle?.bestScore || 0, 5),
          maxProgress: 5
        },
        {
          id: 'findle_score_7',
          name: 'Findle Champion',
          description: 'Score 7+ in Findle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.findle?.bestScore >= 7,
          progress: Math.min(userStats?.games?.findle?.bestScore || 0, 7),
          maxProgress: 7
        },
        {
          id: 'findle_score_10',
          name: 'Findle Legend',
          description: 'Score 10+ in Findle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.findle?.bestScore >= 10,
          progress: Math.min(userStats?.games?.findle?.bestScore || 0, 10),
          maxProgress: 10
        },
        {
          id: 'findle_score_15',
          name: 'Findle God',
          description: 'Score 15+ in Findle',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.games?.findle?.bestScore >= 15,
          progress: Math.min(userStats?.games?.findle?.bestScore || 0, 15),
          maxProgress: 15
        },
        {
          id: 'findle_streak_3',
          name: 'Findle Streaker',
          description: 'Maintain a 3-game Findle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.findle?.currentStreak >= 3,
          progress: Math.min(userStats?.games?.findle?.currentStreak || 0, 3),
          maxProgress: 3
        },
        {
          id: 'findle_streak_5',
          name: 'Findle Fire',
          description: 'Maintain a 5-game Findle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.findle?.currentStreak >= 5,
          progress: Math.min(userStats?.games?.findle?.currentStreak || 0, 5),
          maxProgress: 5
        }
      ]
    },
    {
      name: 'Flagle',
      icon: <FlagIcon sx={{ fontSize: 20, color: '#ff9800' }} />,
      badges: [
        {
          id: 'flagle_first_win',
          name: 'Flag Enthusiast',
          description: 'Play your first Flagle game',
          icon: <FlagIcon sx={{ fontSize: 24, color: '#ff9800' }} />,
          color: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)',
          unlocked: userStats?.games?.flagle?.gamesPlayed >= 1,
          progress: userStats?.games?.flagle?.gamesPlayed || 0,
          maxProgress: 1
        },
        {
          id: 'flagle_10_games',
          name: 'Flag Regular',
          description: 'Play 10 Flagle games',
          icon: <FlagIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.flagle?.gamesPlayed >= 10,
          progress: Math.min(userStats?.games?.flagle?.gamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'flagle_50_games',
          name: 'Flag Master',
          description: 'Play 50 Flagle games',
          icon: <FlagIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.flagle?.gamesPlayed >= 50,
          progress: Math.min(userStats?.games?.flagle?.gamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'flagle_score_3',
          name: 'Flag Novice',
          description: 'Score 3+ in Flagle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.flagle?.bestScore >= 3,
          progress: Math.min(userStats?.games?.flagle?.bestScore || 0, 3),
          maxProgress: 3
        },
        {
          id: 'flagle_score_5',
          name: 'Flag Expert',
          description: 'Score 5+ in Flagle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.flagle?.bestScore >= 5,
          progress: Math.min(userStats?.games?.flagle?.bestScore || 0, 5),
          maxProgress: 5
        },
        {
          id: 'flagle_score_8',
          name: 'Flag Master',
          description: 'Score 8+ in Flagle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.flagle?.bestScore >= 8,
          progress: Math.min(userStats?.games?.flagle?.bestScore || 0, 8),
          maxProgress: 8
        },
        {
          id: 'flagle_score_10',
          name: 'Flag Legend',
          description: 'Score 10+ in Flagle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.flagle?.bestScore >= 10,
          progress: Math.min(userStats?.games?.flagle?.bestScore || 0, 10),
          maxProgress: 10
        },
        {
          id: 'flagle_score_15',
          name: 'Flag God',
          description: 'Score 15+ in Flagle',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.games?.flagle?.bestScore >= 15,
          progress: Math.min(userStats?.games?.flagle?.bestScore || 0, 15),
          maxProgress: 15
        },
        {
          id: 'flagle_streak_3',
          name: 'Flag Streaker',
          description: 'Maintain a 3-game Flagle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.flagle?.currentStreak >= 3,
          progress: Math.min(userStats?.games?.flagle?.currentStreak || 0, 3),
          maxProgress: 3
        },
        {
          id: 'flagle_streak_5',
          name: 'Flag Fire',
          description: 'Maintain a 5-game Flagle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.flagle?.currentStreak >= 5,
          progress: Math.min(userStats?.games?.flagle?.currentStreak || 0, 5),
          maxProgress: 5
        }
      ]
    },
    {
      name: 'Worldle',
      icon: <PublicIcon sx={{ fontSize: 20, color: '#43cea2' }} />,
      badges: [
        {
          id: 'worldle_first_win',
          name: 'World Explorer',
          description: 'Play your first Worldle game',
          icon: <PublicIcon sx={{ fontSize: 24, color: '#43cea2' }} />,
          color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
          unlocked: userStats?.games?.worldle?.gamesPlayed >= 1,
          progress: userStats?.games?.worldle?.gamesPlayed || 0,
          maxProgress: 1
        },
        {
          id: 'worldle_10_games',
          name: 'World Regular',
          description: 'Play 10 Worldle games',
          icon: <PublicIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.worldle?.gamesPlayed >= 10,
          progress: Math.min(userStats?.games?.worldle?.gamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'worldle_50_games',
          name: 'World Master',
          description: 'Play 50 Worldle games',
          icon: <PublicIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.worldle?.gamesPlayed >= 50,
          progress: Math.min(userStats?.games?.worldle?.gamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'worldle_score_2',
          name: 'World Novice',
          description: 'Score 2+ in Worldle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.worldle?.bestScore >= 2,
          progress: Math.min(userStats?.games?.worldle?.bestScore || 0, 2),
          maxProgress: 2
        },
        {
          id: 'worldle_score_3',
          name: 'World Expert',
          description: 'Score 3+ in Worldle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.worldle?.bestScore >= 3,
          progress: Math.min(userStats?.games?.worldle?.bestScore || 0, 3),
          maxProgress: 3
        },
        {
          id: 'worldle_score_5',
          name: 'World Master',
          description: 'Score 5+ in Worldle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.worldle?.bestScore >= 5,
          progress: Math.min(userStats?.games?.worldle?.bestScore || 0, 5),
          maxProgress: 5
        },
        {
          id: 'worldle_score_8',
          name: 'World Legend',
          description: 'Score 8+ in Worldle',
          icon: <StarIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.worldle?.bestScore >= 8,
          progress: Math.min(userStats?.games?.worldle?.bestScore || 0, 8),
          maxProgress: 8
        },
        {
          id: 'worldle_score_10',
          name: 'World God',
          description: 'Score 10+ in Worldle',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.games?.worldle?.bestScore >= 10,
          progress: Math.min(userStats?.games?.worldle?.bestScore || 0, 10),
          maxProgress: 10
        },
        {
          id: 'worldle_streak_3',
          name: 'World Streaker',
          description: 'Maintain a 3-game Worldle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.worldle?.currentStreak >= 3,
          progress: Math.min(userStats?.games?.worldle?.currentStreak || 0, 3),
          maxProgress: 3
        },
        {
          id: 'worldle_streak_5',
          name: 'World Fire',
          description: 'Maintain a 5-game Worldle streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.worldle?.currentStreak >= 5,
          progress: Math.min(userStats?.games?.worldle?.currentStreak || 0, 5),
          maxProgress: 5
        }
      ]
    },
    {
      name: 'Capitals',
      icon: <SchoolIcon sx={{ fontSize: 20, color: '#43cea2' }} />,
      badges: [
        {
          id: 'capitals_first_win',
          name: 'Capital Learner',
          description: 'Play your first Capitals game',
          icon: <SchoolIcon sx={{ fontSize: 24, color: '#43cea2' }} />,
          color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
          unlocked: userStats?.games?.capitals?.gamesPlayed >= 1,
          progress: userStats?.games?.capitals?.gamesPlayed || 0,
          maxProgress: 1
        },
        {
          id: 'capitals_10_games',
          name: 'Capital Regular',
          description: 'Play 10 Capitals games',
          icon: <SchoolIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.capitals?.gamesPlayed >= 10,
          progress: Math.min(userStats?.games?.capitals?.gamesPlayed || 0, 10),
          maxProgress: 10
        },
        {
          id: 'capitals_50_games',
          name: 'Capital Master',
          description: 'Play 50 Capitals games',
          icon: <SchoolIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.capitals?.gamesPlayed >= 50,
          progress: Math.min(userStats?.games?.capitals?.gamesPlayed || 0, 50),
          maxProgress: 50
        },
        {
          id: 'capitals_score_5',
          name: 'Capital Novice',
          description: 'Score 5+ in Capitals',
          icon: <StarIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
          color: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          unlocked: userStats?.games?.capitals?.bestScore >= 5,
          progress: Math.min(userStats?.games?.capitals?.bestScore || 0, 5),
          maxProgress: 5
        },
        {
          id: 'capitals_score_7',
          name: 'Capital Expert',
          description: 'Score 7+ in Capitals',
          icon: <StarIcon sx={{ fontSize: 24, color: '#2196F3' }} />,
          color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          unlocked: userStats?.games?.capitals?.bestScore >= 7,
          progress: Math.min(userStats?.games?.capitals?.bestScore || 0, 7),
          maxProgress: 7
        },
        {
          id: 'capitals_score_8',
          name: 'Capital Master',
          description: 'Score 8+ in Capitals',
          icon: <StarIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.capitals?.bestScore >= 8,
          progress: Math.min(userStats?.games?.capitals?.bestScore || 0, 8),
          maxProgress: 8
        },
        {
          id: 'capitals_score_9',
          name: 'Capital Legend',
          description: 'Score 9+ in Capitals',
          icon: <StarIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.capitals?.bestScore >= 9,
          progress: Math.min(userStats?.games?.capitals?.bestScore || 0, 9),
          maxProgress: 9
        },
        {
          id: 'capitals_score_10',
          name: 'Capital God',
          description: 'Perfect score in Capitals (10/10)',
          icon: <EmojiEventsIcon sx={{ fontSize: 24, color: '#FFD700' }} />,
          color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          unlocked: userStats?.games?.capitals?.bestScore >= 10,
          progress: Math.min(userStats?.games?.capitals?.bestScore || 0, 10),
          maxProgress: 10
        },
        {
          id: 'capitals_streak_3',
          name: 'Capital Streaker',
          description: 'Maintain a 3-game Capitals streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
          color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          unlocked: userStats?.games?.capitals?.currentStreak >= 3,
          progress: Math.min(userStats?.games?.capitals?.currentStreak || 0, 3),
          maxProgress: 3
        },
        {
          id: 'capitals_streak_5',
          name: 'Capital Fire',
          description: 'Maintain a 5-game Capitals streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#F44336' }} />,
          color: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
          unlocked: userStats?.games?.capitals?.currentStreak >= 5,
          progress: Math.min(userStats?.games?.capitals?.currentStreak || 0, 5),
          maxProgress: 5
        },
        {
          id: 'capitals_streak_10',
          name: 'Capital Inferno',
          description: 'Maintain a 10-game Capitals streak',
          icon: <LocalFireDepartmentIcon sx={{ fontSize: 24, color: '#9C27B0' }} />,
          color: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
          unlocked: userStats?.games?.capitals?.currentStreak >= 10,
          progress: Math.min(userStats?.games?.capitals?.currentStreak || 0, 10),
          maxProgress: 10
        }
      ]
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const totalBadges = badgeCategories.reduce((total, category) => total + category.badges.length, 0);
  const unlockedBadges = badgeCategories.reduce((total, category) => 
    total + category.badges.filter(badge => badge.unlocked).length, 0);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: isMobile
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Header />
        <Toolbar />
        <CircularProgress sx={{ color: '#43cea2' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: isMobile
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Toolbar />
        <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: 'rgba(30,34,44,0.95)',
                color: 'white',
                boxShadow: '0 20px 60px 0 rgba(31,38,135,0.5)',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: 500,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: { xs: 70, md: 80 },
                  height: { xs: 70, md: 80 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: { xs: 35, md: 40 }, color: 'white' }} />
              </Box>

              {/* Title */}
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #FFD700 30%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: 1,
                }}
              >
                Your Achievements
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#b0c4de',
                  fontWeight: 500,
                  mb: 3,
                  lineHeight: 1.4,
                }}
              >
                Track your progress and unlock badges
              </Typography>

              {/* Error Message */}
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3, 
                  textAlign: 'left',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  border: '1px solid rgba(25, 118, 210, 0.3)',
                  color: '#b0c4de'
                }}
              >
                {error}
              </Alert>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    backgroundColor: '#43cea2',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#3bb08f',
                    },
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Toolbar />
      <Fade in timeout={800}>
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 2 } }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
            </Box>
            
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                fontWeight: 900,
                color: 'transparent',
                background: 'linear-gradient(90deg, #FFD700 30%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: 1,
              }}
            >
              Your Achievements
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: '#b0c4de',
                fontWeight: 500,
                mb: 1,
                lineHeight: 1.4,
              }}
            >
              Track your progress and unlock badges
            </Typography>

            {/* Progress Overview */}
            <Paper
              elevation={8}
              sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: 3,
                background: 'rgba(30,34,44,0.95)',
                color: 'white',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                textAlign: 'center',
                mt: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
                Badge Progress: {unlockedBadges}/{totalBadges}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(unlockedBadges / totalBadges) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: 4,
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>
                {Math.round((unlockedBadges / totalBadges) * 100)}% Complete
              </Typography>
            </Paper>
          </Box>

          {/* Tabs */}
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  minWidth: 100,
                  '&.Mui-selected': {
                    color: '#FFD700',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700',
                }
              }}
            >
              {badgeCategories.map((category, index) => (
                <Tab
                  key={category.name}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {category.icon}
                      <span>{category.name}</span>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Badges Grid */}
          <Grid container spacing={1.5} sx={{ pb: 4 }}>
            {badgeCategories[activeTab].badges.map((badge, index) => (
              <Grid item xs={12} sm={6} md={4} key={badge.id}>
                <Card
                  sx={{
                    background: badge.unlocked ? 'rgba(30,34,44,0.95)' : 'rgba(20,24,34,0.95)',
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: badge.unlocked ? '0 8px 32px 0 rgba(31,38,135,0.37)' : '0 4px 16px 0 rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    opacity: badge.unlocked ? 1 : 0.6,
                    '&:hover': {
                      transform: badge.unlocked ? 'translateY(-4px)' : 'none',
                      boxShadow: badge.unlocked ? '0 12px 40px 0 rgba(31,38,135,0.5)' : '0 4px 16px 0 rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: badge.unlocked ? badge.color : 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        boxShadow: badge.unlocked ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
                      }}
                    >
                      {badge.icon}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: badge.unlocked ? 'white' : 'rgba(255,255,255,0.5)',
                        fontSize: '1rem',
                      }}
                    >
                      {badge.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        mb: 1.5,
                        lineHeight: 1.4,
                        fontSize: '0.8rem',
                      }}
                    >
                      {badge.description}
                    </Typography>

                    {!badge.unlocked && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Progress: {badge.progress}/{badge.maxProgress}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={badge.reverseProgress 
                            ? Math.max(0, ((badge.maxProgress - badge.progress) / badge.maxProgress) * 100)
                            : (badge.progress / badge.maxProgress) * 100
                          }
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            mt: 0.5,
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Box>
                    )}

                    <Chip
                      label={badge.unlocked ? 'Unlocked' : 'Locked'}
                      size="small"
                      sx={{
                        backgroundColor: badge.unlocked ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                        color: badge.unlocked ? 'white' : 'rgba(255,255,255,0.5)',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Fade>
    </Box>
  );
};

export default Badges; 