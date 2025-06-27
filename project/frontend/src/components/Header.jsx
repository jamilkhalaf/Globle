import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#121213' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', marginLeft: '-1000px' }}>
            JAMIL KHALAF
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ 
              color: 'white',
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none'
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/game"
            sx={{ 
              color: 'white',
              fontWeight: location.pathname === '/game' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/game' ? '2px solid white' : 'none'
            }}
          >
            Globle
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/wordle"
            sx={{ 
              color: 'white',
              fontWeight: location.pathname === '/wordle' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/wordle' ? '2px solid white' : 'none'
            }}
          >
            Wordle
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/population"
            sx={{ 
              color: 'white',
              fontWeight: location.pathname === '/population' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/population' ? '2px solid white' : 'none'
            }}
          >
            Population
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 