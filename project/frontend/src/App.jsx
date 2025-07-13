import React, { Suspense, lazy, memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material'
import './App.css'

// Optimized lazy loading with chunk names for better caching
const Home = lazy(() => import(/* webpackChunkName: "home" */ './components/Home'))
const Game = lazy(() => import(/* webpackChunkName: "game" */ './components/Game'))
const Population = lazy(() => import(/* webpackChunkName: "population" */ './components/population'))
const Name = lazy(() => import(/* webpackChunkName: "name" */ './components/name'))
const Flagle = lazy(() => import(/* webpackChunkName: "flagle" */ './components/Flagle'))
const Worldle = lazy(() => import(/* webpackChunkName: "worldle" */ './components/Worldle'))
const Capitals = lazy(() => import(/* webpackChunkName: "capitals" */ './components/capitals'))
const Hangman = lazy(() => import(/* webpackChunkName: "hangman" */ './components/hangman'))
const About = lazy(() => import(/* webpackChunkName: "about" */ './components/About'))
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ './components/Contact'))
const Badges = lazy(() => import(/* webpackChunkName: "badges" */ './components/badges'))
const Maintenance = lazy(() => import(/* webpackChunkName: "maintenance" */ './components/Maintenance'))
const Login = lazy(() => import(/* webpackChunkName: "auth" */ './components/Login'))
const Signup = lazy(() => import(/* webpackChunkName: "auth" */ './components/Signup'))
const Shaple = lazy(() => import(/* webpackChunkName: "shaple" */ './components/shaple'))
const US = lazy(() => import(/* webpackChunkName: "us" */ './components/US'))
const Namle = lazy(() => import(/* webpackChunkName: "namle" */ './components/Namle'))
const Online = lazy(() => import(/* webpackChunkName: "online" */ './components/online'))
const Satle = lazy(() => import(/* webpackChunkName: "satle" */ './components/satle'))
const EducationalContent = lazy(() => import(/* webpackChunkName: "educational" */ './components/EducationalContent'))
const PrivacyPolicy = lazy(() => import(/* webpackChunkName: "privacy" */ './components/PrivacyPolicy'))

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

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = false;

function App() {
  // If maintenance mode is enabled, show maintenance page for all routes
  if (MAINTENANCE_MODE) {
    return (
      <ThemeProvider theme={theme}>
        <Suspense fallback={<LoadingFallback />}>
          <Maintenance />
        </Suspense>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  )
}

export default App
