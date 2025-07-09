import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Chip,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const ComingSoon = ({ open, onClose, feature = "1v1 Multiplayer" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      // Here you would typically send the email to your backend
      console.log('Email subscribed:', email);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(30,34,44,0.98)',
          color: 'white',
          boxShadow: '0 20px 80px 0 rgba(31,38,135,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 1,
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 48px rgba(156, 39, 176, 0.4)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', boxShadow: '0 12px 48px rgba(156, 39, 176, 0.4)' },
                '50%': { transform: 'scale(1.05)', boxShadow: '0 16px 64px rgba(156, 39, 176, 0.6)' },
                '100%': { transform: 'scale(1)', boxShadow: '0 12px 48px rgba(156, 39, 176, 0.4)' },
              }
            }}
          >
            <GroupsIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Box>

        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 900,
            color: 'transparent',
            background: 'linear-gradient(90deg, #9c27b0 30%, #673ab7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            letterSpacing: 1,
          }}
        >
          Coming Soon!
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            mb: 2,
          }}
        >
          {feature}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          Challenge your friends in real-time 1v1 battles! Compete head-to-head in all your favorite geography games 
          with live leaderboards, rankings, and global tournaments. Show off your skills and climb the competitive ladder!
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 3 }}>
          <Chip 
            icon={<SportsEsportsIcon />} 
            label="1v1 Battles"
            sx={{ 
              background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip 
            icon={<LeaderboardIcon />} 
            label="Live Leaderboards"
            sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip 
            icon={<EmojiEventsIcon />} 
            label="Tournaments"
            sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600,
              mb: 2,
            }}
          >
            🎮 Multiplayer Features
          </Typography>
          
          <Stack spacing={2} sx={{ textAlign: 'left', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: '#9c27b0' 
              }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                Real-time 1v1 matches across all games
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: '#ff9800' 
              }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                Global leaderboards and rankings
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: '#4caf50' 
              }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                Weekly tournaments with prizes
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: '#2196f3' 
              }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                Friend challenges and private matches
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 2,
              fontWeight: 500,
            }}
          >
            Want to be notified when multiplayer launches?
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '1rem',
                width: '250px',
                outline: 'none',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.5)',
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
            />
            <Button
              variant="contained"
              onClick={handleSubscribe}
              startIcon={<EmailIcon />}
              sx={{
                background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7b1fa2 0%, #512da8 100%)',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Subscribe
            </Button>
          </Stack>
        </Box>

        {subscribed && (
          <Fade in={subscribed}>
            <Typography
              variant="body2"
              sx={{
                color: '#4caf50',
                fontWeight: 600,
                mb: 2,
              }}
            >
              ✅ Thanks! We'll notify you when multiplayer is ready.
            </Typography>
          </Fade>
        )}

        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.5)',
            display: 'block',
            fontStyle: 'italic',
          }}
        >
          Estimated launch: Q1 2024
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComingSoon; 