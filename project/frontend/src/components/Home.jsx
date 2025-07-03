import React, { useState } from 'react';
import { Box, Typography, Paper, Fade, useTheme, useMediaQuery, Toolbar, Button, Popper, ClickAwayListener, IconButton, Dialog, Slide } from '@mui/material';
import Header from './Header';
import PublicIcon from '@mui/icons-material/Public';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import GroupsIcon from '@mui/icons-material/Groups';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const gameList = [
  { label: 'Globle', path: '/game', icon: <PublicIcon sx={{ fontSize: 40, color: '#1976d2' }} />, color: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)' },
  { label: 'Wordle', path: '/wordle', icon: <SpellcheckIcon sx={{ fontSize: 40, color: '#f093fb' }} />, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: 'Population', path: '/population', icon: <GroupsIcon sx={{ fontSize: 40, color: '#4caf50' }} />, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: 'Findle', path: '/name', icon: <SportsEsportsIcon sx={{ fontSize: 40, color: '#9c27b0' }} />, color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: 'Flagle', path: '/flagle', icon: <FlagIcon sx={{ fontSize: 40, color: '#ff9800' }} />, color: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)' },
  { label: 'Worldle', path: '/worldle', icon: <PublicIcon sx={{ fontSize: 40, color: '#1976d2' }} />, color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)' },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExploreClick = (event) => {
    if (isMobile) {
      setMobileMenuOpen(true);
    } else {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuOpen(false);
  };
  const handleGameSelect = (path) => {
    setAnchorEl(null);
    setMobileMenuOpen(false);
    navigate(path);
  };
  const open = Boolean(anchorEl);

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
      <Header />
      <Toolbar />
      <Fade in timeout={800}>
        <Paper
          elevation={8}
          sx={{
            mt: { xs: 6, md: 10 },
            mb: 4,
            px: { xs: 3, md: 8 },
            py: { xs: 5, md: 8 },
            borderRadius: 6,
            maxWidth: 600,
            width: '100%',
            textAlign: 'center',
            background: 'rgba(30,34,44,0.98)',
            color: 'white',
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            <PublicIcon sx={{ fontSize: 56, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
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
              mb: 2,
              letterSpacing: 2,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            Welcome to my games collection
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              color: '#b0c4de',
              fontWeight: 600,
              mb: 3,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            Explore the world. Play. Learn. Compete.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              mb: 4,
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            This is a collection of geography games + wordle designed to challenge your knowledge of countries, capitals, populations, flags, and pattern recognition. Whether you're a casual explorer or a competitive globetrotter, you'll find something to enjoy. Sharpen your skills, learn new facts, and have fun discovering the world!
          </Typography>
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
              mb: 2,
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
              background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
              textTransform: 'none',
            }}
            onClick={handleExploreClick}
            id="explore-btn"
          >
            Explore
          </Button>

          {/* Desktop Popper */}
          {!isMobile && (
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="top"
              sx={{
                zIndex: 2000,
                position: 'fixed',
                left: '50vw',
                top: { xs: 60, md: 80 },
                transform: 'translateX(-50%)',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: open ? 'auto' : 'none',
              }}
            >
              <ClickAwayListener onClickAway={(e) => {
                if (anchorEl && anchorEl.contains(e.target)) return;
                handleClose();
              }}>
                <Paper
                  elevation={16}
                  sx={{
                    px: { xs: 1.5, md: 4 },
                    py: { xs: 2.5, md: 4 },
                    borderRadius: 5,
                    background: 'rgba(30,34,44,0.99)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2.5, md: 3 },
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 40px 0 rgba(31,38,135,0.45)',
                    minWidth: { xs: 260, md: 600 },
                    maxWidth: { xs: '98vw', md: '80vw' },
                    position: 'relative',
                    pointerEvents: 'auto',
                  }}
                >
                  {gameList.map((game) => (
                    <Box
                      key={game.path}
                      onClick={() => handleGameSelect(game.path)}
                      sx={{
                        cursor: 'pointer',
                        background: game.color,
                        borderRadius: 3,
                        p: { xs: 2.5, md: 2.5 },
                        minWidth: { xs: 220, md: 110 },
                        minHeight: { xs: 110, md: 140 },
                        mb: { xs: 1.5, md: 0 },
                        boxShadow: { xs: '0 2px 12px 0 rgba(25, 118, 210, 0.10)', md: '0 4px 20px rgba(0,0,0,0.15)' },
                        border: { xs: '2px solid rgba(255,255,255,0.12)', md: 'none' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        '&:hover': {
                          transform: { xs: 'scale(1.06)', md: 'translateY(-6px) scale(1.07)' },
                          boxShadow: { xs: '0 6px 24px rgba(25, 118, 210, 0.18)', md: '0 8px 32px rgba(25, 118, 210, 0.25)' },
                        },
                      }}
                    >
                      {game.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 800,
                          mt: 1.5,
                          fontSize: { xs: 20, md: 20 },
                          letterSpacing: 1,
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        {game.label}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </ClickAwayListener>
            </Popper>
          )}

          {/* Mobile Fullscreen Menu */}
          {isMobile && (
            <Dialog
              fullScreen
              open={mobileMenuOpen}
              onClose={handleClose}
              TransitionComponent={Slide}
              TransitionProps={{ direction: 'up' }}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(135deg, #232a3b 0%, #121213 100%)',
                  color: 'white',
                  p: 0,
                },
              }}
            >
              <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, zIndex: 10 }}>
                <IconButton onClick={handleClose} sx={{ color: 'white', background: 'rgba(0,0,0,0.18)' }}>
                  <CloseIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Box>
              <Box sx={{ pt: 8, pb: 4, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, mt: 2, letterSpacing: 1, textAlign: 'center' }}>
                  Choose a Game
                </Typography>
                {gameList.map((game) => (
                  <Box
                    key={game.path}
                    onClick={() => handleGameSelect(game.path)}
                    sx={{
                      width: '100%',
                      maxWidth: 340,
                      background: game.color,
                      borderRadius: 4,
                      p: 3,
                      mb: 2.5,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.10)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s',
                      '&:active': { transform: 'scale(0.97)' },
                    }}
                  >
                    {game.icon}
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, ml: 2, fontSize: 22, letterSpacing: 1 }}>
                      {game.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Dialog>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default Home; 