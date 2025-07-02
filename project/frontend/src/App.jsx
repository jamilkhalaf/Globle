import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import Home from './components/Home'
import Game from './components/Game'
import Wordle from './components/Wordle'
import Population from './components/population'
import Name from './components/name'
import Flagle from './components/Flagle'
import Worldle from './components/Worldle'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="/population" element={<Population />} />
          <Route path="/name" element={<Name />} />
          <Route path="/flagle" element={<Flagle />} />
          <Route path="/worldle" element={<Worldle />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
