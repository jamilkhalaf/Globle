import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import Home from './components/Home'
import Game from './components/Game'
import Population from './components/population'
import Name from './components/name'
import Flagle from './components/Flagle'
import Worldle from './components/Worldle'
import Capitals from './components/capitals'
import Hangman from './components/hangman'
import About from './components/About'
import Contact from './components/Contact'
import Badges from './components/badges'
import Maintenance from './components/Maintenance'
import Login from './components/Login'
import Signup from './components/Signup'
import Shaple from './components/shaple'
import US from './components/US'
import Namle from './components/Namle'
import Online from './components/online'
import Satle from './components/satle'
import EducationalContent from './components/EducationalContent'
import PrivacyPolicy from './components/PrivacyPolicy'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = false;

function App() {
  // If maintenance mode is enabled, show maintenance page for all routes
  if (MAINTENANCE_MODE) {
    return (
      <ThemeProvider theme={theme}>
        <Maintenance />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
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
      </Router>
    </ThemeProvider>
  )
}

export default App
