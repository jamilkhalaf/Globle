import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import SmartAdComponent from './SmartAdComponent';
import monetizationManager from '../utils/monetizationManager';

const GlobalAdContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  useEffect(() => {
    // Listen for route changes
    const handleRouteChange = () => {
      setCurrentPage(window.location.pathname);
    };

    // Listen for popstate events
    window.addEventListener('popstate', handleRouteChange);

    // Override pushState to detect programmatic navigation
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Don't show global ads on mobile to keep the layout clean
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Top Banner Ad - Fixed at top */}
      <Box
        sx={{
          position: 'fixed',
          top: 64, // Below the header
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <SmartAdComponent
          adSlot="global-top-banner"
          adType="header"
          adFormat="auto"
          responsive={true}
          style={{
            width: '100%',
            maxWidth: '728px',
            minHeight: '90px',
            margin: '8px auto'
          }}
          showAdLabel={false}
        />
      </Box>

      {/* Left Sidebar Ad - Fixed */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 999,
          width: '160px',
          height: '600px'
        }}
      >
        <SmartAdComponent
          adSlot="global-left-sidebar"
          adType="leftSidebar"
          adFormat="vertical"
          responsive={false}
          style={{
            width: '160px',
            height: '600px',
            margin: '0 8px'
          }}
        />
      </Box>

      {/* Right Sidebar Ad - Fixed */}
      <Box
        sx={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 999,
          width: '160px',
          height: '600px'
        }}
      >
        <SmartAdComponent
          adSlot="global-right-sidebar"
          adType="rightSidebar"
          adFormat="vertical"
          responsive={false}
          style={{
            width: '160px',
            height: '600px',
            margin: '0 8px'
          }}
        />
      </Box>

      {/* Bottom Banner Ad - Fixed at bottom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <SmartAdComponent
          adSlot="global-bottom-banner"
          adType="footer"
          adFormat="auto"
          responsive={true}
          style={{
            width: '100%',
            maxWidth: '728px',
            minHeight: '90px',
            margin: '8px auto'
          }}
          showAdLabel={false}
        />
      </Box>
    </>
  );
};

export default GlobalAdContainer; 