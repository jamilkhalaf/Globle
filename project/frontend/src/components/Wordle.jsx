import React, { useState, useEffect } from 'react';
import { Box, Typography, Toolbar, Button, Paper, Fade, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Confetti from 'react-confetti';

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
    // Prevent any automatic scrolling when component mounts or state changes
    const preventScroll = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };
    
    // Prevent scroll on state changes
    preventScroll();
    
    // Add event listener to prevent scroll on mobile keyboard
    const handleScroll = () => {
      if (isMobile && window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentGuess, gameOver, isMobile]);

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
  }, []);

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

    // Prevent any automatic scrolling
    const currentScrollPosition = window.scrollY;
    
    // Check if the word is valid by fetching from dictionary API
    const checkWordValidity = async () => {
      try {
        const response = await fetch(`https://api.datamuse.com/words?sp=${currentInput.toLowerCase()}&max=1`);
        const words = await response.json();
        
        // Check if the word exists in the dictionary
        const isValidWord = words.length > 0 && words[0].word.toLowerCase() === currentInput.toLowerCase();
        
        if (!isValidWord) {
          setMessage('Not a valid word!');
          // Maintain scroll position
          window.scrollTo(0, currentScrollPosition);
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
        // Maintain scroll position
        window.scrollTo(0, currentScrollPosition);
        return;
      }

      if (currentGuess === MAX_GUESSES - 1) {
        setGameOver(true);
        setMessage(`Game Over! The word was ${targetWord}`);
        // Maintain scroll position
        window.scrollTo(0, currentScrollPosition);
      }

      setCurrentGuess(prev => prev + 1);
      setCurrentInput('');
      setMessage('Guess the word!');
      
      // Maintain scroll position and refocus input on mobile
      setTimeout(() => {
        window.scrollTo(0, currentScrollPosition);
        if (isMobile) {
          const input = document.getElementById('mobile-wordle-input');
          if (input) {
            input.focus();
          }
        }
      }, 100);
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

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      bgcolor: '#121213',
      overflow: 'hidden', // Prevent scrolling issues
      touchAction: 'manipulation', // Optimize touch handling
      WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
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
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 },
        height: 'calc(100vh - 64px)', // Account for header
        overflow: 'auto', // Allow scrolling if needed
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'auto', // Prevent smooth scrolling
        position: 'relative'
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
          
          {/* Mobile Input Box */}
          {isMobile && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 1,
              width: '100%',
              mb: 2,
              position: 'relative',
              zIndex: 10 // Ensure input stays above other elements
            }}>
              <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                Type your guess:
              </Typography>
              <Box sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '280px'
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
                    // Prevent scrolling when input is focused
                    e.target.scrollIntoView({ behavior: 'auto', block: 'nearest' });
                  }}
                  style={{
                    width: '100%',
                    maxWidth: '280px',
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
              </Box>
            </Box>
          )}
          
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
              width: { xs: '100%', md: 'auto' }
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
    </Box>
  );
};

export default Wordle; 