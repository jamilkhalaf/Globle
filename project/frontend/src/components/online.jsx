import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Badge,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Toolbar
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';
import Header from './Header';
import { io } from 'socket.io-client';
import FlagGuessGame from './FlagGuessGame';

const Online = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [lobbyData, setLobbyData] = useState([]);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [joinLobbyDialog, setJoinLobbyDialog] = useState(false);
  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  
  // WebSocket and game state
  const [isConnected, setIsConnected] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, countdown, playing, ended
  const [gameTimer, setGameTimer] = useState(0);
  const [gameAnswer, setGameAnswer] = useState('');
  const [gameQuestion, setGameQuestion] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  // Socket management
  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load leaderboard data
    fetchLeaderboard();

    // Initialize socket connection if user is logged in
    if (localStorage.getItem('token')) {
      initializeSocket();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      disconnectSocket();
    };
  }, []);

  // Timer effect for game countdown and playing state
  useEffect(() => {
    let interval;
    
    if (gameState === 'countdown') {
      interval = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            setGameState('playing');
            return 60; // Start 60 second game
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            setGameState('ended');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  // Timer effect for waiting
  useEffect(() => {
    let interval;
    
    if (isWaitingForPlayer) {
      interval = setInterval(() => {
        setWaitingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWaitingForPlayer]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('https://api.jamilweb.click/api/games/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const initializeSocket = async () => {
    if (socketRef.current || isConnectingRef.current) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to play online');
      return;
    }

    isConnectingRef.current = true;
    console.log('🔌 Initializing socket connection...');

    try {
      // Verify token first
      const verifyResponse = await fetch('https://api.jamilweb.click/api/auth/verify', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!verifyResponse.ok) {
        throw new Error('Token verification failed');
      }

      // Create socket connection
      const socket = io('https://api.jamilweb.click', {
        auth: { token },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000
      });

      // Socket event handlers
      socket.on('connect', () => {
        console.log('🔌 Socket connected successfully');
        setIsConnected(true);
        setError('');
        isConnectingRef.current = false;
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
        setIsConnected(false);
        isConnectingRef.current = false;
      });

      socket.on('connect_error', (error) => {
        console.error('🔌 Socket connection error:', error);
        setError('Failed to connect to game server: ' + error.message);
        setIsConnected(false);
        isConnectingRef.current = false;
      });

      socket.on('queueJoined', (data) => {
        console.log('✅ Joined queue:', data);
      });

      socket.on('queueError', (data) => {
        console.log('❌ Queue error:', data);
        setError(data.message);
      });

      socket.on('matchFound', (data) => {
        console.log('🎮 Match found:', data);
        console.log('🎮 Setting currentMatch to:', data);
        console.log('🎮 Setting gameState to countdown');
        console.log('🎮 Setting isWaitingForPlayer to false');
        setCurrentMatch(data);
        setGameState('countdown');
        setGameQuestion(data.question || 'Game starting...');
        setIsWaitingForPlayer(false);
        setWaitingTime(0);
        setGameTimer(3);
        console.log('🎮 Match found event handlers completed');
      });

      socket.on('gameStart', (data) => {
        console.log('🎮 Game start:', data);
        console.log('🎮 Setting gameState to playing');
        setGameState('playing');
        setGameTimer(60);
        setGameQuestion(data.question);
        console.log('🎮 Game start event handlers completed');
      });

      socket.on('gameEnd', (data) => {
        console.log('🎮 Game end:', data);
        setGameState('ended');
        setMatchResult(data);
        setGameTimer(0);
      });

      socket.on('roundEnd', (data) => {
        console.log('🎮 Round end:', data);
        // Handle round end for FlagGuess games
        if (data.roundWinner !== undefined) {
          setGameState('roundEnd');
          // Update round result state for FlagGuessGame component
          setMatchResult({
            roundWinner: data.roundWinner,
            roundNumber: data.roundNumber,
            score: data.score,
            nextRound: data.nextRound,
            isCorrect: data.isCorrect,
            correctAnswer: data.correctAnswer
          });
        }
      });

      socket.on('guessResult', (data) => {
        console.log('🎮 Guess result:', data);
        // Handle incorrect guess feedback
        if (!data.isCorrect) {
          // Update the message or show feedback
          // setMessage(data.message); // This line was removed
        }
      });

      socket.on('opponentDisconnected', () => {
        console.log('🎮 Opponent disconnected');
        setError('Opponent disconnected');
        setGameState('waiting');
        setCurrentMatch(null);
      });

      socketRef.current = socket;

    } catch (error) {
      console.error('🔌 Socket initialization error:', error);
      setError('Failed to connect to game server');
      isConnectingRef.current = false;
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    isConnectingRef.current = false;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleJoinLobby = (lobby) => {
    setSelectedLobby(lobby);
    setJoinLobbyDialog(true);
  };

  const handleConfirmJoinLobby = () => {
    console.log(`Joining lobby: ${selectedLobby?.name}`);
    setJoinLobbyDialog(false);
    setSelectedLobby(null);
  };

  const handleSubmitAnswer = (answerData) => {
    if (!socketRef.current || !currentMatch) return;
    
    socketRef.current.emit('submitAnswer', {
      matchId: currentMatch.matchId,
      answer: answerData.answer,
      timeTaken: answerData.timeTaken
    });
  };

  const handleNewOpponent = () => {
    if (!socketRef.current) return;
    
    setGameState('waiting');
    setCurrentMatch(null);
    setMatchResult(null);
    setGameAnswer('');
    setGameQuestion('');
    setGameTimer(0);
    
    socketRef.current.emit('requestNewOpponent', { gameType: 'FlagGuess' });
  };

  const handleLeaveGame = () => {
    setGameState('waiting');
    setCurrentMatch(null);
    setMatchResult(null);
    setGameAnswer('');
    setGameQuestion('');
    setGameTimer(0);
    setIsWaitingForPlayer(false);
    setWaitingTime(0);
    
    if (socketRef.current) {
      socketRef.current.emit('leaveQueue', { gameType: 'FlagGuess' });
    }
  };

  const getLobbyStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'success';
      case 'starting': return 'warning';
      case 'full': return 'error';
      default: return 'default';
    }
  };

  // Render specific game component based on game type
  const renderGameComponent = () => {
    const gameProps = {
      matchData: currentMatch,
      onAnswerSubmit: handleSubmitAnswer,
      gameState,
      gameTimer,
      onLeaveGame: handleLeaveGame,
      onNewOpponent: handleNewOpponent,
      matchResult
    };

    return <FlagGuessGame {...gameProps} />;
  };

  const renderLeaderboardTab = () => (
    <Box>
      <Card sx={{ mb: 3, bgcolor: '#1e1e1e', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EmojiEventsIcon sx={{ color: '#ffd700', fontSize: 32 }} />
            <Typography variant="h5">
              Global Leaderboard
            </Typography>
            <Button
              onClick={fetchLeaderboard}
              startIcon={<RefreshIcon />}
              sx={{ ml: 'auto', color: 'white' }}
            >
              Refresh
            </Button>
          </Box>
          
          <TableContainer component={Paper} sx={{ bgcolor: '#2a2a2a' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Player</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Games</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Win Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow key={player.rank} sx={{ '&:hover': { bgcolor: '#3a3a3a' } }}>
                    <TableCell sx={{ color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {player.rank === 1 && <EmojiEventsIcon sx={{ color: '#ffd700', fontSize: 20 }} />}
                        {player.rank === 2 && <EmojiEventsIcon sx={{ color: '#c0c0c0', fontSize: 20 }} />}
                        {player.rank === 3 && <EmojiEventsIcon sx={{ color: '#cd7f32', fontSize: 20 }} />}
                        {player.rank}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{player.username}</TableCell>
                    <TableCell sx={{ color: '#43cea2', fontWeight: 'bold' }}>{player.score}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{player.games}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{player.winRate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderLobbyTab = () => (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        mb: 4, 
        textAlign: 'center',
        p: 4,
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h2" sx={{ 
          color: 'white', 
          mb: 2, 
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
        }}>
          🎮 Quick Match
        </Typography>
        
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.8)', 
          mb: 4,
          fontStyle: 'italic',
          maxWidth: 600,
          mx: 'auto'
        }}>
          Challenge players worldwide in our flag guessing game. First to answer correctly wins!
        </Typography>

        {/* Game Info Cards */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Card sx={{ 
            bgcolor: 'rgba(67, 206, 162, 0.1)', 
            border: '1px solid rgba(67, 206, 162, 0.3)',
            minWidth: 150
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#43cea2', mb: 1 }}>🏆</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Win Points</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            bgcolor: 'rgba(255, 193, 7, 0.1)', 
            border: '1px solid rgba(255, 193, 7, 0.3)',
            minWidth: 150
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#ffc107', mb: 1 }}>⚡</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Fast Paced</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            bgcolor: 'rgba(156, 39, 176, 0.1)', 
            border: '1px solid rgba(156, 39, 176, 0.3)',
            minWidth: 150
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#9c27b0', mb: 1 }}>🌍</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Global Players</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Join Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => {
              console.log('🎮 Joining queue directly');
              setIsWaitingForPlayer(true);
              setWaitingTime(0);
              setGameState('waiting');
              setCurrentMatch(null);
              setMatchResult(null);
              
              // Ensure socket is connected
              if (!socketRef.current) {
                console.log('🔌 No socket, initializing...');
                initializeSocket().then(() => {
                  if (socketRef.current && isConnected) {
                    console.log('🔌 Joining queue after socket initialization');
                    socketRef.current.emit('joinQueue', { gameType: 'FlagGuess' });
                  }
                });
              } else if (isConnected) {
                console.log('🔌 Socket connected, joining queue');
                socketRef.current.emit('joinQueue', { gameType: 'FlagGuess' });
              } else {
                console.log('🔌 Socket exists but not connected, waiting for connection...');
              }
            }}
            disabled={!localStorage.getItem('token')}
            sx={{ 
              bgcolor: '#43cea2',
              fontSize: '1.3rem',
              px: 6,
              py: 2.5,
              borderRadius: 3,
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(67, 206, 162, 0.3)',
              '&:hover': {
                bgcolor: '#3bb08f',
                transform: 'scale(1.05)',
                boxShadow: '0 12px 25px rgba(67, 206, 162, 0.4)',
              },
              '&:disabled': {
                bgcolor: 'rgba(67, 206, 162, 0.3)',
                color: 'rgba(255,255,255,0.5)',
                boxShadow: 'none'
              }
            }}
          >
            {!localStorage.getItem('token') ? 'Please Login First' : '🎯 Join Queue Now'}
          </Button>
        </Box>
      </Box>

      {/* How to Play */}
      <Card sx={{ 
        bgcolor: 'rgba(255,255,255,0.05)', 
        color: 'white',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            🎯 How to Play
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>1️⃣</Typography>
                <Typography variant="h6" sx={{ mb: 1, color: '#43cea2' }}>Join Queue</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Click "Join Queue" to find an opponent
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>2️⃣</Typography>
                <Typography variant="h6" sx={{ mb: 1, color: '#43cea2' }}>Guess the Flag</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Look at the country name and click the correct flag
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>3️⃣</Typography>
                <Typography variant="h6" sx={{ mb: 1, color: '#43cea2' }}>Win Points</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  First to answer correctly wins 100 points!
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderWaitingPage = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(10px)'
      }}
    >
      <Card sx={{ 
        bgcolor: 'rgba(30,30,30,0.95)', 
        color: 'white', 
        p: 4, 
        maxWidth: 500, 
        textAlign: 'center',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <CardContent>
          {/* Animated Loading */}
          <Box sx={{ mb: 4, position: 'relative' }}>
            <CircularProgress 
              size={100} 
              sx={{ 
                color: '#43cea2', 
                mb: 2,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            
            {/* Pulsing Ring */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '2px solid rgba(67, 206, 162, 0.3)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'translate(-50%, -50%) scale(1)',
                  opacity: 1
                },
                '50%': {
                  transform: 'translate(-50%, -50%) scale(1.1)',
                  opacity: 0.5
                },
                '100%': {
                  transform: 'translate(-50%, -50%) scale(1)',
                  opacity: 1
                }
              }
            }} />
          </Box>

          {/* Status Text */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ 
              mb: 2, 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              color: '#43cea2'
            }}>
              🔍 Searching...
            </Typography>
            
            <Typography variant="h6" sx={{ 
              color: '#43cea2', 
              mb: 2,
              fontWeight: '500'
            }}>
              Flag Guessing Game
            </Typography>
            
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 3,
              fontStyle: 'italic'
            }}>
              Looking for an opponent to challenge...
            </Typography>
          </Box>

          {/* Timer Display */}
          <Box sx={{ 
            mb: 4, 
            p: 3,
            bgcolor: 'rgba(67, 206, 162, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(67, 206, 162, 0.3)'
          }}>
            <Typography variant="h2" sx={{ 
              color: '#43cea2', 
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              {Math.floor(waitingTime / 60)}:{(waitingTime % 60).toString().padStart(2, '0')}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.6)',
              fontStyle: 'italic'
            }}>
              Time searching
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleLeaveGame}
              size="large"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                borderWidth: 2,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': { 
                  borderColor: 'white',
                  borderWidth: 2,
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              ❌ Cancel Search
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled
              sx={{ 
                bgcolor: 'rgba(67, 206, 162, 0.3)',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                cursor: 'not-allowed'
              }}
            >
              🔄 Connecting...
            </Button>
          </Box>

          {/* Tips */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic'
            }}>
              💡 Tip: Make sure you're ready to play! The game starts immediately when an opponent is found.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Toolbar />
      
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Connection Status */}
        {!isConnected && localStorage.getItem('token') && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Not connected to game server. Please login to play online.
          </Alert>
        )}

        {/* Login Required Alert */}
        {!localStorage.getItem('token') && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              You need to be logged in to play online games.
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => window.location.href = '/login'}
              sx={{ bgcolor: '#43cea2' }}
            >
              Go to Login
            </Button>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: '#43cea2'
                }
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#43cea2'
              }
            }}
          >
            <Tab 
              icon={<LeaderboardIcon />} 
              label="Leaderboard" 
              iconPosition="start"
            />
            <Tab 
              icon={<PlayArrowIcon />} 
              label="Lobby" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && renderLeaderboardTab()}
        {activeTab === 1 && renderLobbyTab()}

        {/* Join Lobby Dialog */}
        <Dialog
          open={joinLobbyDialog}
          onClose={() => setJoinLobbyDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { bgcolor: '#1e1e1e', color: 'white' }
          }}
        >
          <DialogTitle>
            Join Lobby: {selectedLobby?.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to join this lobby?
            </Typography>
            <Box sx={{ bgcolor: '#2a2a2a', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                Game Type: {selectedLobby?.gameType}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                Players: {selectedLobby?.players}/{selectedLobby?.maxPlayers}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Time Limit: {selectedLobby?.timeLimit}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinLobbyDialog(false)} sx={{ color: 'white' }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmJoinLobby} variant="contained" sx={{ bgcolor: '#43cea2' }}>
              Join Lobby
            </Button>
          </DialogActions>
        </Dialog>

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <CircularProgress sx={{ color: '#43cea2' }} />
          </Box>
        )}

        {/* Waiting Page */}
        {isWaitingForPlayer && gameState === 'waiting' && !currentMatch && (
          <>
            {console.log('⏳ Rendering waiting page:', { isWaitingForPlayer, gameState, currentMatch })}
            {renderWaitingPage()}
          </>
        )}

        {/* Game Page - Render specific game component or generic interface */}
        {(gameState === 'countdown' || gameState === 'playing' || gameState === 'ended') && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10002, // Higher than waiting page
              bgcolor: 'rgba(0,0,0,0.9)'
            }}
          >
            {console.log('🎮 Rendering game component:', { gameState, currentMatch, isWaitingForPlayer })}
            {console.log('🎮 Game state conditions met, rendering game component')}
            {console.log('🎮 currentMatch?.gameType:', currentMatch?.gameType)}
            {renderGameComponent()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Online; 