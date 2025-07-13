import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material'
import './App.css'

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home'))
const Game = lazy(() => import('./components/Game'))
const Population = lazy(() => import('./components/population'))
const Name = lazy(() => import('./components/name'))
const Flagle = lazy(() => import('./components/Flagle'))
const Worldle = lazy(() => import('./components/Worldle'))
const Capitals = lazy(() => import('./components/capitals'))
const Hangman = lazy(() => import('./components/hangman'))
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Badges = lazy(() => import('./components/badges'))
const Maintenance = lazy(() => import('./components/Maintenance'))
const Login = lazy(() => import('./components/Login'))
const Signup = lazy(() => import('./components/Signup'))
const Shaple = lazy(() => import('./components/shaple'))
const US = lazy(() => import('./components/US'))
const Namle = lazy(() => import('./components/Namle'))
const Online = lazy(() => import('./components/online'))
const Satle = lazy(() => import('./components/satle'))
const EducationalContent = lazy(() => import('./components/EducationalContent'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))

// Optimized theme for mobile performance
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
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (max-width: 768px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (max-width: 768px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (max-width: 768px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (max-width: 768px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      '@media (max-width: 768px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      '@media (max-width: 768px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width: 768px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width: 768px)': {
        fontSize: '0.8rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          '@media (max-width: 768px)': {
            fontSize: '0.9rem',
            padding: '8px 16px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width: 768px)': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width: 768px)': {
            borderRadius: 8,
          },
        },
      },
    },
  },
})

// Loading component for better UX
const LoadingFallback = () => (
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
)

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
