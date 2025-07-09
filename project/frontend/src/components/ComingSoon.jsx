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
import ConstructionIcon from '@mui/icons-material/Construction';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';

const ComingSoon = ({ open, onClose, feature = "New Feature" }) => {
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
              background: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 48px rgba(255, 152, 0, 0.4)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', boxShadow: '0 12px 48px rgba(255, 152, 0, 0.4)' },
                '50%': { transform: 'scale(1.05)', boxShadow: '0 16px 64px rgba(255, 152, 0, 0.6)' },
                '100%': { transform: 'scale(1)', boxShadow: '0 12px 48px rgba(255, 152, 0, 0.4)' },
              }
            }}
          >
            <ConstructionIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Box>

        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 900,
            color: 'transparent',
            background: 'linear-gradient(90deg, #ff9800 30%, #ff5e62 100%)',
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
          We're working hard to bring you something amazing! This feature is currently under development 
          and will be available soon. Stay tuned for updates!
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 3 }}>
          <Chip 
            icon={<RocketLaunchIcon />} 
            label="In Development"
            sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip 
            icon={<NotificationsIcon />} 
            label="Get Notified"
            sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 2,
              fontWeight: 500,
            }}
          >
            Want to be notified when this feature launches?
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
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00 0%, #e64a19 100%)',
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
              ✅ Thanks! We'll notify you when it's ready.
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
          Estimated launch: Coming soon
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