import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Stack, Fade, Avatar, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import countryInfo from './countryInfo';
import Header from './Header';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import NotificationModal from './NotificationModal';
import AdPopup from './AdPopup';
import SmartAdComponent from './SmartAdComponent';

const getRandomCountry = (exclude) => {
  const keys = Object.keys(countryInfo).filter(k => k !== exclude);
  return keys[Math.floor(Math.random() * keys.length)];
};

const getPopulation = (name) => countryInfo[name]?.population || 0;

const getCountryCapital = (countryName) => {
  return countryInfo[countryName]?.capital || 'Unknown';
};

// Helper function to format population numbers
const formatPopulation = (population) => {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(1)}B`;
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}K`;
  }
  return population.toString();
};

const Population = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]); // [left, right]
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [fadeKey, setFadeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [streak, setStreak] = useState(0); // Add streak tracking

  // Add state for contact dialog
  const [contactOpen, setContactOpen] = useState(false);

  // Add state for notification modal
  const [showIntro, setShowIntro] = useState(true);
  const [showAdPopup, setShowAdPopup] = useState(false);
  
  // Add state to track if ad popup has been shown and closed
  const [adPopupShown, setAdPopupShown] = useState(false);

  // Add effect to show ad popup after intro closes
  useEffect(() => {
    if (!showIntro && !showAdPopup && !adPopupShown) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowAdPopup(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showIntro, showAdPopup, adPopupShown]);

  const updateGameStats = async (finalScore, gameTime, currentStreak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://api.jamilweb.click/api/games/update-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'population',
          score: finalScore,
          gameTime,
          streak: currentStreak,
          attempts: 10 // Population has 10 questions
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress('population', finalScore, 10, currentStreak);
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const updateBadgeProgress = async (gameId, score, attempts, streak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://api.jamilweb.click/api/badges/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          score,
          attempts,
          streak
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.totalNewBadges > 0) {
          console.log(`🎉 Unlocked ${data.totalNewBadges} new badges!`);
        }
      }
    } catch (error) {
      console.error('Error updating badge progress:', error);
    }
  };

  // Memoize the random country generation to prevent unnecessary re-renders
  const generateNewCountries = useCallback(() => {
    const left = getRandomCountry();
    const right = getRandomCountry(left);
    return [left, right];
  }, []);

  useEffect(() => {
    // Initial two random countries
    setCountries(generateNewCountries());
    setMessage('Which country has a higher population?');
    setGameStartTime(Date.now());
  }, [generateNewCountries]);

  const handleGuess = useCallback((guessIdx) => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    const [left, right] = countries;
    const popLeft = getPopulation(left);
    const popRight = getPopulation(right);
    const correct = (guessIdx === 0 && popLeft >= popRight) || (guessIdx === 1 && popRight > popLeft);
    
    // Store the result for display
    const result = {
      leftCountry: left,
      rightCountry: right,
      leftPopulation: popLeft,
      rightPopulation: popRight,
      guessedIndex: guessIdx,
      correct: correct,
      winner: popLeft >= popRight ? left : right,
      winnerPopulation: Math.max(popLeft, popRight)
    };
    
    setLastGuessResult(result);
    setShowPopulationResult(true);
    
    if (correct) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setBestScore(prev => Math.max(prev, newScore));
      setStreak(newStreak);
      setMessage('Correct! 🎉');
      
      // Update stats after each correct answer
      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      updateGameStats(newScore, gameTime, newStreak);
    } else {
      setScore(0);
      setStreak(0); // Reset streak on wrong answer
      setMessage(`Wrong! The answer was ${popLeft > popRight ? left : right}.`);
      
      // Update stats when game ends (wrong answer)
      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      updateGameStats(0, gameTime, 0);
    }
    
    setIsLoading(false);
  }, [countries, isLoading, generateNewCountries, score, gameStartTime, bestScore, streak]);
      
  // Function to continue to next question
  const continueToNext = useCallback(() => {
    setShowPopulationResult(false);
        setCountries(generateNewCountries());
        setMessage('Which country has a higher population?');
        setFadeKey(prev => prev + 1);
        setGameStartTime(Date.now()); // Reset timer for new game
  }, [generateNewCountries]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && showPopulationResult) {
        continueToNext();
      }
    };

    if (showPopulationResult) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [showPopulationResult, continueToNext]);

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => {
            setShowIntro(false);
            // setShowAdPopup(true); // This will be handled by useEffect
          }}
          title="How to Play Population Showdown"
          description={"Choose which country has the higher population. Each correct answer increases your score. Try to get the highest streak!"}
          color="info"
        />
        {/* AdPopup is now rendered in the main game view */}
      </>
    );
  }

  if (countries.length < 2) return null;
  const [left, right] = countries;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      overflow: 'hidden', // Prevent scrolling issues on mobile
      position: 'relative'
    }}>
      <Header />
      <Toolbar />
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        px: { xs: 2, md: 4 },
        py: { xs: 1, md: 2 }
      }}>
        {/* Population Result Display */}
        {showPopulationResult && lastGuessResult && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(30,34,44,0.95) 0%, rgba(20,24,34,0.95) 100%)',
                borderRadius: 3,
                padding: { xs: 2, md: 3 },
                maxWidth: { xs: '90vw', sm: '400px', md: '500px' },
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: 'scale(0.9)',
                animation: 'popIn 0.4s ease-out forwards',
                overflow: 'hidden'
              }}
            >
              {/* Animated background elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: lastGuessResult.correct 
                    ? 'radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, transparent 70%)',
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: lastGuessResult.correct 
                    ? 'radial-gradient(circle, rgba(139,195,74,0.15) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(229,57,53,0.15) 0%, transparent 70%)',
                  animation: 'float 2.5s ease-in-out infinite reverse'
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Result indicator */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    animation: 'slideDown 0.5s ease-out'
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: lastGuessResult.correct 
                        ? 'linear-gradient(135deg, #4caf50, #66bb6a)'
                        : 'linear-gradient(135deg, #f44336, #ef5350)',
                      boxShadow: lastGuessResult.correct 
                        ? '0 8px 24px rgba(76, 175, 80, 0.4)'
                        : '0 8px 24px rgba(244, 67, 54, 0.4)',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '24px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {lastGuessResult.correct ? '✓' : '✗'}
                    </Typography>
                  </Box>
                </Box>

                {/* Population comparison */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    animation: 'slideUp 0.5s ease-out 0.2s both'
                  }}
                >
                  {/* Left country */}
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#90caf9',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        mb: 0.5
                      }}
                    >
                      {lastGuessResult.leftCountry}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: lastGuessResult.leftPopulation >= lastGuessResult.rightPopulation ? '#4caf50' : '#f44336',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.125rem', md: '1.25rem' }
                      }}
                    >
                      {formatPopulation(lastGuessResult.leftPopulation)}
                    </Typography>
                  </Box>

                  {/* VS indicator */}
                  <Box
                    sx={{
                      mx: 2,
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      background: 'rgba(255, 152, 0, 0.2)',
                      border: '1px solid rgba(255, 152, 0, 0.3)'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#ff9800',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}
                    >
                      VS
                    </Typography>
                  </Box>

                  {/* Right country */}
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#90caf9',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        mb: 0.5
                      }}
                    >
                      {lastGuessResult.rightCountry}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: lastGuessResult.rightPopulation >= lastGuessResult.leftPopulation ? '#4caf50' : '#f44336',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.125rem', md: '1.25rem' }
                      }}
                    >
                      {formatPopulation(lastGuessResult.rightPopulation)}
                    </Typography>
                  </Box>
                </Box>

                {/* Difference */}
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: '#b0c4de',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    fontStyle: 'italic',
                    mb: 2,
                    animation: 'fadeIn 0.5s ease-out 0.4s both'
                  }}
                >
                  Difference: {formatPopulation(Math.abs(lastGuessResult.leftPopulation - lastGuessResult.rightPopulation))}
                </Typography>

                {/* Continue button */}
                <Box sx={{ textAlign: 'center', animation: 'slideUp 0.5s ease-out 0.6s both' }}>
                  <Button
                    variant="contained"
                    onClick={continueToNext}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        
        <Fade in key={fadeKey} timeout={400}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: { xs: 1.5, md: 4 }, 
              borderRadius: { xs: 2, md: 4 }, 
              width: { xs: '100%', md: 400 }, 
              maxWidth: { xs: 300, sm: 340, md: 480 },
              textAlign: 'center', 
              background: 'rgba(30,34,44,0.95)', 
              color: 'white', 
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', 
              backdropFilter: 'blur(12px)', 
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background gradient overlay */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
              pointerEvents: 'none'
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  mb: { xs: 2, md: 3 }, 
                  fontWeight: 'bold', 
                  color: 'transparent', 
                  background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Population Showdown
              </Typography>
              
              <Typography 
                variant={isMobile ? "body1" : "subtitle1"} 
                sx={{ 
                  mb: { xs: 3, md: 4 }, 
                  color: '#b0c4de',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {message}
              </Typography>
              
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={isMobile ? 2 : 3} 
                justifyContent="center" 
                alignItems="center" 
                sx={{ mb: { xs: 3, md: 4 } }}
              >
                {[left, right].map((name, idx) => (
                  <Button 
                    key={`${name}-${fadeKey}`} 
                    onClick={() => handleGuess(idx)}
                    disabled={isLoading}
                    sx={{
                      p: 0,
                      borderRadius: { xs: 3, md: 4 },
                      width: { xs: '100%', md: 200 },
                      height: { xs: 120, md: 160 },
                      background: 'rgba(25,118,210,0.15)',
                      border: '2px solid rgba(25,118,210,0.3)',
                      '&:hover': { 
                        background: 'rgba(25,118,210,0.25)', 
                        transform: 'translateY(-2px)',
                        border: '2px solid rgba(25,118,210,0.5)',
                        boxShadow: '0 8px 25px rgba(25,118,210,0.3)'
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                        transition: 'transform 0.1s'
                      },
                      '&:disabled': {
                        opacity: 0.7,
                        transform: 'none'
                      },
                      boxShadow: '0 4px 20px rgba(25,118,210,0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Button background gradient */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      pointerEvents: 'none'
                    }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      p: { xs: 1.5, md: 2 }, 
                      width: '100%',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        sx={{ 
                          color: '#90caf9', 
                          fontWeight: 700, 
                          fontSize: { xs: 18, md: 20 }, 
                          mb: { xs: 0.5, md: 1 }, 
                          wordBreak: 'break-word',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "body2" : "body1"} 
                        sx={{ 
                          color: '#b0c4de', 
                          fontWeight: 500, 
                          fontSize: { xs: 14, md: 16 }, 
                          textAlign: 'center',
                          lineHeight: 1.2,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          fontStyle: 'italic'
                        }}
                      >
                        {getCountryCapital(name)}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
              
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)'
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    color: '#4caf50', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Score: {score}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Footer with ? button */}
      <Box sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 16 },
        left: 0,
        width: '100vw',
        display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
        justifyContent: 'center',
        zIndex: 2001
      }}>
        <Button
          variant="outlined"
          sx={{ 
            borderRadius: '50%', 
            minWidth: 0, 
            width: { xs: 48, md: 40 }, 
            height: { xs: 48, md: 40 }, 
            fontSize: { xs: 28, md: 24 }, 
            color: 'white', 
            borderColor: 'white', 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' } 
          }}
          onClick={() => setContactOpen(true)}
          aria-label="Contact Info"
        >
          ?
        </Button>
      </Box>
      <Dialog open={contactOpen} onClose={() => setContactOpen(false)}>
        <DialogTitle>Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For questions, contact: <br />
            <b>Jamil Khalaf</b><br />
            <a href="mailto:jamilkhalaf04@gmail.com">jamilkhalaf04@gmail.com</a>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Desktop Sidebar Ads - Fixed on left and right sides */}
      {!isMobile && (
        <>
          {/* Left Sidebar Ad */}
          <Box
            sx={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '160px',
              zIndex: 999
            }}
          >
            <SmartAdComponent
              adSlot="9833563267"
              adType="sidebar"
              adFormat="auto"
              responsive={true}
              style={{
                width: '160px',
                minHeight: '600px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>

          {/* Right Sidebar Ad */}
          <Box
            sx={{
              position: 'fixed',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '160px',
              zIndex: 999
            }}
          >
            <SmartAdComponent
              adSlot="5275872162"
              adType="sidebar"
              adFormat="auto"
              responsive={true}
              style={{
                width: '160px',
                minHeight: '600px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>
        </>
      )}

      {/* Ad Popup - Shows after notification modal closes */}
      <AdPopup
        open={showAdPopup}
        onClose={() => {
          setShowAdPopup(false);
          setAdPopupShown(true); // Mark ad as shown
        }}
        title="Support Us"
      />
    </Box>
  );
};

export default Population; 