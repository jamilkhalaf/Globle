import React from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button, Stack, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Header from './Header';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExploreIcon from '@mui/icons-material/Explore';
import FlagIcon from '@mui/icons-material/Flag';
import GroupsIcon from '@mui/icons-material/Groups';
import MapIcon from '@mui/icons-material/Map';
import { Link as RouterLink } from 'react-router-dom';
import { HeaderAd } from './AdPlacements';
import SmartAdComponent from './SmartAdComponent';

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
          maxWidth: 1200, 
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
                About MapZap - Educational Geography Games
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.7,
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                Welcome to MapZap, a comprehensive collection of interactive geography games designed to make learning about the world engaging, educational, and entertaining. 
                Our platform offers a unique approach to geography education through gamification, helping students, educators, and geography enthusiasts explore our planet's diverse countries, cultures, and landscapes.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Whether you're a geography student preparing for exams, a teacher looking for interactive classroom tools, 
                a traveler planning your next adventure, or simply someone who enjoys challenging puzzles, our games provide 
                an entertaining way to explore the world's countries, capitals, flags, populations, and cultural landmarks.
              </Typography>
            </Box>
          </Paper>

          {/* Educational Value Section */}
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
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
                  textAlign: 'center'
                }}
              >
                Educational Benefits & Learning Outcomes
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#43cea2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon /> Cognitive Development
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><EmojiEventsIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText primary="Enhanced memory retention through interactive learning" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><PsychologyIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText primary="Improved spatial awareness and global perspective" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><ExploreIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText primary="Critical thinking skills through problem-solving challenges" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#43cea2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PublicIcon /> Geography Knowledge
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><FlagIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText primary="Comprehensive understanding of world flags and symbols" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><MapIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText primary="Detailed knowledge of countries, capitals, and borders" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><GroupsIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText primary="Population demographics and cultural awareness" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Game Collection Section */}
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
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
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #9c27b0 30%, #e91e63 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  letterSpacing: 2,
                  textAlign: 'center'
                }}
              >
                Our Comprehensive Game Collection
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7,
                  mb: 4,
                  textAlign: 'center'
                }}
              >
                Our platform features 11 unique geography games, each designed to target specific learning objectives 
                and provide different challenges for various skill levels. From interactive globe exploration to 
                flag recognition challenges, our games cover all aspects of geographical knowledge.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#9c27b0', mb: 2 }}>Interactive Globe Games</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        • <strong>MapZap:</strong> Explore countries on an interactive 3D globe with distance-based hints
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        • <strong>Worldle:</strong> Guess countries through progressive hints and clues
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        • <strong>Shaple:</strong> Identify countries by their unique geographical shapes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#9c27b0', mb: 2 }}>Knowledge Testing Games</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        • <strong>Capitals:</strong> Test your knowledge of world capitals with multiple choice questions
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        • <strong>Population:</strong> Learn about global demographics and population statistics
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        • <strong>Findle:</strong> Discover countries through name-based puzzles and word games
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#9c27b0', mb: 2 }}>Specialized Challenges</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        • <strong>Flagle:</strong> Master flag recognition with detailed flag identification challenges
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        • <strong>Hangman:</strong> Geography-themed word games with educational content
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        • <strong>US States:</strong> Focused learning on United States geography and culture
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Hi! I'm Jamil Khalaf, a passionate developer and educator who believes in making learning accessible and enjoyable for everyone. 
                This comprehensive geography games collection was built with modern web technologies including React and Material-UI, 
                designed to provide an engaging educational experience that helps users develop a deeper understanding of our world.
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7,
                  mb: 5,
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Each game is crafted with attention to educational value, user experience, and accessibility. 
                The platform serves students, teachers, geography enthusiasts, and anyone interested in learning about our planet's diverse cultures, 
                landscapes, and political geography. Our mission is to make geography education engaging, interactive, and accessible to learners worldwide.
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
                  Explore Games
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Fade>

      {/* Mobile Banner Ad - Fixed at bottom on mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '8px'
          }}
        >
          <SmartAdComponent
            adSlot="mobile-banner"
            adType="mobile"
            adFormat="horizontal"
            responsive={true}
            style={{
              width: '100%',
              minHeight: '50px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
        </Box>
      )}

      {/* Desktop Sidebar Ad - Fixed on right side */}
      {!isMobile && (
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
            adSlot="right-sidebar"
            adType="sidebar"
            adFormat="vertical"
            responsive={false}
            style={{
              width: '160px',
              minHeight: '600px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default About; 