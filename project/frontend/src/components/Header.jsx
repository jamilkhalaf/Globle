import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/game', label: 'Globle' },
    { path: '/wordle', label: 'Wordle', icon: <PublicIcon sx={{ fontSize: 32, color: '#1976d2' }} /> },
    { path: '/population', label: 'Population' },
    { path: '/name', label: 'Findle' },
    { path: '/flagle', label: 'Flagle' },
    { path: '/worldle', label: 'Worldle', icon: <PublicIcon sx={{ fontSize: 32, color: '#43cea2' }} /> },
  ];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#121213', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box
          component="a"
          href="https://jamilweb.click"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.15rem',
            textDecoration: 'none',
            letterSpacing: 1.5,
            transition: 'color 0.2s',
            cursor: 'pointer',
            '&:hover': {
              color: '#43cea2',
              textDecoration: 'underline',
            },
          }}
        >
          JAMIL KHALAF
        </Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            component={RouterLink} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: 'white',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              }
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  fontSize: '1.1rem'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#121213', zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            component="a"
            href="https://jamilweb.click"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              textDecoration: 'none',
              letterSpacing: 1.5,
              transition: 'color 0.2s',
              cursor: 'pointer',
              '&:hover': {
                color: '#43cea2',
                textDecoration: 'underline',
              },
            }}
          >
            JAMIL KHALAF
          </Box>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 } }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.path}
                  color="inherit" 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ 
                    color: 'white',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    px: { xs: 1, md: 2 }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            bgcolor: '#121213'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 