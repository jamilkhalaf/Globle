import React, { useState, useEffect } from 'react';
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

// Import online game components
import OnlineGloble from './online/Globle';
import OnlinePopulation from './online/Population';
import OnlineUS from './online/US';
import OnlineFindle from './online/Findle';
import OnlineFlagle from './online/Flagle';

const Online = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [lobbyData, setLobbyData] = useState([]);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [joinLobbyDialog, setJoinLobbyDialog] = useState(false);
  const [joinGameDialog, setJoinGameDialog] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState('');
  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  
  // WebSocket and game state
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, countdown, playing, ended
  const [gameTimer, setGameTimer] = useState(0);
  const [gameAnswer, setGameAnswer] = useState('');
  const [gameQuestion, setGameQuestion] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load leaderboard data
    fetchLeaderboard();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Timer for waiting page
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

  // Game timer
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, gameTimer]);

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

  const connectSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to play online');
      return;
    }

    // Import socket.io-client dynamically
    const socketInstance = io('https://api.jamilweb.click', {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError('');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('queueJoined', (data) => {
      console.log('Joined queue:', data);
    });

    socketInstance.on('queueError', (data) => {
      setError(data.message);
    });

    socketInstance.on('matchFound', (data) => {
      setCurrentMatch(data);
      setGameState('countdown');
      setGameQuestion(data.question);
      setIsWaitingForPlayer(false);
      setWaitingTime(0);
    });

    socketInstance.on('gameStart', (data) => {
      setGameState('playing');
      setGameTimer(60); // 60 second game
      setGameQuestion(data.question);
    });

    socketInstance.on('gameEnd', (data) => {
      setGameState('ended');
      setMatchResult(data);
      setGameTimer(0);
    });

    socketInstance.on('opponentDisconnected', () => {
      setError('Opponent disconnected');
      setGameState('waiting');
      setCurrentMatch(null);
    });

    setSocket(socketInstance);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleJoinLobby = (lobby) => {
    setSelectedLobby(lobby);
    setJoinLobbyDialog(true);
  };

  const handleConfirmJoinLobby = () => {
    // Simulate joining lobby
    console.log(`Joining lobby: ${selectedLobby?.name}`);
    setJoinLobbyDialog(false);
    setSelectedLobby(null);
  };

  const handleJoinGameNow = () => {
    if (!selectedGameType) return;
    
    // If random is selected, pick a random game type
    if (selectedGameType === 'random') {
      const gameTypes = ['Globle', 'Population', 'Findle', 'Flagle', 'Worldle', 'Capitals', 'Hangman', 'Shaple', 'US', 'Namle'];
      const randomGameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
      setSelectedGameType(randomGameType);
    }
    
    setJoinGameDialog(true);
  };

  const handleConfirmJoinGame = () => {
    setJoinGameDialog(false);
    setIsWaitingForPlayer(true);
    setWaitingTime(0);
    setGameState('waiting');
    setCurrentMatch(null);
    setMatchResult(null);
    
    // Connect socket if not connected
    if (!socket) {
      connectSocket();
    }
    
    // Join queue
    if (socket && selectedGameType) {
      socket.emit('joinQueue', { gameType: selectedGameType });
    }
  };

  const handleCancelWaiting = () => {
    setIsWaitingForPlayer(false);
    setWaitingTime(0);
    setSelectedGameType('');
    setGameState('waiting');
    setCurrentMatch(null);
    
    if (socket) {
      socket.emit('leaveQueue', { gameType: selectedGameType });
    }
  };

  const handleSubmitAnswer = (answer) => {
    if (!socket || !currentMatch) return;
    
    const timeTaken = 60 - gameTimer;
    socket.emit('submitAnswer', {
      matchId: currentMatch.matchId,
      answer: answer,
      timeTaken
    });
  };

  const handleNewOpponent = () => {
    if (!socket || !selectedGameType) return;
    
    setGameState('waiting');
    setCurrentMatch(null);
    setMatchResult(null);
    setGameAnswer('');
    setGameQuestion('');
    setGameTimer(0);
    
    socket.emit('requestNewOpponent', { gameType: selectedGameType });
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
    setSelectedGameType('');
    
    if (socket) {
      socket.emit('leaveQueue', { gameType: selectedGameType });
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

  // Render the appropriate online game component
  const renderOnlineGame = () => {
    const gameProps = {
      socket,
      matchId: currentMatch?.matchId,
      gameState,
      onAnswerSubmit: handleSubmitAnswer
    };

    switch (selectedGameType) {
      case 'Globle':
        return <OnlineGloble {...gameProps} />;
      case 'Population':
        return <OnlinePopulation {...gameProps} />;
      case 'US':
        return <OnlineUS {...gameProps} />;
      case 'Findle':
        return <OnlineFindle {...gameProps} />;
      case 'Flagle':
        return <OnlineFlagle {...gameProps} />;
      default:
        return renderGamePage();
    }
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
      <Card sx={{ mb: 3, bgcolor: '#1e1e1e', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <PlayArrowIcon sx={{ color: '#43cea2', fontSize: 32 }} />
            <Typography variant="h5">
              Quick Match
            </Typography>
          </Box>
          
          {/* Game Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Choose Your Game
            </Typography>
            
            <Grid container spacing={2}>
              {['Globle', 'Population', 'Findle', 'Flagle', 'Worldle', 'Capitals', 'Hangman', 'Shaple', 'US', 'Namle'].map((gameType) => (
                <Grid item xs={12} sm={6} md={4} key={gameType}>
                  <Card 
                    sx={{ 
                      bgcolor: selectedGameType === gameType ? '#43cea2' : '#2a2a2a', 
                      color: 'white', 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: selectedGameType === gameType ? '#3bb08f' : '#3a3a3a',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(67, 206, 162, 0.3)'
                      }
                    }}
                    onClick={() => setSelectedGameType(gameType)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <PlayArrowIcon sx={{ fontSize: 40, color: selectedGameType === gameType ? 'white' : '#43cea2' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {gameType}
                      </Typography>
                      <Typography variant="body2" sx={{ color: selectedGameType === gameType ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)' }}>
                        Find opponents quickly
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Random Option */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Or Let Fate Decide
            </Typography>
            
            <Card 
              sx={{ 
                bgcolor: selectedGameType === 'random' ? '#43cea2' : '#2a2a2a', 
                color: 'white', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: selectedGameType === 'random' ? '#3bb08f' : '#3a3a3a',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(67, 206, 162, 0.3)'
                }
              }}
              onClick={() => setSelectedGameType('random')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <PlayArrowIcon sx={{ fontSize: 40, color: selectedGameType === 'random' ? 'white' : '#43cea2' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Random Game
                </Typography>
                <Typography variant="body2" sx={{ color: selectedGameType === 'random' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)' }}>
                  Surprise me with any game type
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Join Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={handleJoinGameNow}
              disabled={!selectedGameType}
              sx={{ 
                bgcolor: '#43cea2',
                fontSize: '1.2rem',
                px: 4,
                py: 2,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#3bb08f',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  bgcolor: 'rgba(67, 206, 162, 0.3)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              {selectedGameType ? `Join ${selectedGameType === 'random' ? 'Random Game' : selectedGameType} Queue` : 'Select a Game First'}
            </Button>
          </Box>
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
        bgcolor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <Card sx={{ bgcolor: '#1e1e1e', color: 'white', p: 4, maxWidth: 500, textAlign: 'center' }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <CircularProgress 
              size={80} 
              sx={{ color: '#43cea2', mb: 2 }} 
            />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Waiting for Player...
            </Typography>
            <Typography variant="h6" sx={{ color: '#43cea2', mb: 1 }}>
              {selectedGameType}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
              Searching for an opponent in the queue
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ color: '#43cea2', fontWeight: 'bold' }}>
              {Math.floor(waitingTime / 60)}:{(waitingTime % 60).toString().padStart(2, '0')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Time waiting
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleCancelWaiting}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'white' }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#43cea2' }}
              disabled
            >
              Connecting...
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderGamePage = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <Card sx={{ bgcolor: '#1e1e1e', color: 'white', p: 4, maxWidth: 600, width: '100%' }}>
        <CardContent>
          {gameState === 'countdown' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
                Match Found!
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {currentMatch?.players?.map(p => p.username).join(' vs ')}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Game: {currentMatch?.gameType}
              </Typography>
              <CircularProgress size={60} sx={{ color: '#43cea2' }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Starting in 3 seconds...
              </Typography>
            </Box>
          )}

          {gameState === 'playing' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#43cea2' }}>
                  {currentMatch?.gameType}
                </Typography>
                <Typography variant="h4" sx={{ color: gameTimer <= 10 ? '#f44336' : '#43cea2' }}>
                  {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                {gameQuestion}
              </Typography>

              <TextField
                fullWidth
                label="Your Answer"
                value={gameAnswer}
                onChange={(e) => setGameAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer(gameAnswer)}
                sx={{
                  mb: 3,
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#43cea2' }
                  },
                  '& .MuiInputBase-input': { color: 'white' }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => handleSubmitAnswer(gameAnswer)}
                  disabled={!gameAnswer.trim()}
                  sx={{ bgcolor: '#43cea2' }}
                >
                  Submit Answer
                </Button>
              </Box>
            </Box>
          )}

          {gameState === 'ended' && matchResult && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
                Game Over!
              </Typography>
              
              <Typography variant="h5" sx={{ mb: 2 }}>
                Winner: {matchResult.winner}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                Correct Answer: {matchResult.correctAnswer?.answer}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#43cea2' }}>
                  Points: {matchResult.points ? Object.values(matchResult.points)[0] : 0}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleLeaveGame}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: 'white' }
                  }}
                >
                  Leave Game
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNewOpponent}
                  sx={{ bgcolor: '#43cea2' }}
                >
                  Find New Opponent
                </Button>
              </Box>
            </Box>
          )}
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 3 }}>
          Online Gaming Hub
        </Typography>

        {/* Connection Status */}
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Not connected to game server. Please login to play online.
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

        {/* Quick Match Dialog */}
        <Dialog
          open={joinGameDialog}
          onClose={() => setJoinGameDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { bgcolor: '#1e1e1e', color: 'white' }
          }}
        >
          <DialogTitle>
            Confirm Quick Match
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ready to join the queue for: <strong>{selectedGameType}</strong>
            </Typography>
            <Box sx={{ bgcolor: '#2a2a2a', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                You'll be matched with an opponent as soon as one becomes available.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setJoinGameDialog(false)} sx={{ color: 'white' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmJoinGame} 
              variant="contained" 
              sx={{ bgcolor: '#43cea2' }}
            >
              Join Queue
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
        {isWaitingForPlayer && renderWaitingPage()}

        {/* Game Page - Only show for games that don't have specific online components */}
        {(gameState === 'countdown' || gameState === 'playing' || gameState === 'ended') && 
         !['Globle', 'Population', 'US', 'Findle', 'Flagle'].includes(selectedGameType) && renderGamePage()}

        {/* Online Game Components */}
        {(gameState === 'countdown' || gameState === 'playing' || gameState === 'ended') && 
         ['Globle', 'Population', 'US', 'Findle', 'Flagle'].includes(selectedGameType) && renderOnlineGame()}
      </Box>
    </Box>
  );
};

export default Online; 