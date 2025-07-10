import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import Header from './Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from './countryInfo';

const OnlineGloble = ({ 
  targetCountry = null, 
  onAnswerSubmit = null, 
  disabled = false, 
  opponentRoundsWon = 0,
  currentRoundNumber = 1,
  playerRoundsWon = 0
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]);
  const [secretCountry, setSecretCountry] = useState(null);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess the country!');
  const [lastDistance, setLastDistance] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const mapRef = useRef(null);
  
  // Game state
  const [gameStartTime, setGameStartTime] = useState(null);

  // Debug logging for props
  useEffect(() => {
    console.log('OnlineGloble component props:', { targetCountry, disabled, currentRoundNumber, playerRoundsWon, opponentRoundsWon });
  }, [targetCountry, disabled, currentRoundNumber, playerRoundsWon, opponentRoundsWon]);

  // Initialize online mode
  useEffect(() => {
    if (targetCountry) {
      console.log('Initializing online mode with target:', targetCountry);
      setMessage('Guess the country!');
      setGameStartTime(Date.now());
      
      // For online mode, we need to find the country object from the countries list
      if (countries.length > 0) {
        const targetCountryObj = countries.find(c => c.properties.name === targetCountry);
        if (targetCountryObj) {
          setSecretCountry(targetCountryObj);
        }
      }
    }
  }, [targetCountry, countries]);

  // Load countries data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        // Filter out countries with invalid geometry
        const validCountries = data.features.filter(country => 
          country && 
          country.properties && 
          country.properties.name && 
          country.geometry && 
          country.geometry.coordinates
        );
        
        console.log(`Loaded ${validCountries.length} valid countries out of ${data.features.length} total`);
        setCountries(validCountries);
        
        if (targetCountry) {
          // For online mode, find the target country object
          const targetCountryObj = validCountries.find(c => c.properties.name === targetCountry);
          if (targetCountryObj) {
            setSecretCountry(targetCountryObj);
            setMessage('Guess the country!');
          } else {
            console.error('Target country not found in valid countries:', targetCountry);
            setMessage('Error: Target country not found');
          }
        }
        
        setGameStartTime(Date.now());
        
        // Set up country options for autocomplete
        const options = validCountries
          .filter(country => country.properties.name) // Include all countries
          .map(country => country.properties.name)
          .sort((a, b) => a.localeCompare(b));
        setCountryOptions(options);
      })
      .catch(error => {
        console.error('Error loading countries:', error);
        setMessage('Error loading countries data');
      });
  }, [targetCountry]);

  // Handle map initialization and viewport fitting
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      
      // Ensure map fits the viewport properly
      setTimeout(() => {
        map.invalidateSize();
        map.setView([20, 0], 3);
        
        // Set bounds to prevent scrolling beyond world map
        map.setMaxBounds([[-85, -180], [85, 180]]);
        map.setMinZoom(3);
        map.setMaxZoom(10);
        
        // Add zoom event handler to enforce minimum zoom
        map.on('zoomend', () => {
          const currentZoom = map.getZoom();
          if (currentZoom < 3) {
            map.setZoom(3);
          }
        });
      }, 100);

      // Handle window resize
      const handleResize = () => {
        map.invalidateSize();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [countries.length > 0]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Check for invalid coordinates
    if ((lat1 === 0 && lon1 === 0) || (lat2 === 0 && lon2 === 0) || 
        isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      console.error('Invalid coordinates detected:', { lat1, lon1, lat2, lon2 });
      return 5000; // Return a medium distance instead of very large
    }

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Cap the distance to prevent extreme values
    const cappedDistance = Math.min(distance, 20000);

    return cappedDistance;
  };

  const getColor = (distance) => {
    // Ensure distance is a valid number and cap it
    if (isNaN(distance) || distance < 0) {
      console.error('Invalid distance value:', distance);
      return '#FFFF00'; // Return yellow for invalid distances
    }

    // Cap distance to prevent extreme values
    const cappedDistance = Math.min(distance, 10000);

    // Simple color logic - yellow to dark red
    if (cappedDistance < 100) {
      return '#8B0000'; // Dark red
    } else if (cappedDistance < 300) {
      return '#FF0000'; // Red
    } else if (cappedDistance < 600) {
      return '#FF4500'; // Orange red
    } else if (cappedDistance < 1000) {
      return '#FF8C00'; // Orange
    } else if (cappedDistance < 1500) {
      return '#FFA500'; // Dark orange
    } else if (cappedDistance < 2000) {
      return '#DAA520'; // Goldenrod
    } else if (cappedDistance < 2500) {
      return '#FFD700'; // Gold
    } else if (cappedDistance < 3000) {
      return '#B8860B'; // Dark yellow
    } else if (cappedDistance < 4000) {
      return '#FFFF00'; // Yellow
    } else if (cappedDistance < 5000) {
      return '#FFFFE0'; // Light yellow
    } else {
      return '#FDF5E6'; // Pale yellow
    }
  };

  const getDistanceMessage = (distance, lastDistance) => {
    if (!lastDistance) return 'First guess!';
    
    const difference = lastDistance - distance;
    const percentChange = (difference / lastDistance) * 100;
    
    if (distance < 100) return 'Very hot! You are very close!';
    if (distance < 500) return 'Hot! Getting closer!';
    if (distance < 1000) return 'Warm! Keep going!';
    if (distance < 2000) return 'Cool, but still far away.';
    
    if (percentChange > 20) return 'Much warmer!';
    if (percentChange > 10) return 'Getting warmer!';
    if (percentChange < -20) return 'Much colder!';
    if (percentChange < -10) return 'Getting colder!';
    
    return 'About the same distance.';
  };

  const getCountryCenter = (country) => {
    // Handle different GeoJSON coordinate structures
    let coordinates = [];
    
    if (country.geometry.type === 'Polygon') {
      coordinates = country.geometry.coordinates[0];
    } else if (country.geometry.type === 'MultiPolygon') {
      // For MultiPolygon, find the largest polygon (main territory)
      let largestPolygon = null;
      let maxArea = 0;
      
      country.geometry.coordinates.forEach(polygonGroup => {
        polygonGroup.forEach(polygon => {
          // Calculate approximate area of this polygon
          let area = 0;
          for (let i = 0; i < polygon.length - 1; i++) {
            const [lon1, lat1] = polygon[i];
            const [lon2, lat2] = polygon[i + 1];
            area += (lon2 - lon1) * (lat1 + lat2) / 2;
          }
          area = Math.abs(area);
          
          if (area > maxArea) {
            maxArea = area;
            largestPolygon = polygon;
          }
        });
      });
      
      if (largestPolygon) {
        coordinates = largestPolygon;
      } else {
        // Fallback to first polygon if area calculation fails
        coordinates = country.geometry.coordinates[0][0];
      }
    }

    if (!coordinates || coordinates.length === 0) {
      console.error('Invalid coordinates for country:', country.properties.name);
      return { lat: 0, lon: 0 };
    }

    let sumLat = 0;
    let sumLon = 0;
    let count = 0;

    coordinates.forEach(coord => {
      if (Array.isArray(coord) && coord.length >= 2) {
        sumLat += coord[1];
        sumLon += coord[0];
        count++;
      }
    });

    if (count === 0) {
      console.error('No valid coordinates found for country:', country.properties.name);
      return { lat: 0, lon: 0 };
    }

    const center = {
      lat: sumLat / count,
      lon: sumLon / count
    };

    return center;
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (guess.trim()) {
        handleGuess();
      }
    }
  };

  // Handle online game state changes from parent
  useEffect(() => {
    if (!disabled) {
      console.log('OnlineGloble: New round starting, resetting game state');
      setLastDistance(null);
      setGuess('');
      setGuessedCountries([]);
      setGameStartTime(Date.now());
      setMessage('Guess the country!');
    }
  }, [disabled, targetCountry]); // Reset when target country changes (new round)

  // Add notification state for opponent's correct guess
  const [opponentCorrect, setOpponentCorrect] = useState(false);
  const [opponentCorrectMessage, setOpponentCorrectMessage] = useState('');

  // Listen for opponent correct notifications
  useEffect(() => {
    const handlePlayerCorrect = (event) => {
      const data = event.detail;
      const currentUsername = localStorage.getItem('username') || 'You';
      
      if (data.correctPlayer !== currentUsername) {
        setOpponentCorrect(true);
        setOpponentCorrectMessage(`${data.correctPlayer} found the answer in ${data.timeTaken}s!`);
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setOpponentCorrect(false);
          setOpponentCorrectMessage('');
        }, 3000);
      }
    };

    window.addEventListener('playerCorrect', handlePlayerCorrect);
    return () => window.removeEventListener('playerCorrect', handlePlayerCorrect);
  }, []);

  // Dispatch custom event when we get correct answer
  const dispatchPlayerCorrect = (timeTaken) => {
    const currentUsername = localStorage.getItem('username') || 'You';
    const event = new CustomEvent('playerCorrect', {
      detail: {
        correctPlayer: currentUsername,
        correctAnswer: secretCountry?.properties?.name,
        timeTaken: timeTaken
      }
    });
    window.dispatchEvent(event);
  };

  const handleGuess = () => {
    if (!guess || disabled) {
      console.log('OnlineGloble: handleGuess blocked - guess:', guess, 'disabled:', disabled);
      return;
    }

    const guessedCountry = countries.find(
      country => country.properties.name.toLowerCase() === guess.toLowerCase()
    );

    if (!guessedCountry) {
      setMessage('Country not found. Try again!');
      return;
    }

    if (guessedCountries.some(c => c.properties.name === guessedCountry.properties.name)) {
      setMessage('You already guessed this country!');
      return;
    }

    const newGuessedCountries = [...guessedCountries, guessedCountry];
    setGuessedCountries(newGuessedCountries);

    if (guessedCountry.properties.name === secretCountry.properties.name) {
      // Online mode: just call onAnswerSubmit and let parent handle round logic
      console.log('OnlineGloble: Correct answer, calling onAnswerSubmit with:', guessedCountry.properties.name);
      
      const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
      
      if (onAnswerSubmit) {
        onAnswerSubmit(guessedCountry.properties.name);
      }
      
      // Dispatch event for opponent notification
      dispatchPlayerCorrect(timeTaken);
      
      // Disable the game while waiting for round result
      setMessage(`🎉 Correct! You found it in ${timeTaken}s! Waiting for round result... 🎉`);
    } else {
      // Calculate distance between guessed country and secret country
      const guessedCenter = getCountryCenter(guessedCountry);
      const secretCenter = getCountryCenter(secretCountry);
      const distance = calculateDistance(
        guessedCenter.lat, guessedCenter.lon,
        secretCenter.lat, secretCenter.lon
      );
      
      const distanceMessage = getDistanceMessage(distance, lastDistance);
      setLastDistance(distance);
      
      setMessage(`${distanceMessage} (${Math.round(distance)} km away)`);
    }

    setGuess('');
  };

  const handleCountrySelect = (event, newValue) => {
    if (newValue && !disabled) {
      const selectedCountry = typeof newValue === 'string' ? newValue : newValue.label;
      setGuess(selectedCountry);
      
      const guessedCountry = countries.find(
        country => country.properties.name.toLowerCase() === selectedCountry.toLowerCase()
      );
      
      if (guessedCountry) {
        if (guessedCountries.some(c => c.properties.name === guessedCountry.properties.name)) {
          setMessage('You already guessed this country!');
          return;
        }

        const newGuessedCountries = [...guessedCountries, guessedCountry];
        setGuessedCountries(newGuessedCountries);

        if (guessedCountry.properties.name === secretCountry.properties.name) {
          // Online mode: just call onAnswerSubmit and let parent handle round logic
          console.log('OnlineGloble: Correct answer via dropdown, calling onAnswerSubmit with:', guessedCountry.properties.name);
          
          const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
          
          if (onAnswerSubmit) {
            onAnswerSubmit(guessedCountry.properties.name);
          }
          
          // Dispatch event for opponent notification
          dispatchPlayerCorrect(timeTaken);
          
          // Disable the game while waiting for round result
          setMessage(`🎉 Correct! You found it in ${timeTaken}s! Waiting for round result... 🎉`);
        } else {
          const guessedCenter = getCountryCenter(guessedCountry);
          const secretCenter = getCountryCenter(secretCountry);
          const distance = calculateDistance(
            guessedCenter.lat, guessedCenter.lon,
            secretCenter.lat, secretCenter.lon
          );
          
          const distanceMessage = getDistanceMessage(distance, lastDistance);
          setLastDistance(distance);
          
          setMessage(`${distanceMessage} (${Math.round(distance)} km away)`);
        }
      }
      setGuess('');
      setIsDropdownOpen(false);
    }
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      backgroundColor: '#2b2b2b',
      touchAction: 'none',
      WebkitOverflowScrolling: 'touch',
      // Add CSS animation for notifications
      '& @keyframes fadeInOut': {
        '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' },
        '20%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
        '80%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
        '100%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' }
      }
    }}>
      <Header />
      <Toolbar />
      
      {/* Online Mode Banner */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 90, md: 100 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          backgroundColor: 'rgba(67, 206, 162, 0.95)',
          color: 'white',
          padding: { xs: '6px 12px', md: '12px 24px' },
          borderRadius: 2,
          boxShadow: 3,
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.2)',
          maxWidth: { xs: '90%', md: 'auto' },
          width: { xs: 'auto', md: 'auto' }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: { xs: '0.8rem', md: '1.1rem' }
          }}
        >
          🎮 ONLINE MODE - Round {currentRoundNumber}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '0.6rem', md: '0.9rem' },
            opacity: 0.9
          }}
        >
          You: {playerRoundsWon} | Opponent: {opponentRoundsWon} | First to 5 wins!
        </Typography>
      </Box>

      {/* Opponent Correct Notification */}
      {opponentCorrect && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 150, md: 160 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2001,
            backgroundColor: 'rgba(255, 193, 7, 0.95)',
            color: 'black',
            padding: { xs: '8px 16px', md: '12px 24px' },
            borderRadius: 2,
            boxShadow: 3,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)',
            maxWidth: { xs: '90%', md: 'auto' },
            width: { xs: 'auto', md: 'auto' },
            animation: 'fadeInOut 3s ease-in-out'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '0.8rem', md: '1rem' }
            }}
          >
            ⚡ {opponentCorrectMessage}
          </Typography>
        </Box>
      )}
      
      <Box sx={{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: 1,
        backgroundColor: '#2b2b2b',
        overflow: 'hidden',
        touchAction: 'none'
      }}>
        <MapContainer
          center={[20, 0]}
          zoom={isMobile ? 2 : 3}
          minZoom={isMobile ? 2 : 3}
          maxZoom={10}
          style={{ 
            height: '100vh', 
            width: '100vw',
            position: 'absolute',
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            zIndex: 1,
            backgroundColor: '#2b2b2b',
            touchAction: 'pan-x pan-y',
            overflow: 'hidden'
          }}
          zoomControl={!isMobile}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          dragging={true}
          touchZoom={true}
          boxZoom={false}
          keyboard={false}
          maxBounds={[[-85, -180], [85, 180]]}
          maxBoundsViscosity={1.0}
          ref={mapRef}
          whenCreated={(map) => {
            map.setMinZoom(isMobile ? 2 : 3);
            map.setMaxZoom(10);
            map.setMaxBounds([[-85, -180], [85, 180]]);
            map.on('zoomend', () => {
              const currentZoom = map.getZoom();
              if (currentZoom < (isMobile ? 2 : 3)) {
                map.setZoom(isMobile ? 2 : 3);
              }
            });
            
            // Prevent page scrolling when interacting with map
            map.on('touchstart', (e) => {
              e.originalEvent.stopPropagation();
            });
            
            map.on('touchmove', (e) => {
              e.originalEvent.stopPropagation();
            });
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            noWrap={true}
            updateWhenZooming={false}
            updateWhenIdle={true}
            keepBuffer={3}
            maxNativeZoom={18}
            maxZoom={10}
          />
          {countries.map((country, index) => {
            // Skip countries with invalid geometry
            if (!country || !country.properties || !country.properties.name || !country.geometry || !country.geometry.coordinates) {
              console.warn('Skipping country with invalid geometry:', country);
              return null;
            }
            
            const isGuessed = guessedCountries.some(c => c.properties.name === country.properties.name);
            const guessedCenter = isGuessed ? getCountryCenter(country) : null;
            const secretCenter = getCountryCenter(secretCountry);
            const distance = isGuessed ? calculateDistance(
              guessedCenter.lat, guessedCenter.lon,
              secretCenter.lat, secretCenter.lon
            ) : null;
            
            // Determine fill color
            let fillColor = '#333'; // Default for unguessed countries
            if (isGuessed && distance !== null) {
              fillColor = getColor(distance);
            }
            
            return (
              <GeoJSON
                key={index}
                data={country}
                style={{
                  fillColor: fillColor,
                  fillOpacity: isGuessed ? 0.9 : 0.3,
                  color: '#666',
                  weight: 1
                }}
              />
            );
          })}
        </MapContainer>
      </Box>

      {/* Game Info Panel */}
      <Paper
        sx={{
          position: 'absolute',
          top: { xs: 70, md: 80 },
          left: { xs: 10, md: 20 },
          right: { xs: 'auto', md: 'auto' },
          transform: { xs: 'none', md: 'none' },
          padding: { xs: 1, md: 2 },
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          zIndex: 1000,
          maxWidth: { xs: '200px', md: '320px' },
          width: { xs: '200px', md: '320px' },
          boxShadow: 3,
          borderRadius: { xs: 1, md: 2 },
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Stack spacing={isMobile ? 1 : 2}>
          {/* Header with expand/collapse button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="caption"
              sx={{ 
                fontWeight: 'bold',
                color: '#1976d2',
                fontSize: { xs: '0.75rem', md: '1.1rem' },
                lineHeight: 1.2,
                flex: 1,
                mr: 1
              }}
            >
              {message}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              sx={{ 
                color: 'white',
                padding: 0.25,
                minWidth: '24px',
                height: '24px',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              {isMenuExpanded ? '−' : '+'}
            </IconButton>
          </Box>

          {/* Always visible: Country input */}
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Autocomplete
              value={guess}
              onChange={handleCountrySelect}
              onInputChange={(event, newInputValue) => {
                setGuess(newInputValue);
                setIsDropdownOpen(newInputValue.length > 0);
              }}
              options={countryOptions}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.label
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Country"
                  disabled={disabled}
                  fullWidth
                  variant="outlined"
                  size="small"
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      fontSize: '16px',
                      transform: 'scale(1)',
                    },
                    onKeyDown: handleInputKeyDown
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      fontSize: { xs: '0.7rem', md: '0.9rem' },
                      height: { xs: '32px', md: '40px' },
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      },
                      '& input': {
                        padding: { xs: '6px 8px', md: '8px 12px' },
                        fontSize: { xs: '0.7rem', md: '0.9rem' },
                        fontSize: '16px !important',
                        transform: 'scale(1) !important',
                        '&:focus': {
                          fontSize: '16px !important',
                        }
                      }
                    },
                  }}
                />
              )}
              disabled={disabled}
              fullWidth
              sx={{ flexGrow: 1 }}
              open={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onKeyDown={handleInputKeyDown}
              ListboxProps={{
                style: {
                  maxHeight: isMobile ? '100px' : '150px',
                  fontSize: { xs: '0.7rem', md: '0.9rem' }
                }
              }}
              filterOptions={(options, { inputValue }) => {
                const filtered = options.filter(option => 
                  option.toLowerCase().includes(inputValue.toLowerCase())
                );
                return filtered.slice(0, 10);
              }}
              isOptionEqualToValue={(option, value) => 
                option.toLowerCase() === value.toLowerCase()
              }
            />
            <Button
              variant="contained"
              onClick={handleGuess}
              disabled={disabled || !guess.trim()}
              size="small"
              sx={{
                minWidth: { xs: '40px', md: '60px' },
                height: { xs: '32px', md: '40px' },
                backgroundColor: '#1976d2',
                fontSize: { xs: '0.6rem', md: '0.8rem' },
                padding: { xs: '4px 8px', md: '8px 16px' },
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                '&:disabled': {
                  backgroundColor: '#666',
                  color: '#999',
                },
              }}
            >
              {isMobile ? '✓' : 'Guess'}
            </Button>
          </Box>

          {/* Collapsible content */}
          {isMenuExpanded && (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: { xs: 0.5, md: 1 },
                borderRadius: 0.5,
                fontSize: { xs: '0.6rem', md: '0.75rem' }
              }}>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', md: '0.75rem' }, color: '#ccc' }}>
                  Guessed:
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1976d2',
                    fontSize: { xs: '0.6rem', md: '0.75rem' }
                  }}
                >
                  {guessedCountries.length}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default OnlineGloble; 