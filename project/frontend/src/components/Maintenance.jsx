import React from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Container } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmailIcon from '@mui/icons-material/Email';

const Maintenance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    >
      <Fade in timeout={1000}>
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 20px 60px 0 rgba(31,38,135,0.5)',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                left: -50,
                right: -50,
                bottom: -50,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                animation: 'shine 3s ease-in-out infinite',
              },
              '@keyframes shine': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: { xs: 80, md: 120 },
                height: { xs: 80, md: 120 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 12px 40px rgba(255, 152, 0, 0.3)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            >
              <ConstructionIcon sx={{ fontSize: { xs: 40, md: 60 }, color: 'white' }} />
            </Box>

            {/* Title */}
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 900,
                color: 'transparent',
                background: 'linear-gradient(90deg, #ff9800 30%, #ff5e62 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                letterSpacing: 1,
              }}
            >
              Under Maintenance
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                color: '#b0c4de',
                fontWeight: 500,
                mb: 3,
                lineHeight: 1.4,
              }}
            >
              We're working hard to improve your experience
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Our team is currently performing essential updates and improvements to bring you an even better gaming experience. 
              We apologize for any inconvenience and appreciate your patience.
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '75%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff9800 0%, #ff5e62 100%)',
                    borderRadius: 4,
                    animation: 'progress 2s ease-in-out infinite',
                    '@keyframes progress': {
                      '0%, 100%': { width: '75%' },
                      '50%': { width: '85%' },
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mt: 1,
                  display: 'block',
                }}
              >
                Estimated completion: 75%
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mb: 2,
                }}
              >
                Need to get in touch? Contact us at:
              </Typography>
              <Box
                component="a"
                href="mailto:jamilkhalaf04@gmail.com"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#ff9800',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#ff5e62',
                  },
                }}
              >
                <EmailIcon sx={{ fontSize: 20 }} />
                jamilkhalaf04@gmail.com
              </Box>
            </Box>

            {/* Footer */}
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                mt: 3,
                display: 'block',
                fontSize: '0.8rem',
              }}
            >
              Thank you for your patience and understanding
            </Typography>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default Maintenance; 