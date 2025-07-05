import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import monetizationManager from '../utils/monetizationManager';
import FallbackAdComponent from './FallbackAdComponent';

const TestMonetization = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState({});
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // Load stats after a short delay to allow detection to complete
    const timer = setTimeout(() => {
      setStats(monetizationManager.getRevenueStats());
      setAdBlockerDetected(monetizationManager.adBlocked);
      setCurrentPage(monetizationManager.getCurrentPage());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTestAd = () => {
    const shouldShow = monetizationManager.shouldShowAd('inContent', 'test-slot');
    console.log('Should show ad:', shouldShow);
    alert(`Ad should show: ${shouldShow}`);
  };

  const handleTestFallback = () => {
    monetizationManager.trackFallbackInteraction('test', 'button_click');
    alert('Fallback interaction tracked!');
  };

  const handleForceRefresh = () => {
    monetizationManager.forceRefreshAds();
    alert('Ads refreshed! Navigate to another page and back to see them again.');
  };

  const handleRefreshStats = () => {
    setStats(monetizationManager.getRevenueStats());
    setCurrentPage(monetizationManager.getCurrentPage());
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        padding: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{
          fontWeight: 900,
          color: 'white',
          textAlign: 'center',
          mb: 3,
          letterSpacing: 1
        }}
      >
        Monetization System Test
      </Typography>

      <Paper
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'rgba(30,34,44,0.98)',
          color: 'white',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
          maxWidth: 600,
          width: '100%'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          System Status
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Current Page:
          </Typography>
          <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600 }}>
            {currentPage || 'Loading...'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Ad Blocker Detected:
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: adBlockerDetected ? '#ff6b6b' : '#4caf50', 
              fontWeight: 600 
            }}
          >
            {adBlockerDetected ? 'Yes' : 'No'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Total Impressions:
          </Typography>
          <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 600 }}>
            {stats.totalImpressions || 0}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Fallback Content Shown:
          </Typography>
          <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
            {stats.fallbackShown || 0}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleTestAd}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              py: 1,
              fontSize: '0.9rem',
              textTransform: 'none',
            }}
          >
            Test Ad Logic
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleTestFallback}
            sx={{
              borderColor: '#4ecdc4',
              color: '#4ecdc4',
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              py: 1,
              fontSize: '0.9rem',
              textTransform: 'none',
            }}
          >
            Test Fallback
          </Button>

          <Button
            variant="contained"
            onClick={handleForceRefresh}
            sx={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              py: 1,
              fontSize: '0.9rem',
              textTransform: 'none',
            }}
          >
            Force Refresh Ads
          </Button>

          <Button
            variant="outlined"
            onClick={handleRefreshStats}
            sx={{
              borderColor: '#ff9800',
              color: '#ff9800',
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              py: 1,
              fontSize: '0.9rem',
              textTransform: 'none',
            }}
          >
            Refresh Stats
          </Button>
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
          This test page verifies that the monetization system is working correctly 
          and not being blocked by ad blockers. Ads should persist across page navigation.
        </Typography>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
          💡 Tip: Navigate to other pages and come back to see if ads persist. 
          Use "Force Refresh Ads" to reset all ad timers for testing.
        </Typography>
      </Paper>

      {/* Test Fallback Component */}
      <Box sx={{ mt: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Fallback Component Test
        </Typography>
        <FallbackAdComponent
          adType="inContent"
          onAction={(action) => {
            console.log('Fallback action:', action);
            alert(`Fallback action: ${action}`);
          }}
        />
      </Box>
    </Box>
  );
};

export default TestMonetization; 