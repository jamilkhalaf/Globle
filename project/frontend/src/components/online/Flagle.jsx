import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack, Toolbar, useTheme, useMediaQuery, Alert } from '@mui/material';
import Header from '../Header';

const OnlineFlagle = ({ socket, matchId, gameState, onAnswerSubmit }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'countdown') {
      setQuestion('What country does this flag belong to?');
      setMessage('Enter the country name for the displayed flag');
      setGameOver(false);
      setError('');
    }
  }, [gameState]);

  const handleSubmitAnswer = () => {
    if (!answer.trim() || gameOver) return;

    setError('');
    setGameOver(true);
    onAnswerSubmit(answer.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (gameState === 'playing' || gameState === 'countdown')) {
      handleSubmitAnswer();
    }
  };

  if (gameState === 'waiting') {
    return (
      <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)' }}>
        <Header />
        <Toolbar />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
          <Typography variant="h4" sx={{ color: 'white' }}>
            Waiting for game to start...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)' }}>
      <Header />
      <Toolbar />
      
      {/* Game Content */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 'calc(100vh - 64px)',
        p: 3
      }}>
        <Paper sx={{
          p: 4,
          background: 'rgba(30,34,44,0.95)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: 600,
          width: '100%'
        }}>
          <Stack spacing={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Flagle
            </Typography>
            
            {gameState === 'playing' && (
              <>
                <Typography variant="h6" sx={{ color: '#b0c4de', textAlign: 'center' }}>
                  {question}
                </Typography>
                
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                  {message}
                </Typography>
                
                {/* Flag Display Placeholder */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  p: 3,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  border: '2px dashed rgba(255,255,255,0.3)'
                }}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    [Flag Image Would Display Here]
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  label="Country Name"
                  placeholder="Enter the country name..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={gameOver}
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
                
                {error && (
                  <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                    {error}
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  onClick={handleSubmitAnswer}
                  disabled={gameOver || !answer.trim()}
                  sx={{ bgcolor: '#43cea2' }}
                >
                  Submit Answer
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default OnlineFlagle; 