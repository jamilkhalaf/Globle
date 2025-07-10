import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, Typography, Paper, Button, Stack, Toolbar, useTheme, useMediaQuery, Fade, TextField, Alert } from '@mui/material';
import Header from '../Header';
import NotificationModal from '../NotificationModal';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import 'leaflet/dist/leaflet.css';
import stateList from '../stateList.json';
import statesGeoData from '../states.json';

const OnlineUS = ({ socket, matchId, gameState, onAnswerSubmit }) => {
  const [statesGeo, setStatesGeo] = useState(null);
  const [targetState, setTargetState] = useState('');
  const [message, setMessage] = useState('');
  const [clickedState, setClickedState] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setStatesGeo(statesGeoData);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && statesGeo) {
      startNewRound();
    }
  }, [gameState, statesGeo]);

  const startNewRound = () => {
    setTargetState(stateList[Math.floor(Math.random() * stateList.length)]);
    setMessage('');
    setGameOver(false);
    setClickedState(null);
    setAnswer('');
    setError('');
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
    if (gameOver || gameState !== 'playing') return;
    
    let clickedName = 'Unknown';
    if (feature && feature.properties) {
      clickedName = feature.properties.NAME || feature.properties.name || feature.properties.State || 'Unknown';
    }
    
    setClickedState(clickedName);
    setGameOver(true);
    
    if (clickedName.trim().toLowerCase() === targetState.trim().toLowerCase()) {
      setMessage('Correct!');
      layer.setStyle({ fillColor: '#43cea2', fillOpacity: 0.7 });
      // Submit answer to server
      onAnswerSubmit(clickedName);
    } else {
      setMessage(`Wrong! That was ${clickedName}.`);
      layer.setStyle({ fillColor: '#f44336', fillOpacity: 0.7 });
      // Submit answer to server
      onAnswerSubmit(clickedName);
    }
  };

  const handleTextAnswer = () => {
    if (!answer.trim()) {
      setError('Please enter a state name');
      return;
    }
    
    setError('');
    onAnswerSubmit(answer.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleTextAnswer();
    }
  };

  if (gameState === 'waiting') {
    return (
      <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)' }}>
        <Header />
        <Toolbar />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
          <Typography variant="h4" sx={{ color: 'white' }}>
            Waiting for game to start...
          </Typography>
        </Box>
      </Box>
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
        <Box sx={{
          position: 'absolute',
          top: { xs: 10, md: 20 },
          left: { xs: 10, md: 20 },
          zIndex: 2,
          maxWidth: { xs: 'calc(100vw - 20px)', md: 400 }
        }}>
          <Paper sx={{
            p: 2,
            background: 'rgba(30,34,44,0.95)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CropSquareIcon sx={{ color: '#43cea2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  US States
                </Typography>
              </Box>
              
              {gameState === 'playing' && (
                <>
                  <Typography variant="body1" sx={{ color: '#b0c4de' }}>
                    Find: <strong>{targetState}</strong>
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Click on the map or type the state name
                  </Typography>
                  
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type state name..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={gameOver}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#43cea2' }
                      },
                      '& .MuiInputBase-input': { color: 'white' }
                    }}
                  />
                  
                  {error && (
                    <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                      {error}
                    </Alert>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={handleTextAnswer}
                    disabled={gameOver || !answer.trim()}
                    sx={{ bgcolor: '#43cea2' }}
                  >
                    Submit Answer
                  </Button>
                </>
              )}
              
              {message && (
                <Alert 
                  severity={message.includes('Correct') ? 'success' : 'error'}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {message}
                </Alert>
              )}
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default OnlineUS; 