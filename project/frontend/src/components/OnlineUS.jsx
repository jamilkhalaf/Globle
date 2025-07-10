import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import Header from './Header';
import stateList from './stateList.json';

const OnlineUS = ({ 
  targetState = null, 
  onAnswerSubmit = null, 
  disabled = false, 
  opponentRoundsWon = 0,
  currentRoundNumber = 1,
  playerRoundsWon = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess the US state!');
  const [stateOptions, setStateOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  
  // Game state
  const [gameStartTime, setGameStartTime] = useState(null);

  // Add notification state for opponent's correct guess
  const [opponentCorrect, setOpponentCorrect] = useState(false);
  const [opponentCorrectMessage, setOpponentCorrectMessage] = useState('');

  // Listen for opponent correct notifications
  useEffect(() => {
    const handlePlayerCorrect = (event) => {
      const data = event.detail;
      const currentUsername = localStorage.getItem('username') || 'You';
      
      if (data.correctPlayer !== currentUsername) {
        setOpponentCorrect(true);
        setOpponentCorrectMessage(`${data.correctPlayer} found the answer in ${data.timeTaken}s!`);
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setOpponentCorrect(false);
          setOpponentCorrectMessage('');
        }, 3000);
      }
    };

    window.addEventListener('playerCorrect', handlePlayerCorrect);
    return () => window.removeEventListener('playerCorrect', handlePlayerCorrect);
  }, []);

  // Dispatch custom event when we get correct answer
  const dispatchPlayerCorrect = (timeTaken) => {
    const currentUsername = localStorage.getItem('username') || 'You';
    const event = new CustomEvent('playerCorrect', {
      detail: {
        correctPlayer: currentUsername,
        correctAnswer: targetState,
        timeTaken: timeTaken
      }
    });
    window.dispatchEvent(event);
  };

  // Debug logging for props
  useEffect(() => {
    console.log('OnlineUS component props:', { targetState, disabled, currentRoundNumber, playerRoundsWon, opponentRoundsWon });
  }, [targetState, disabled, currentRoundNumber, playerRoundsWon, opponentRoundsWon]);

  // Initialize online mode
  useEffect(() => {
    if (targetState) {
      console.log('Initializing online mode with target:', targetState);
      setMessage('Guess the US state!');
      setGameStartTime(Date.now());
    }
  }, [targetState]);

  // Load state options
  useEffect(() => {
    // Set up state options for autocomplete from stateList
    const options = stateList
      .sort((a, b) => a.localeCompare(b));
    setStateOptions(options);
  }, []);

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
    if (!guess || disabled) {
      return;
    }

    const guessedState = guess.trim().toLowerCase();
    const correctState = targetState.toLowerCase();

    // Check if the guess is correct (exact match or common variations)
    const isCorrect = correctState === guessedState || 
                     correctState === guessedState.replace(/ /g, '') ||
                     correctState.replace(/ /g, '') === guessedState;

    if (isCorrect) {
      const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
      
      // Online mode: just call onAnswerSubmit and let parent handle round logic
      console.log('OnlineUS: Correct answer, calling onAnswerSubmit with:', guessedState);
      
      if (onAnswerSubmit) {
        onAnswerSubmit(guessedState);
      }
      
      // Dispatch event for opponent notification
      dispatchPlayerCorrect(timeTaken);
      
      // Disable the game while waiting for round result
      setMessage(`🎉 Correct! You found it in ${timeTaken}s! Waiting for round result... 🎉`);
    } else {
      // Show feedback
      setMessage('❌ Incorrect! Try again!');
    }

    setGuess('');
  };

  const handleStateSelect = (event, newValue) => {
    if (newValue && !disabled) {
      const selectedState = typeof newValue === 'string' ? newValue : newValue.label;
      setGuess(selectedState);
      
      const guessedState = selectedState.trim().toLowerCase();
      const correctState = targetState.toLowerCase();

      // Check if the guess is correct (exact match or common variations)
      const isCorrect = correctState === guessedState || 
                       correctState === guessedState.replace(/ /g, '') ||
                       correctState.replace(/ /g, '') === guessedState;

      if (isCorrect) {
        const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
        
        // Online mode: just call onAnswerSubmit and let parent handle round logic
        console.log('OnlineUS: Correct answer via dropdown, calling onAnswerSubmit with:', guessedState);
        
        if (onAnswerSubmit) {
          onAnswerSubmit(guessedState);
        }
        
        // Dispatch event for opponent notification
        dispatchPlayerCorrect(timeTaken);
        
        // Disable the game while waiting for round result
        setMessage(`🎉 Correct! You found it in ${timeTaken}s! Waiting for round result... 🎉`);
      } else {
        // Show feedback
        setMessage('❌ Incorrect! Try again!');
      }
      
      setGuess('');
      setIsDropdownOpen(false);
    }
  };

  // Handle online game state changes from parent
  useEffect(() => {
    if (!disabled) {
      console.log('OnlineUS: New round starting, resetting game state');
      setGuess('');
      setGameStartTime(Date.now());
      setMessage('Guess the US state!');
    }
  }, [disabled, targetState]); // Reset when target state changes (new round)

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
      WebkitOverflowScrolling: 'touch',
      // Add CSS animation for notifications
      '& @keyframes fadeInOut': {
        '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' },
        '20%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
        '80%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
        '100%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' }
      }
    }}>
      <Header />
      <Toolbar />
      
      {/* Online Mode Banner */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 90, md: 100 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          backgroundColor: 'rgba(67, 206, 162, 0.95)',
          color: 'white',
          padding: { xs: '6px 12px', md: '12px 24px' },
          borderRadius: 2,
          boxShadow: 3,
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.2)',
          maxWidth: { xs: '90%', md: 'auto' },
          width: { xs: 'auto', md: 'auto' }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: { xs: '0.8rem', md: '1.1rem' }
          }}
        >
          🎮 ONLINE MODE - Round {currentRoundNumber}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '0.6rem', md: '0.9rem' },
            opacity: 0.9
          }}
        >
          You: {playerRoundsWon} | Opponent: {opponentRoundsWon} | First to 5 wins!
        </Typography>
      </Box>

      {/* Opponent Correct Notification */}
      {opponentCorrect && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 150, md: 160 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2001,
            backgroundColor: 'rgba(255, 193, 7, 0.95)',
            color: 'black',
            padding: { xs: '8px 16px', md: '12px 24px' },
            borderRadius: 2,
            boxShadow: 3,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)',
            maxWidth: { xs: '90%', md: 'auto' },
            width: { xs: 'auto', md: 'auto' },
            animation: 'fadeInOut 3s ease-in-out'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '0.8rem', md: '1rem' }
            }}
          >
            ⚡ {opponentCorrectMessage}
          </Typography>
        </Box>
      )}
      
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
                  color: '#1976d2',
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
                    disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled || !guess.trim()}
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
                    Target State:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#43cea2',
                      fontSize: { xs: '0.8rem', md: '1rem' }
                    }}
                  >
                    {targetState}
                  </Typography>
                </Box>

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

export default OnlineUS; 