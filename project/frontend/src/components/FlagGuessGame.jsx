import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Memoized Flag Component
const FlagCard = React.memo(({ 
  flagCode, 
  index, 
  isAnswered, 
  selectedAnswer, 
  correctFlagCode, 
  onAnswerSubmit 
}) => {
  const handleClick = useCallback(() => {
    onAnswerSubmit(flagCode);
  }, [flagCode, onAnswerSubmit]);

  return (
    <Card 
      sx={{ 
        bgcolor: 'white', 
        p: 0.5,
        cursor: 'pointer',
        border: isAnswered && selectedAnswer === flagCode ? '3px solid #43cea2' : '2px solid #e0e0e0',
        borderRadius: 1.5,
        boxShadow: isAnswered ? '0 6px 12px rgba(0,0,0,0.3)' : '0 3px 6px rgba(0,0,0,0.2)',
        '&:hover': {
          transform: 'scale(1.03)',
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
          borderColor: isAnswered ? 'transparent' : '#43cea2'
        },
        '&:active': {
          transform: 'scale(0.98)',
          transition: 'all 0.1s ease'
        },
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}
      onClick={handleClick}
    >
      {/* Flag Image Container */}
      <Box sx={{ 
        position: 'relative',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#ffffff', // Changed from '#f5f5f5' to white
        borderRadius: 1,
        overflow: 'hidden',
        minHeight: 0,
        height: '100%'
      }}>
        <img 
          src={`/flags/${flagCode}.png`}
          alt={`Flag ${index + 1}`}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'contain',
            padding: '6px'
          }}
          onLoad={() => console.log(`Flag loaded successfully: ${flagCode}.png`)}
          onError={(e) => {
            console.log(`Flag failed to load: ${flagCode}.png`);
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <Box sx={{ 
          display: 'none', 
          textAlign: 'center', 
          py: 1,
          color: '#666'
        }}>
          <FlagIcon sx={{ fontSize: 20, color: '#ccc', mb: 0.5 }} />
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
            Flag not available
          </Typography>
        </Box>
      </Box>
      
      {/* Flag Number Badge */}
      <Box sx={{
        position: 'absolute',
        top: 3,
        right: 3,
        bgcolor: 'rgba(0,0,0,0.8)',
        color: 'white',
        borderRadius: '50%',
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>
        {index + 1}
      </Box>
      
      {/* Selected Indicator */}
      {isAnswered && selectedAnswer === flagCode && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(67, 206, 162, 0.95)',
          color: 'white',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 2,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          ✓
        </Box>
      )}
    </Card>
  );
});

FlagCard.displayName = 'FlagCard';

const FlagGuessGame = ({ matchData, onAnswerSubmit, gameState, gameTimer, onLeaveGame, onNewOpponent, matchResult }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [flagCodes, setFlagCodes] = useState([]);
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [roundResult, setRoundResult] = useState(null);

  useEffect(() => {
    if (matchData && matchData.question) {
      // Parse the question data
      const questionData = JSON.parse(matchData.question);
      console.log('FlagGuessGame - Received question data:', questionData);
      console.log('FlagGuessGame - Correct flag code:', questionData.correctFlagCode);
      console.log('FlagGuessGame - All flag codes:', questionData.flagCodes);
      setCorrectAnswer(questionData.correctAnswer);
      setFlagCodes(questionData.flagCodes || []);
      setQuestion(questionData.question || 'Which flag belongs to this country?');
      console.log('FlagGuessGame - Set flag codes:', questionData.flagCodes);
    }
  }, [matchData]);

  useEffect(() => {
    if (matchData && matchData.roundNumber) {
      console.log('🎮 FlagGuessGame - Updating current round:', matchData.roundNumber);
      setCurrentRound(matchData.roundNumber);
    }
  }, [matchData]);

  useEffect(() => {
    if (matchResult && matchResult.score) {
      // Parse score like "2-1" to update player wins
      const [p1Wins, p2Wins] = matchResult.score.split('-').map(Number);
      console.log('🎮 FlagGuessGame - Updating player wins:', { p1Wins, p2Wins });
      setPlayer1Wins(p1Wins);
      setPlayer2Wins(p2Wins);
    }
  }, [matchResult]);

  useEffect(() => {
    if (gameState === 'roundEnd' && matchResult) {
      console.log('🎮 FlagGuessGame - Round end detected:', { gameState, matchResult });
      setRoundResult(matchResult);
      // Reset answer state for next round
      setSelectedAnswer('');
      setIsAnswered(false);
      setMessage('');
    }
  }, [gameState, matchResult]);

  useEffect(() => {
    if (gameState === 'playing' && matchData) {
      console.log('🎮 FlagGuessGame - Starting new round:', { gameState, matchData });
      // Reset answer state when starting a new round
      setSelectedAnswer('');
      setIsAnswered(false);
      setMessage('');
      setRoundResult(null); // Clear previous round result
      
      // Update round number if provided
      if (matchData.roundNumber) {
        console.log('🎮 FlagGuessGame - Setting round number to:', matchData.roundNumber);
        setCurrentRound(matchData.roundNumber);
      }
    }
  }, [gameState, matchData]);

  // Keep component visible during round transitions
  useEffect(() => {
    if (gameState === 'roundEnd' || gameState === 'playing' || gameState === 'countdown') {
      console.log('🎮 FlagGuessGame - Keeping component visible during game session');
    }
  }, [gameState]);

  useEffect(() => {
    console.log('🎮 FlagGuessGame - Component state changed:', { 
      gameState, 
      currentRound,
      player1Wins,
      player2Wins,
      isAnswered,
      matchData: matchData ? { matchId: matchData.matchId, roundNumber: matchData.roundNumber } : null,
      matchResult 
    });
  }, [gameState, currentRound, player1Wins, player2Wins, isAnswered, matchData, matchResult]);

  const handleAnswerSubmit = useCallback((flagCode) => {
    if (isAnswered) return;
    
    console.log('🎮 Submitting answer:', flagCode);
    
    // Check if the selected flag code matches the correct flag code for immediate UI feedback
    const questionData = JSON.parse(matchData.question);
    const isCorrect = flagCode === questionData.correctFlagCode;
    
    console.log('🎮 Answer result:', { 
      isCorrect, 
      correctFlagCode: questionData.correctFlagCode, 
      selectedFlagCode: flagCode,
      questionData: questionData
    });
    
    // Submit answer to server immediately
    onAnswerSubmit({
      answer: flagCode,
      timeTaken: Date.now() - (matchData?.startTime || Date.now()),
      isCorrect: isCorrect,
      distance: 0 // Add distance field for compatibility with backend
    });
    
    // Update UI state after server submission
    setIsAnswered(true);
    setSelectedAnswer(flagCode);
    
    // Show generic waiting message - the actual result will come from server
    setMessage('Answer submitted! Waiting for other player...');
  }, [isAnswered, matchData, onAnswerSubmit]);

  const renderRoundResult = () => {
    if (!roundResult) return null;
    
    // Use the new round result data structure
    const userIsCorrect = roundResult.userIsCorrect;
    const userWonRound = roundResult.userWonRound;
    const userAnswer = roundResult.userAnswer;
    const roundWinner = roundResult.roundWinner;
    const score = roundResult.score;
    const correctAnswer = roundResult.correctAnswer;
    const isDraw = roundResult.isDraw;
    
    // Determine the main message based on the scenario
    let mainMessage, messageColor;
    
    if (isDraw) {
      mainMessage = '🤝 Draw!';
      messageColor = '#ff9800'; // Orange for draw
    } else if (userWonRound) {
      mainMessage = '🎉 You Won!';
      messageColor = '#43cea2'; // Green for win
    } else if (userIsCorrect && !userWonRound) {
      mainMessage = '⚡ Too Slow!';
      messageColor = '#ff9800'; // Orange for correct but slow
    } else {
      mainMessage = '❌ Incorrect!';
      messageColor = '#f44336'; // Red for incorrect
    }
    
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: { xs: 2, sm: 4 }, // Reduced padding for mobile
        bgcolor: '#000000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Typography variant="h2" sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: messageColor,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } // Smaller for mobile
          }}>
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: 'white',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } // Smaller for mobile
          }}>
            {isDraw ? 'Round Repeating' : 'Round Complete'}
          </Typography>
        </Box>
        
        <Box sx={{ 
          mb: { xs: 2, sm: 4 }, 
          p: { xs: 2, sm: 3 }, // Reduced padding for mobile
          bgcolor: 'transparent',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: { xs: '95%', sm: 500 }, // Wider on mobile
          mx: 'auto'
        }}>
          <Typography variant="h6" sx={{ 
            mb: { xs: 1, sm: 2 }, 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500',
            fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller for mobile
          }}>
          </Typography>
          
          <Typography variant="h6" sx={{ 
            mb: { xs: 1, sm: 2 }, 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500',
            fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller for mobile
          }}>
            Correct Answer: {correctAnswer}
          </Typography>

          <Box sx={{ mb: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" sx={{ 
              color: '#43cea2', 
              fontWeight: 'bold',
              mb: 1,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } // Smaller for mobile
            }}>
            </Typography>
            <Typography variant="h4" sx={{ 
              color: '#43cea2', 
              fontWeight: 'bold',
              mb: 1,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } // Smaller for mobile
            }}>
              Score: {score}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic',
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } // Smaller for mobile
            }}>
              {isDraw ? '🤝 Both players answered simultaneously! Round will restart.' :
               userWonRound ? '🎉 You won this round!' : 
               roundWinner ? `${roundWinner} won this round!` : 
               '🤝 Round draw - both players answered incorrectly!'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 4 },
          '& .countdown-dot': {
            width: { xs: 16, sm: 20 }, // Smaller dots for mobile
            height: { xs: 16, sm: 20 },
            borderRadius: '50%',
            bgcolor: '#43cea2',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 10px rgba(67, 206, 162, 0.5)'
          }
        }}>
          <Box className="countdown-dot" />
          <Box className="countdown-dot" />
          <Box className="countdown-dot" />
        </Box>
        
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.8)',
          fontStyle: 'italic',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } // Smaller for mobile
        }}>
          {isDraw ? 'Repeating round...' : 'Next round starting...'}
        </Typography>
      </Box>
    );
  };

  const renderGameEnd = () => {
    // Get current user's points from the match result
    const userPoints = matchResult?.userPoints || 0;
    const isWinner = matchResult?.isWinner || false;
    const finalScore = matchResult?.finalScore || '0-0';
    const scoreDifference = matchResult?.scoreDifference || 0;
    
    console.log('Game End Debug:', {
      userPoints,
      isWinner,
      matchResult,
      scoreDifference
    });
    
    // Determine the result message based on points and score difference
    let resultMessage, resultColor, pointsMessage;
    
    if (userPoints === 0) {
      // Draw
      resultMessage = '🤝 Game Draw!';
      resultColor = '#ff9800'; // Orange for draw
      pointsMessage = 'No points awarded - it was a tie!';
    } else if (scoreDifference === 5) {
      // Complete victory/defeat
      resultMessage = isWinner ? '🎉 Complete Victory!' : '😔 Complete Defeat';
      resultColor = isWinner ? '#43cea2' : '#f44336';
      pointsMessage = isWinner ? `+${userPoints} Points (Perfect Victory!)` : `${userPoints} Points (Complete Loss)`;
    } else {
      // Partial victory/defeat
      resultMessage = isWinner ? '🎉 You Won!' : '😔 You Lost';
      resultColor = isWinner ? '#43cea2' : '#f44336';
      pointsMessage = isWinner ? `+${userPoints} Points` : `${userPoints} Points`;
    }
    
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: { xs: 2, sm: 4 }, // Reduced padding for mobile
        bgcolor: '#000000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Typography variant="h1" sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: resultColor,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' } // Smaller for mobile
          }}>
            {resultMessage}
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: 'white',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } // Smaller for mobile
          }}>
            {userPoints === 0 ? 'Great game, both players were evenly matched!' : 
             isWinner ? 'Congratulations on your victory!' : 'Better luck next time!'}
          </Typography>
        </Box>
        
        {matchResult && (
          <Box sx={{ 
            mb: { xs: 2, sm: 4 }, 
            p: { xs: 2, sm: 3 }, // Reduced padding for mobile
            bgcolor: 'transparent',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: { xs: '95%', sm: 500 }, // Wider on mobile
            mx: 'auto'
          }}>
            <Typography variant="h6" sx={{ 
              mb: { xs: 1, sm: 2 }, 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500',
              fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller for mobile
            }}>
              Final Score: {finalScore}
            </Typography>

            <Box sx={{ mb: { xs: 1, sm: 2 } }}>
              <Typography variant="h3" sx={{ 
                color: resultColor, 
                fontWeight: 'bold',
                mb: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // Smaller for mobile
              }}>
                {pointsMessage}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontStyle: 'italic',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } // Smaller for mobile
              }}>
                {userPoints === 0 ? 'Neither player gained or lost points' :
                 isWinner ? 'You earned points for your victory!' : 'You lost points this round.'}
              </Typography>
            </Box>
            
            {/* Score difference explanation */}
            {scoreDifference > 0 && (
              <Box sx={{ 
                mt: { xs: 1, sm: 2 }, 
                p: { xs: 1, sm: 2 }, // Reduced padding for mobile
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontStyle: 'italic',
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } // Smaller for mobile
                }}>
                  {scoreDifference === 5 ? 
                   'Perfect victory! Maximum points awarded.' :
                   `Score difference: ${scoreDifference} rounds. Points awarded proportionally.`}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={onLeaveGame}
            size="large"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)',
              borderWidth: 2,
              px: { xs: 3, sm: 4 }, // Reduced padding for mobile
              py: { xs: 1, sm: 1.5 }, // Reduced padding for mobile
              fontSize: { xs: '0.9rem', sm: '1.1rem' }, // Smaller font for mobile
              '&:hover': { 
                borderColor: 'white',
                borderWidth: 2,
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Leave Game
          </Button>
          <Button
            variant="contained"
            onClick={onNewOpponent}
            size="large"
            sx={{ 
              bgcolor: '#43cea2',
              px: { xs: 3, sm: 4 }, // Reduced padding for mobile
              py: { xs: 1, sm: 1.5 }, // Reduced padding for mobile
              fontSize: { xs: '0.9rem', sm: '1.1rem' }, // Smaller font for mobile
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#3bb08f',
                transform: 'scale(1.05)'
              }
            }}
          >
            Find New Opponent
          </Button>
        </Box>
      </Box>
    );
  };

  const renderGameInterface = () => (
    <Box sx={{ 
      textAlign: 'center', 
      p: { xs: 1, sm: 3 }, // Reduced padding for mobile
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      overflow: 'hidden',
      bgcolor: '#000000'
    }}>
      {/* Main Game Container */}
      <Card sx={{ 
        bgcolor: '#000000',
        color: 'white', 
        p: { xs: 2, sm: 3 }, // Reduced padding for mobile
        maxWidth: { xs: '98%', sm: 600 }, // Wider on mobile
        mx: 'auto',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          {/* Round Header */}
          <Box sx={{ mb: { xs: 1, sm: 2 }, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              color: '#43cea2', 
              mb: 0.5, 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
            }}>
              Round {currentRound} of 5
            </Typography>
            
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontStyle: 'italic',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}>
              Score: {player1Wins} - {player2Wins}
            </Typography>
          </Box>

          {/* Game Header */}
          <Box sx={{ mb: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              mb: 1, 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              lineHeight: 1.2
            }}>
              {question}
            </Typography>
            
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontStyle: 'italic',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}>
              Click on the correct flag
            </Typography>
          </Box>
          
          {message && (
            <Alert 
              severity="info"
              sx={{ 
                mb: { xs: 1, sm: 2 }, 
                maxWidth: { xs: '95%', sm: 400 }, 
                mx: 'auto',
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                '& .MuiAlert-message': { fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }
              }}
            >
              {message}
            </Alert>
          )}

          {/* Flag Options Grid - 2x2 Layout */}
          <Box sx={{ 
            mb: { xs: 1, sm: 2 },
            p: { xs: 1, sm: 2 }, // Reduced padding for mobile
            bgcolor: 'transparent',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* 2x2 Grid Container */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gridTemplateRows: '1fr 1fr',
              gap: { xs: 1, sm: 1.5 }, // Reduced gap for mobile
              height: { xs: '220px', sm: '240px', md: '260px' }, // Bigger height for mobile
              width: '100%'
            }}>
              {flagCodes.map((flagCode, index) => (
                <FlagCard 
                  key={index}
                  flagCode={flagCode}
                  index={index}
                  isAnswered={isAnswered}
                  selectedAnswer={selectedAnswer}
                  correctFlagCode={JSON.parse(matchData.question).correctFlagCode}
                  onAnswerSubmit={handleAnswerSubmit}
                />
              ))}
            </Box>
            
            {/* Instructions */}
            <Typography variant="caption" sx={{ 
              color: 'rgba(255,255,255,0.6)', 
              mt: { xs: 0.5, sm: 1 },
              fontStyle: 'italic',
              fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
              display: 'block',
              textAlign: 'center'
            }}>
              {isAnswered ? 'Round completed!' : 'Select the flag that matches the country name above'}
            </Typography>
          </Box>

          {/* Game Status */}
          {isAnswered && (
            <Box sx={{ mt: { xs: 0.5, sm: 1 }, textAlign: 'center' }}>
              <Chip
                icon={<EmojiEventsIcon />}
                label="Waiting for round result..."
                color="info"
                size="medium"
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, 
                  py: { xs: 0.5, sm: 1 },
                  px: { xs: 1, sm: 2 },
                  '& .MuiChip-label': { fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderCountdown = () => (
    <Box sx={{ 
      textAlign: 'center', 
      p: 4,
      bgcolor: '#000000', // Added black background
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ 
          color: '#43cea2', 
          fontWeight: 'bold', 
          mb: 3,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontSize: { xs: '4rem', sm: '6rem' }
        }}>
          {gameTimer}
        </Typography>
        <Typography variant="h4" sx={{ 
          color: 'white', 
          mb: 4,
          fontWeight: '300',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          Round {currentRound} starting in...
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 3, 
        mb: 4,
        '& .countdown-dot': {
          width: 24,
          height: 24,
          borderRadius: '50%',
          bgcolor: gameTimer <= 3 ? '#43cea2' : 'rgba(255,255,255,0.3)',
          transition: 'all 0.3s ease',
          boxShadow: gameTimer <= 3 ? '0 0 10px rgba(67, 206, 162, 0.5)' : 'none'
        }
      }}>
        <Box className="countdown-dot" />
        <Box className="countdown-dot" />
        <Box className="countdown-dot" />
      </Box>
      
      <Typography variant="h6" sx={{ 
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'italic',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        Get ready to play!
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#000000', // Changed from 'rgba(0,0,0,0.9)' to completely black
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <Card sx={{ bgcolor: '#000000', color: 'white', p: 4, maxWidth: 800, width: '100%' }}>
        <CardContent>
          {gameState === 'countdown' && renderCountdown()}
          {gameState === 'playing' && renderGameInterface()}
          {gameState === 'roundEnd' && renderRoundResult()}
          {gameState === 'ended' && renderGameEnd()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FlagGuessGame;