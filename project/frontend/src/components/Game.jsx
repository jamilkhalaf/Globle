import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, Tooltip, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from './countryInfo';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Game = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]);
  const [secretCountry, setSecretCountry] = useState(null);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a country!');
  const [gameOver, setGameOver] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [lastDistance, setLastDistance] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const mapRef = useRef(null);
  
  // Game state
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Add state for showing more info
  const [showCountryInfo, setShowCountryInfo] = useState(false);

  // Add state for contact dialog
  const [contactOpen, setContactOpen] = useState(false);

  // Add state to track recently used countries for better variety
  const [recentlyUsedCountries, setRecentlyUsedCountries] = useState([]);

  // Function to show country selection statistics
  const logCountryVariety = (countryList) => {
    const continents = {
      'North America': 0,
      'South America': 0,
      'Europe': 0,
      'Asia': 0,
      'Africa': 0,
      'Oceania': 0
    };
    
    // Simple continent detection based on coordinates
    countryList.forEach(country => {
      try {
        const center = getCountryCenter(country);
        if (center.lat > 0 && center.lon < -30) {
          continents['North America']++;
        } else if (center.lat < 0 && center.lon < -30) {
          continents['South America']++;
        } else if (center.lat > 35 && center.lon > -10 && center.lon < 40) {
          continents['Europe']++;
        } else if (center.lat > 0 && center.lon > 40) {
          continents['Asia']++;
        } else if (center.lat < 0 && center.lon > -10 && center.lon < 40) {
          continents['Africa']++;
        } else if (center.lat < 0 && center.lon > 100) {
          continents['Oceania']++;
        }
      } catch (e) {
        // Skip countries with invalid coordinates
      }
    });
    
    console.log('Country distribution by continent:', continents);
  };

  // Function to categorize countries by difficulty
  const getCountryDifficulty = (countryName) => {
    // Well-known countries (easy)
    const easyCountries = [
      'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile',
      'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal',
      'China', 'Japan', 'India', 'Australia', 'South Africa', 'Egypt',
      'Russia', 'Turkey', 'Iran', 'Saudi Arabia', 'Thailand', 'Vietnam'
    ];
    
    // Medium difficulty countries
    const mediumCountries = [
      'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech Republic',
      'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Ukraine', 'Belarus',
      'Pakistan', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'Malaysia', 'Indonesia',
      'Philippines', 'New Zealand', 'Fiji', 'Papua New Guinea',
      'Nigeria', 'Kenya', 'Morocco', 'Algeria', 'Tunisia', 'Libya',
      'Sudan', 'Ethiopia', 'Somalia', 'Madagascar', 'Zimbabwe', 'Botswana',
      'Namibia', 'Mozambique', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi',
      'Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Paraguay',
      'Uruguay', 'Guyana', 'Suriname', 'French Guiana',
      'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua',
      'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic'
    ];
    
    if (easyCountries.includes(countryName)) return 'easy';
    if (mediumCountries.includes(countryName)) return 'medium';
    return 'hard';
  };

  const selectRandomCountry = (countryList) => {
    // Filter out countries that are too small, have invalid coordinates, or aren't in the official 196 countries
    const validCountries = countryList.filter(country => {
      try {
        const center = getCountryCenter(country);
        const hasValidCoordinates = center.lat !== 0 && center.lon !== 0;
        const isOfficialCountry = countryInfo[country.properties.name];
        return hasValidCoordinates && isOfficialCountry;
      } catch (e) {
        return false;
      }
    });
    
    // Filter out recently used countries (last 5 games) for better variety
    const availableCountries = validCountries.filter(country => 
      !recentlyUsedCountries.includes(country.properties.name)
    );
    
    // If we've used too many countries recently, reset the list
    const countriesToUse = availableCountries.length > 0 ? availableCountries : validCountries;
    
    // Add slight bias toward easier countries (70% chance for easy/medium, 30% for hard)
    const random = Math.random();
    let filteredCountries = countriesToUse;
    
    if (random < 0.7) {
      // 70% chance: prefer easy and medium countries
      const easyMediumCountries = countriesToUse.filter(country => {
        const difficulty = getCountryDifficulty(country.properties.name);
        return difficulty === 'easy' || difficulty === 'medium';
      });
      
      if (easyMediumCountries.length > 0) {
        filteredCountries = easyMediumCountries;
        console.log('Using easy/medium bias - filtered to', filteredCountries.length, 'countries');
      }
    } else {
      // 30% chance: include all countries (including hard ones)
      console.log('Using full country pool - no difficulty bias');
    }
    
    // Ensure we have a good mix of countries by not excluding any valid ones
    console.log(`Total countries available: ${countryList.length}`);
    console.log(`Valid countries after filtering: ${validCountries.length}`);
    console.log(`Available countries (excluding recent): ${countriesToUse.length}`);
    console.log(`Final selection pool: ${filteredCountries.length}`);
    
    // Use a more robust random selection
    const randomIndex = Math.floor(Math.random() * filteredCountries.length);
    const selectedCountry = filteredCountries[randomIndex];
    
    // Log the selection for debugging
    console.log(`Random index: ${randomIndex} out of ${filteredCountries.length}`);
    console.log(`Selected country: ${selectedCountry.properties.name}`);
    console.log(`Difficulty: ${getCountryDifficulty(selectedCountry.properties.name)}`);
    
    // Log some sample countries to verify variety
    const sampleCountries = filteredCountries.slice(0, 10).map(c => c.properties.name);
    console.log(`Sample of available countries: ${sampleCountries.join(', ')}`);
    
    // Log continent distribution for verification
    logCountryVariety(filteredCountries);
    
    return selectedCountry;
  };

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
        
        // Load best score
        loadBestScore();
        
        // Start new game
        const randomCountry = selectRandomCountry(data.features);
        setSecretCountry(randomCountry);
        setGameStartTime(Date.now());
        setMessage('Guess the country!');
      })
      .catch(error => {
        console.error('Error loading countries:', error);
        setMessage('Error loading countries data');
      });
  }, []);

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

    // Debug logging for specific countries
    if ((lat1 > 43 && lat1 < 44 && lon1 > 6 && lon1 < 8) || 
        (lat2 > 43 && lat2 < 44 && lon2 > 6 && lon2 < 8)) {
      console.log(`Distance calculation: (${lat1}, ${lon1}) to (${lat2}, ${lon2}) = ${cappedDistance} km`);
    }

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

    // Debug logging
    console.log(`Distance: ${cappedDistance}km`);

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

    // Debug logging for problematic countries
    if (country.properties.name === 'Monaco' || country.properties.name === 'France' || country.properties.name === 'Spain') {
      console.log(`Country: ${country.properties.name}, Center: ${center.lat}, ${center.lon}`);
    }

    return center;
  };

  const handleGuess = () => {
    if (!guess) return;

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
      const endTime = Date.now();
      const timeTaken = endTime - gameStartTime;
      const finalScore = calculateScore(timeTaken, newGuessedCountries.length);
      
      setGameEndTime(endTime);
      setScore(finalScore);
      saveBestScore(newGuessedCountries.length);
      
      setMessage(`🎉 Congratulations! You found ${secretCountry.properties.name}! 🎉`);
      setGameOver(true);
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
    if (newValue) {
      setGuess(newValue.label);
      const guessedCountry = countries.find(
        country => country.properties.name.toLowerCase() === newValue.label.toLowerCase()
      );
      
      if (guessedCountry) {
        if (guessedCountries.some(c => c.properties.name === guessedCountry.properties.name)) {
          setMessage('You already guessed this country!');
          return;
        }

        const newGuessedCountries = [...guessedCountries, guessedCountry];
        setGuessedCountries(newGuessedCountries);

        if (guessedCountry.properties.name === secretCountry.properties.name) {
          const endTime = Date.now();
          const timeTaken = endTime - gameStartTime;
          const finalScore = calculateScore(timeTaken, newGuessedCountries.length);
          
          setGameEndTime(endTime);
          setScore(finalScore);
          saveBestScore(newGuessedCountries.length);
          
          setMessage(`🎉 Congratulations! You found ${secretCountry.properties.name}! 🎉`);
          setGameOver(true);
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

  const resetGame = () => {
    // Start new game with different country
    let newSecretCountry;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop
    
    do {
      newSecretCountry = selectRandomCountry(countries);
      attempts++;
    } while (
      newSecretCountry.properties.name === secretCountry?.properties.name && 
      attempts < maxAttempts
    );
    
    // Track recently used countries for better variety
    if (secretCountry) {
      setRecentlyUsedCountries(prev => {
        const updated = [secretCountry.properties.name, ...prev.slice(0, 4)]; // Keep last 5
        console.log(`Recently used countries: ${updated.join(', ')}`);
        return updated;
      });
    }
    
    setSecretCountry(newSecretCountry);
    setGuessedCountries([]);
    setMessage('Guess the country!');
    setGameOver(false);
    setShowSecret(false);
    setLastDistance(null);
    setGuess('');
    setGameStartTime(Date.now());
    setGameEndTime(null);
    setScore(0);
  };

  const handleGiveUp = () => {
    setGameOver(true);
    setShowSecret(true);
    const endTime = Date.now();
    const timeTaken = endTime - gameStartTime;
    const finalScore = calculateScore(timeTaken, guessedCountries.length);
    
    setGameEndTime(endTime);
    setScore(finalScore);
    saveBestScore(guessedCountries.length);
    
    setMessage(`Game Over! The secret country was ${secretCountry.properties.name}`);
  };

  // Calculate score based on time and guesses
  const calculateScore = (timeTaken, numGuesses) => {
    const baseScore = 1000;
    const timePenalty = Math.floor(timeTaken / 1000) * 10; // 10 points per second
    const guessPenalty = (numGuesses - 1) * 50; // 50 points per extra guess
    return Math.max(0, baseScore - timePenalty - guessPenalty);
  };

  // Format time for display
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load best score (fewest attempts) from localStorage
  const loadBestScore = () => {
    const saved = localStorage.getItem('globleBestScore');
    if (saved) {
      setBestScore(parseInt(saved));
    }
  };

  // Save best score (fewest attempts) to localStorage
  const saveBestScore = (attempts) => {
    if (bestScore === 0 || attempts < bestScore) {
      setBestScore(attempts);
      localStorage.setItem('globleBestScore', attempts.toString());
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
      touchAction: 'none', // Prevent touch scrolling on the page
      WebkitOverflowScrolling: 'touch'
    }}>
      <Header />
      <Toolbar /> {/* This creates space for the fixed AppBar */}
      
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
        overflow: 'hidden', // Prevent scrolling
        touchAction: 'none' // Prevent touch scrolling
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
            touchAction: 'pan-x pan-y', // Allow only map panning
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
            const isGuessed = guessedCountries.some(c => c.properties.name === country.properties.name);
            const guessedCenter = isGuessed ? getCountryCenter(country) : null;
            const secretCenter = getCountryCenter(secretCountry);
            const distance = isGuessed ? calculateDistance(
              guessedCenter.lat, guessedCenter.lon,
              secretCenter.lat, secretCenter.lon
            ) : null;
            
            // Debug logging for specific countries
            if (isGuessed && (country.properties.name === 'France' || country.properties.name === 'Spain' || country.properties.name === 'Monaco')) {
              console.log(`${country.properties.name}: distance=${distance}km, color=${getColor(distance)}`);
            }
            
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
          {showSecret && secretCountry && (
            <GeoJSON
              data={secretCountry}
              style={{
                fillColor: '#FF0000',
                fillOpacity: 1,
                color: '#fff',
                weight: 2
              }}
            />
          )}
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
                color: gameOver ? '#4CAF50' : '#1976d2',
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
              {isMenuExpanded ? <ExpandLessIcon sx={{ fontSize: '16px' }} /> : <ExpandMoreIcon sx={{ fontSize: '16px' }} />}
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
                  disabled={gameOver}
                  fullWidth
                  variant="outlined"
                  size="small"
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      fontSize: '16px', // Prevents zoom on iOS
                      transform: 'scale(1)', // Prevents zoom
                    }
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
                        fontSize: '16px !important', // Prevents zoom on iOS
                        transform: 'scale(1) !important', // Prevents zoom
                        '&:focus': {
                          fontSize: '16px !important', // Maintains size on focus
                        }
                      }
                    },
                  }}
                />
              )}
              disabled={gameOver}
              fullWidth
              sx={{ flexGrow: 1 }}
              open={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              ListboxProps={{
                style: {
                  maxHeight: isMobile ? '100px' : '150px',
                  fontSize: { xs: '0.7rem', md: '0.9rem' }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleGuess}
              disabled={gameOver}
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
              }}
            >
              {isMobile ? '✓' : 'Guess'}
            </Button>
          </Box>

          {/* Collapsible content */}
          {isMenuExpanded && (
            <>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {!gameOver && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleGiveUp}
                    fullWidth
                    size="small"
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      fontSize: { xs: '0.6rem', md: '0.8rem' },
                      height: { xs: '28px', md: '36px' },
                      '&:hover': {
                        borderColor: '#b71c1c',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      },
                    }}
                  >
                    {isMobile ? 'X' : 'Give Up'}
                  </Button>
                )}
                {gameOver && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={resetGame}
                    fullWidth
                    size="small"
                    sx={{
                      backgroundColor: '#4CAF50',
                      fontSize: { xs: '0.6rem', md: '0.8rem' },
                      height: { xs: '28px', md: '36px' },
                      '&:hover': {
                        backgroundColor: '#388E3C',
                      },
                    }}
                  >
                    {isMobile ? '↻' : 'Next Country'}
                  </Button>
                )}
              </Box>

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
                  Best:
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#4CAF50',
                    fontSize: { xs: '0.6rem', md: '0.75rem' }
                  }}
                >
                  {bestScore || '--'}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Paper>

      {/* Footer with ? button */}
      <Box sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 16 },
        left: 0,
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 2001
      }}>
        <Button
          variant="outlined"
          sx={{ 
            borderRadius: '50%', 
            minWidth: 0, 
            width: { xs: 48, md: 40 }, 
            height: { xs: 48, md: 40 }, 
            fontSize: { xs: 28, md: 24 }, 
            color: 'white', 
            borderColor: 'white', 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' } 
          }}
          onClick={() => setContactOpen(true)}
          aria-label="Contact Info"
        >
          ?
        </Button>
      </Box>
      <Dialog open={contactOpen} onClose={() => setContactOpen(false)}>
        <DialogTitle>Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For questions, contact: <br />
            <b>Jamil Khalaf</b><br />
            <a href="mailto:jamilkhalaf04@gmail.com">jamilkhalaf04@gmail.com</a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Game; 