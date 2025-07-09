import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, Typography, Paper, Button, Stack, Toolbar, useTheme, useMediaQuery, Fade } from '@mui/material';
import Header from './Header';
import NotificationModal from './NotificationModal';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import 'leaflet/dist/leaflet.css';
import stateList from './stateList.json';
import statesGeoData from './states.json';

const US = ({ targetState = null, isOnline = false, onAnswerSubmit = null, disabled = false }) => {
  const [statesGeo, setStatesGeo] = useState(null);
  const [currentTargetState, setCurrentTargetState] = useState('');
  const targetStateRef = useRef(currentTargetState);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showIntro, setShowIntro] = useState(!isOnline); // Don't show intro for online games
  const [clickedState, setClickedState] = useState(null);
  const mapRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setStatesGeo(statesGeoData);
  }, []);

  useEffect(() => {
    if (statesGeo && !showIntro) {
      if (targetState && isOnline) {
        // Use the provided target state for online games
        setCurrentTargetState(targetState);
        setMessage('');
        setGameOver(false);
        setShowContinue(false);
        setClickedState(null);
      } else {
        // Use random state for offline games
        startNewRound();
      }
    }
    // eslint-disable-next-line
  }, [statesGeo, showIntro, targetState, isOnline]);

  useEffect(() => {
    targetStateRef.current = currentTargetState;
  }, [currentTargetState]);

  const startNewRound = () => {
    setCurrentTargetState(stateList[Math.floor(Math.random() * stateList.length)]);
    setMessage('');
    setGameOver(false);
    setShowContinue(false);
    setClickedState(null);
    // Reset map view
    if (mapRef.current) {
      mapRef.current.setView([39.8283, -98.5795], 4, { animate: true, duration: 1 });
    }
  };

  const onEachState = (feature, layer) => {
    layer.on({
      click: () => handleStateClick(feature, layer)
    });
    layer.setStyle({
      color: '#43cea2',
      weight: 1.5,
      fillOpacity: 0.2,
      fillColor: '#232a3b',
    });
  };

  const handleStateClick = (feature, layer) => {
    if (gameOver || disabled) return;
    let clickedName = 'Unknown';
    if (feature && feature.properties) {
      clickedName = feature.properties.NAME || feature.properties.name || feature.properties.State || 'Unknown';
    }
    const currentTarget = targetStateRef.current;
    console.log('Clicked:', clickedName, 'Target:', currentTarget, 'Types:', typeof clickedName, typeof currentTarget, 'Raw:', JSON.stringify(clickedName), JSON.stringify(currentTarget)); // Enhanced debug log
    setClickedState(clickedName);
    setGameOver(true); // Only allow one click per round
    
    // For online mode, immediately call onAnswerSubmit and end the game
    if (isOnline && onAnswerSubmit) {
      console.log('US: Online mode - calling onAnswerSubmit with:', clickedName);
      onAnswerSubmit(clickedName);
      return; // End the game immediately for online mode
    }
    
    if (clickedName.trim().toLowerCase() === currentTarget.trim().toLowerCase()) {
      setMessage('Correct!');
      setScore(prev => {
        const newScore = prev + 1;
        updateGameStats(newScore, streak + 1);
        return newScore;
      });
      setStreak(prev => prev + 1);
      setShowContinue(true);
      layer.setStyle({ fillColor: '#43cea2', fillOpacity: 0.7 });
    } else {
      setMessage(`Wrong! That was ${clickedName}.`);
      setStreak(0);
      updateGameStats(score, 0);
      setShowContinue(true);
      layer.setStyle({ fillColor: '#f44336', fillOpacity: 0.7 });
    }
  };

  const handleContinue = () => {
    setShowContinue(false);
    startNewRound();
  };

  useEffect(() => {
    if (!showContinue) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleContinue();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showContinue]);

  // Add this function to update stats and badges
  const updateGameStats = async (finalScore, streak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch('https://api.jamilweb.click/api/games/update-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'usstates',
          score: finalScore,
          streak: streak,
          attempts: 1 // One round per guess
        }),
      });
      await fetch('https://api.jamilweb.click/api/badges/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'usstates',
          score: finalScore,
          streak: streak,
          attempts: 1
        }),
      });
    } catch (error) {
      console.error('Error updating US States stats/badges:', error);
    }
  };

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play US States Map Game"
          description="Click the correct US state on the map when prompted. Try to get the highest streak!"
          color="primary"
        />
      </>
    );
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)' }}>
      <Header />
      <Toolbar />
      {/* Map Fullscreen */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
        {statesGeo && (
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            minZoom={3}
            maxZoom={7}
            style={{ height: '100vh', width: '100vw', background: '#232a3b' }}
            ref={mapRef}
            scrollWheelZoom={true}
            doubleClickZoom={false}
            dragging={!gameOver}
            zoomControl={!isMobile}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.2}
            />
            <GeoJSON data={statesGeo} onEachFeature={onEachState} style={feature => {
              const name = feature.properties.NAME || feature.properties.name || feature.properties.State || 'Unknown';
              let fillColor = '#232a3b';
              if (gameOver) {
                if (name === currentTargetState) fillColor = '#43cea2';
                else if (name === clickedState) fillColor = '#f44336';
              }
              return {
                color: '#43cea2',
                weight: 1.5,
                fillOpacity: (gameOver && (name === currentTargetState || name === clickedState)) ? 0.7 : 0.2,
                fillColor
              };
            }} />
          </MapContainer>
        )}
      </Box>
      {/* Info Panel Overlay */}
      <Fade in timeout={600}>
        <Paper elevation={8} sx={{
          position: 'absolute',
          top: { xs: 16, md: 80 },
          left: { xs: '50%', md: 32 },
          transform: { xs: 'translateX(-50%)', md: 'none' },
          width: { xs: '90vw', md: 340 },
          maxWidth: 400,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background: 'rgba(30,34,44,0.98)',
          color: 'white',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
          zIndex: 1200,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 900, color: 'transparent', background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>US States</Typography>
          <Typography variant="h6" sx={{ mb: 2, color: '#43cea2', textAlign: 'center' }}>Find: <b>{currentTargetState}</b></Typography>
          <Typography variant="h6" sx={{ mb: 2, color: message.startsWith('Correct') ? '#43cea2' : '#f44336', minHeight: 32, textAlign: 'center' }}>{message}</Typography>
          <Stack direction="row" spacing={3} sx={{ mb: 2, width: '100%', justifyContent: 'center' }}>
            <Typography>Score: {score}</Typography>
            <Typography>Streak: {streak}</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={startNewRound} sx={{ color: '#ccc', borderColor: '#666', fontWeight: 'bold', '&:hover': { borderColor: '#999', backgroundColor: 'rgba(255,255,255,0.1)' } }}>Reset</Button>
            {showContinue && (
              <Button variant="contained" color="success" onClick={handleContinue} sx={{ fontWeight: 'bold' }}>Continue</Button>
            )}
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default US; 