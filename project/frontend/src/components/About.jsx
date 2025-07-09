import React from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button, Stack } from '@mui/material';
import Header from './Header';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';
import { HeaderAd } from './AdPlacements';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Toolbar />
      
      {/* Header Ad */}
      <HeaderAd />
      
      <Fade in timeout={800}>
        <Box sx={{ 
          flex: 1, 
          width: '100%', 
          maxWidth: 800, 
          px: { xs: 2, md: 4 }, 
          py: { xs: 4, md: 6 },
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          justifyContent: 'center'
        }}>
          {/* Hero Section */}
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
              textAlign: 'center',
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
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px',
                  boxShadow: '0 16px 64px rgba(25, 118, 210, 0.4)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 16px 64px rgba(25, 118, 210, 0.4)' },
                    '50%': { transform: 'scale(1.05)', boxShadow: '0 20px 80px rgba(25, 118, 210, 0.6)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 16px 64px rgba(25, 118, 210, 0.4)' },
                  }
                }}
              >
                <PublicIcon sx={{ fontSize: { xs: 50, md: 60 }, color: 'white' }} />
              </Box>
              
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  letterSpacing: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                About Globle
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.7,
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                Welcome to Globle, a collection of interactive geography games designed to make learning about the world fun and engaging. 
                From exploring countries on an interactive globe to testing your knowledge of flags, capitals, and populations, 
                our games offer a unique way to discover and learn about our planet.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  maxWidth: 600,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Whether you're a geography enthusiast, a student looking to improve your knowledge, 
                or simply someone who enjoys challenging puzzles, our games provide an entertaining 
                way to explore the world's countries, cultures, and landscapes.
              </Typography>
            </Box>
          </Paper>

          {/* Developer Section */}
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
              textAlign: 'center',
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
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  letterSpacing: 2,
                }}
              >
                About the Developer
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1.1rem', md: '1.2rem' },
                  lineHeight: 1.8,
                  mb: 5,
                  maxWidth: 700,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Hi! I'm Jamil Khalaf, a passionate developer who loves creating educational and entertaining web applications. 
                This geography games collection was built with React and Material-UI, designed to make learning about the world 
                accessible and enjoyable for everyone. Each game is crafted with attention to detail and user experience, 
                ensuring that learning geography becomes an engaging adventure rather than a chore.
              </Typography>
              
              <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/contact"
                  startIcon={<EmailIcon />}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 5,
                    py: 2,
                    background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                    }
                  }}
                >
                  Get in Touch
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 5,
                    py: 2,
                    borderColor: '#43cea2',
                    color: '#43cea2',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#185a9d',
                      color: '#185a9d',
                      backgroundColor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Back to Home
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default About; 