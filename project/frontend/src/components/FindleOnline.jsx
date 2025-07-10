import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Header from './Header';

const FindleOnline = ({ matchData, onAnswerSubmit, gameState, gameTimer }) => {
  const [countryGuess, setCountryGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([]);

  useEffect(() => {
    if (matchData) {
      setOtherPlayers(matchData.players || []);
    }
  }, [matchData]);

  useEffect(() => {
    if (gameState === 'ended') {
      setGameEnded(true);
    }
  }, [gameState]);

  const handleCountrySubmit = () => {
    if (!countryGuess.trim()) return;
    
    onAnswerSubmit({
      answer: countryGuess.trim(),
      timeTaken: 60 - gameTimer
    });
    
    setAttempts(prev => [...prev, countryGuess.trim()]);
    setCountryGuess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCountrySubmit();
    }
  };

  const renderPlayerList = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Players
      </Typography>
      <Grid container spacing={2}>
        {otherPlayers.map((player, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: '#43cea2', width: 32, height: 32 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {player.username}
                  </Typography>
                  {winner === player.username && (
                    <EmojiEventsIcon sx={{ color: '#ffd700', ml: 'auto' }} />
                  )}
                </Box>
                {gameEnded && (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                    {winner === player.username ? 'Winner!' : 'Lost'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderGameInterface = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
        Find the country on the map
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#43cea2', mb: 1 }}>
          Timer: {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Enter country name"
          value={countryGuess}
          onChange={(e) => setCountryGuess(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={gameEnded}
          sx={{
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#43cea2' }
            },
            '& .MuiInputBase-input': { color: 'white' }
          }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleCountrySubmit}
        disabled={!countryGuess.trim() || gameEnded}
        sx={{ 
          bgcolor: '#43cea2',
          '&:hover': { bgcolor: '#3bb08f' }
        }}
      >
        Submit Answer
      </Button>
    </Box>
  );

  const renderAttempts = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Your Attempts
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {attempts.map((attempt, index) => (
          <Chip
            key={index}
            label={attempt}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderGameResult = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h3" sx={{ color: '#43cea2', mb: 2 }}>
        Game Over!
      </Typography>
      {winner && (
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Winner: {winner}
        </Typography>
      )}
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        Correct Answer: {matchData?.correctAnswer?.answer || 'Unknown'}
      </Typography>
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
      
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
          <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
          Findle Online
        </Typography>

        {renderPlayerList()}

        {gameState === 'playing' && renderGameInterface()}
        
        {gameEnded && renderGameResult()}

        {attempts.length > 0 && renderAttempts()}

        {gameState === 'countdown' && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: '#43cea2', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              Game starting in 3 seconds...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FindleOnline; 