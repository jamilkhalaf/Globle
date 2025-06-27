import React, { useState, useEffect } from 'react';
import { Box, Typography, Toolbar, Button, Paper, Fade } from '@mui/material';
import Header from './Header';
import Confetti from 'react-confetti';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const Wordle = () => {
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
      if (gameOver) return;
      
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
  }, [gameOver, currentInput]);

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
        return;
      }

      if (currentGuess === MAX_GUESSES - 1) {
        setGameOver(true);
        setMessage(`Game Over! The word was ${targetWord}`);
      }

      setCurrentGuess(prev => prev + 1);
      setCurrentInput('');
      setMessage('Guess the word!');
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
      width: '62px',
      height: '62px',
      border: '2px solid #3a3a3c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      color: hasLetter ? 'white' : '#121213',
      fontSize: '2rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      }
    };
  };

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', bgcolor: '#121213' }}>
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
        pt: 4
      }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: '300px'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: gameOver ? 2 : 0
            }}
          >
            {message}
          </Typography>
          {gameOver && !showConfetti && (
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#6aaa64',
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase'
              }}
            >
              {targetWord}
            </Typography>
          )}
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
          {guesses.map((guess, guessIndex) => (
            <Box key={guessIndex} sx={{ display: 'flex', gap: 0.5 }}>
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

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              minWidth: '250px',
              textAlign: 'center'
            }}
          >
            {currentInput}
          </Typography>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={currentInput.length !== WORD_LENGTH || gameOver}
            sx={{
              bgcolor: '#538d4e',
              '&:hover': {
                bgcolor: '#4a7d45'
              }
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
              sx={{
                mt: 4,
                bgcolor: '#538d4e',
                '&:hover': {
                  bgcolor: '#4a7d45'
                }
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