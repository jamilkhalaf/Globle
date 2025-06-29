import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Stack, Fade, Avatar, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import countryInfo from './countryInfo';
import Header from './Header';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const getRandomCountry = (exclude) => {
  const keys = Object.keys(countryInfo).filter(k => k !== exclude);
  return keys[Math.floor(Math.random() * keys.length)];
};

const getPopulation = (name) => countryInfo[name]?.population || 0;

const getCountryCapital = (countryName) => {
  return countryInfo[countryName]?.capital || 'Unknown';
};

const Population = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]); // [left, right]
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [fadeKey, setFadeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for contact dialog
  const [contactOpen, setContactOpen] = useState(false);

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
  }, [generateNewCountries]);

  const handleGuess = useCallback((guessIdx) => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    const [left, right] = countries;
    const popLeft = getPopulation(left);
    const popRight = getPopulation(right);
    const correct = (guessIdx === 0 && popLeft >= popRight) || (guessIdx === 1 && popRight > popLeft);
    
    if (correct) {
      setScore(prev => prev + 1);
      setMessage('Correct! 🎉');
      
      // Faster transition for correct answers
      setTimeout(() => {
        setCountries(generateNewCountries());
        setMessage('Which country has a higher population?');
        setFadeKey(prev => prev + 1);
        setIsLoading(false);
      }, 600);
    } else {
      setScore(0);
      setMessage(`Wrong! The answer was ${popLeft > popRight ? left : right}.`);
      
      setTimeout(() => {
        setCountries(generateNewCountries());
        setMessage('Which country has a higher population?');
        setFadeKey(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
    }
  }, [countries, isLoading, generateNewCountries]);

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
        <Fade in key={fadeKey} timeout={400}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: { xs: 3, md: 4 }, 
              width: { xs: '100%', md: 480 }, 
              maxWidth: { xs: '100%', md: 480 },
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
    </Box>
  );
};

export default Population; 