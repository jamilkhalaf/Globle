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
        background: isMobile 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <Header />
      <Toolbar />
      
      {isMobile ? (
        // Mobile Design
        <Box sx={{ 
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          py: 3
        }}>
          {/* Hero Section */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            mt: 2
          }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <PublicIcon sx={{ 
                fontSize: 40, 
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }} />
            </Box>
            
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'white',
                mb: 1,
                fontSize: '2rem',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: 1
              }}
            >
              GAMES
            </Typography>
            
            <Typography
              variant="body1"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: 500,
                fontSize: '1rem',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                lineHeight: 1.5
              }}
            >
              Explore the world. Play. Learn. Compete.
            </Typography>
          </Box>

          {/* Games List */}
          <Stack spacing={2} sx={{ flex: 1 }}>
            {/* Globle */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
              onClick={() => navigate('/game')}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <SportsEsportsIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    Globle
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Guess the secret country!
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Play
                </Button>
              </Box>
            </Paper>

            {/* Wordle */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
              onClick={() => navigate('/wordle')}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <SpellcheckIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    Wordle
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Guess the hidden word!
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Play
                </Button>
              </Box>
            </Paper>

            {/* Population */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
              onClick={() => navigate('/population')}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <GroupsIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    Population
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Which country has more people?
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Play
                </Button>
              </Box>
            </Paper>

            {/* Findle */}
            <Paper
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
              onClick={() => navigate('/name')}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <PublicIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    Findle
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                    Click the correct country!
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Play
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Box>
      ) : (
        // Desktop Design (keeping existing)
        <>
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
              py: { xs: 0.5, md: 4 },
              px: { xs: 1, md: 4 },
              height: { xs: 'calc(100vh - 64px)', md: 'auto' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: { xs: 'center', md: 'flex-start' },
              pt: { xs: 'calc(40px + 20vw)', md: 'calc(80px + 20vw)' }
            }}
          >
            <Fade in timeout={800}>
              <Box sx={{ 
                textAlign: 'center', 
                mb: { xs: 2, md: 4 },
                flexShrink: 0,
                mt: { xs: '-5vw', md: '-10vw' }
              }}>
                <Typography
                  variant={isMobile ? "h4" : "h2"}
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
                    mb: { xs: 1.5, md: 2 },
                    letterSpacing: { xs: 1, md: 2 },
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                    flexWrap: 'wrap',
                    textShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  <PublicIcon 
                    fontSize="inherit" 
                    sx={{ 
                      fontSize: { xs: 28, sm: 48, md: 64 }, 
                      color: '#1976d2', 
                      filter: 'drop-shadow(0 0 12px #1976d2aa)' 
                    }} 
                  />
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                    <span></span>
                    <span>GAMES</span>
                  </Box>
                </Typography>
                
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ 
                    color: '#b0c4de', 
                    mb: { xs: 3, md: 4 }, 
                    fontWeight: 500,
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    px: { xs: 2, md: 0 },
                    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                    lineHeight: 1.4
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
                    xs: 'repeat(2, 1fr)', 
                    md: 'repeat(4, 1fr)' 
                  },
                  rowGap: { xs: 0, md: 2 },
                  columnGap: { xs: 0, md: 2 },
                  maxWidth: { xs: '600px', md: '1400px' },
                  mx: 'auto',
                  flex: 1,
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                {/* Globle Card */}
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    background: 'rgba(25, 118, 210, 0.15)',
                    borderRadius: { xs: 3, md: 3 },
                    border: '2px solid rgba(25, 118, 210, 0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(25, 118, 210, 0.25)',
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 40px rgba(25, 118, 210, 0.5)',
                      border: '2px solid rgba(25, 118, 210, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(-3px)',
                      transition: 'transform 0.1s'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    height: { xs: 130, md: 280 },
                    justifyContent: 'space-between',
                    mb: { xs: 1, md: 0 },
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)'
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
                    background: 'linear-gradient(135deg, rgba(25,118,210,0.15) 0%, rgba(0,188,212,0.08) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1.5, md: 1.5 } }}>
                    <Box sx={{
                      width: { xs: 40, md: 60 },
                      height: { xs: 40, md: 60 },
                      borderRadius: '50%',
                      background: 'rgba(25, 118, 210, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, md: 1 },
                      border: '2px solid rgba(25, 118, 210, 0.4)',
                      boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)'
                    }}>
                      <SportsEsportsIcon sx={{ 
                        fontSize: { xs: 20, md: 30 }, 
                        color: '#1976d2',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }} />
                    </Box>
                    
                    <Typography 
                      variant={isMobile ? "h6" : "h6"} 
                      sx={{ 
                        color: '#90caf9', 
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        mb: { xs: 0.5, md: 1 },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      Globle
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="#b0caf9" 
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.8rem' },
                        lineHeight: 1.3,
                        mb: { xs: 0.5, md: 1.5 },
                        fontWeight: 400,
                        display: { xs: 'none', md: 'block' }
                      }}
                    >
                      Guess the secret country! Each guess shows how close you are to the target country.
                    </Typography>
                    
                    <Button
                      variant="contained"
                      size={isMobile ? "medium" : "medium"}
                      sx={{ 
                        fontWeight: 600, 
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                        px: { xs: 2, md: 2 },
                        py: { xs: 1, md: 1 },
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          boxShadow: '0 6px 25px rgba(25, 118, 210, 0.6)',
                        }
                      }}
                    >
                      {isMobile ? 'Play' : 'Play Globle'}
                    </Button>
                  </Box>
                </Paper>

                {/* Wordle Card */}
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    background: 'rgba(0, 188, 212, 0.15)',
                    borderRadius: { xs: 3, md: 3 },
                    border: '2px solid rgba(0, 188, 212, 0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(0, 188, 212, 0.25)',
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 40px rgba(0, 188, 212, 0.5)',
                      border: '2px solid rgba(0, 188, 212, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(-3px)',
                      transition: 'transform 0.1s'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    height: { xs: 130, md: 280 },
                    justifyContent: 'space-between',
                    mb: { xs: 1, md: 0 },
                    boxShadow: '0 4px 20px rgba(0, 188, 212, 0.2)'
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
                    background: 'linear-gradient(135deg, rgba(0,188,212,0.15) 0%, rgba(25,118,210,0.08) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1.5, md: 1.5 } }}>
                    <Box sx={{
                      width: { xs: 40, md: 60 },
                      height: { xs: 40, md: 60 },
                      borderRadius: '50%',
                      background: 'rgba(0, 188, 212, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, md: 1 },
                      border: '2px solid rgba(0, 188, 212, 0.4)',
                      boxShadow: '0 6px 25px rgba(0, 188, 212, 0.4)'
                    }}>
                      <SpellcheckIcon sx={{ 
                        fontSize: { xs: 20, md: 30 }, 
                        color: '#00bcd4',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }} />
                    </Box>
                    
                    <Typography 
                      variant={isMobile ? "h6" : "h6"} 
                      sx={{ 
                        color: '#80deea', 
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        mb: { xs: 0.5, md: 1 },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      Wordle
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="#b0caf9" 
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.8rem' },
                        lineHeight: 1.3,
                        mb: { xs: 0.5, md: 1.5 },
                        fontWeight: 400,
                        display: { xs: 'none', md: 'block' }
                      }}
                    >
                      Guess the hidden word in 6 tries! Each guess must be a valid 5-letter word.
                    </Typography>
                    
                    <Button
                      variant="contained"
                      size={isMobile ? "medium" : "medium"}
                      sx={{ 
                        fontWeight: 600, 
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                        px: { xs: 2, md: 2 },
                        py: { xs: 1, md: 1 },
                        background: 'linear-gradient(45deg, #00bcd4 30%, #4dd0e1 90%)',
                        boxShadow: '0 4px 20px rgba(0, 188, 212, 0.4)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #0097a7 30%, #00bcd4 90%)',
                          boxShadow: '0 6px 25px rgba(0, 188, 212, 0.6)',
                        }
                      }}
                    >
                      {isMobile ? 'Play' : 'Play Wordle'}
                    </Button>
                  </Box>
                </Paper>

                {/* Population Card */}
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    background: 'rgba(76, 175, 80, 0.15)',
                    borderRadius: { xs: 3, md: 3 },
                    border: '2px solid rgba(76, 175, 80, 0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(76, 175, 80, 0.25)',
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 40px rgba(76, 175, 80, 0.5)',
                      border: '2px solid rgba(76, 175, 80, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(-3px)',
                      transition: 'transform 0.1s'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    height: { xs: 130, md: 280 },
                    justifyContent: 'space-between',
                    mb: { xs: 1, md: 0 },
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
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
                    background: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(0,188,212,0.08) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1.5, md: 1.5 } }}>
                    <Box sx={{
                      width: { xs: 40, md: 60 },
                      height: { xs: 40, md: 60 },
                      borderRadius: '50%',
                      background: 'rgba(76, 175, 80, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, md: 1 },
                      border: '2px solid rgba(76, 175, 80, 0.4)',
                      boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)'
                    }}>
                      <GroupsIcon sx={{ 
                        fontSize: { xs: 20, md: 30 }, 
                        color: '#4caf50',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }} />
                    </Box>
                    
                    <Typography 
                      variant={isMobile ? "h6" : "h6"} 
                      sx={{ 
                        color: '#a5d6a7', 
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        mb: { xs: 0.5, md: 1 },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      Population
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="#b0caf9" 
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.8rem' },
                        lineHeight: 1.3,
                        mb: { xs: 0.5, md: 1.5 },
                        fontWeight: 400,
                        display: { xs: 'none', md: 'block' }
                      }}
                    >
                      Which country has a higher population? Guess and keep your score going!
                    </Typography>
                    
                    <Button
                      variant="contained"
                      size={isMobile ? "medium" : "medium"}
                      sx={{ 
                        fontWeight: 600, 
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                        px: { xs: 2, md: 2 },
                        py: { xs: 1, md: 1 },
                        background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
                          boxShadow: '0 6px 25px rgba(76, 175, 80, 0.6)',
                        }
                      }}
                    >
                      {isMobile ? 'Play' : 'Play Population'}
                    </Button>
                  </Box>
                </Paper>

                {/* Name Card */}
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    background: 'rgba(156, 39, 176, 0.15)',
                    borderRadius: { xs: 3, md: 3 },
                    border: '2px solid rgba(156, 39, 176, 0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(156, 39, 176, 0.25)',
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 40px rgba(156, 39, 176, 0.5)',
                      border: '2px solid rgba(156, 39, 176, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(-3px)',
                      transition: 'transform 0.1s'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    height: { xs: 130, md: 280 },
                    justifyContent: 'space-between',
                    mb: { xs: 1, md: 0 },
                    boxShadow: '0 4px 20px rgba(156, 39, 176, 0.2)'
                  }}
                  onClick={() => navigate('/name')}
                >
                  {/* Card background gradient */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(156,39,176,0.15) 0%, rgba(76,175,80,0.08) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 1.5, md: 1.5 } }}>
                    <Box sx={{
                      width: { xs: 40, md: 60 },
                      height: { xs: 40, md: 60 },
                      borderRadius: '50%',
                      background: 'rgba(156, 39, 176, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: { xs: 1, md: 1 },
                      border: '2px solid rgba(156, 39, 176, 0.4)',
                      boxShadow: '0 6px 25px rgba(156, 39, 176, 0.4)'
                    }}>
                      <PublicIcon sx={{ 
                        fontSize: { xs: 20, md: 30 }, 
                        color: '#9c27b0',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }} />
                    </Box>
                    
                    <Typography 
                      variant={isMobile ? "h6" : "h6"} 
                      sx={{ 
                        color: '#ce93d8', 
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        mb: { xs: 0.5, md: 1 },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      Findle
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="#b0caf9" 
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.8rem' },
                        lineHeight: 1.3,
                        mb: { xs: 0.5, md: 1.5 },
                        fontWeight: 400,
                        display: { xs: 'none', md: 'block' }
                      }}
                    >
                      Click on the correct country location on the map to earn points!
                    </Typography>
                    
                    <Button
                      variant="contained"
                      size={isMobile ? "medium" : "medium"}
                      sx={{ 
                        fontWeight: 600, 
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                        px: { xs: 2, md: 2 },
                        py: { xs: 1, md: 1 },
                        background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                        boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
                          boxShadow: '0 6px 25px rgba(156, 39, 176, 0.6)',
                        }
                      }}
                    >
                      {isMobile ? 'Play' : 'Play Findle'}
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Fade>
          </Container>
        </>
      )}
    </Box>
  );
};

export default Home; 