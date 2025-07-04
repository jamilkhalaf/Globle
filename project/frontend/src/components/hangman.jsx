import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, Stack, Fade, useTheme, useMediaQuery, Toolbar } from '@mui/material';
import Header from './Header';
import NotificationModal from './NotificationModal';
import officialCountries from './officialCountries';

const Hangman = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const canvasRef = useRef(null);
  
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Filter countries to only use official ones and those with reasonable lengths
  const allCountries = officialCountries.filter(name => 
    name.length >= 4 && name.length <= 15
  );

  const getRandomWord = () => {
    return allCountries[Math.floor(Math.random() * allCountries.length)].toUpperCase();
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('');

  const displayWord = word
    .split('')
    .map(letter => {
      if (letter === ' ') return ' '; // Keep spaces as spaces
      return guessedLetters.has(letter) ? letter : '_';
    })
    .join(' ');

  const drawHangman = (ctx, wrongGuesses) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set drawing style
    ctx.strokeStyle = '#f44336';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Draw base
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(150, height - 50);
    ctx.stroke();
    
    // Draw vertical pole
    ctx.beginPath();
    ctx.moveTo(100, height - 50);
    ctx.lineTo(100, 50);
    ctx.stroke();
    
    // Draw top
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.stroke();
    
    // Draw rope
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 80);
    ctx.stroke();
    
    if (wrongGuesses >= 1) {
      // Draw head
      ctx.beginPath();
      ctx.arc(200, 100, 20, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    if (wrongGuesses >= 2) {
      // Draw body
      ctx.beginPath();
      ctx.moveTo(200, 120);
      ctx.lineTo(200, 180);
      ctx.stroke();
    }
    
    if (wrongGuesses >= 3) {
      // Draw left arm
      ctx.beginPath();
      ctx.moveTo(200, 140);
      ctx.lineTo(170, 160);
      ctx.stroke();
    }
    
    if (wrongGuesses >= 4) {
      // Draw right arm
      ctx.beginPath();
      ctx.moveTo(200, 140);
      ctx.lineTo(230, 160);
      ctx.stroke();
    }
    
    if (wrongGuesses >= 5) {
      // Draw left leg
      ctx.beginPath();
      ctx.moveTo(200, 180);
      ctx.lineTo(170, 220);
      ctx.stroke();
    }
    
    if (wrongGuesses >= 6) {
      // Draw right leg
      ctx.beginPath();
      ctx.moveTo(200, 180);
      ctx.lineTo(230, 220);
      ctx.stroke();
    }
  };

  const handleLetterGuess = (letter) => {
    if (gameOver || guessedLetters.has(letter)) return;
    
    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);
    
    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= 6) {
        setGameOver(true);
        setMessage(`Game Over! The country was: ${word}`);
        setStreak(0);
        updateGameStats(false);
      }
    } else {
      // Check if word is complete
      const isWordComplete = word.split('').every(letter => newGuessedLetters.has(letter));
      if (isWordComplete) {
        setGameWon(true);
        setGameOver(true);
        setStreak(prev => prev + 1);
        setMessage('🎉 Congratulations! You saved the hangman!');
        updateGameStats(true);
      }
    }
  };

  const resetGame = () => {
    setWord(getRandomWord());
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
    setMessage('');
    setGameStartTime(Date.now());
  };

  const updateGameStats = async (won) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      const finalScore = won ? 100 - (wrongGuesses * 10) : 0;

      console.log('Hangman - Updating game stats:', {
        gameId: 'hangman',
        score: finalScore,
        gameTime,
        streak: streak,
        attempts: wrongGuesses,
        won
      });

      const response = await fetch('http://136.36.59.111:5051/api/games/update-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'hangman',
          score: finalScore,
          gameTime,
          streak: streak,
          attempts: wrongGuesses
        }),
      });

      console.log('Hangman - Game stats response:', response.status, response.ok);

      if (response.ok) {
        const gameData = await response.json();
        console.log('Hangman - Game stats updated:', gameData);
        await updateBadgeProgress('hangman', finalScore, wrongGuesses, streak);
      } else {
        const errorData = await response.json();
        console.error('Hangman - Game stats error:', errorData);
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const updateBadgeProgress = async (gameId, score, attempts, streak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('Hangman - Updating badge progress:', {
        gameId,
        score,
        attempts,
        streak
      });

      const response = await fetch('http://136.36.59.111:5051/api/badges/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          score,
          attempts,
          streak
        }),
      });

      console.log('Hangman - Badge response:', response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Hangman - Badge update result:', data);
        if (data.totalNewBadges > 0) {
          console.log(`🎉 Unlocked ${data.totalNewBadges} new badges!`);
        }
      } else {
        const errorData = await response.json();
        console.error('Hangman - Badge update error:', errorData);
      }
    } catch (error) {
      console.error('Error updating badge progress:', error);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 300;
      canvas.height = 300;
      
      drawHangman(ctx, wrongGuesses);
    }
  }, [wrongGuesses]);

  useEffect(() => {
    resetGame();
  }, []);

  if (showIntro) {
    return (
      <>
        <Header />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Hangman"
          description="Guess the country name one letter at a time! Each wrong guess adds a part to the hangman. You have 6 wrong guesses before the game is over. Good luck!"
          color="error"
        />
      </>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Header />
      <Toolbar />
      <Fade in timeout={600}>
        <Paper elevation={8} sx={{ 
          mt: { xs: 2, md: 6 }, 
          p: { xs: 2, md: 4 }, 
          borderRadius: 4, 
          maxWidth: { xs: 350, sm: 600, md: 800 }, 
          width: '100%', 
          textAlign: 'center', 
          position: 'relative', 
          background: 'rgba(30,34,44,0.98)', 
          color: 'white', 
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' 
        }}>
          <Typography variant="h3" sx={{ 
            mb: 3, 
            fontWeight: 900, 
            color: 'transparent', 
            background: 'linear-gradient(90deg, #f44336 30%, #e91e63 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            letterSpacing: 2, 
            textShadow: '0 2px 8px rgba(0,0,0,0.3)' 
          }}>
            Hangman
          </Typography>

          <Typography variant="h5" sx={{ 
            mb: 3, 
            color: '#b0c4de', 
            fontWeight: 700, 
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            minHeight: '2.5rem'
          }}>
            {message || 'Guess the country name!'}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            {/* Hangman Canvas */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: 300
            }}>
              <canvas
                ref={canvasRef}
                style={{
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0,0,0,0.3)'
                }}
              />
              <Typography variant="h6" sx={{ mt: 2, color: '#f44336', fontWeight: 'bold' }}>
                Wrong Guesses: {wrongGuesses}/6
              </Typography>
            </Box>

            {/* Game Info */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: 300
            }}>
              <Typography variant="h4" sx={{ 
                mb: 3, 
                fontFamily: 'monospace', 
                letterSpacing: '0.5rem',
                color: gameWon ? '#4caf50' : '#fff',
                fontWeight: 'bold'
              }}>
                {displayWord}
              </Typography>

              <Stack spacing={1} sx={{ mb: 3, width: '100%' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: 1,
                  borderRadius: 1
                }}>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Streak:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {streak}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: 1,
                  borderRadius: 1
                }}>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Best Score:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                    {bestScore}
                  </Typography>
                </Box>
              </Stack>

              {/* Letter Buttons */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 1, 
                maxWidth: 350,
                width: '100%'
              }}>
                {alphabet.map((letter) => (
                  <Button
                    key={letter}
                    variant="outlined"
                    size="small"
                    disabled={guessedLetters.has(letter) || gameOver}
                    onClick={() => handleLetterGuess(letter)}
                    sx={{
                      color: guessedLetters.has(letter) 
                        ? (word.includes(letter) ? '#4caf50' : '#f44336')
                        : '#fff',
                      borderColor: guessedLetters.has(letter) 
                        ? (word.includes(letter) ? '#4caf50' : '#f44336')
                        : 'rgba(255,255,255,0.3)',
                      backgroundColor: guessedLetters.has(letter) 
                        ? (word.includes(letter) ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)')
                        : 'transparent',
                      minWidth: letter === ' ' ? '80px' : '40px',
                      height: '40px',
                      fontSize: letter === ' ' ? '0.7rem' : '1.2rem',
                      fontWeight: 'bold',
                      gridColumn: letter === ' ' ? 'span 2' : 'span 1',
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      '&:disabled': {
                        opacity: 0.7,
                      }
                    }}
                  >
                    {letter === ' ' ? 'SPACE' : letter}
                  </Button>
                ))}
              </Box>

              {/* Reset Button */}
              <Button
                variant="contained"
                onClick={resetGame}
                sx={{
                  mt: 3,
                  backgroundColor: '#f44336',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  }
                }}
              >
                New Game
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Hangman; 