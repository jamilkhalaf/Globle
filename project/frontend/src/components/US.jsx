import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, Typography, Paper, Button, Stack, Toolbar, useTheme, useMediaQuery, Fade } from '@mui/material';
import Header from './Header';
import NotificationModal from './NotificationModal';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import 'leaflet/dist/leaflet.css';
import stateList from './stateList.json';
import statesGeoData from './states.json';

const US = () => {
  const [statesGeo, setStatesGeo] = useState(null);
  const [targetState, setTargetState] = useState('');
  const targetStateRef = useRef(targetState);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [clickedState, setClickedState] = useState(null);
  const mapRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setStatesGeo(statesGeoData);
  }, []);

  useEffect(() => {
    if (statesGeo && !showIntro) startNewRound();
    // eslint-disable-next-line
  }, [statesGeo, showIntro]);

  useEffect(() => {
    targetStateRef.current = targetState;
  }, [targetState]);

  const startNewRound = () => {
    setTargetState(stateList[Math.floor(Math.random() * stateList.length)]);
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
    if (gameOver) return;
    let clickedName = 'Unknown';
    if (feature && feature.properties) {
      clickedName = feature.properties.NAME || feature.properties.name || feature.properties.State || 'Unknown';
    }
    const currentTarget = targetStateRef.current;
    console.log('Clicked:', clickedName, 'Target:', currentTarget, 'Types:', typeof clickedName, typeof currentTarget, 'Raw:', JSON.stringify(clickedName), JSON.stringify(currentTarget)); // Enhanced debug log
    setClickedState(clickedName);
    setGameOver(true); // Only allow one click per round
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
                if (name === targetState) fillColor = '#43cea2';
                else if (name === clickedState) fillColor = '#f44336';
              }
              return {
                color: '#43cea2',
                weight: 1.5,
                fillOpacity: (gameOver && (name === targetState || name === clickedState)) ? 0.7 : 0.2,
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
          top: { xs: 100, sm: 120, md: 80 },
          left: { xs: '50%', md: 32 },
          transform: { xs: 'translateX(-50%)', md: 'none' },
          width: { xs: '85vw', sm: '80vw', md: 340 },
          maxWidth: { xs: 320, sm: 350, md: 400 },
          p: { xs: 1, sm: 1.5, md: 3 },
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
          <Typography variant="h4" sx={{ 
            mb: { xs: 0.5, sm: 1, md: 2 }, 
            fontWeight: 900, 
            color: 'transparent', 
            background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            letterSpacing: 2, 
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.125rem' }
          }}>
            US States
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: { xs: 0.5, sm: 1, md: 2 }, 
            color: '#43cea2', 
            textAlign: 'center',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
          }}>
            Find: <b>{targetState}</b>
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: { xs: 0.5, sm: 1, md: 2 }, 
            color: message.startsWith('Correct') ? '#43cea2' : '#f44336', 
            minHeight: { xs: 24, sm: 28, md: 32 }, 
            textAlign: 'center',
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.25rem' }
          }}>
            {message}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ 
            mb: { xs: 0.5, sm: 1, md: 2 }, 
            width: '100%', 
            justifyContent: 'center',
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' }
          }}>
            <Typography sx={{ fontSize: 'inherit' }}>Score: {score}</Typography>
            <Typography sx={{ fontSize: 'inherit' }}>Streak: {streak}</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ 
            width: '100%', 
            justifyContent: 'center',
            gap: { xs: 0.5, sm: 1 }
          }}>
            <Button 
              variant="outlined" 
              onClick={startNewRound} 
              size="small"
              sx={{ 
                color: '#ccc', 
                borderColor: '#666', 
                fontWeight: 'bold', 
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                py: { xs: 0.3, sm: 0.5 },
                px: { xs: 1, sm: 1.5 },
                '&:hover': { 
                  borderColor: '#999', 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                } 
              }}
            >
              Reset
            </Button>
            {showContinue && (
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleContinue} 
                size="small"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  py: { xs: 0.3, sm: 0.5 },
                  px: { xs: 1, sm: 1.5 }
                }}
              >
                Continue
              </Button>
            )}
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default US; 