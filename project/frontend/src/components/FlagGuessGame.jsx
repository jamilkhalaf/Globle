import React, { useState, useEffect } from 'react';
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
      setCurrentRound(matchData.roundNumber);
    }
  }, [matchData]);

  useEffect(() => {
    if (matchResult && matchResult.score) {
      // Parse score like "2-1" to update player wins
      const [p1Wins, p2Wins] = matchResult.score.split('-').map(Number);
      setPlayer1Wins(p1Wins);
      setPlayer2Wins(p2Wins);
    }
  }, [matchResult]);

  useEffect(() => {
    if (gameState === 'roundEnd' && matchResult) {
      setRoundResult(matchResult);
      // Reset answer state for next round
      setSelectedAnswer('');
      setIsAnswered(false);
      setMessage('');
    }
  }, [gameState, matchResult]);

  const handleAnswerSubmit = (flagCode) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(flagCode);
    
    // Check if the selected flag code matches the correct flag code
    const questionData = JSON.parse(matchData.question);
    const isCorrect = flagCode === questionData.correctFlagCode;
    setMessage(isCorrect ? 'Correct!' : `Wrong! The correct flag was for ${correctAnswer}`);
    
    // Submit answer to server
    onAnswerSubmit({
      answer: flagCode,
      timeTaken: Date.now() - (matchData?.startTime || Date.now()),
      isCorrect: isCorrect
    });
  };

  const renderRoundResult = () => {
    if (!roundResult) return null;
    
    const isCorrect = roundResult.isCorrect;
    const roundWinner = roundResult.roundWinner;
    const score = roundResult.score;
    
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ 
            mb: 3, 
            color: isCorrect ? '#43cea2' : '#f44336',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2.5rem', sm: '3rem' }
          }}>
            {isCorrect ? '🎉 Correct!' : '❌ Wrong!'}
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
          bgcolor: 'rgba(255,255,255,0.05)',
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
            Correct Answer: {roundResult.correctAnswer}
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
              {roundWinner ? `${roundWinner} won this round!` : 'No one got it right this round.'}
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
    
    console.log('Game End Debug:', {
      userPoints,
      isWinner,
      matchResult
    });
    
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ 
            mb: 3, 
            color: isWinner ? '#43cea2' : '#f44336',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '3rem', sm: '4rem' }
          }}>
            {isWinner ? '🎉 You Won!' : '😔 You Lost'}
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: 3, 
            color: 'white',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {isWinner ? 'Congratulations!' : 'Better luck next time!'}
          </Typography>
        </Box>
        
        {matchResult && (
          <Box sx={{ 
            mb: 4, 
            p: 3,
            bgcolor: 'rgba(255,255,255,0.05)',
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
                color: isWinner ? '#43cea2' : '#f44336', 
                fontWeight: 'bold',
                mb: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                {isWinner ? `+${userPoints} Points` : `${userPoints} Points`}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontStyle: 'italic'
              }}>
                {isWinner ? 'Great job! You earned points!' : 'You lost some points this round.'}
              </Typography>
            </Box>
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
    <Box sx={{ textAlign: 'center', p: 3, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Round Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ 
          color: '#43cea2', 
          mb: 1, 
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          Round {currentRound} of 5
        </Typography>
        
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.8)', 
          mb: 2,
          fontStyle: 'italic'
        }}>
          Score: {player1Wins} - {player2Wins}
        </Typography>
      </Box>

      {/* Game Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ 
          color: 'white', 
          mb: 2, 
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}>
          {question}
        </Typography>
        
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.8)', 
          mb: 3,
          fontStyle: 'italic'
        }}>
          Click on the correct flag
        </Typography>
      </Box>
      
      {message && (
        <Alert 
          severity={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'success' : 'error'} 
          sx={{ 
            mb: 3, 
            maxWidth: 400, 
            mx: 'auto',
            fontSize: '1.1rem',
            '& .MuiAlert-message': { fontSize: '1.1rem' }
          }}
        >
          {message}
        </Alert>
      )}

      {/* Flag Options Grid */}
      <Box sx={{ 
        mb: 4, 
        maxWidth: 600, 
        mx: 'auto',
        p: 2,
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {flagCodes.map((flagCode, index) => (
            <Grid item xs={6} key={index}>
              <Card 
                sx={{ 
                  bgcolor: 'white', 
                  p: 1,
                  cursor: 'pointer',
                  border: isAnswered && flagCode === JSON.parse(matchData.question).correctFlagCode ? '4px solid #4caf50' : 
                          isAnswered && selectedAnswer === flagCode && flagCode !== JSON.parse(matchData.question).correctFlagCode ? '4px solid #f44336' : '2px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: isAnswered ? '0 8px 16px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.2)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                    borderColor: isAnswered ? 'transparent' : '#43cea2'
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                    transition: 'all 0.1s ease'
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  height: 120, // Smaller fixed height
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => handleAnswerSubmit(flagCode)}
              >
                {/* Flag Image Container */}
                <Box sx={{ 
                  position: 'relative',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  overflow: 'hidden',
                  minHeight: 0
                }}>
                  <img 
                    src={`/flags/${flagCode}.png`}
                    alt={`Flag ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'contain',
                      padding: '8px'
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
                    py: 2,
                    color: '#666'
                  }}>
                    <FlagIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
                    <Typography variant="caption" color="textSecondary">
                      Flag not available
                    </Typography>
                  </Box>
                </Box>
                
                {/* Flag Number Badge */}
                <Box sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0,0,0,0.7)',
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
                    bgcolor: flagCode === JSON.parse(matchData.question).correctFlagCode ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}>
                    {flagCode === JSON.parse(matchData.question).correctFlagCode ? '✓' : '✗'}
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Instructions */}
        <Typography variant="body2" sx={{ 
          color: 'rgba(255,255,255,0.6)', 
          mt: 2,
          fontStyle: 'italic'
        }}>
          {isAnswered ? 'Round completed!' : 'Select the flag that matches the country name above'}
        </Typography>
      </Box>

      {/* Game Status */}
      {isAnswered && (
        <Box sx={{ mt: 3 }}>
          <Chip
            icon={<EmojiEventsIcon />}
            label={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'You got it right!' : 'Better luck next time!'}
            color={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'success' : 'error'}
            sx={{ 
              fontSize: '1.2rem', 
              py: 2,
              px: 3,
              '& .MuiChip-label': { fontSize: '1.2rem' }
            }}
          />
        </Box>
      )}
    </Box>
  );

  const renderCountdown = () => (
    <Box sx={{ textAlign: 'center', p: 4 }}>
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
        bgcolor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <Card sx={{ bgcolor: '#1e1e1e', color: 'white', p: 4, maxWidth: 800, width: '100%' }}>
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