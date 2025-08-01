import React, { Suspense, lazy, memo, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CircularProgress, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import './App.css'

// Optimized lazy loading with chunk names for better caching
// Core pages - load immediately
const Home = lazy(() => import(/* webpackChunkName: "core" */ './components/Home'))

// Game pages - load on demand
const Game = lazy(() => import(/* webpackChunkName: "games" */ './components/Game'))
const Population = lazy(() => import(/* webpackChunkName: "games" */ './components/population'))
const Name = lazy(() => import(/* webpackChunkName: "games" */ './components/name'))
const Flagle = lazy(() => import(/* webpackChunkName: "games" */ './components/Flagle'))
const Worldle = lazy(() => import(/* webpackChunkName: "games" */ './components/Worldle'))
const Capitals = lazy(() => import(/* webpackChunkName: "games" */ './components/capitals'))
const Hangman = lazy(() => import(/* webpackChunkName: "games" */ './components/hangman'))
const Shaple = lazy(() => import(/* webpackChunkName: "games" */ './components/shaple'))
const US = lazy(() => import(/* webpackChunkName: "games" */ './components/US'))
const Namle = lazy(() => import(/* webpackChunkName: "games" */ './components/Namle'))
const Satle = lazy(() => import(/* webpackChunkName: "games" */ './components/satle'))

// Info pages - load on demand
const About = lazy(() => import(/* webpackChunkName: "info" */ './components/About'))
const Contact = lazy(() => import(/* webpackChunkName: "info" */ './components/Contact'))
const Badges = lazy(() => import(/* webpackChunkName: "info" */ './components/badges'))
const EducationalContent = lazy(() => import(/* webpackChunkName: "info" */ './components/EducationalContent'))
const PrivacyPolicy = lazy(() => import(/* webpackChunkName: "info" */ './components/PrivacyPolicy'))

// Auth pages - load on demand
const Login = lazy(() => import(/* webpackChunkName: "auth" */ './components/Login'))
const Signup = lazy(() => import(/* webpackChunkName: "auth" */ './components/Signup'))

// Online features - load on demand
const Online = lazy(() => import(/* webpackChunkName: "online" */ './components/online'))

// Maintenance - load on demand
const Maintenance = lazy(() => import(/* webpackChunkName: "maintenance" */ './components/Maintenance'))

// Optimized theme for mobile performance - reduced complexity
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121213',
      paper: 'rgba(30,34,44,0.95)',
  },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Simplified typography for better performance
    h1: {
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: 700,
    },
    h2: {
      fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
      fontWeight: 600,
    },
    h3: {
      fontSize: 'clamp(1.1rem, 3vw, 1.75rem)',
      fontWeight: 600,
    },
    h4: {
      fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
    },
    h5: {
      fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
      fontWeight: 600,
    },
    h6: {
      fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
      fontWeight: 600,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    },
    body2: {
      fontSize: 'clamp(0.8rem, 1.8vw, 0.875rem)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
})

// Optimized loading component
const LoadingFallback = memo(() => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
    }}
  >
    <CircularProgress size={60} sx={{ color: '#43cea2' }} />
  </Box>
))

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
      color: 'white',
      p: 3,
    }}
  >
    <Typography variant="h4" sx={{ mb: 2 }}>
      Something went wrong
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
      {error.message}
    </Typography>
    <Button variant="contained" onClick={resetErrorBoundary}>
      Try again
    </Button>
  </Box>
)

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = false;

// Ad Blocker Detection Component
const AdBlockerModal = ({ open, onClose }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        backgroundColor: 'rgba(30,34,44,0.98)',
        color: 'white',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)'
      }
    }}
  >
    <DialogTitle sx={{ 
      textAlign: 'center', 
      color: '#f44336',
      fontWeight: 'bold',
      fontSize: '1.5rem'
    }}>
      ⚠️ Ad Blocker Detected
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
        We've detected that you're using an ad blocker. Our educational games are free thanks to advertising revenue.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
        To continue using our website, please:
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          1. Disable your ad blocker for this site
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          2. Refresh the page
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          3. Or whitelist mapzap.click in your ad blocker settings
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.7)',
        fontStyle: 'italic'
      }}>
        Your support helps us keep these educational games free for everyone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
      <Button 
        variant="contained" 
        onClick={() => window.location.reload()}
        sx={{
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#1565c0' }
        }}
      >
        I've Disabled Ad Blocker - Reload Page
      </Button>
    </DialogActions>
  </Dialog>
);

function App() {
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  const [showAdBlockerModal, setShowAdBlockerModal] = useState(false);

  // Ad blocker detection
  useEffect(() => {
    const detectAdBlocker = () => {
      // Method 1: Test ad element
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-9999px';
      testAd.style.top = '-9999px';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setAdBlockerDetected(true);
          setShowAdBlockerModal(true);
        }
        document.body.removeChild(testAd);
      }, 100);

      // Method 2: Test AdSense script
      const testScript = document.createElement('script');
      testScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      testScript.async = true;
      
      testScript.onerror = () => {
        setAdBlockerDetected(true);
        setShowAdBlockerModal(true);
      };
      
      testScript.onload = () => {
        setTimeout(() => {
          if (typeof window.adsbygoogle === 'undefined') {
            setAdBlockerDetected(true);
            setShowAdBlockerModal(true);
          }
        }, 1000);
      };
      
      document.head.appendChild(testScript);
    };

    // Run detection after a short delay
    const timer = setTimeout(detectAdBlocker, 1000);
    return () => clearTimeout(timer);
  }, []);

  // If ad blocker is detected, show modal and block access
  if (adBlockerDetected) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white'
        }}>
          <AdBlockerModal 
            open={showAdBlockerModal} 
            onClose={() => setShowAdBlockerModal(false)}
          />
        </Box>
      </ThemeProvider>
    );
  }

  // If maintenance mode is enabled, show maintenance page for all routes
  if (MAINTENANCE_MODE) {
    return (
      <ThemeProvider theme={theme}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
        <Maintenance />
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
          <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
              <Route path="/online" element={<Online />} />
              <Route path="/educational-content" element={<EducationalContent />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/game" element={<Game />} />
          <Route path="/population" element={<Population />} />
          <Route path="/name" element={<Name />} />
          <Route path="/flagle" element={<Flagle />} />
          <Route path="/worldle" element={<Worldle />} />
          <Route path="/capitals" element={<Capitals />} />
          <Route path="/hangman" element={<Hangman />} />
          <Route path="/shaple" element={<Shaple />} />
          <Route path="/us" element={<US />} />
          <Route path="/namle" element={<Namle />} />
              <Route path="/satle" element={<Satle />} />
        </Routes>
          </Suspense>
      </Router>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
