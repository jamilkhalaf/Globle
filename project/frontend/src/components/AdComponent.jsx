import React, { useEffect, useRef } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const AdComponent = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const adRef = useRef(null);

  useEffect(() => {
    // Load Google AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', 'ca-pub-YOUR_PUBLISHER_ID'); // Replace with your AdSense publisher ID
      document.head.appendChild(script);
    }

    // Initialize the ad
    if (adRef.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSlot]);

  const getAdStyle = () => {
    const baseStyle = {
      display: 'block',
      textAlign: 'center',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
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

  return (
    <Box
      ref={adRef}
      className={`ad-container ${className}`}
      sx={getAdStyle()}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </Box>
  );
};

export default AdComponent; 