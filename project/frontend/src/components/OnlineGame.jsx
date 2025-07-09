import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress, TextField } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Import all game components
import Game from './Game'; // Globle
import Population from './population.jsx';
import Wordle from './Wordle.jsx'; // Findle
import Flagle from './Flagle.jsx';
import Worldle from './Worldle.jsx';
import Capitals from './capitals.jsx';
import Hangman from './hangman.jsx';
import Shaple from './shaple.jsx';
import US from './US.jsx';

const OnlineGame = ({ 
  matchData, 
  gameState, 
  gameTimer, 
  onAnswerSubmit, 
  onLeaveGame, 
  onNewOpponent,
  matchResult 
}) => {
  const [gameAnswer, setGameAnswer] = useState('');
  const [gameComponent, setGameComponent] = useState(null);
  const [gameProps, setGameProps] = useState({});

  useEffect(() => {
    if (matchData?.gameType) {
      // Set up game-specific props and component
      const getGameConfig = (gameType) => {
        const baseProps = {
          // Don't pass unsupported props to game components
          // We'll handle online functionality in the wrapper
        };

        switch (gameType) {
          case 'Globle':
            return {
              component: Game,
              props: baseProps
            };
          case 'Population':
            return {
              component: Population,
              props: baseProps
            };
          case 'Findle':
            return {
              component: Wordle,
              props: baseProps
            };
          case 'Flagle':
            return {
              component: Flagle,
              props: baseProps
            };
          case 'Worldle':
            return {
              component: Worldle,
              props: baseProps
            };
          case 'Capitals':
            return {
              component: Capitals,
              props: baseProps
            };
          case 'Hangman':
            return {
              component: Hangman,
              props: baseProps
            };
          case 'Shaple':
            return {
              component: Shaple,
              props: baseProps
            };
          case 'US':
            return {
              component: US,
              props: baseProps
            };
          default:
            return {
              component: Game,
              props: baseProps
            };
        }
      };

      const gameConfig = getGameConfig(matchData.gameType);
      setGameComponent(gameConfig.component);
      setGameProps(gameConfig.props);
    }
  }, [matchData, gameState, onAnswerSubmit]);

  const renderCountdown = () => (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
        Match Found!
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {matchData?.players?.map(p => p.username).join(' vs ')}
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Game: {matchData?.gameType}
      </Typography>
      <CircularProgress size={60} sx={{ color: '#43cea2' }} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Starting in 3 seconds...
      </Typography>
    </Box>
  );

  const renderGame = () => (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Game Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        bgcolor: '#1e1e1e',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Typography variant="h4" sx={{ color: '#43cea2' }}>
          {matchData?.gameType}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TimerIcon sx={{ color: gameTimer <= 10 ? '#f44336' : '#43cea2' }} />
          <Typography variant="h4" sx={{ color: gameTimer <= 10 ? '#f44336' : '#43cea2' }}>
            {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
      </Box>

      {/* Game Component */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {gameComponent && React.createElement(gameComponent, gameProps)}
        
        {/* Online Answer Submission Overlay */}
        {gameState === 'playing' && (
          <Box sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(30, 30, 30, 0.9)',
            p: 2,
            borderRadius: 2,
            border: '1px solid rgba(67, 206, 162, 0.3)',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            minWidth: 300
          }}>
            <Typography variant="body2" sx={{ color: 'white', minWidth: 80 }}>
              Your Answer:
            </Typography>
            <TextField
              size="small"
              value={gameAnswer}
              onChange={(e) => setGameAnswer(e.target.value)}
              placeholder="Enter your answer..."
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#43cea2',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (gameAnswer.trim()) {
                  onAnswerSubmit(gameAnswer.trim());
                  setGameAnswer('');
                }
              }}
              disabled={!gameAnswer.trim()}
              sx={{ 
                bgcolor: '#43cea2',
                '&:hover': { bgcolor: '#3bb08f' },
                '&:disabled': { bgcolor: 'rgba(67, 206, 162, 0.3)' }
              }}
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  const renderGameEnd = () => (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
        Game Over!
      </Typography>
      
      <Typography variant="h5" sx={{ mb: 2 }}>
        Winner: {matchResult?.winner}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Correct Answer: {matchResult?.correctAnswer?.answer}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#43cea2' }}>
          Points: {matchResult?.points ? Object.values(matchResult.points)[0] : 0}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={onLeaveGame}
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Leave Game
        </Button>
        <Button
          variant="contained"
          onClick={onNewOpponent}
          sx={{ bgcolor: '#43cea2' }}
        >
          Find New Opponent
        </Button>
      </Box>
    </Box>
  );

  if (gameState === 'countdown') {
    return renderCountdown();
  }

  if (gameState === 'playing') {
    return renderGame();
  }

  if (gameState === 'ended' && matchResult) {
    return renderGameEnd();
  }

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <CircularProgress sx={{ color: '#43cea2' }} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Loading game...
      </Typography>
    </Box>
  );
};

export default OnlineGame; 