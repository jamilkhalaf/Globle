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

// Import official lists
import officialCountries from './officialCountries';
import stateList from './stateList.json';

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
  const [isGameReady, setIsGameReady] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [canRenderGame, setCanRenderGame] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('OnlineGame - matchData changed:', matchData);
    console.log('OnlineGame - gameState:', gameState);
  }, [matchData, gameState]);

  // Function to get a random target from the appropriate list
  const getRandomTarget = (gameType) => {
    switch (gameType) {
      case 'Globle':
      case 'Population':
      case 'Flagle':
      case 'Worldle':
      case 'Capitals':
      case 'Hangman':
      case 'Shaple':
        // For Shaple, we need to determine if it's world or US mode
        // For now, default to world mode (countries)
        return officialCountries[Math.floor(Math.random() * officialCountries.length)];
      case 'US':
        return stateList[Math.floor(Math.random() * stateList.length)];
      case 'Findle':
        // For Findle (Wordle), we need a word list
        // For now, use a simple word list or countries
        return officialCountries[Math.floor(Math.random() * officialCountries.length)];
      default:
        return officialCountries[Math.floor(Math.random() * officialCountries.length)];
    }
  };

  // Function to get the appropriate target based on game type and shared target
  const getTargetForGame = (gameType, sharedTarget) => {
    if (sharedTarget && sharedTarget.target) {
      return sharedTarget.target;
    }
    
    // If no shared target provided, generate a random one
    return getRandomTarget(gameType);
  };

  useEffect(() => {
    if (matchData?.gameType && gameState === 'playing' && !isSettingUp) {
      // Reset ready state when starting new game
      setIsGameReady(false);
      setIsSettingUp(true);
      
      console.log('Starting game setup for:', matchData.gameType);
      
      // Add a delay to ensure everything is properly set up
      const setupGame = () => {
        // Set up game-specific props and component
        const getGameConfig = (gameType) => {
          const target = getTargetForGame(gameType, matchData?.sharedTarget);
          
          console.log(`Setting up game config for ${gameType} with target:`, target);
          console.log(`Match data shared target:`, matchData?.sharedTarget);
          
          // Ensure we have a valid target
          if (!target) {
            console.error('No valid target found for game:', gameType);
            setIsSettingUp(false);
            return null;
          }
          
          const baseProps = {
            isOnline: true,
            disabled: false, // Game is active when playing
            onAnswerSubmit: (answer) => {
              onAnswerSubmit(answer);
              setGameAnswer('');
            }
          };

          switch (gameType) {
            case 'Globle':
              return {
                component: Game,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
            case 'Population':
              return {
                component: Population,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
            case 'Findle':
              return {
                component: Wordle,
                props: {
                  ...baseProps,
                  targetWord: target
                }
              };
            case 'Flagle':
              return {
                component: Flagle,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
            case 'Worldle':
              return {
                component: Worldle,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
            case 'Capitals':
              return {
                component: Capitals,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
            case 'Hangman':
              return {
                component: Hangman,
                props: {
                  ...baseProps,
                  targetWord: target
                }
              };
            case 'Shaple':
              return {
                component: Shaple,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
            case 'US':
              return {
                component: US,
                props: {
                  ...baseProps,
                  targetState: target
                }
              };
            default:
              return {
                component: Game,
                props: {
                  ...baseProps,
                  targetCountry: target
                }
              };
          }
        };

        const gameConfig = getGameConfig(matchData.gameType);
        if (gameConfig) {
          console.log('Setting game component with props:', gameConfig.props);
          
          // Additional check to ensure props are valid before setting
          if (gameConfig.props && (gameConfig.props.targetCountry || gameConfig.props.targetWord || gameConfig.props.targetState)) {
            // Double-check that the target is not null/undefined
            const target = gameConfig.props.targetCountry || gameConfig.props.targetWord || gameConfig.props.targetState;
            if (target && target !== null && target !== undefined) {
              console.log('Props are valid, setting game component');
              setGameComponent(gameConfig.component);
              setGameProps(gameConfig.props);
              
              // Add much longer delay before marking game as ready
              setTimeout(() => {
                console.log('Final props check before marking ready:', gameConfig.props);
                setIsGameReady(true);
                setIsSettingUp(false);
                console.log('Game is now ready to render');
                
                // Add final delay before actually rendering the Game component
                setTimeout(() => {
                  console.log('Now safe to render Game component');
                  setCanRenderGame(true);
                }, 5000); // Additional 5 second delay
              }, 8000); // Increased to 8 seconds
            } else {
              console.error('Target is null/undefined:', target);
              setIsSettingUp(false);
            }
          } else {
            console.error('Game config props are invalid:', gameConfig.props);
            setIsSettingUp(false);
          }
        } else {
          console.error('Failed to create game config for:', matchData.gameType);
          setIsSettingUp(false);
        }
      };

      // Add much longer initial delay to ensure everything is properly set
      setTimeout(setupGame, 5000); // Increased to 5 seconds
    } else if (gameState !== 'playing') {
      // Clear game component when not playing
      setGameComponent(null);
      setGameProps({});
      setIsGameReady(false);
      setIsSettingUp(false);
      setCanRenderGame(false); // Reset canRenderGame when game state changes
    }
  }, [matchData, gameState, onAnswerSubmit, isSettingUp]);

  // Safe Game Component that only renders when everything is ready
  const SafeGameComponent = ({ gameType, targetCountry, onAnswerSubmit }) => {
    const [isReadyToRender, setIsReadyToRender] = useState(false);
    
    useEffect(() => {
      console.log('SafeGameComponent: Received targetCountry:', targetCountry);
      
      if (targetCountry && targetCountry !== null && targetCountry !== undefined) {
        console.log('SafeGameComponent: TargetCountry is valid, waiting before rendering');
        // Add a delay before rendering the Game component
        setTimeout(() => {
          console.log('SafeGameComponent: Now ready to render Game component');
          setIsReadyToRender(true);
        }, 3000); // 3 second delay
      } else {
        console.log('SafeGameComponent: No valid targetCountry, showing loading');
      }
    }, [targetCountry]);
    
    if (!targetCountry || targetCountry === null || targetCountry === undefined) {
      console.log('SafeGameComponent: No valid targetCountry, showing loading');
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress sx={{ color: '#43cea2' }} />
          <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
            Loading game...
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', display: 'block', width: '100%', textAlign: 'center' }}>
            Target: {targetCountry || 'Not set'}
          </Typography>
        </Box>
      );
    }
    
    if (!isReadyToRender) {
      console.log('SafeGameComponent: Not ready to render yet, showing loading');
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress sx={{ color: '#43cea2' }} />
          <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
            Initializing game...
          </Typography>
        </Box>
      );
    }
    
    console.log('SafeGameComponent: TargetCountry is valid, rendering Game component');
    
    // Only render the actual game component when we have a valid target and are ready
    return (
      <Game 
        targetCountry={targetCountry}
        isOnline={true}
        disabled={false}
        onAnswerSubmit={onAnswerSubmit}
      />
    );
  };

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

      {/* Game Component - Only render when game is actually playing */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {gameState === 'playing' && isGameReady && gameComponent && gameProps && canRenderGame ? (
          (() => {
            console.log('OnlineGame: About to render Game component with props:', gameProps);
            const target = gameProps.targetCountry || gameProps.targetWord || gameProps.targetState;
            console.log('OnlineGame: Target extracted:', target);
            
            // Final validation - don't render if target is invalid
            if (!target || target === null || target === undefined) {
              console.log('OnlineGame: Target is invalid, showing loading instead');
              return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress sx={{ color: '#43cea2' }} />
                  <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
                    Waiting for valid target...
                  </Typography>
                </Box>
              );
            }
            
            // Now safe to render the Game component
            console.log('OnlineGame: Rendering Game component with target:', target);
            return (
              <Game 
                targetCountry={target}
                isOnline={true}
                disabled={false}
                onAnswerSubmit={onAnswerSubmit}
              />
            );
          })()
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress sx={{ color: '#43cea2' }} />
            <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>
              {gameState === 'countdown' ? 'Preparing game...' : 
               gameState === 'playing' ? 'Loading game components...' : 'Loading game...'}
            </Typography>
            {gameState === 'playing' && (
              <Typography variant="caption" sx={{ ml: 2, color: '#999', display: 'block', width: '100%', textAlign: 'center' }}>
                Ready: {isGameReady ? 'Yes' : 'No'}, 
                Component: {gameComponent ? 'Yes' : 'No'}, 
                Props: {gameProps && Object.keys(gameProps).length > 0 ? 'Yes' : 'No'}, 
                Target: {gameProps?.targetCountry || 'Not set'},
                Can Render: {canRenderGame ? 'Yes' : 'No'}
              </Typography>
            )}
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