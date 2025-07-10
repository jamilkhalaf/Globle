import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, Alert } from '@mui/material';
import Header from '../Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from '../countryInfo';
import officialCountries from '../officialCountries';

const OnlinePopulation = ({ socket, matchId, gameState, onAnswerSubmit }) => {
  const [countries, setCountries] = useState([]);
  const [targetCountry, setTargetCountry] = useState(null);
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
    if (gameState === 'playing' && countries.length > 0) {
      startNewRound();
    }
  }, [gameState, countries]);

  const startNewRound = () => {
    // Select a random country with population data
    const validCountries = countries.filter(country => {
      const countryName = country.properties.name;
      return countryInfo[countryName] && countryInfo[countryName].population;
    });
    
    const randomIndex = Math.floor(Math.random() * validCountries.length);
    const selectedCountry = validCountries[randomIndex];
    setTargetCountry(selectedCountry);
    setGuessedCountries([]);
    setGuess('');
    setMessage('Guess the population!');
    setGameOver(false);
    setError('');
    
    // Reset map view
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2, { animate: true, duration: 1 });
    }
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

    const guessedPopulation = countryInfo[guessedCountry.properties.name]?.population;
    if (!guessedPopulation) {
      setError('Population data not available for this country.');
      return;
    }

    setError('');
    const targetPopulation = countryInfo[targetCountry.properties.name].population;
    const difference = Math.abs(guessedPopulation - targetPopulation);
    const percentageDiff = (difference / targetPopulation) * 100;

    const newGuessedCountry = {
      ...guessedCountry,
      guessedPopulation,
      actualPopulation: targetPopulation,
      difference,
      percentageDiff
    };

    setGuessedCountries(prev => [...prev, newGuessedCountry]);

    if (percentageDiff <= 5) {
      setMessage('Excellent! Very close!');
      setGameOver(true);
      onAnswerSubmit(guess);
    } else if (percentageDiff <= 15) {
      setMessage('Good guess!');
      setGuess('');
    } else if (percentageDiff <= 30) {
      setMessage('Not bad, try again!');
      setGuess('');
    } else {
      setMessage('Way off! Try again!');
      setGuess('');
    }
  };

  const formatPopulation = (population) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)}B`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population.toString();
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
            
            return (
              <GeoJSON
                key={index}
                data={country}
                style={{
                  color: guessedCountry ? '#43cea2' : '#43cea2',
                  weight: guessedCountry ? 2 : 1,
                  fillOpacity: guessedCountry ? 0.7 : 0.2,
                  fillColor: guessedCountry ? '#43cea2' : '#232a3b'
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
              Population
            </Typography>
            
            {gameState === 'playing' && (
              <>
                <Typography variant="body1" sx={{ color: '#b0c4de' }}>
                  {message}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Guess the population of a country
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
                  <Typography key={index} variant="body2" sx={{ color: '#43cea2' }}>
                    {country.properties.name} - {formatPopulation(country.guessedPopulation)} 
                    (Actual: {formatPopulation(country.actualPopulation)})
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

export default OnlinePopulation; 