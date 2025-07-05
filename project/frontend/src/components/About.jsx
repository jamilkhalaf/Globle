import React from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button, Grid, Card, CardContent } from '@mui/material';
import Header from './Header';
import PublicIcon from '@mui/icons-material/Public';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import FlagIcon from '@mui/icons-material/Flag';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import HelpIcon from '@mui/icons-material/Help';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MapIcon from '@mui/icons-material/Map';
import { Link as RouterLink } from 'react-router-dom';
import { HeaderAd, InContentAd, FooterAd } from './AdPlacements';
import SmartAdComponent from './SmartAdComponent';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const games = [
    {
      name: 'Globle',
      description: 'Guess the country by clicking on the world map.',
      icon: <PublicIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
      color: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)'
    },
    {
      name: 'Population',
      description: 'Test your knowledge of world populations.',
      icon: <GroupsIcon sx={{ fontSize: 32, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      name: 'Findle',
      description: 'Find the hidden country name in a grid.',
      icon: <SportsEsportsIcon sx={{ fontSize: 32, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      name: 'Flagle',
      description: 'Guess the country by its flag.',
      icon: <FlagIcon sx={{ fontSize: 32, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)'
    },
    {
      name: 'Worldle',
      description: 'Guess the country by its shape.',
      icon: <PublicIcon sx={{ fontSize: 32, color: '#43cea2' }} />,
      color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    },
    {
      name: 'Capitals',
      description: 'Test your knowledge of world capitals.',
      icon: <SchoolIcon sx={{ fontSize: 32, color: '#43cea2' }} />,
      color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    },
    {
      name: 'Hangman',
      description: 'Guess the country name letter by letter.',
      icon: <HelpIcon sx={{ fontSize: 32, color: '#f44336' }} />,
      color: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
    },
    {
      name: 'Shaple',
      description: 'Guess the country or US state by its shape!',
      icon: <CropSquareIcon sx={{ fontSize: 24, color: '#43cea2' }} />,
      color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
      path: '/shaple'
    },
    {
      name: 'US',
      description: 'Find the prompted US state by clicking on the map.',
      icon: <MapIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
      color: 'linear-gradient(135deg, #1976d2 0%, #43cea2 100%)',
      path: '/us'
    },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
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
          py: { xs: 1, md: 2 },
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Hero Section */}
          <Paper
            elevation={8}
            sx={{
              mb: 2,
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: 'rgba(30,34,44,0.98)',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              }}
            >
              <PublicIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'white' }} />
            </Box>
            
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                fontWeight: 900,
                color: 'transparent',
                background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: 1,
              }}
            >
              About the Games Collection
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              A collection of geography games designed to challenge your knowledge of countries, capitals, populations, flags, and more.
            </Typography>
          </Paper>

          {/* In-Content Ad */}
          <InContentAd />

          {/* Games Grid */}
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
              mb: 2,
              letterSpacing: 1,
            }}
          >
            Our Games
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2, flex: 1 }}>
            {games.map((game, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card
                  sx={{
                    background: 'rgba(30,34,44,0.98)',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px 0 rgba(31,38,135,0.5)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: game.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {game.icon}
                      </Box>
                      
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: 'white',
                          fontSize: '0.9rem',
                        }}
                      >
                        {game.name}
                      </Typography>
                      
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.4,
                          fontSize: '0.75rem',
                        }}
                      >
                        {game.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Developer Section */}
          <Paper
            elevation={8}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: 'rgba(30,34,44,0.98)',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 800,
                color: 'transparent',
                background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                letterSpacing: 1,
              }}
            >
              About the Developer
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: { xs: '0.85rem', md: '0.9rem' },
                lineHeight: 1.5,
                mb: 2,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Hi! I'm Jamil Khalaf, a passionate developer who loves creating educational and entertaining web applications. 
              This games collection was built with React and Material-UI, designed to make learning geography fun and engaging.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                component={RouterLink}
                to="/contact"
                startIcon={<EmailIcon />}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                }}
              >
                Get in Touch
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="small"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#00bcd4',
                    color: '#00bcd4',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default About; 