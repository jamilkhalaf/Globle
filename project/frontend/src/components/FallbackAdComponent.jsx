import React from 'react';
import { Box, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CoffeeIcon from '@mui/icons-material/Coffee';
import StarIcon from '@mui/icons-material/Star';

const FallbackAdComponent = ({ 
  adType = 'inContent',
  style = {}, 
  className = '',
  onAction = null 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getFallbackContent = () => {
    switch (adType) {
      case 'header':
        return {
          title: "Support Our Games",
          message: "Consider disabling your ad blocker to support free game development",
          cta: "Learn More",
          icon: <FavoriteIcon sx={{ fontSize: 24, color: '#ff6b6b' }} />
        };
      case 'inContent':
        return {
          title: "Enjoying the Games?",
          message: "Help us keep these games free by allowing ads or making a donation",
          cta: "Support Us",
          icon: <CoffeeIcon sx={{ fontSize: 24, color: '#4ecdc4' }} />
        };
      case 'footer':
        return {
          title: "Thank You for Playing",
          message: "Your support helps us create more educational games",
          cta: "Share with Friends",
          icon: <ShareIcon sx={{ fontSize: 24, color: '#45b7d1' }} />
        };
      case 'gameCompletion':
        return {
          title: "Great Job!",
          message: "You've completed the game! Consider supporting us to keep games free",
          cta: "Play Again",
          icon: <StarIcon sx={{ fontSize: 24, color: '#f9ca24' }} />
        };
      default:
        return {
          title: "Support Our Games",
          message: "Help us keep these educational games free and accessible",
          cta: "Support Us",
          icon: <FavoriteIcon sx={{ fontSize: 24, color: '#ff6b6b' }} />
        };
    }
  };

  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }

    switch (action) {
      case 'disable_adblock':
        // Show instructions for disabling ad blocker
        alert('To disable your ad blocker:\n\n1. Click the ad blocker icon in your browser\n2. Select "Disable for this site"\n3. Refresh the page\n\nThank you for supporting us!');
        break;
      case 'donate':
        // Open donation page or show donation modal
        window.open('https://www.buymeacoffee.com/yourusername', '_blank');
        break;
      case 'share':
        // Share the app
        if (navigator.share) {
          navigator.share({
            title: 'Geography Games Collection',
            text: 'Check out these awesome geography games!',
            url: window.location.origin
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          navigator.clipboard.writeText(window.location.origin);
          alert('Link copied to clipboard! Share it with your friends.');
        }
        break;
      case 'rate':
        // Rate the app (if it's a mobile app or has app store presence)
        window.open('https://your-app-store-link.com', '_blank');
        break;
      default:
        break;
    }
  };

  const content = getFallbackContent();

  const getComponentStyle = () => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '24px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      minHeight: isMobile ? '120px' : '150px',
      ...style
    };

    return baseStyle;
  };

  return (
    <Paper
      elevation={8}
      className={`fallback-ad-container ${className}`}
      sx={getComponentStyle()}
    >
      <Box sx={{ mb: 2 }}>
        {content.icon}
      </Box>
      
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        sx={{
          fontWeight: 700,
          color: 'white',
          mb: 1,
          fontSize: isMobile ? '1rem' : '1.2rem'
        }}
      >
        {content.title}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          mb: 3,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          lineHeight: 1.4,
          maxWidth: '300px'
        }}
      >
        {content.message}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleAction('disable_adblock')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            fontSize: '0.8rem',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          Disable Ad Blocker
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleAction('donate')}
          sx={{
            borderColor: '#4ecdc4',
            color: '#4ecdc4',
            fontWeight: 600,
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            fontSize: '0.8rem',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#45b7d1',
              color: '#45b7d1',
              backgroundColor: 'rgba(78, 205, 196, 0.1)',
            }
          }}
        >
          Donate
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant="text"
          size="small"
          onClick={() => handleAction('share')}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Share
        </Button>
        
        <Button
          variant="text"
          size="small"
          onClick={() => handleAction('rate')}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.75rem',
            textTransform: 'none',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Rate
        </Button>
      </Box>
    </Paper>
  );
};

export default FallbackAdComponent; 