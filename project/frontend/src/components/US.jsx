import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import Header from './Header';
import stateList from './stateList.json';

const US = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess the US state!');
  const [stateOptions, setStateOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [targetState, setTargetState] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  
  // Game state
  const [gameEndTime, setGameEndTime] = useState(null);

  // Load state options and start new game
  useEffect(() => {
    // Set up state options for autocomplete from stateList
    const options = stateList
      .sort((a, b) => a.localeCompare(b));
    setStateOptions(options);
    
    // Start with a random state
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomStateName = stateList[Math.floor(Math.random() * stateList.length)];
    setTargetState(randomStateName);
    setGuess('');
    setMessage('Guess the US state!');
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

    const guessedState = guess.trim().toLowerCase();
    const correctState = targetState.toLowerCase();

    // Check if the guess is correct (exact match or common variations)
    const isCorrect = correctState === guessedState || 
                     correctState === guessedState.replace(/ /g, '') ||
                     correctState.replace(/ /g, '') === guessedState;

    if (isCorrect) {
      const endTime = Date.now();
      const timeTaken = endTime - gameStartTime;
      const finalScore = calculateScore(timeTaken);
      
      setGameEndTime(endTime);
      setScore(finalScore);
      setGameOver(true);
      
      setMessage('🎉 Correct! You got it right! 🎉');
    } else {
      // Show feedback
      setMessage('❌ Incorrect! Try again!');
    }

    setGuess('');
  };

  const handleStateSelect = (event, newValue) => {
    if (newValue && !gameOver) {
      const selectedState = typeof newValue === 'string' ? newValue : newValue.label;
      setGuess(selectedState);
      
      const guessedState = selectedState.trim().toLowerCase();
      const correctState = targetState.toLowerCase();

      // Check if the guess is correct (exact match or common variations)
      const isCorrect = correctState === guessedState || 
                       correctState === guessedState.replace(/ /g, '') ||
                       correctState.replace(/ /g, '') === guessedState;

      if (isCorrect) {
        const endTime = Date.now();
        const timeTaken = endTime - gameStartTime;
        const finalScore = calculateScore(timeTaken);
        
        setGameEndTime(endTime);
        setScore(finalScore);
        setGameOver(true);
        
        setMessage('🎉 Correct! You got it right! 🎉');
      } else {
        // Show feedback
        setMessage('❌ Incorrect! Try again!');
      }
      
      setGuess('');
      setIsDropdownOpen(false);
    }
  };

  const resetGame = () => {
    startNewGame();
  };

  // Calculate score based on time
  const calculateScore = (timeTaken) => {
    const baseScore = 1000;
    const timePenalty = Math.floor(timeTaken / 1000) * 10; // 10 points per second
    return Math.max(0, baseScore - timePenalty);
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
        {/* Target State Display */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 2,
          border: '2px solid rgba(67, 206, 162, 0.5)'
        }}>
          <Typography variant="h3" sx={{ color: '#43cea2', mb: 2 }}>
            🇺🇸
          </Typography>
          <Typography variant="h6" sx={{ color: '#ccc' }}>
            What US state is this?
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

            {/* State input */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Autocomplete
                value={guess}
                onChange={handleStateSelect}
                onInputChange={(event, newInputValue) => {
                  setGuess(newInputValue);
                  setIsDropdownOpen(newInputValue.length > 0);
                }}
                options={stateOptions}
                getOptionLabel={(option) => 
                  typeof option === 'string' ? option : option.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter US state name"
                    disabled={gameOver}
                    fullWidth
                    variant="outlined"
                    size="large"
                    inputProps={{
                      ...params.inputProps,
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
                )}
                disabled={gameOver}
                fullWidth
                sx={{ flexGrow: 1 }}
                open={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onKeyDown={handleInputKeyDown}
                ListboxProps={{
                  style: {
                    maxHeight: isMobile ? '150px' : '200px',
                    fontSize: { xs: '0.8rem', md: '1rem' }
                  }
                }}
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter(option => 
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  return filtered.slice(0, 15);
                }}
                isOptionEqualToValue={(option, value) => 
                  option.toLowerCase() === value.toLowerCase()
                }
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
                    setMessage(`Game Over! The state was ${targetState}`);
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
                  Next State
                </Button>
              )}
            </Box>

            {/* Collapsible content */}
            {isMenuExpanded && (
              <>
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
                      Correct Answer:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#4CAF50',
                        fontSize: { xs: '0.8rem', md: '1rem' }
                      }}
                    >
                      {targetState || 'N/A'}
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
                    💡 Tip: Enter the US state name that matches this shape!
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    You can type the state name or select from the dropdown
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

export default US; 