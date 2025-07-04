import React, { useRef } from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button } from '@mui/material';
import Header from './Header';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';

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
        alignItems: 'center',
      }}
    >
      <Header ref={headerRef} />
      <Toolbar />
      <Fade in timeout={800}>
        <Paper
          elevation={8}
          sx={{
            mt: { xs: 1, md: 6 },
            mb: { xs: 1, md: 3 },
            px: { xs: 1, md: 6 },
            py: { xs: 2, md: 6 },
            borderRadius: 6,
            maxWidth: { xs: 340, sm: 400, md: 600 },
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
          }}
        >
          <Box
            sx={{
              width: { xs: 64, md: 100 },
              height: { xs: 64, md: 100 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: { xs: '0 auto 18px', md: '0 auto 32px' },
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            <PublicIcon sx={{ fontSize: { xs: 36, md: 56 }, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
          </Box>
          <Typography
            variant={isMobile ? 'h5' : 'h2'}
            component="h1"
            sx={{
              fontWeight: 900,
              color: 'transparent',
              background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 1, md: 2 },
              letterSpacing: 2,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              fontSize: { xs: '1.3rem', sm: '1.7rem', md: '2.5rem' },
            }}
          >
            Welcome to my games collection
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              color: '#b0c4de',
              fontWeight: 600,
              mb: 4,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            Explore the world. Play. Learn. Compete.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                fontWeight: 700,
                fontSize: 22,
                borderRadius: 3,
                px: 5,
                py: 2,
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                textTransform: 'none',
              }}
              onClick={handleExploreClick}
              id="explore-btn"
            >
              Explore
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/contact"
              sx={{
                fontWeight: 700,
                fontSize: 22,
                borderRadius: 3,
                px: 5,
                py: 2,
                borderColor: '#1976d2',
                color: '#1976d2',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#00bcd4',
                  color: '#00bcd4',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                }
              }}
            >
              Contact
            </Button>
          </Box>

          {/* Contact Section */}
          {!isMobile && (
            <Box sx={{ mt: 2, width: '100%', maxWidth: 420, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 0, px: 0 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0c4de', fontWeight: 600, mb: 0.5, fontSize: 16 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                <Button
                  href="https://instagram.com/jamillkhalaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" style={{ width: 18, height: 18, filter: 'invert(0.6)' }} />}
                  sx={{ color: '#fff', fontWeight: 600, textTransform: 'none', fontSize: 16, background: 'linear-gradient(90deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)', borderRadius: 2, px: 2, py: 1, minWidth: 0, boxShadow: '0 2px 8px rgba(131,58,180,0.10)' }}
                >
                  @jamillkhalaf
                </Button>
                <Button
                  href="mailto:jamilkhalaf04@gmail.com"
                  startIcon={<EmailIcon sx={{ color: '#d93025', background: '#fff', borderRadius: '3px', fontSize: 28, p: '2px' }} />}
                  sx={{ color: '#222', fontWeight: 600, textTransform: 'none', fontSize: 16, background: '#fff', borderRadius: 2, px: 2, py: 1, minWidth: 0, boxShadow: '0 2px 8px rgba(66,133,244,0.10)', '&:hover': { background: '#f5f5f5' } }}
                >
                  jamilkhalaf04@gmail.com
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default Home; 