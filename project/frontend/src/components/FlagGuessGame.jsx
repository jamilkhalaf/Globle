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

const FlagGuessGame = ({ matchData, onAnswerSubmit, gameState, onLeaveGame, onNewOpponent, matchResult }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [flagCodes, setFlagCodes] = useState([]);
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');

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

  const renderGameEnd = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
        Game Over!
      </Typography>
      
      {matchResult && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Winner: {matchResult.winner}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Correct Answer: {matchResult.correctAnswer}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#43cea2' }}>
              Points: {matchResult.points ? Object.values(matchResult.points)[0] : 0}
            </Typography>
          </Box>
        </>
      )}

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

  const renderGameInterface = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
        {question}
      </Typography>
      
      {message && (
        <Alert severity={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Flag Options Grid */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {flagCodes.map((flagCode, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card sx={{ 
                bgcolor: 'white', 
                p: 1,
                cursor: 'pointer',
                border: isAnswered && flagCode === JSON.parse(matchData.question).correctFlagCode ? '3px solid #4caf50' : '1px solid #ddd',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s'
                }
              }}>
                <img 
                  src={`/flags/${flagCode}.png`}
                  alt={`Flag ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxHeight: '120px',
                    objectFit: 'contain'
                  }}
                  onLoad={() => console.log(`Flag loaded successfully: ${flagCode}.png`)}
                  onError={(e) => {
                    console.log(`Flag failed to load: ${flagCode}.png`);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Box sx={{ display: 'none', textAlign: 'center', py: 1 }}>
                  <FlagIcon sx={{ fontSize: 30, color: '#ccc' }} />
                  <Typography variant="caption" color="textSecondary">
                    Flag not available
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Game Status */}
      {isAnswered && (
        <Box sx={{ mt: 3 }}>
          <Chip
            icon={<EmojiEventsIcon />}
            label={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'You got it right!' : 'Better luck next time!'}
            color={selectedAnswer === JSON.parse(matchData.question).correctFlagCode ? 'success' : 'error'}
            sx={{ fontSize: '1.1rem', py: 1 }}
          />
        </Box>
      )}
    </Box>
  );

  const renderCountdown = () => (
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress sx={{ color: '#43cea2', mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'white' }}>
        Game starting in 3 seconds...
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
          {gameState === 'ended' && renderGameEnd()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FlagGuessGame; 