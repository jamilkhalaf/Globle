import React from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button, Grid, Card, CardContent, Divider, Container } from '@mui/material';
import Header from './Header';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link as RouterLink } from 'react-router-dom';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const contactMethods = [
    {
      title: 'Email',
      subtitle: 'Direct Communication',
      description: 'Send me a message for questions, feedback, or collaboration.',
      icon: <EmailIcon sx={{ fontSize: 24, color: 'white' }} />,
      action: 'Send Email',
      href: 'mailto:jamilkhalaf04@gmail.com',
      color: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
    },
    {
      title: 'Instagram',
      subtitle: 'Social Updates',
      description: 'Follow for behind-the-scenes content and updates.',
      icon: <InstagramIcon sx={{ fontSize: 24, color: 'white' }} />,
      action: 'Follow @jamillkhalaf',
      href: 'https://instagram.com/jamillkhalaf',
      color: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
    },
    {
      title: 'LinkedIn',
      subtitle: 'Professional Network',
      description: 'Connect professionally and stay updated with my work.',
      icon: <LinkedInIcon sx={{ fontSize: 24, color: 'white' }} />,
      action: 'Connect on LinkedIn',
      href: 'https://www.linkedin.com/in/jamil-khalaf-35b428247',
      color: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)',
    }
  ];

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
      <Header />
      <Toolbar />
      <Fade in timeout={800}>
        <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 2, md: 4 } }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                width: { xs: 70, md: 90 },
                height: { xs: 70, md: 90 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                  opacity: 0.3,
                  zIndex: -1,
                }
              }}
            >
              <EmailIcon sx={{ fontSize: { xs: 35, md: 45 }, color: 'white' }} />
            </Box>
            
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 900,
                color: 'transparent',
                background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                letterSpacing: 1,
              }}
            >
              Let's Connect
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: '#b0c4de',
                fontWeight: 500,
                mb: 1.5,
                lineHeight: 1.4,
              }}
            >
              Ready to collaborate or just want to say hello?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              I'm always excited to hear from fellow developers, geography enthusiasts, and anyone interested in creating amazing digital experiences.
            </Typography>
          </Box>

          {/* Contact Methods Grid */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              {contactMethods.map((method, index) => (
                <Box
                  key={index}
                  component="a"
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '16px',
                    background: method.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  {React.cloneElement(method.icon, { 
                    sx: { fontSize: 32, color: 'white' } 
                  })}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Footer Section */}
          <Paper
            elevation={8}
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 2,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
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
                mb: 1.5,
                letterSpacing: 1,
              }}
            >
              Let's Build Something Amazing Together
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '0.8rem', md: '0.85rem' },
                lineHeight: 1.4,
                mb: 2,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              I'm passionate about creating educational and entertaining web applications that make learning fun. 
              Whether you have an idea for a new game, want to collaborate on a project, or just want to discuss 
              technology and geography, I'd love to connect with you!
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                component={RouterLink}
                to="/about"
                sx={{
                  fontWeight: 700,
                  borderRadius: 1.5,
                  px: 2.5,
                  py: 0.8,
                  background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                Learn More About Me
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="small"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  borderRadius: 1.5,
                  px: 2.5,
                  py: 0.8,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#00bcd4',
                    color: '#00bcd4',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default Contact; 