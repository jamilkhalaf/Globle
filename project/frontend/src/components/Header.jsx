import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
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
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupsIcon from '@mui/icons-material/Groups';
import FlagIcon from '@mui/icons-material/Flag';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MapIcon from '@mui/icons-material/Map';
import WifiIcon from '@mui/icons-material/Wifi';
import ComingSoon from './ComingSoon';

const Header = forwardRef((props, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gamesAnchorEl, setGamesAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('New Feature');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    openGamesMenu: () => {
      // Create a synthetic event to open the games menu
      const event = {
        currentTarget: document.querySelector('[data-games-button]') || document.body
      };
      handleGamesMenuOpen(event);
    }
  }));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleGamesMenuOpen = (event) => {
    setGamesAnchorEl(event.currentTarget);
  };

  const handleGamesMenuClose = () => {
    setGamesAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuAnchorEl(null);
    navigate('/');
  };

  const handleComingSoon = (feature = 'New Feature') => {
    setComingSoonFeature(feature);
    setComingSoonOpen(true);
  };

  const games = [
    { path: '/game', label: 'Globle', icon: <PublicIcon sx={{ fontSize: 20, color: '#1976d2' }} /> },
    { path: '/population', label: 'Population', icon: <GroupsIcon sx={{ fontSize: 20, color: '#4caf50' }} /> },
    { path: '/name', label: 'Findle', icon: <SportsEsportsIcon sx={{ fontSize: 20, color: '#9c27b0' }} /> },
    { path: '/flagle', label: 'Flagle', icon: <FlagIcon sx={{ fontSize: 20, color: '#ff9800' }} /> },
    { path: '/worldle', label: 'Worldle', icon: <PublicIcon sx={{ fontSize: 20, color: '#43cea2' }} /> },
    { path: '/capitals', label: 'Capitals', icon: <SchoolIcon sx={{ fontSize: 20, color: '#43cea2' }} /> },
    { path: '/hangman', label: 'Hangman', icon: <HelpIcon sx={{ fontSize: 20, color: '#f44336' }} /> },
    {
      label: 'Shaple',
      path: '/shaple',
      icon: <CropSquareIcon sx={{ fontSize: 22, color: '#43cea2' }} />
    },
    {
      label: 'US',
      path: '/us',
      icon: <MapIcon sx={{ fontSize: 22, color: '#1976d2' }} />
    },
    {
      label: 'Namle',
      path: '/namle',
      icon: <PublicIcon sx={{ fontSize: 20, color: '#9c27b0' }} />
    }
  ];

  const mainMenuItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/badges', label: 'Badges' },
    { path: '/contact', label: 'Contact' },
    { path: '/online', label: 'Online', icon: <WifiIcon sx={{ fontSize: 20, color: '#43cea2' }} /> },
    { 
      label: 'Coming Soon', 
      action: () => handleComingSoon('1v1 Multiplayer & Leaderboards'),
      isComingSoon: true 
    },
  ];

  const allMenuItems = [
    ...mainMenuItems,
    ...games.map(game => ({ ...game, isGame: true }))
  ];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#121213', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.15rem',
            textDecoration: 'none',
            letterSpacing: 1.5,
            transition: 'color 0.2s',
            cursor: 'pointer',
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            '&:hover': {
              color: '#43cea2',
            },
          }}
        >
          Designed by Jamil
        </Box>
      </Box>
      
      {/* User section in mobile drawer */}
      {user ? (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#43cea2', width: 40, height: 40 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {user.username}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mb: 1 }}>
            Welcome to Globle
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                fontSize: '0.8rem',
                py: 0.5,
                px: 1.5,
              }}
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#43cea2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3bb08f',
                },
                fontSize: '0.8rem',
                py: 0.5,
                px: 1.5,
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      )}

      <List>
        {mainMenuItems.map((item) => (
          <ListItem 
            key={item.label} 
            component={item.isComingSoon ? 'div' : RouterLink} 
            to={item.isComingSoon ? undefined : item.path}
            onClick={item.isComingSoon ? () => {
              item.action();
              handleDrawerToggle();
            } : handleDrawerToggle}
            sx={{
              color: item.isComingSoon ? '#ff9800' : 'white',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              backgroundColor: !item.isComingSoon && location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
              cursor: 'pointer',
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: !item.isComingSoon && location.pathname === item.path ? 'bold' : 'normal',
                  fontSize: '1.1rem',
                  color: item.isComingSoon ? '#ff9800' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
        <ListItem 
          sx={{
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: games.some(game => location.pathname === game.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            }
          }}
        >
          <ListItemText 
            primary="Games" 
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: games.some(game => location.pathname === game.path) ? 'bold' : 'normal',
                fontSize: '1.1rem',
                color: '#43cea2'
              }
            }}
          />
        </ListItem>
        {games.map((game) => (
          <ListItem 
            key={game.path} 
            component={RouterLink} 
            to={game.path}
            onClick={handleDrawerToggle}
            sx={{
              color: 'white',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              backgroundColor: location.pathname === game.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              pl: 4,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
              {game.icon}
            </ListItemIcon>
            <ListItemText 
              primary={game.label} 
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === game.path ? 'bold' : 'normal',
                  fontSize: '1rem'
                }
              }}
            />
          </ListItem>
        ))}
        
        {/* Logout option in mobile drawer */}
        {user && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
            <ListItem 
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
              sx={{
                color: 'white',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '1.1rem'
                  }
                }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#121213', zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              textDecoration: 'none',
              letterSpacing: 1.5,
              transition: 'color 0.2s',
              cursor: 'pointer',
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              '&:hover': {
                color: '#43cea2',
              },
            }}
          >
            Designed by Jamil
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
            <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, alignItems: 'center' }}>
              {mainMenuItems.map((item) => (
                <Button 
                  key={item.label}
                  color="inherit" 
                  component={item.isComingSoon ? 'button' : RouterLink} 
                  to={item.isComingSoon ? undefined : item.path}
                  onClick={item.isComingSoon ? item.action : undefined}
                  sx={{ 
                    color: item.isComingSoon ? '#ff9800' : 'white',
                    fontWeight: !item.isComingSoon && location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: !item.isComingSoon && location.pathname === item.path ? '2px solid white' : 'none',
                    fontSize: { xs: '0.8rem', md: '1rem' },
                    px: { xs: 1, md: 2 },
                    '&:hover': {
                      color: item.isComingSoon ? '#f57c00' : 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button 
                color="inherit"
                onClick={handleGamesMenuOpen}
                endIcon={<ExpandMoreIcon />}
                data-games-button
                sx={{ 
                  color: games.some(game => location.pathname === game.path) ? '#43cea2' : 'white',
                  fontWeight: games.some(game => location.pathname === game.path) ? 'bold' : 'normal',
                  borderBottom: games.some(game => location.pathname === game.path) ? '2px solid #43cea2' : 'none',
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  px: { xs: 1, md: 2 }
                }}
              >
                Games
              </Button>

              {/* Authentication buttons */}
              {user ? (
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ color: 'white', ml: 1 }}
                >
                  <Avatar sx={{ bgcolor: '#43cea2', width: 32, height: 32 }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      fontSize: '0.8rem',
                      py: 0.5,
                      px: 1.5,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#43cea2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#3bb08f',
                      },
                      fontSize: '0.8rem',
                      py: 0.5,
                      px: 1.5,
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Games Menu */}
      <Menu
        anchorEl={gamesAnchorEl}
        open={Boolean(gamesAnchorEl)}
        onClose={handleGamesMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#121213',
            color: 'white',
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }
        }}
      >
        {games.map((game) => (
          <MenuItem 
            key={game.path}
            component={RouterLink}
            to={game.path}
            onClick={handleGamesMenuClose}
            sx={{
              color: 'white',
              backgroundColor: location.pathname === game.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
              {game.icon}
            </ListItemIcon>
            <Typography sx={{ fontWeight: location.pathname === game.path ? 'bold' : 'normal' }}>
              {game.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#121213',
            color: 'white',
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {user?.username}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
            {user?.email}
          </Typography>
        </Box>
        <MenuItem 
          onClick={handleLogout}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
      
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

      {/* Coming Soon Dialog */}
      <ComingSoon 
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        feature={comingSoonFeature}
      />
    </>
  );
});

export default Header; 