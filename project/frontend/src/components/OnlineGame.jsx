import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress, TextField } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Import dedicated online game components
import OnlineGloble from './OnlineGloble';
import OnlinePopulation from './OnlinePopulation';
import OnlineFlagle from './OnlineFlagle';
import OnlineUS from './OnlineUS';

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
  // Game state
  const [currentRound, setCurrentRound] = useState(1);

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
        // For Findle (Name game), use countries
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

  const renderGame = () => {
    const target = getTargetForGame(matchData?.gameType, matchData?.sharedTarget);
    
    // Render the appropriate online component based on game type
    switch (matchData?.gameType) {
      case 'Globle':
        return (
          <OnlineGloble
            targetCountry={target}
            onAnswerSubmit={onAnswerSubmit}
            disabled={false}
            opponentRoundsWon={matchData?.player2Rounds || 0}
            currentRoundNumber={matchData?.currentRound || 1}
            playerRoundsWon={matchData?.player1Rounds || 0}
          />
        );
      case 'Population':
        return (
          <OnlinePopulation
            targetCountry={target}
            onAnswerSubmit={onAnswerSubmit}
            disabled={false}
            opponentRoundsWon={matchData?.player2Rounds || 0}
            currentRoundNumber={matchData?.currentRound || 1}
            playerRoundsWon={matchData?.player1Rounds || 0}
          />
        );
      case 'Flagle':
        return (
          <OnlineFlagle
            targetCountry={target}
            onAnswerSubmit={onAnswerSubmit}
            disabled={false}
            opponentRoundsWon={matchData?.player2Rounds || 0}
            currentRoundNumber={matchData?.currentRound || 1}
            playerRoundsWon={matchData?.player1Rounds || 0}
          />
        );
      case 'US':
        return (
          <OnlineUS
            targetState={target}
            onAnswerSubmit={onAnswerSubmit}
            disabled={false}
            opponentRoundsWon={matchData?.player2Rounds || 0}
            currentRoundNumber={matchData?.currentRound || 1}
            playerRoundsWon={matchData?.player1Rounds || 0}
          />
        );
      default:
        // For other games, show a placeholder until we create their online components
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
              {matchData?.gameType}
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Online mode coming soon!
            </Typography>
            <CircularProgress size={60} sx={{ color: '#43cea2' }} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              This game type is not yet available in online mode.
            </Typography>
          </Box>
        );
    }
  };

  const renderRoundEnd = () => {
    const currentUsername = localStorage.getItem('username') || matchData?.players?.[0]?.username;
    const isRoundWinner = matchResult?.roundWinner === currentUsername;
    const isRoundLoser = matchResult?.roundLoser === currentUsername;
    
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h3" sx={{ mb: 3, color: isRoundWinner ? '#4caf50' : isRoundLoser ? '#f44336' : '#ff9800' }}>
          {isRoundWinner ? '🎉 Round Won!' : isRoundLoser ? '😔 Round Lost' : 'Round Complete'}
        </Typography>
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          Round {matchResult?.currentRound - 1} Results
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#4caf50' }}>
            Score: {matchResult?.player1Rounds} - {matchResult?.player2Rounds}
          </Typography>
          <Typography variant="body1" sx={{ color: '#ff9800' }}>
            Correct Answer: {matchResult?.correctAnswer}
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          {isRoundWinner ? 'You won this round!' : isRoundLoser ? 'You lost this round.' : 'Both players were incorrect.'}
        </Typography>
        
        <Typography variant="h6" sx={{ color: '#43cea2' }}>
          Next round starting in 2 seconds...
        </Typography>
      </Box>
    );
  };

  const renderGameEnd = () => {
    // Get current user's username from localStorage or match data
    const currentUsername = localStorage.getItem('username') || matchData?.players?.[0]?.username;
    const currentUserId = localStorage.getItem('userId');
    
    // Determine if current user won or lost
    const isWinner = matchResult?.winner === currentUsername;
    const isLoser = matchResult?.loser === currentUsername;
    const bothWrong = matchResult?.bothWrong;
    const bothCorrect = matchResult?.bothCorrect;
    const timeout = matchResult?.timeout;
    
    // Get current user's points
    const userPoints = currentUserId ? matchResult?.points?.[currentUserId] : 0;
    
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h3" sx={{ mb: 3, color: '#43cea2' }}>
          Game Over!
        </Typography>
        
        {timeout ? (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: '#ff9800' }}>
              ⏰ Time's Up!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#ff9800' }}>
              Correct Answer: {matchResult?.correctAnswer}
            </Typography>
            {matchResult?.winner ? (
              <>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Winner: {matchResult?.winner}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: isWinner ? '#4caf50' : '#f44336' }}>
                    {isWinner ? 'You won +100 points!' : 'You lost -100 points'}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#f44336' }}>
                  No one answered correctly - both players lost -100 points
                </Typography>
              </Box>
            )}
          </>
        ) : bothWrong ? (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: '#f44336' }}>
              Both players got it wrong!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#ff9800' }}>
              Correct Answer: {matchResult?.correctAnswer}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#f44336' }}>
                You lost -100 points
              </Typography>
            </Box>
          </>
        ) : bothCorrect ? (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: '#4caf50' }}>
              Both players got it right!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Winner: {matchResult?.winner} (faster time)
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#ff9800' }}>
              Correct Answer: {matchResult?.correctAnswer}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: isWinner ? '#4caf50' : '#f44336' }}>
                {isWinner ? 'You won +100 points!' : 'You lost -100 points'}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: isWinner ? '#4caf50' : '#f44336' }}>
              {isWinner ? '🎉 You Won!' : '😔 You Lost'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {isWinner ? `Winner: ${matchResult?.winner}` : `Winner: ${matchResult?.winner}`}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#ff9800' }}>
              Correct Answer: {matchResult?.correctAnswer}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: isWinner ? '#4caf50' : '#f44336' }}>
                {isWinner ? 'You won +100 points!' : 'You lost -100 points'}
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
  };

  if (gameState === 'countdown') {
    return renderCountdown();
  }

  if (gameState === 'playing') {
    return renderGame();
  }

  if (gameState === 'roundEnd' && matchResult) {
    return renderRoundEnd();
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