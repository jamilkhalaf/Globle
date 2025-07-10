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
        border: isAnswered && flagCode === correctFlagCode ? '3px solid #4caf50' : 
                isAnswered && selectedAnswer === flagCode && flagCode !== correctFlagCode ? '3px solid #f44336' : '2px solid #e0e0e0',
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
      
      {/* Result Indicator */}
      {isAnswered && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: flagCode === correctFlagCode ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)',
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
          {flagCode === correctFlagCode ? '✓' : '✗'}
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
    
    // Check if the selected flag code matches the correct flag code
    const questionData = JSON.parse(matchData.question);
    const isCorrect = flagCode === questionData.correctFlagCode;
    
    console.log('🎮 Answer result:', { isCorrect, correctFlagCode: questionData.correctFlagCode });
    
    // Submit answer to server immediately
    onAnswerSubmit({
      answer: flagCode,
      timeTaken: Date.now() - (matchData?.startTime || Date.now()),
      isCorrect: isCorrect,
      distance: 0 // Add distance field for compatibility with backend
    });
    
    // Update UI state after server submission - but don't show immediate feedback
    setIsAnswered(true);
    setSelectedAnswer(flagCode);
    // Don't set message here - wait for server response
    setMessage('Answer submitted! Waiting for other player...');
  }, [isAnswered, matchData, onAnswerSubmit, correctAnswer]);

  const renderRoundResult = () => {
    if (!roundResult) return null;
    
    // Use the new round result data structure
    const userIsCorrect = roundResult.userIsCorrect;
    const userWonRound = roundResult.userWonRound;
    const userAnswer = roundResult.userAnswer;
    const roundWinner = roundResult.roundWinner;
    const score = roundResult.score;
    const correctAnswer = roundResult.correctAnswer;
    
    return (
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
          <Typography variant="h2" sx={{ 
            mb: 3, 
            color: userIsCorrect ? '#43cea2' : '#f44336',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2.5rem', sm: '3rem' }
          }}>
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: 3, 
            color: 'white',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Round {roundResult.roundNumber} Complete
          </Typography>
        </Box>
        
        <Box sx={{ 
          mb: 4, 
          p: 3,
          bgcolor: 'transparent', // Changed from 'rgba(255,255,255,0.05)' to transparent
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: 500,
          mx: 'auto'
        }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500'
          }}>
            Your Answer: {userAnswer || 'No answer'}
          </Typography>
          
          <Typography variant="h6" sx={{ 
            mb: 2, 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500'
          }}>
            Correct Answer: {correctAnswer}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ 
              color: '#43cea2', 
              fontWeight: 'bold',
              mb: 1,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Score: {score}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic'
            }}>
              {userWonRound ? '🎉 You won this round!' : 
               roundWinner ? `${roundWinner} won this round!` : '🤝 Round draw - both players answered incorrectly!'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          mb: 4,
          '& .countdown-dot': {
            width: 20,
            height: 20,
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
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          Next round starting...
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
        p: 4,
        bgcolor: '#000000', // Added black background
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ 
            mb: 3, 
            color: resultColor,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '3rem', sm: '4rem' }
          }}>
            {resultMessage}
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: 3, 
            color: 'white',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {userPoints === 0 ? 'Great game, both players were evenly matched!' : 
             isWinner ? 'Congratulations on your victory!' : 'Better luck next time!'}
          </Typography>
        </Box>
        
        {matchResult && (
          <Box sx={{ 
            mb: 4, 
            p: 3,
            bgcolor: 'transparent', // Changed from 'rgba(255,255,255,0.05)' to transparent
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: 500,
            mx: 'auto'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              Final Score: {finalScore}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h3" sx={{ 
                color: resultColor, 
                fontWeight: 'bold',
                mb: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                {pointsMessage}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontStyle: 'italic'
              }}>
                {userPoints === 0 ? 'Neither player gained or lost points' :
                 isWinner ? 'You earned points for your victory!' : 'You lost points this round.'}
              </Typography>
            </Box>
            
            {/* Score difference explanation */}
            {scoreDifference > 0 && (
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontStyle: 'italic'
                }}>
                  {scoreDifference === 5 ? 
                   'Perfect victory! Maximum points awarded.' :
                   `Score difference: ${scoreDifference} rounds. Points awarded proportionally.`}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={onLeaveGame}
            size="large"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)',
              borderWidth: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
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
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
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
      p: 3, 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      overflow: 'hidden',
      bgcolor: '#000000' // Completely black background
    }}>
      {/* Main Game Container */}
      <Card sx={{ 
        bgcolor: '#000000', // Changed from 'rgba(30,30,30,0.95)' to black
        color: 'white', 
        p: 3, 
        maxWidth: 600, 
        mx: 'auto',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <CardContent sx={{ p: 2 }}>
          {/* Round Header */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ 
              color: '#43cea2', 
              mb: 0.5, 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}>
              Round {currentRound} of 5
            </Typography>
            
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontStyle: 'italic',
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}>
              Score: {player1Wins} - {player2Wins}
            </Typography>
          </Box>

          {/* Game Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              mb: 1, 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
              lineHeight: 1.2
            }}>
              {question}
            </Typography>
            
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontStyle: 'italic',
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}>
              Click on the correct flag
            </Typography>
          </Box>
          
          {message && (
            <Alert 
              severity={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'success' : 'error'} 
              sx={{ 
                mb: 2, 
                maxWidth: 400, 
                mx: 'auto',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                '& .MuiAlert-message': { fontSize: { xs: '0.8rem', sm: '0.9rem' } }
              }}
            >
              {message}
            </Alert>
          )}

          {/* Flag Options Grid - 2x2 Layout */}
          <Box sx={{ 
            mb: 2,
            p: 2,
            bgcolor: 'transparent', // Changed from 'rgba(255,255,255,0.05)' to transparent
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* 2x2 Grid Container */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gridTemplateRows: '1fr 1fr',
              gap: 1.5,
              height: { xs: '180px', sm: '200px', md: '220px' },
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
              mt: 1,
              fontStyle: 'italic',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              display: 'block',
              textAlign: 'center'
            }}>
              {isAnswered ? 'Round completed!' : 'Select the flag that matches the country name above'}
            </Typography>
          </Box>

          {/* Game Status */}
          {isAnswered && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Chip
                icon={<EmojiEventsIcon />}
                label={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'You got it right!' : 'Better luck next time!'}
                color={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'success' : 'error'}
                size="medium"
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }, 
                  py: 1,
                  px: 2,
                  '& .MuiChip-label': { fontSize: { xs: '0.8rem', sm: '0.9rem' } }
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