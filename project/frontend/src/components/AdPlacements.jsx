import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import SmartAdComponent from './SmartAdComponent';

// Banner ad for header area
export const HeaderAd = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '728px',
        margin: '0 auto',
        padding: { xs: '8px', md: '12px' },
        display: { xs: 'none', md: 'block' } // Hide on mobile to avoid cluttering
      }}
    >
      <SmartAdComponent
        adSlot="header-banner" // ✅ Create this ad unit in AdSense
        adType="header"
        adFormat="auto"
        style={{
          minHeight: '90px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
    </Box>
  );
};

// Sidebar ad for desktop
export const SidebarAd = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) return null; // Don't show sidebar ads on mobile

  return (
    <Box
      sx={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '160px',
        zIndex: 1000
      }}
    >
      <SmartAdComponent
        adSlot="9833563267" // ✅ Your new AdSense slot ID
        adType="sidebar"
        adFormat="auto"
        responsive={true}
        style={{
          minHeight: '600px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
    </Box>
  );
};

// In-content ad for between game sections
export const InContentAd = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '728px',
        margin: '20px auto',
        padding: '16px'
      }}
    >
      <SmartAdComponent
        adSlot="in-content" // ✅ Create this ad unit in AdSense
        adType="inContent"
        adFormat="auto"
        style={{
          minHeight: '90px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
    </Box>
  );
};

// Footer ad
export const FooterAd = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '728px',
        margin: '20px auto',
        padding: '16px'
      }}
    >
      <SmartAdComponent
        adSlot="footer-banner" // ✅ Create this ad unit in AdSense
        adType="footer"
        adFormat="auto"
        style={{
          minHeight: '90px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
    </Box>
  );
};

// Mobile banner ad (shown only on mobile)
export const MobileBannerAd = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        width: '100%',
        padding: '8px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <SmartAdComponent
        adSlot="mobile-banner" // ✅ Create this ad unit in AdSense
        adType="mobile"
        adFormat="auto"
        style={{
          minHeight: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
    </Box>
  );
};

// Game completion ad (shown after finishing a game)
export const GameCompletionAd = ({ show }) => {
  if (!show) return null;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '728px',
        margin: '20px auto',
        padding: '16px',
        animation: 'fadeIn 0.5s ease-in'
      }}
    >
      <SmartAdComponent
        adSlot="game-completion" // ✅ Create this ad unit in AdSense
        adType="gameCompletion"
        adFormat="auto"
        style={{
          minHeight: '90px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
    </Box>
  );
}; 