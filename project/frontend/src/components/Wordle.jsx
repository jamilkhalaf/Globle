import React, { useState, useEffect } from 'react';
import { Box, Typography, Toolbar, Button, Paper, Fade, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Confetti from 'react-confetti';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import NotificationModal from './NotificationModal';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const Wordle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Loading word...');
  const [submittedGuesses, setSubmittedGuesses] = useState(new Set());
  const [currentInput, setCurrentInput] = useState('');
  const [letterStates, setLetterStates] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // Streak state
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Add state for contact dialog
  const [contactOpen, setContactOpen] = useState(false);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent automatic scrolling and maintain page position
  useEffect(() => {
    // Remove scroll prevention - allow normal scrolling
    // Only maintain viewport height adjustment for mobile keyboard
  }, [currentGuess, gameOver, isMobile]);

  // Add viewport height adjustment for mobile keyboard
  useEffect(() => {
    if (isMobile) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
      // Set initial viewport height
      setVH();
    
      // Only update on orientation change, not on resize to prevent scroll jumping
      const handleOrientationChange = () => {
        setTimeout(setVH, 100); // Small delay to ensure orientation change is complete
    };
    
      window.addEventListener('orientationchange', handleOrientationChange);
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await fetch('https://api.datamuse.com/words?sp=?????&max=1000');
        const words = await response.json();
        const fiveLetterWords = words
          .map(word => word.word.toUpperCase())
          .filter(word => word.length === 5);
        
        const randomWord = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
        setTargetWord(randomWord);
        setMessage('Guess the word!');
      } catch (error) {
        console.error('Error fetching word:', error);
        // Fallback to a default word if API fails
        setTargetWord('LOCAL');
        setMessage('Guess the word!');
      }
    };

    fetchRandomWord();
    loadStreakData();
  }, []);

  // Load streak data from localStorage
  const loadStreakData = () => {
    const savedCurrentStreak = localStorage.getItem('wordleCurrentStreak');
    const savedBestStreak = localStorage.getItem('wordleBestStreak');
    
    if (savedCurrentStreak) {
      setCurrentStreak(parseInt(savedCurrentStreak));
    }
    if (savedBestStreak) {
      setBestStreak(parseInt(savedBestStreak));
    }
  };

  // Save streak data to localStorage
  const saveStreakData = (current, best) => {
    localStorage.setItem('wordleCurrentStreak', current.toString());
    localStorage.setItem('wordleBestStreak', best.toString());
  };

  // Update streak when game ends
  const updateStreak = (won) => {
    if (won) {
      const newCurrentStreak = currentStreak + 1;
      const newBestStreak = Math.max(bestStreak, newCurrentStreak);
      
      setCurrentStreak(newCurrentStreak);
      setBestStreak(newBestStreak);
      saveStreakData(newCurrentStreak, newBestStreak);
    } else {
      // Reset current streak on loss
      setCurrentStreak(0);
      saveStreakData(0, bestStreak);
    }
  };

  const startNewGame = () => {
    setGuesses(Array(MAX_GUESSES).fill(''));
    setCurrentGuess(0);
    setGameOver(false);
    setMessage('Guess the word!');
    setSubmittedGuesses(new Set());
    setCurrentInput('');
    setLetterStates({});
    setShowConfetti(false);
    
    // Fetch new random word
    const fetchRandomWord = async () => {
      try {
        const response = await fetch('https://api.datamuse.com/words?sp=?????&max=1000');
        const words = await response.json();
        const fiveLetterWords = words
          .map(word => word.word.toUpperCase())
          .filter(word => word.length === 5);
        
        const randomWord = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
        setTargetWord(randomWord);
      } catch (error) {
        console.error('Error fetching word:', error);
        setTargetWord('LOCAL');
      }
    };

    fetchRandomWord();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver || isMobile) return; // Disable keyboard handler on mobile
      
      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        handleSubmit();
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        if (currentInput.length < WORD_LENGTH) {
          setCurrentInput(prev => prev + key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, currentInput, isMobile]);

  const handleSubmit = () => {
    if (gameOver) return;
    if (currentGuess >= MAX_GUESSES) return;
    
    if (currentInput.length !== WORD_LENGTH) {
      setMessage('Word must be 5 letters!');
      return;
    }
    
    // Check if the word is valid by fetching from dictionary API
    const checkWordValidity = async () => {
      try {
        const response = await fetch(`https://api.datamuse.com/words?sp=${currentInput.toLowerCase()}&max=1`);
        const words = await response.json();
        
        // Check if the word exists in the dictionary
        const isValidWord = words.length > 0 && words[0].word.toLowerCase() === currentInput.toLowerCase();
        
        if (!isValidWord) {
          setMessage('Not a valid word!');
          return;
        }
        
        // Word is valid, proceed with the guess
        submitValidGuess();
      } catch (error) {
        console.error('Error checking word validity:', error);
        // If API fails, allow the guess to proceed (fallback)
        submitValidGuess();
      }
    };

    const submitValidGuess = () => {
      setGuesses(prev => {
        const newGuesses = [...prev];
        newGuesses[currentGuess] = currentInput;
        return newGuesses;
      });
      
      const newLetterStates = { ...letterStates };
      const targetLetters = targetWord.split('');
      const guessLetters = currentInput.split('');
      
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          newLetterStates[`${currentGuess}-${i}`] = 'correct';
          targetLetters[i] = null;
        }
      }
      
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (newLetterStates[`${currentGuess}-${i}`] === 'correct') continue;
        
        const letterIndex = targetLetters.indexOf(guessLetters[i]);
        if (letterIndex !== -1) {
          newLetterStates[`${currentGuess}-${i}`] = 'present';
          targetLetters[letterIndex] = null;
        } else {
          newLetterStates[`${currentGuess}-${i}`] = 'absent';
        }
      }
      
      setLetterStates(newLetterStates);
      setSubmittedGuesses(prev => new Set([...prev, currentGuess]));
      
      if (currentInput === targetWord) {
        setGameOver(true);
        setShowConfetti(true);
        setMessage('🎉 Amazing! You got it! 🎉');
        updateStreak(true);
        return;
      }

      if (currentGuess === MAX_GUESSES - 1) {
        setGameOver(true);
        setMessage(`Game Over! The word was ${targetWord}`);
        updateStreak(false);
      }

      setCurrentGuess(prev => prev + 1);
      setCurrentInput('');
      setMessage('Guess the word!');
      
      // Refocus input on mobile without scroll manipulation
      if (isMobile) {
      setTimeout(() => {
          const input = document.getElementById('mobile-wordle-input');
          if (input) {
            input.focus();
          }
        }, 100);
        }
    };

    // Check word validity before submitting
    checkWordValidity();
  };

  const getBoxStyle = (letter, index, guessIndex) => {
    const isCurrentRow = guessIndex === currentGuess;
    const hasLetter = isCurrentRow ? currentInput[index] : letter;
    const isSubmitted = submittedGuesses.has(guessIndex);
    const letterState = letterStates[`${guessIndex}-${index}`];
    
    let backgroundColor = '#121213';
    if (isSubmitted) {
      switch (letterState) {
        case 'correct':
          backgroundColor = '#6aaa64';
          break;
        case 'present':
          backgroundColor = '#c9b458';
          break;
        case 'absent':
          backgroundColor = '#787c7e';
          break;
        default:
          backgroundColor = '#121213';
      }
    }
    
    return {
      width: { xs: '50px', sm: '56px', md: '62px' },
      height: { xs: '50px', sm: '56px', md: '62px' },
      border: '2px solid #3a3a3c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      color: hasLetter ? 'white' : '#121213',
      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
      fontWeight: 'bold',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      }
    };
  };

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Wordle"
          description={"Guess the 5-letter word in 6 tries. Each guess must be a valid word. After each guess, the color of the tiles will show how close your guess was to the word. Good luck!"}
          color="secondary"
        />
      </>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', // Use standard viewport height instead of CSS variable
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#121213',
      position: 'relative',
      overflow: 'auto' // Allow scrolling
    }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <Header />
      <Toolbar />
      
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', md: 'center' },
        pt: { xs: 2, md: 0 },
        pb: { xs: isMobile ? 32 : 2, md: 4 }, // Increase bottom padding for mobile to account for fixed input
        px: { xs: 2, md: 4 },
        overflow: 'visible', // Allow content to scroll
        position: 'relative',
        zIndex: 1,
        minHeight: { xs: 'auto', md: 'auto' } // Allow natural height
      }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: { xs: 2, md: 4 }, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: { xs: '280px', md: '300px' },
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: gameOver ? { xs: 1, md: 2 } : 0,
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}
          >
            {message}
          </Typography>
          {gameOver && !showConfetti && (
            <Typography 
              variant={isMobile ? "body1" : "h6"}
              sx={{ 
                color: '#6aaa64',
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              {targetWord}
            </Typography>
          )}
        </Paper>

        {/* Streak Display */}
        <Paper 
          elevation={2}
          sx={{ 
            p: { xs: 1.5, md: 2 }, 
            mb: { xs: 2, md: 3 }, 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: { xs: '280px', md: '300px' },
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: { xs: 2, md: 3 }
          }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography 
                variant={isMobile ? "body2" : "body1"}
                sx={{ 
                  color: '#ccc',
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  mb: 0.5
                }}
              >
                Current Streak
              </Typography>
              <Typography 
                variant={isMobile ? "h6" : "h5"}
                sx={{ 
                  color: '#6aaa64',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                {currentStreak}
              </Typography>
            </Box>
            <Box sx={{ 
              width: '1px', 
              height: '40px', 
              bgcolor: 'rgba(255, 255, 255, 0.2)' 
            }} />
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography 
                variant={isMobile ? "body2" : "body1"}
                sx={{ 
                  color: '#ccc',
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  mb: 0.5
                }}
              >
                Best Streak
              </Typography>
              <Typography 
                variant={isMobile ? "h6" : "h5"}
                sx={{ 
                  color: '#c9b458',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                {bestStreak}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 0.5, md: 1 }, 
          mb: { xs: 2, md: 4 },
          width: '100%',
          maxWidth: { xs: '280px', md: '400px' }
        }}>
          {guesses.map((guess, guessIndex) => (
            <Box key={guessIndex} sx={{ display: 'flex', gap: { xs: 0.25, md: 0.5 }, justifyContent: 'center' }}>
              {Array(WORD_LENGTH).fill('').map((_, letterIndex) => (
                <Box
                  key={letterIndex}
                  sx={getBoxStyle(guess[letterIndex], letterIndex, guessIndex)}
                >
                  {guessIndex === currentGuess ? currentInput[letterIndex] || '' : guess[letterIndex]}
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1, md: 2 }, 
          alignItems: 'center',
          width: '100%',
          maxWidth: { xs: '280px', md: '400px' }
        }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"}
            sx={{ 
              color: 'white',
              minWidth: { xs: 'auto', md: '250px' },
              textAlign: 'center',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              mb: { xs: 1, md: 0 }
            }}
          >
            {currentInput}
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={currentInput.length !== WORD_LENGTH || gameOver}
            size={isMobile ? "medium" : "large"}
            sx={{
              bgcolor: '#538d4e',
              '&:hover': {
                bgcolor: '#4a7d45'
              },
              width: { xs: '100%', md: 'auto' },
              display: { xs: 'none', md: 'inline-flex' } // Hide on mobile, show on desktop
            }}
          >
            Submit
          </Button>
        </Box>

        {gameOver && (
          <Fade in={gameOver}>
            <Button
              variant="contained"
              onClick={startNewGame}
              size={isMobile ? "medium" : "large"}
              sx={{
                mt: { xs: 2, md: 4 },
                bgcolor: '#538d4e',
                '&:hover': {
                  bgcolor: '#4a7d45'
                },
                width: { xs: '200px', md: 'auto' }
              }}
            >
              New Game
            </Button>
          </Fade>
        )}
      </Box>

      {/* Mobile Input Box - Fixed at bottom */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 1,
              width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          backgroundColor: '#121213',
          paddingTop: 2,
          paddingBottom: 2,
          paddingX: 2,
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                Type your guess:
              </Typography>
              <Box sx={{
                position: 'relative',
                width: '100%',
            maxWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
              }}>
                <input
                  id="mobile-wordle-input"
                  type="text"
                  value={currentInput}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, WORD_LENGTH);
                    setCurrentInput(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default form submission
                      handleSubmit();
                    }
                  }}
                  onFocus={(e) => {
                // Don't force scroll on focus - let user control scrolling
                  }}
                  style={{
                flex: 1,
                    padding: '12px',
                    fontSize: '16px', // Prevents zoom on iOS
                    border: '2px solid #3a3a3c',
                    borderRadius: '8px',
                    backgroundColor: '#121213',
                    color: 'white',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    outline: 'none',
                    transform: 'scale(1)', // Prevents zoom
                    WebkitTransform: 'scale(1)', // Safari support
                    WebkitAppearance: 'none', // Removes default styling
                    appearance: 'none',
                    boxSizing: 'border-box',
                    '&:focus': {
                      borderColor: '#1976d2',
                      fontSize: '16px', // Maintains size on focus
                      transform: 'scale(1)',
                      WebkitTransform: 'scale(1)'
                    }
                  }}
                  placeholder="Type 5 letters..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  maxLength={WORD_LENGTH}
                  autoFocus
                  inputMode="text"
                  spellCheck="false"
                />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={currentInput.length !== WORD_LENGTH || gameOver}
              size="small"
              sx={{
                bgcolor: '#538d4e',
                minWidth: '48px',
                height: '48px',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#4a7d45'
                },
                '&:disabled': {
                  bgcolor: '#666',
                  color: '#999'
                }
              }}
            >
              ✓
            </Button>
          </Box>
        </Box>
        )}
    </Box>
  );
};

export default Wordle; 