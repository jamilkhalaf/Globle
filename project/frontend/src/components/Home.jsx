import React from 'react';
import { Box, Typography, Button, Stack, Paper, Fade, useTheme, useMediaQuery, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Toolbar from '@mui/material/Toolbar';
import PublicIcon from '@mui/icons-material/Public';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import GroupsIcon from '@mui/icons-material/Groups';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <Header />
      <Toolbar />
      
      {/* Background decorative element */}
      <Fade in timeout={1200}>
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 60, md: 80 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
            opacity: 0.05,
            width: { xs: '80vw', md: '40vw' },
            height: { xs: '80vw', md: '40vw' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, #1976d2 0%, #232a3b 80%, transparent 100%)',
            filter: 'blur(3px)',
            pointerEvents: 'none'
          }}
        />
      </Fade>

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          py: { xs: 1, md: 4 },
          px: { xs: 1, md: 4 },
          height: { xs: 'calc(100vh - 64px)', md: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'center', md: 'flex-start' },
          pt: { xs: 'calc(60px + 40vw)', md: 'calc(80px + 20vw)' }
        }}
      >
        <Fade in timeout={800}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, md: 4 },
            flexShrink: 0,
            mt: { xs: '-20vw', md: '-10vw' }
          }}>
            <Typography
              variant={isMobile ? "h5" : "h2"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'transparent',
                background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1, md: 2 },
                mb: { xs: 1, md: 2 },
                letterSpacing: { xs: 0.5, md: 2 },
                fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3.75rem' },
                flexWrap: 'wrap'
              }}
            >
              <PublicIcon 
                fontSize="inherit" 
                sx={{ 
                  fontSize: { xs: 20, sm: 48, md: 64 }, 
                  color: '#1976d2', 
                  filter: 'drop-shadow(0 0 8px #1976d2aa)' 
                }} 
              />
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                <span></span>
                <span>GAMES</span>
              </Box>
            </Typography>
            
            <Typography
              variant={isMobile ? "body2" : "h6"}
              sx={{ 
                color: '#b0c4de', 
                mb: { xs: 2, md: 4 }, 
                fontWeight: 400,
                fontSize: { xs: '0.875rem', sm: '1.25rem', md: '1.5rem' },
                px: { xs: 1, md: 0 },
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              Explore the world. Play. Learn. Compete.
            </Typography>
          </Box>
        </Fade>

        {/* Games Grid */}
        <Fade in timeout={1000}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(3, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: { xs: 1, md: 3 },
              maxWidth: '1200px',
              mx: 'auto',
              flex: 1,
              alignItems: 'center'
            }}
          >
            {/* Globle Card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 1.5, md: 3 },
                background: 'rgba(25, 118, 210, 0.12)',
                borderRadius: { xs: 2, md: 4 },
                border: '2px solid rgba(25, 118, 210, 0.25)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(25, 118, 210, 0.20)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.4)',
                  border: '2px solid rgba(25, 118, 210, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.1s'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                height: { xs: 160, md: 320 },
                justifyContent: 'space-between'
              }}
              onClick={() => navigate('/game')}
            >
              {/* Card background gradient */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.05) 100%)',
                pointerEvents: 'none'
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1, md: 2 } }}>
                <Box sx={{
                  width: { xs: 40, md: 80 },
                  height: { xs: 40, md: 80 },
                  borderRadius: '50%',
                  background: 'rgba(25, 118, 210, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: { xs: 0.5, md: 2 },
                  border: '2px solid rgba(25, 118, 210, 0.3)',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                }}>
                  <SportsEsportsIcon sx={{ 
                    fontSize: { xs: 20, md: 40 }, 
                    color: '#1976d2',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} />
                </Box>
                
                <Typography 
                  variant={isMobile ? "body1" : "h5"} 
                  sx={{ 
                    color: '#90caf9', 
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', md: '1.5rem' },
                    mb: { xs: 0.5, md: 1.5 },
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  Globle
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="#b0caf9" 
                  sx={{
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    lineHeight: 1.3,
                    mb: { xs: 0.5, md: 2.5 },
                    fontWeight: 400,
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  Guess the secret country! Each guess shows how close you are to the target country.
                </Typography>
                
                <Button
                  variant="contained"
                  size={isMobile ? "small" : "large"}
                  sx={{ 
                    fontWeight: 600, 
                    letterSpacing: 0.5,
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    px: { xs: 1.5, md: 4 },
                    py: { xs: 0.5, md: 1.5 },
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 3px 15px rgba(25, 118, 210, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                      boxShadow: '0 5px 20px rgba(25, 118, 210, 0.6)',
                    }
                  }}
                >
                  {isMobile ? 'Play' : 'Play Globle'}
                </Button>
              </Box>
            </Paper>

            {/* Wordle Card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 1.5, md: 3 },
                background: 'rgba(0, 188, 212, 0.12)',
                borderRadius: { xs: 2, md: 4 },
                border: '2px solid rgba(0, 188, 212, 0.25)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(0, 188, 212, 0.20)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(0, 188, 212, 0.4)',
                  border: '2px solid rgba(0, 188, 212, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.1s'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                height: { xs: 160, md: 320 },
                justifyContent: 'space-between'
              }}
              onClick={() => navigate('/wordle')}
            >
              {/* Card background gradient */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,188,212,0.1) 0%, rgba(25,118,210,0.05) 100%)',
                pointerEvents: 'none'
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1, md: 2 } }}>
                <Box sx={{
                  width: { xs: 40, md: 80 },
                  height: { xs: 40, md: 80 },
                  borderRadius: '50%',
                  background: 'rgba(0, 188, 212, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: { xs: 0.5, md: 2 },
                  border: '2px solid rgba(0, 188, 212, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 188, 212, 0.3)'
                }}>
                  <SpellcheckIcon sx={{ 
                    fontSize: { xs: 20, md: 40 }, 
                    color: '#00bcd4',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} />
                </Box>
                
                <Typography 
                  variant={isMobile ? "body1" : "h5"} 
                  sx={{ 
                    color: '#80deea', 
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', md: '1.5rem' },
                    mb: { xs: 0.5, md: 1.5 },
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  Wordle
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="#b0caf9" 
                  sx={{
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    lineHeight: 1.3,
                    mb: { xs: 0.5, md: 2.5 },
                    fontWeight: 400,
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  Guess the hidden word in 6 tries! Each guess must be a valid 5-letter word.
                </Typography>
                
                <Button
                  variant="contained"
                  size={isMobile ? "small" : "large"}
                  sx={{ 
                    fontWeight: 600, 
                    letterSpacing: 0.5,
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    px: { xs: 1.5, md: 4 },
                    py: { xs: 0.5, md: 1.5 },
                    background: 'linear-gradient(45deg, #00bcd4 30%, #4dd0e1 90%)',
                    boxShadow: '0 3px 15px rgba(0, 188, 212, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0097a7 30%, #00bcd4 90%)',
                      boxShadow: '0 5px 20px rgba(0, 188, 212, 0.6)',
                    }
                  }}
                >
                  {isMobile ? 'Play' : 'Play Wordle'}
                </Button>
              </Box>
            </Paper>

            {/* Population Card */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 1.5, md: 3 },
                background: 'rgba(76, 175, 80, 0.12)',
                borderRadius: { xs: 2, md: 4 },
                border: '2px solid rgba(76, 175, 80, 0.25)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(76, 175, 80, 0.20)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
                  border: '2px solid rgba(76, 175, 80, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.1s'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                height: { xs: 160, md: 320 },
                justifyContent: 'space-between'
              }}
              onClick={() => navigate('/population')}
            >
              {/* Card background gradient */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(0,188,212,0.05) 100%)',
                pointerEvents: 'none'
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1, md: 2 } }}>
                <Box sx={{
                  width: { xs: 40, md: 80 },
                  height: { xs: 40, md: 80 },
                  borderRadius: '50%',
                  background: 'rgba(76, 175, 80, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: { xs: 0.5, md: 2 },
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
                }}>
                  <GroupsIcon sx={{ 
                    fontSize: { xs: 20, md: 40 }, 
                    color: '#4caf50',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} />
                </Box>
                
                <Typography 
                  variant={isMobile ? "body1" : "h5"} 
                  sx={{ 
                    color: '#a5d6a7', 
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', md: '1.5rem' },
                    mb: { xs: 0.5, md: 1.5 },
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  Population
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="#b0caf9" 
                  sx={{
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    lineHeight: 1.3,
                    mb: { xs: 0.5, md: 2.5 },
                    fontWeight: 400,
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  Which country has a higher population? Guess and keep your score going!
                </Typography>
                
                <Button
                  variant="contained"
                  size={isMobile ? "small" : "large"}
                  sx={{ 
                    fontWeight: 600, 
                    letterSpacing: 0.5,
                    fontSize: { xs: '0.7rem', md: '1rem' },
                    px: { xs: 1.5, md: 4 },
                    py: { xs: 0.5, md: 1.5 },
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    boxShadow: '0 3px 15px rgba(76, 175, 80, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
                      boxShadow: '0 5px 20px rgba(76, 175, 80, 0.6)',
                    }
                  }}
                >
                  {isMobile ? 'Play' : 'Play Population'}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home; 