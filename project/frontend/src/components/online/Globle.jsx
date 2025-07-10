import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, Alert } from '@mui/material';
import Header from '../Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from '../countryInfo';
import officialCountries from '../officialCountries';

const OnlineGloble = ({ socket, matchId, gameState, onAnswerSubmit }) => {
  const [countries, setCountries] = useState([]);
  const [secretCountry, setSecretCountry] = useState(null);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load countries data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        setCountries(data.features);
        // Create options for autocomplete
        const options = data.features.map(country => ({
          label: country.properties.name,
          value: country
        }));
        setCountryOptions(options);
      })
      .catch(error => {
        console.error('Error loading countries:', error);
      });
  }, []);

  useEffect(() => {
    if ((gameState === 'playing' || gameState === 'countdown') && countries.length > 0) {
      startNewRound();
    }
  }, [gameState, countries]);

  const startNewRound = () => {
    // Select a random country
    const validCountries = countries.filter(country => {
      try {
        const center = getCountryCenter(country);
        const hasValidCoordinates = center.lat !== 0 && center.lon !== 0;
        const isOfficialCountry = countryInfo[country.properties.name] && officialCountries.includes(country.properties.name);
        return hasValidCoordinates && isOfficialCountry;
      } catch (e) {
        return false;
      }
    });
    
    const randomIndex = Math.floor(Math.random() * validCountries.length);
    const selectedCountry = validCountries[randomIndex];
    setSecretCountry(selectedCountry);
    setGuessedCountries([]);
    setGuess('');
    setMessage('Guess a country!');
    setGameOver(false);
    setError('');
    
    // Reset map view
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2, { animate: true, duration: 1 });
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getColor = (distance) => {
    if (distance < 500) return '#43cea2'; // Green
    if (distance < 1500) return '#ffd700'; // Yellow
    if (distance < 2500) return '#ff8c00'; // Orange
    if (distance < 4000) return '#ff4500'; // Red
    return '#8b0000'; // Dark red
  };

  const getCountryCenter = (country) => {
    if (!country.geometry || !country.geometry.coordinates) {
      return { lat: 0, lon: 0 };
    }

    const coordinates = country.geometry.coordinates;
    let centerLat = 0, centerLon = 0, count = 0;

    if (country.geometry.type === 'Polygon') {
      coordinates[0].forEach(coord => {
        centerLon += coord[0];
        centerLat += coord[1];
        count++;
      });
    } else if (country.geometry.type === 'MultiPolygon') {
      coordinates.forEach(polygon => {
        polygon[0].forEach(coord => {
          centerLon += coord[0];
          centerLat += coord[1];
          count++;
        });
      });
    }

    return {
      lat: centerLat / count,
      lon: centerLon / count
    };
  };

  const handleGuess = () => {
    if (!guess.trim() || gameOver) return;

    const guessedCountry = countries.find(country => 
      country.properties.name.toLowerCase() === guess.toLowerCase()
    );

    if (!guessedCountry) {
      setError('Country not found. Please try again.');
      return;
    }

    setError('');
    const distance = calculateDistance(
      getCountryCenter(guessedCountry).lat,
      getCountryCenter(guessedCountry).lon,
      getCountryCenter(secretCountry).lat,
      getCountryCenter(secretCountry).lon
    );

    const newGuessedCountry = {
      ...guessedCountry,
      distance,
      color: getColor(distance)
    };

    setGuessedCountries(prev => [...prev, newGuessedCountry]);

    if (distance === 0) {
      setMessage('Correct! You found it!');
      setGameOver(true);
      onAnswerSubmit(guess);
    } else {
      const direction = getDistanceMessage(distance, guessedCountries.length > 0 ? guessedCountries[guessedCountries.length - 1].distance : null);
      setMessage(direction);
      setGuess('');
    }
  };

  const getDistanceMessage = (distance, lastDistance) => {
    let message = '';
    if (distance < 500) {
      message = 'Very hot!';
    } else if (distance < 1500) {
      message = 'Hot!';
    } else if (distance < 2500) {
      message = 'Warm';
    } else if (distance < 4000) {
      message = 'Cold';
    } else {
      message = 'Very cold';
    }

    if (lastDistance !== null) {
      if (distance < lastDistance) {
        message += ' - Getting closer!';
      } else if (distance > lastDistance) {
        message += ' - Getting farther!';
      } else {
        message += ' - Same distance';
      }
    }

    return message;
  };

  const handleCountrySelect = (event, newValue) => {
    if (newValue) {
      setGuess(newValue.label);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleGuess();
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
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={6}
          style={{ height: '100vh', width: '100vw', background: '#232a3b' }}
          ref={mapRef}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          dragging={true}
          zoomControl={!isMobile}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.2}
          />
          {countries.map((country, index) => {
            const guessedCountry = guessedCountries.find(gc => gc.properties.name === country.properties.name);
            const center = getCountryCenter(country);
            
            return (
              <GeoJSON
                key={index}
                data={country}
                style={{
                  color: guessedCountry ? guessedCountry.color : '#43cea2',
                  weight: guessedCountry ? 2 : 1,
                  fillOpacity: guessedCountry ? 0.7 : 0.2,
                  fillColor: guessedCountry ? guessedCountry.color : '#232a3b'
                }}
              />
            );
          })}
        </MapContainer>
      </Box>

      {/* Info Panel Overlay */}
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Globle
            </Typography>
            
            {gameState === 'playing' && (
              <>
                <Typography variant="body1" sx={{ color: '#b0c4de' }}>
                  {message}
                </Typography>
                
                <Autocomplete
                  options={countryOptions}
                  getOptionLabel={(option) => option.label}
                  onChange={handleCountrySelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Guess a country..."
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
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
                  )}
                />
                
                {error && (
                  <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                    {error}
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  onClick={handleGuess}
                  disabled={gameOver || !guess.trim()}
                  sx={{ bgcolor: '#43cea2' }}
                >
                  Submit Guess
                </Button>
              </>
            )}
            
            {guessedCountries.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  Guesses:
                </Typography>
                {guessedCountries.map((country, index) => (
                  <Typography key={index} variant="body2" sx={{ color: country.color }}>
                    {country.properties.name} - {Math.round(country.distance)}km
                  </Typography>
                ))}
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default OnlineGloble; 