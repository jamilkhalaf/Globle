import React, { useEffect, useRef, useState } from 'react';
import { Box, useTheme, useMediaQuery, Typography, Button } from '@mui/material';
import monetizationManager from '../utils/monetizationManager';
import FallbackAdComponent from './FallbackAdComponent';

const SmartAdComponent = ({ 
  adSlot, 
  adType = 'inContent',
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true,
  fallbackContent = null,
  showAdLabel = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const adRef = useRef(null);
  const [shouldShow, setShouldShow] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [adsenseError, setAdsenseError] = useState('');

  // AdSense Configuration
  const ADSENSE_CONFIG = {
    publisherId: 'ca-pub-5704559495232028', // Your real AdSense publisher ID
    isConfigured: true, // Now enabled with your real publisher ID
    domain: 'jamilweb.click' // Use your main domain, not subdomain
  };

  // Debug AdSense loading
  useEffect(() => {
    const checkAdSenseStatus = () => {
      console.log('AdSense Status Check:');
      console.log('- Window adsbygoogle:', !!window.adsbygoogle);
      console.log('- Array check:', Array.isArray(window.adsbygoogle));
      console.log('- Publisher ID:', ADSENSE_CONFIG.publisherId);
      console.log('- Domain:', ADSENSE_CONFIG.domain);
    };

    // Check after page loads
    setTimeout(checkAdSenseStatus, 1000);
  }, []);

  useEffect(() => {
    // Check if ad should be shown
    const shouldShowAd = monetizationManager.shouldShowAd();
    setShouldShow(shouldShowAd);

    if (!shouldShowAd || shouldShowAd === 'fallback') {
      return;
    }

    // Check if AdSense is properly configured
    if (!ADSENSE_CONFIG.isConfigured) {
      setAdsenseError('AdSense not configured. Please add your publisher ID.');
      setShowFallback(true);
      return;
    }

    // Check if AdSense script is loaded
    const checkAdSenseLoaded = () => {
      return window.adsbygoogle && Array.isArray(window.adsbygoogle);
    };

    // Initialize the ad with retry logic
    const initializeAd = () => {
      if (adRef.current && checkAdSenseLoaded()) {
        try {
          console.log('Initializing AdSense ad:', adSlot);
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          monetizationManager.markAdShown(adType, adSlot);
          monetizationManager.trackAdImpression(adType);
          setAdLoaded(true);
        } catch (error) {
          console.error('AdSense error:', error);
          setAdError(true);
          setShowFallback(true);
        }
      } else {
        console.warn('AdSense script not loaded or ad container not found');
        setAdError(true);
        setShowFallback(true);
      }
    };

    // Try to initialize immediately
    if (checkAdSenseLoaded()) {
      initializeAd();
    } else {
      // Wait for AdSense to load
      const timer = setTimeout(() => {
        initializeAd();
      }, 3000); // Increased delay to ensure AdSense script loads

      return () => clearTimeout(timer);
    }
  }, [adSlot, adType]);

  const getAdStyle = () => {
    const baseStyle = {
      display: 'block',
      textAlign: 'center',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      ...style
    };

    if (isMobile) {
      return {
        ...baseStyle,
        width: '100%',
        minHeight: '100px',
        margin: '10px 0'
      };
    }

    return baseStyle;
  };

  const handleAdClick = () => {
    monetizationManager.trackAdClick(adType);
  };

  const handleFallbackAction = (action) => {
    monetizationManager.trackFallbackInteraction(adType, action);
  };

  // Show configuration error
  if (adsenseError) {
    return (
      <Box sx={getAdStyle()}>
        <Box
          sx={{
            padding: 2,
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            AdSense Configuration Required
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
            {adsenseError}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)' }}>
            Domain: {ADSENSE_CONFIG.domain} | Publisher ID: {ADSENSE_CONFIG.publisherId}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show fallback content when ads are blocked or not available
  if (showFallback) {
    return (
      <Box
        sx={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          minHeight: style.minHeight || '100px'
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
          📢 Ad Space
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {adsenseError === 'Ad blocker detected' 
            ? 'Please disable your ad blocker to support this site' 
            : 'Ad loading...'
          }
        </Typography>
      </Box>
    );
  }

  // Don't render if ad shouldn't be shown
  if (!shouldShow) {
    return null;
  }

  // Show custom fallback content if provided and ad fails to load
  if (adError && fallbackContent) {
    return (
      <Box sx={getAdStyle()}>
        {fallbackContent}
      </Box>
    );
  }

  return (
    <Box
      ref={adRef}
      className={`smart-ad-container ${className}`}
      sx={getAdStyle()}
      onClick={handleAdClick}
    >
      {showAdLabel && (
        <Box
          sx={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: 1
          }}
        >
          Ad
        </Box>
      )}
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
      
      {!adLoaded && !adError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px'
          }}
        >
          Loading advertisement...
        </Box>
      )}
    </Box>
  );
};

export default SmartAdComponent; 