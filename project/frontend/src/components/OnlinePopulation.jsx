import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import Header from './Header';
import officialCountries from './officialCountries';

const OnlinePopulation = ({ 
  targetCountry = null, 
  onAnswerSubmit = null, 
  disabled = false, 
  opponentRoundsWon = 0,
  currentRoundNumber = 1,
  playerRoundsWon = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess the population!');
  const [countryOptions, setCountryOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  
  // Game state
  const [gameStartTime, setGameStartTime] = useState(null);

  // Debug logging for props
  useEffect(() => {
    console.log('OnlinePopulation component props:', { targetCountry, disabled, currentRoundNumber, playerRoundsWon, opponentRoundsWon });
  }, [targetCountry, disabled, currentRoundNumber, playerRoundsWon, opponentRoundsWon]);

  // Initialize online mode
  useEffect(() => {
    if (targetCountry) {
      console.log('Initializing online mode with target:', targetCountry);
      setMessage('Guess the population!');
      setGameStartTime(Date.now());
    }
  }, [targetCountry]);

  // Load country options
  useEffect(() => {
    // Set up country options for autocomplete
    const options = officialCountries
      .map(country => country.name)
      .sort((a, b) => a.localeCompare(b));
    setCountryOptions(options);
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
      console.log('OnlinePopulation: handleGuess blocked - guess:', guess, 'disabled:', disabled);
      return;
    }

    // Find the target country data
    const targetCountryData = officialCountries.find(c => c.name === targetCountry);
    if (!targetCountryData) {
      setMessage('Error: Target country not found');
      return;
    }

    const correctPopulation = targetCountryData.population;
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
      // Online mode: just call onAnswerSubmit and let parent handle round logic
      console.log('OnlinePopulation: Correct answer, calling onAnswerSubmit with:', guessedPopulation);
      
      if (onAnswerSubmit) {
        onAnswerSubmit(guessedPopulation.toString());
      }
      
      // Disable the game while waiting for round result
      setMessage('🎉 Correct! Waiting for round result... 🎉');
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
    if (newValue && !disabled) {
      const selectedCountry = typeof newValue === 'string' ? newValue : newValue.label;
      setGuess(selectedCountry);
      
      // Find the target country data
      const targetCountryData = officialCountries.find(c => c.name === targetCountry);
      if (!targetCountryData) {
        setMessage('Error: Target country not found');
        return;
      }

      const correctPopulation = targetCountryData.population;
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
        // Online mode: just call onAnswerSubmit and let parent handle round logic
        console.log('OnlinePopulation: Correct answer via dropdown, calling onAnswerSubmit with:', guessedPopulation);
        
        if (onAnswerSubmit) {
          onAnswerSubmit(guessedPopulation.toString());
        }
        
        // Disable the game while waiting for round result
        setMessage('🎉 Correct! Waiting for round result... 🎉');
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

  // Handle online game state changes from parent
  useEffect(() => {
    if (!disabled) {
      console.log('OnlinePopulation: New round starting, resetting game state');
      setGuess('');
      setGameStartTime(Date.now());
      setMessage('Guess the population!');
    }
  }, [disabled, targetCountry]); // Reset when target country changes (new round)

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
            {targetCountry}
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

            {/* Population input */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter population (e.g., 1000000)"
                disabled={disabled}
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
                    {targetCountry}
                  </Typography>
                </Box>

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

export default OnlinePopulation; 