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
              adSlot="9833563267"
              adType="sidebar"
              adFormat="auto"
              responsive={true}
              style={{
                width: '180px',
                minHeight: '600px',
                marginTop: '20px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>

          {/* Main Content - Simplified */}
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
                      startIcon={<ExploreIcon />}
          >
                      Explore Games
          </Button>
                  <Button
                      component={RouterLink}
                      to="/educational-content"
                    variant="outlined"
                    size="large"
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: 16, md: 20 },
                      borderRadius: 3,
                        px: { xs: 3, md: 5 },
                        py: { xs: 1.5, md: 2 },
                        borderWidth: 2,
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                      startIcon={<SchoolIcon />}
                    >
                      Learning Resources
                </Button>
              </Box>
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
              adSlot="5275872162"
              adType="sidebar"
              adFormat="auto"
              responsive={true}
              style={{
                width: '180px',
                minHeight: '600px',
                marginTop: '20px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>
        </Box>
      ) : (
        /* Mobile Layout - Simplified */
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          px: 2,
          py: 2
        }}>
          {/* Mobile Hero Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={8}
            sx={{
                px: 3,
                py: 4,
                borderRadius: 4,
              width: '100%',
              textAlign: 'center',
              background: 'rgba(30,34,44,0.98)',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
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
                    width: 80,
                    height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                    margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
                      '50%': { transform: 'scale(1.05)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)' },
                      '100%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
                    }
                  }}
            >
                  <PublicIcon sx={{ fontSize: 40, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
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
                    mb: 2,
                letterSpacing: 2,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    fontSize: '1.5rem',
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
                    lineHeight: 1.6
              }}
            >
                  Interactive learning experiences designed to enhance your geographical knowledge through engaging gameplay and educational content.
            </Typography>
            
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
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
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.6)',
                      }
                }}
                onClick={handleExploreClick}
                    startIcon={<ExploreIcon />}
              >
                    Explore Games
              </Button>
              <Button
                    component={RouterLink}
                    to="/educational-content"
                variant="outlined"
                size="large"
                sx={{
                      fontWeight: 600,
                      fontSize: 16,
                  borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      borderWidth: 2,
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                  }
                }}
                    startIcon={<SchoolIcon />}
                  >
                    Learning Resources
              </Button>
            </Box>
              </Box>
            </Paper>
          </Fade>

          {/* Mobile Square Ad */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <SmartAdComponent
              adSlot="3930499892"
              adType="square"
              adFormat="auto"
              responsive={true}
              style={{
                width: '300px',
                minHeight: '250px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>

          {/* Mobile Bottom Ad */}
          <Box sx={{ mt: 3 }}>
              <SmartAdComponent
              adSlot="mobile-bottom"
              adType="banner"
              adFormat="horizontal"
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
      
      <Footer />
    </Box>
  );
};

export default Home; 