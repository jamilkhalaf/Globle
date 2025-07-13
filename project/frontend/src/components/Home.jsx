import React, { useRef } from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import FlagIcon from '@mui/icons-material/Flag';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';
import ExploreIcon from '@mui/icons-material/Explore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link as RouterLink } from 'react-router-dom';
import SmartAdComponent from './SmartAdComponent';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const headerRef = useRef(null);

  const handleExploreClick = () => {
    // Trigger the header's games menu
    if (headerRef.current && headerRef.current.openGamesMenu) {
      headerRef.current.openGamesMenu();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header ref={headerRef} />
      <Toolbar />
      
      {/* Desktop Layout with Improved Ad Placement */}
      {!isMobile ? (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: '1600px',
            mx: 'auto',
            px: { xs: 2, md: 4 },
            gap: { xs: 2, md: 4 },
            mt: 2,
            mb: 4,
            flex: 1,
            minHeight: 'calc(100vh - 120px)'
          }}
        >
          {/* Left Sidebar Ad - Improved Positioning */}
          <Box
            sx={{
              width: '180px',
              flexShrink: 0,
              position: 'sticky',
              top: 120,
              height: 'fit-content',
              display: { xs: 'none', lg: 'block' }
            }}
          >
            <SmartAdComponent
              adSlot="left-sidebar"
              adType="sidebar"
              adFormat="vertical"
              responsive={false}
              style={{
                width: '180px',
                minHeight: '600px',
                marginTop: '20px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>

          {/* Main Content - Improved Spacing */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            maxWidth: '1000px',
            mx: 'auto'
          }}>
            {/* Hero Section */}
            <Fade in timeout={800}>
              <Paper
                elevation={8}
                sx={{
                  mt: { xs: 1, md: 4 },
                  px: { xs: 3, md: 6 },
                  py: { xs: 4, md: 8 },
                  borderRadius: 6,
                  width: '100%',
                  textAlign: 'center',
                  background: 'rgba(30,34,44,0.98)',
                  color: 'white',
                  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: { xs: 'auto', md: '70vh' },
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
                    zIndex: 0,
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  <Box
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: { xs: '0 auto 24px', md: '0 auto 40px' },
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
                        '50%': { transform: 'scale(1.05)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)' },
                        '100%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
                      }
                    }}
                  >
                    <PublicIcon sx={{ fontSize: { xs: 40, md: 60 }, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
                  </Box>
                  <Typography
                    variant={isMobile ? 'h4' : 'h2'}
                    component="h1"
                    sx={{
                      fontWeight: 900,
                      color: 'transparent',
                      background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: { xs: 2, md: 3 },
                      letterSpacing: 2,
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                    }}
                  >
                    Educational Geography Games
                  </Typography>
                  <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    sx={{
                      color: '#b0c4de',
                      fontWeight: 600,
                      mb: 6,
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      maxWidth: 700,
                      mx: 'auto',
                      lineHeight: 1.6
                    }}
                  >
                    Interactive learning experiences designed to enhance your geographical knowledge through engaging gameplay and educational content.
                  </Typography>
                        
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 18, md: 22 },
                        borderRadius: 3,
                        px: { xs: 4, md: 6 },
                        py: { xs: 1.5, md: 2 },
                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                        background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                        textTransform: 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.6)',
                        }
                      }}
                      onClick={handleExploreClick}
                      id="explore-btn"
                    >
                      Explore Games
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      component={RouterLink}
                      to="/educational-content"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 18, md: 22 },
                        borderRadius: 3,
                        px: { xs: 4, md: 6 },
                        py: { xs: 1.5, md: 2 },
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        textTransform: 'none',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#00bcd4',
                          color: '#00bcd4',
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Learning Resources
                    </Button>
                  </Box>

                  {/* Contact Section - Improved Design */}
                  <Box sx={{ 
                    mt: 4, 
                    width: '100%', 
                    maxWidth: 500, 
                    mx: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600, mb: 1 }}>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                      <Button
                        href="https://instagram.com/jamillkhalaf"
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" style={{ width: 18, height: 18, filter: 'invert(0.6)' }} />}
                        sx={{ 
                          color: '#fff', 
                          fontWeight: 600, 
                          textTransform: 'none', 
                          fontSize: 14, 
                          background: 'linear-gradient(90deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)', 
                          borderRadius: 2, 
                          px: 2, 
                          py: 1, 
                          minWidth: 0, 
                          boxShadow: '0 2px 8px rgba(131,58,180,0.10)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(131,58,180,0.2)',
                          }
                        }}
                      >
                        @jamillkhalaf
                      </Button>
                      <Button
                        href="mailto:jamilkhalaf04@gmail.com"
                        startIcon={<EmailIcon sx={{ color: '#d93025', background: '#fff', borderRadius: '3px', fontSize: 20, p: '2px' }} />}
                        sx={{ 
                          color: '#222', 
                          fontWeight: 600, 
                          textTransform: 'none', 
                          fontSize: 14, 
                          background: '#fff', 
                          borderRadius: 2, 
                          px: 2, 
                          py: 1, 
                          minWidth: 0, 
                          boxShadow: '0 2px 8px rgba(66,133,244,0.10)', 
                          '&:hover': { 
                            background: '#f5f5f5',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(66,133,244,0.2)',
                          } 
                        }}
                      >
                        jamilkhalaf04@gmail.com
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Fade>

            {/* Educational Value Section */}
            <Fade in timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  px: { xs: 3, md: 6 },
                  py: { xs: 4, md: 6 },
                  borderRadius: 4,
                  background: 'rgba(30,34,44,0.95)',
                  color: 'white',
                  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(67,206,162,0.1) 0%, rgba(24,90,157,0.1) 100%)',
                    zIndex: 0,
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: 'transparent',
                      background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 4,
                      textAlign: 'center',
                      letterSpacing: 1,
                    }}
                  >
                    Why Choose Our Educational Games?
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(67, 206, 162, 0.2)',
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <SchoolIcon sx={{ color: '#43cea2', mr: 1 }} />
                            <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600 }}>
                              Educational Excellence
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            Each game is designed with educational principles in mind, helping students develop critical thinking, spatial awareness, and global understanding.
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip label="Interactive Learning" size="small" sx={{ bgcolor: 'rgba(67,206,162,0.2)', color: 'white' }} />
                            <Chip label="Progressive Difficulty" size="small" sx={{ bgcolor: 'rgba(67,206,162,0.2)', color: 'white' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(67, 206, 162, 0.2)',
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EmojiEventsIcon sx={{ color: '#43cea2', mr: 1 }} />
                            <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600 }}>
                              Engaging Gameplay
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            Gamification elements like scoring, achievements, and competitive features make learning geography fun and motivating.
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip label="Achievement System" size="small" sx={{ bgcolor: 'rgba(67,206,162,0.2)', color: 'white' }} />
                            <Chip label="Competitive Play" size="small" sx={{ bgcolor: 'rgba(67,206,162,0.2)', color: 'white' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(67, 206, 162, 0.2)',
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ExploreIcon sx={{ color: '#43cea2', mr: 1 }} />
                            <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600 }}>
                              Comprehensive Coverage
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            From interactive globes to flag recognition, our games cover all aspects of geographical knowledge and cultural awareness.
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip label="11 Unique Games" size="small" sx={{ bgcolor: 'rgba(67,206,162,0.2)', color: 'white' }} />
                            <Chip label="Global Focus" size="small" sx={{ bgcolor: 'rgba(67,206,162,0.2)', color: 'white' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Fade>

            {/* Game Categories Section */}
            <Fade in timeout={1200}>
              <Paper
                elevation={8}
                sx={{
                  px: { xs: 3, md: 6 },
                  py: { xs: 4, md: 6 },
                  borderRadius: 4,
                  background: 'rgba(30,34,44,0.95)',
                  color: 'white',
                  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(233,30,99,0.1) 100%)',
                    zIndex: 0,
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: 'transparent',
                      background: 'linear-gradient(90deg, #9c27b0 30%, #e91e63 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 4,
                      textAlign: 'center',
                      letterSpacing: 1,
                    }}
                  >
                    Game Categories & Learning Objectives
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(156, 39, 176, 0.2)',
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PublicIcon sx={{ color: '#9c27b0', mr: 1 }} />
                            <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                              Interactive Globe Games
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            Explore countries on interactive 3D globes with distance-based hints and progressive learning challenges.
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip label="Globle" size="small" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                            <Chip label="Worldle" size="small" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                            <Chip label="Shaple" size="small" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(156, 39, 176, 0.2)',
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FlagIcon sx={{ color: '#9c27b0', mr: 1 }} />
                            <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                              Knowledge Testing Games
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                            Test your knowledge of world capitals, flags, populations, and cultural geography through engaging quizzes.
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip label="Capitals" size="small" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                            <Chip label="Flagle" size="small" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                            <Chip label="Population" size="small" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Fade>
          </Box>

          {/* Right Sidebar Ad - Improved Positioning */}
          <Box
            sx={{
              width: '180px',
              flexShrink: 0,
              position: 'sticky',
              top: 120,
              height: 'fit-content',
              display: { xs: 'none', lg: 'block' }
            }}
          >
            <SmartAdComponent
              adSlot="right-sidebar"
              adType="sidebar"
              adFormat="vertical"
              responsive={false}
              style={{
                width: '180px',
                minHeight: '600px',
                marginTop: '20px',
                borderRadius: '8px',
                marginLeft: '60px',
                overflow: 'hidden'
              }}
            />
          </Box>
        </Box>
      ) : (
        /* Mobile Layout - Improved Design */
        <Box sx={{ 
          width: '100%', 
          px: 2, 
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          flex: 1
        }}>
          <Fade in timeout={800}>
            <Paper
              elevation={8}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 4, sm: 6 },
                borderRadius: 4,
                width: '100%',
                textAlign: 'center',
                background: 'rgba(30,34,44,0.98)',
                color: 'white',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 'auto',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
                  zIndex: 0,
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <Box
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: { xs: '0 auto 24px', sm: '0 auto 32px' },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
                      '50%': { transform: 'scale(1.05)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)' },
                      '100%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
                    }
                  }}
                >
                  <PublicIcon sx={{ fontSize: { xs: 40, sm: 50 }, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 900,
                    color: 'transparent',
                    background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: { xs: 2, sm: 3 },
                    letterSpacing: 2,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  Educational Geography Games
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#b0c4de',
                    fontWeight: 600,
                    mb: 4,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    lineHeight: 1.5
                  }}
                >
                  Interactive learning experiences designed to enhance your geographical knowledge through engaging gameplay and educational content.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                      background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                      textTransform: 'none',
                      width: '100%',
                      maxWidth: 300,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.6)',
                      }
                    }}
                    onClick={handleExploreClick}
                    id="explore-btn"
                  >
                    Explore Games
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to="/educational-content"
                    sx={{
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      textTransform: 'none',
                      borderWidth: 2,
                      width: '100%',
                      maxWidth: 300,
                      '&:hover': {
                        borderColor: '#00bcd4',
                        color: '#00bcd4',
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Learning Resources
                  </Button>
                </Box>

                {/* Mobile Contact Section */}
                <Box sx={{ 
                  mt: 3, 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="subtitle1" sx={{ color: '#43cea2', fontWeight: 600, mb: 1 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', alignItems: 'center' }}>
                    <Button
                      href="https://instagram.com/jamillkhalaf"
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" style={{ width: 16, height: 16, filter: 'invert(0.6)' }} />}
                      sx={{ 
                        color: '#fff', 
                        fontWeight: 600, 
                        textTransform: 'none', 
                        fontSize: 14, 
                        background: 'linear-gradient(90deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)', 
                        borderRadius: 2, 
                        px: 2, 
                        py: 1, 
                        width: '100%',
                        maxWidth: 250,
                        boxShadow: '0 2px 8px rgba(131,58,180,0.10)',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(131,58,180,0.2)',
                        }
                      }}
                    >
                      @jamillkhalaf
                    </Button>
                    <Button
                      href="mailto:jamilkhalaf04@gmail.com"
                      startIcon={<EmailIcon sx={{ color: '#d93025', background: '#fff', borderRadius: '3px', fontSize: 18, p: '2px' }} />}
                      sx={{ 
                        color: '#222', 
                        fontWeight: 600, 
                        textTransform: 'none', 
                        fontSize: 14, 
                        background: '#fff', 
                        borderRadius: 2, 
                        px: 2, 
                        py: 1, 
                        width: '100%',
                        maxWidth: 250,
                        boxShadow: '0 2px 8px rgba(66,133,244,0.10)', 
                        '&:hover': { 
                          background: '#f5f5f5',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(66,133,244,0.2)',
                        } 
                      }}
                    >
                      jamilkhalaf04@gmail.com
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Fade>

          {/* Mobile Ad - Better Positioning */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <SmartAdComponent
              adSlot="mobile-home-bottom"
              adType="mobile"
              adFormat="auto"
              responsive={true}
              style={{
                width: '100%',
                minHeight: '100px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>
        </Box>
      )}
      
      {/* Footer - Now properly positioned */}
      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Home; 