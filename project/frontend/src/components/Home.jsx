import React from 'react';
import { Box, Typography, Button, Stack, Paper, Fade, useTheme, useMediaQuery } from '@mui/material';
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
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        // Optionally add a world map SVG or pattern as a background image
        // backgroundImage: `url('/world-map.svg')`,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
      }}
    >
      <Header />
      <Toolbar />
      {/* Animated globe or floating effect */}
      <Fade in timeout={1200}>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 20, md: 80 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
            opacity: 0.08,
            width: { xs: '90vw', md: '50vw' },
            height: { xs: '90vw', md: '50vw' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, #1976d2 0%, #232a3b 80%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
      </Fade>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          padding: { xs: 2, md: 3 },
          zIndex: 1,
          width: '100vw',
          position: 'absolute',
          top: 0,
          left: 0,
          pt: { xs: 4, md: 6 },
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={6}
            sx={{
              padding: { xs: 2, sm: 3, md: 6 },
              maxWidth: '900px',
              width: '100%',
              textAlign: 'center',
              background: 'rgba(30, 34, 44, 0.85)',
              borderRadius: { xs: 2, md: 4 },
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 300, sm: 400, md: 520 },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
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
                mb: 1,
                letterSpacing: { xs: 1, md: 2 },
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.75rem' },
                flexWrap: 'wrap'
              }}
            >
              <PublicIcon 
                fontSize="inherit" 
                sx={{ 
                  fontSize: { xs: 32, sm: 48, md: 64 }, 
                  color: '#1976d2', 
                  filter: 'drop-shadow(0 0 8px #1976d2aa)' 
                }} 
              />
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                <span>WORLD</span>
                <span>GAMES</span>
              </Box>
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ 
                color: '#b0c4de', 
                mb: { xs: 2, md: 4 }, 
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                px: { xs: 1, md: 0 }
              }}
            >
              Explore the world. Play. Learn. Compete.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, md: 4 },
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                mt: { xs: 1, md: 2 },
              }}
            >
              {/* Globle Card */}
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: 2, md: 3 },
                  background: 'rgba(25, 118, 210, 0.10)',
                  borderRadius: { xs: 2, md: 3 },
                  border: '1px solid rgba(25, 118, 210, 0.18)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.22)',
                    transform: 'scale(1.03) translateY(-2px)',
                    boxShadow: '0 4px 24px 0 #1976d2aa',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: { xs: '100%', md: 'auto' },
                  minWidth: { xs: 'auto', md: 200 },
                  maxWidth: { xs: '100%', md: 220 },
                }}
                onClick={() => navigate('/game')}
              >
                <SportsEsportsIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#1976d2', mb: 1 }} />
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  gutterBottom 
                  sx={{ 
                    color: '#90caf9', 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Globle
                </Typography>
                <Typography 
                  variant="body2" 
                  color="#b0c4de" 
                  paragraph
                  sx={{
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    textAlign: 'center',
                    mb: { xs: 1, md: 2 }
                  }}
                >
                  Guess the secret country! Each guess shows how close you are to the target country.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    mt: { xs: 1, md: 2 }, 
                    fontWeight: 700, 
                    letterSpacing: 1,
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    px: { xs: 2, md: 3 }
                  }}
                >
                  Play Globle
                </Button>
              </Paper>
              {/* Wordle Card */}
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: 2, md: 3 },
                  background: 'rgba(0, 188, 212, 0.10)',
                  borderRadius: { xs: 2, md: 3 },
                  border: '1px solid rgba(0, 188, 212, 0.18)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'rgba(0, 188, 212, 0.22)',
                    transform: 'scale(1.03) translateY(-2px)',
                    boxShadow: '0 4px 24px 0 #00bcd4aa',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: { xs: '100%', md: 'auto' },
                  minWidth: { xs: 'auto', md: 200 },
                  maxWidth: { xs: '100%', md: 220 },
                }}
                onClick={() => navigate('/wordle')}
              >
                <SpellcheckIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#00bcd4', mb: 1 }} />
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  gutterBottom 
                  sx={{ 
                    color: '#80deea', 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Wordle
                </Typography>
                <Typography 
                  variant="body2" 
                  color="#b0c4de" 
                  paragraph
                  sx={{
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    textAlign: 'center',
                    mb: { xs: 1, md: 2 }
                  }}
                >
                  Guess the hidden word in 6 tries! Each guess must be a valid 5-letter word.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    mt: { xs: 1, md: 2 }, 
                    fontWeight: 700, 
                    letterSpacing: 1,
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    px: { xs: 2, md: 3 }
                  }}
                >
                  Play Wordle
                </Button>
              </Paper>
              {/* Population Card */}
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: 2, md: 3 },
                  background: 'rgba(76, 175, 80, 0.10)',
                  borderRadius: { xs: 2, md: 3 },
                  border: '1px solid rgba(76, 175, 80, 0.18)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'rgba(76, 175, 80, 0.22)',
                    transform: 'scale(1.03) translateY(-2px)',
                    boxShadow: '0 4px 24px 0 #4caf50aa',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: { xs: '100%', md: 'auto' },
                  minWidth: { xs: 'auto', md: 200 },
                  maxWidth: { xs: '100%', md: 220 },
                }}
                onClick={() => navigate('/population')}
              >
                <GroupsIcon sx={{ fontSize: { xs: 32, md: 40 }, color: '#4caf50', mb: 1 }} />
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  gutterBottom 
                  sx={{ 
                    color: '#a5d6a7', 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Population
                </Typography>
                <Typography 
                  variant="body2" 
                  color="#b0c4de" 
                  paragraph
                  sx={{
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    textAlign: 'center',
                    mb: { xs: 1, md: 2 }
                  }}
                >
                  Which country has a higher population? Guess and keep your score going!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    mt: { xs: 1, md: 2 }, 
                    fontWeight: 700, 
                    letterSpacing: 1,
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    px: { xs: 2, md: 3 }
                  }}
                >
                  Play Population
                </Button>
              </Paper>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Home; 