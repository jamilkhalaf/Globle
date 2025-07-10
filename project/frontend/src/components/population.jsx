import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import Header from './Header';
import countryInfo from './countryInfo';

const Population = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess the population!');
  const [countryOptions, setCountryOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [targetCountry, setTargetCountry] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  
  // Game state
  const [gameEndTime, setGameEndTime] = useState(null);

  // Load country options and start new game
  useEffect(() => {
    // Set up country options for autocomplete from countryInfo
    const options = Object.keys(countryInfo)
      .sort((a, b) => a.localeCompare(b));
    setCountryOptions(options);
    
    // Start with a random country
    startNewGame();
  }, []);

  const startNewGame = () => {
    const countryNames = Object.keys(countryInfo);
    const randomCountryName = countryNames[Math.floor(Math.random() * countryNames.length)];
    const randomCountry = {
      name: randomCountryName,
      ...countryInfo[randomCountryName]
    };
    setTargetCountry(randomCountry);
    setGuess('');
    setMessage('Guess the population!');
    setGameOver(false);
    setScore(0);
    setGameStartTime(Date.now());
    setGameEndTime(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (guess.trim()) {
        handleGuess();
      }
    }
  };

  const handleGuess = () => {
    if (!guess || gameOver) {
      return;
    }

    const correctPopulation = targetCountry.population;
    const guessedPopulation = parseInt(guess.replace(/,/g, ''));

    if (isNaN(guessedPopulation)) {
      setMessage('Please enter a valid number!');
      return;
    }

    // Calculate the difference and percentage
    const difference = Math.abs(guessedPopulation - correctPopulation);
    const percentageError = (difference / correctPopulation) * 100;

    // Determine if the guess is correct (within 5% error)
    if (percentageError <= 5) {
      const endTime = Date.now();
      const timeTaken = endTime - gameStartTime;
      const finalScore = calculateScore(timeTaken, percentageError);
      
      setGameEndTime(endTime);
      setScore(finalScore);
      setGameOver(true);
      
      setMessage('🎉 Correct! You got it right! 🎉');
    } else {
      // Show feedback based on how close the guess was
      let feedback = '';
      if (percentageError <= 10) {
        feedback = 'Very close!';
      } else if (percentageError <= 20) {
        feedback = 'Getting warmer!';
      } else if (percentageError <= 50) {
        feedback = 'Not quite right.';
      } else {
        feedback = 'Way off!';
      }
      
      const direction = guessedPopulation > correctPopulation ? 'lower' : 'higher';
      setMessage(`${feedback} Try ${direction}! (${Math.round(percentageError)}% off)`);
    }

    setGuess('');
  };

  const handleCountrySelect = (event, newValue) => {
    if (newValue && !gameOver) {
      const selectedCountry = typeof newValue === 'string' ? newValue : newValue.label;
      setGuess(selectedCountry);
      
      const correctPopulation = targetCountry.population;
      const guessedPopulation = parseInt(selectedCountry.replace(/,/g, ''));

      if (isNaN(guessedPopulation)) {
        setMessage('Please enter a valid number!');
        return;
      }

      // Calculate the difference and percentage
      const difference = Math.abs(guessedPopulation - correctPopulation);
      const percentageError = (difference / correctPopulation) * 100;

      // Determine if the guess is correct (within 5% error)
      if (percentageError <= 5) {
        const endTime = Date.now();
        const timeTaken = endTime - gameStartTime;
        const finalScore = calculateScore(timeTaken, percentageError);
        
        setGameEndTime(endTime);
        setScore(finalScore);
        setGameOver(true);
        
        setMessage('🎉 Correct! You got it right! 🎉');
      } else {
        // Show feedback based on how close the guess was
        let feedback = '';
        if (percentageError <= 10) {
          feedback = 'Very close!';
        } else if (percentageError <= 20) {
          feedback = 'Getting warmer!';
        } else if (percentageError <= 50) {
          feedback = 'Not quite right.';
        } else {
          feedback = 'Way off!';
        }
        
        const direction = guessedPopulation > correctPopulation ? 'lower' : 'higher';
        setMessage(`${feedback} Try ${direction}! (${Math.round(percentageError)}% off)`);
      }
      
      setGuess('');
      setIsDropdownOpen(false);
    }
  };

  const resetGame = () => {
    startNewGame();
  };

  // Calculate score based on time and accuracy
  const calculateScore = (timeTaken, percentageError) => {
    const baseScore = 1000;
    const timePenalty = Math.floor(timeTaken / 1000) * 5; // 5 points per second
    const accuracyBonus = Math.max(0, 100 - percentageError * 10); // Bonus for accuracy
    return Math.max(0, baseScore - timePenalty + accuracyBonus);
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      backgroundColor: '#2b2b2b',
      touchAction: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
      <Header />
      <Toolbar />
      
      {/* Main Game Area */}
      <Box sx={{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: 1,
        backgroundColor: '#2b2b2b',
        overflow: 'hidden',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Target Country Display */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 2,
          border: '2px solid rgba(67, 206, 162, 0.5)'
        }}>
          <Typography variant="h3" sx={{ color: '#43cea2', mb: 2 }}>
            {targetCountry?.name || 'Loading...'}
          </Typography>
          <Typography variant="h6" sx={{ color: '#ccc' }}>
            What is the population?
          </Typography>
        </Box>

        {/* Game Info Panel */}
        <Paper
          sx={{
            padding: { xs: 2, md: 3 },
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            zIndex: 1000,
            maxWidth: { xs: '90%', md: '500px' },
            width: '100%',
            boxShadow: 3,
            borderRadius: { xs: 1, md: 2 },
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          <Stack spacing={isMobile ? 2 : 3}>
            {/* Header with expand/collapse button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 'bold',
                  color: gameOver ? '#4CAF50' : '#1976d2',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.2,
                  flex: 1,
                  mr: 1
                }}
              >
                {message}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                sx={{ 
                  color: 'white',
                  padding: 0.5,
                  minWidth: '32px',
                  height: '32px',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                {isMenuExpanded ? '−' : '+'}
              </IconButton>
            </Box>

            {/* Population input */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter population (e.g., 1000000)"
                disabled={gameOver}
                fullWidth
                variant="outlined"
                size="large"
                inputProps={{
                  style: {
                    fontSize: '16px',
                    transform: 'scale(1)',
                  },
                  onKeyDown: handleInputKeyDown
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    height: { xs: '48px', md: '56px' },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '& input': {
                      padding: { xs: '12px 16px', md: '16px 20px' },
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontSize: '16px !important',
                      transform: 'scale(1) !important',
                      '&:focus': {
                        fontSize: '16px !important',
                      }
                    }
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleGuess}
                disabled={gameOver || !guess.trim()}
                size="large"
                sx={{
                  minWidth: { xs: '60px', md: '80px' },
                  height: { xs: '48px', md: '56px' },
                  backgroundColor: '#1976d2',
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  padding: { xs: '8px 16px', md: '12px 24px' },
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                  '&:disabled': {
                    backgroundColor: '#666',
                    color: '#999',
                  },
                }}
              >
                Guess
              </Button>
            </Box>

            {/* Game controls */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!gameOver && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setGameOver(true);
                    setMessage(`Game Over! The population was ${targetCountry?.population?.toLocaleString()}`);
                  }}
                  fullWidth
                  size="small"
                  sx={{
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    height: { xs: '40px', md: '48px' },
                    '&:hover': {
                      borderColor: '#b71c1c',
                      backgroundColor: 'rgba(211, 47, 47, 0.04)',
                    },
                  }}
                >
                  Give Up
                </Button>
              )}
              {gameOver && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={resetGame}
                  fullWidth
                  size="small"
                  sx={{
                    backgroundColor: '#4CAF50',
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    height: { xs: '40px', md: '48px' },
                    '&:hover': {
                      backgroundColor: '#388E3C',
                    },
                  }}
                >
                  Next Country
                </Button>
              )}
            </Box>

            {/* Collapsible content */}
            {isMenuExpanded && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: { xs: 1, md: 1.5 },
                  borderRadius: 1,
                  fontSize: { xs: '0.8rem', md: '1rem' }
                }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, color: '#ccc' }}>
                    Target Country:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#43cea2',
                      fontSize: { xs: '0.8rem', md: '1rem' }
                    }}
                  >
                    {targetCountry?.name || 'Loading...'}
                  </Typography>
                </Box>

                {gameOver && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: { xs: 1, md: 1.5 },
                    borderRadius: 1,
                    fontSize: { xs: '0.8rem', md: '1rem' }
                  }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, color: '#ccc' }}>
                      Actual Population:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#4CAF50',
                        fontSize: { xs: '0.8rem', md: '1rem' }
                      }}
                    >
                      {targetCountry?.population?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: { xs: 1, md: 1.5 },
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                    💡 Tip: You need to be within 5% of the actual population to win!
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Example: If the population is 1,000,000, your guess must be between 950,000 and 1,050,000
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Population; 