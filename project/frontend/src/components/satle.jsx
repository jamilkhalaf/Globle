import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  Chip,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Popper,
  ClickAwayListener
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';

const Satle = () => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Sample cities with coordinates (longitude, latitude)
  const cities = [
    { name: 'Paris', coords: [2.3522, 48.8566] },
    { name: 'New York', coords: [-74.0060, 40.7128] },
    { name: 'London', coords: [-0.1276, 51.5074] },
    { name: 'Tokyo', coords: [139.6917, 35.6895] },
    { name: 'Sydney', coords: [151.2093, -33.8688] },
    { name: 'Dubai', coords: [55.2708, 25.2048] },
    { name: 'Singapore', coords: [103.8198, 1.3521] },
    { name: 'Mumbai', coords: [72.8777, 19.0760] },
    { name: 'Cairo', coords: [31.2357, 30.0444] },
    { name: 'Rio de Janeiro', coords: [-43.1729, -22.9068] },
    { name: 'Los Angeles', coords: [-118.2437, 34.0522] },
    { name: 'Moscow', coords: [37.6173, 55.7558] },
    { name: 'Beijing', coords: [116.4074, 39.9042] },
    { name: 'Mexico City', coords: [-99.1332, 19.4326] },
    { name: 'Berlin', coords: [13.4050, 52.5200] },
    { name: 'Rome', coords: [12.4964, 41.9028] },
    { name: 'Istanbul', coords: [28.9784, 41.0082] },
    { name: 'Bangkok', coords: [100.5018, 13.7563] },
    { name: 'Toronto', coords: [-79.3832, 43.6532] },
    { name: 'San Francisco', coords: [-122.4194, 37.7749] },
    { name: 'Hong Kong', coords: [114.1694, 22.3193] },
    { name: 'Barcelona', coords: [2.1734, 41.3851] },
    { name: 'Buenos Aires', coords: [-58.3816, -34.6037] },
    { name: 'Lagos', coords: [3.3792, 6.5244] },
    { name: 'Seoul', coords: [126.9780, 37.5665] },
    { name: 'Johannesburg', coords: [28.0473, -26.2041] },
    { name: 'Karachi', coords: [67.0011, 24.8607] },
    { name: 'Nairobi', coords: [36.8219, -1.2921] },
    { name: 'Lima', coords: [-77.0428, -12.0464] },
    { name: 'Chicago', coords: [-87.6298, 41.8781] },
    { name: 'Jakarta', coords: [106.8456, -6.2088] },
    { name: 'Tehran', coords: [51.3890, 35.6892] },
    { name: 'Warsaw', coords: [21.0122, 52.2297] },
    { name: 'Kuala Lumpur', coords: [101.6869, 3.1390] },
    { name: 'Athens', coords: [23.7275, 37.9838] },
    { name: 'Budapest', coords: [19.0402, 47.4979] },
    { name: 'Cape Town', coords: [18.4241, -33.9249] },
    { name: 'Santiago', coords: [-70.6483, -33.4489] },
    { name: 'Hanoi', coords: [105.8544, 21.0285] },
    { name: 'Havana', coords: [-82.3666, 23.1136] },
    { name: 'Manila', coords: [120.9842, 14.5995] },
    { name: 'Boston', coords: [-71.0589, 42.3601] },
    { name: 'Oslo', coords: [10.7522, 59.9139] },
    { name: 'Stockholm', coords: [18.0686, 59.3293] },
    { name: 'Helsinki', coords: [24.9384, 60.1699] },
    { name: 'Copenhagen', coords: [12.5683, 55.6761] },
    { name: 'Dublin', coords: [-6.2603, 53.3498] },
    { name: 'Edinburgh', coords: [-3.1883, 55.9533] },
    { name: 'Lisbon', coords: [-9.1393, 38.7223] },
    { name: 'Prague', coords: [14.4378, 50.0755] },
    { name: 'Vienna', coords: [16.3738, 48.2082] },
    { name: 'Zurich', coords: [8.5417, 47.3769] },
    { name: 'Amsterdam', coords: [4.9041, 52.3676] },
    { name: 'Brussels', coords: [4.3517, 50.8503] },
    { name: 'Reykjavik', coords: [-21.8277, 64.1265] },
    { name: 'Doha', coords: [51.5310, 25.2854] },
    { name: 'Tel Aviv', coords: [34.7818, 32.0853] },
    { name: 'Amman', coords: [35.9106, 31.9539] },
    { name: 'Baghdad', coords: [44.3661, 33.3152] },
    { name: 'Casablanca', coords: [-7.5898, 33.5731] },
    { name: 'Accra', coords: [-0.186964, 5.603717] },
    { name: 'Addis Ababa', coords: [38.7578, 9.0054] },
    { name: 'Kigali', coords: [30.0587, -1.9706] },
    { name: 'Tunis', coords: [10.1658, 36.8065] },
    { name: 'Bamako', coords: [-7.9922, 12.6392] },
    { name: 'Luanda', coords: [13.2344, -8.8390] },
    { name: 'Perth', coords: [115.8575, -31.9505] },
    { name: 'Melbourne', coords: [144.9631, -37.8136] },
    { name: 'Auckland', coords: [174.7633, -36.8485] },
    { name: 'Montreal', coords: [-73.5673, 45.5017] },
    { name: 'Vancouver', coords: [-123.1216, 49.2827] },
    { name: 'Seattle', coords: [-122.3321, 47.6062] },
    { name: 'Houston', coords: [-95.3698, 29.7604] },
    { name: 'Philadelphia', coords: [-75.1652, 39.9526] },
    { name: 'Miami', coords: [-80.1918, 25.7617] },
    { name: 'San Diego', coords: [-117.1611, 32.7157] },
    { name: 'Denver', coords: [-104.9903, 39.7392] },
    { name: 'Atlanta', coords: [-84.3880, 33.7490] },
    { name: 'Phoenix', coords: [-112.0740, 33.4484] },
    { name: 'Las Vegas', coords: [-115.1398, 36.1699] }
  ];
  

  const [currentCity, setCurrentCity] = useState(null);
  const [satelliteImage, setSatelliteImage] = useState('');
  const [gameStartTime, setGameStartTime] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const updateGameStats = async (finalScore, gameTime, attempts) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://api.jamilweb.click/api/games/update-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'satle',
          score: finalScore,
          gameTime,
          attempts
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress(finalScore, gameTime, attempts);
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const updateBadgeProgress = async (finalScore, gameTime, attempts) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('https://api.jamilweb.click/api/badges/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'satle',
          score: finalScore,
          gameTime,
          attempts
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.totalNewBadges > 0) {
          console.log(`🎉 Unlocked ${data.totalNewBadges} new badges!`);
        }
      }
    } catch (error) {
      console.error('Error updating badge progress:', error);
    }
  };

  const startNewGame = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    console.log(`🎯 Starting new game with city: ${randomCity.name} at coordinates: ${randomCity.coords[0]},${randomCity.coords[1]}`);
    setCurrentCity(randomCity);
    setCurrentGuess('');
    setGuesses([]);
    setGameState('playing');
    setShowAnswer(false);
    setCurrentZoom(14);
    setError('');
    setGameStartTime(Date.now());
    generateSatelliteImage(randomCity.coords, 14);
  };

  const generateSatelliteImage = (coords, zoom) => {
    setLoading(true);
    const [lon, lat] = coords;
    const accessToken = 'pk.eyJ1IjoiamFtaWxraGFsYWYiLCJhIjoiY21jd3pvam93MDhndDJpcTB3em0xdDJsayJ9.lbwxSHTRb9u9CPyWH_KskQ';
    const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},${zoom},0/600x600?access_token=${accessToken}`;
    
    console.log(`Loading satellite image for coordinates: ${lon},${lat} at zoom ${zoom}`);
    console.log(`Image URL: ${imageUrl}`);
    
    // Create a new image to test if it loads
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Successfully loaded satellite image for coordinates: ${lon},${lat} at zoom ${zoom}`);
      setSatelliteImage(imageUrl);
      setLoading(false);
    };
    img.onerror = () => {
      console.error(`❌ Failed to load satellite image for coordinates: ${lon},${lat} at zoom ${zoom}`);
      console.error(`Failed URL: ${imageUrl}`);
      setError(`Failed to load satellite image for coordinates: ${lon},${lat} at zoom ${zoom}`);
      setLoading(false);
    };
    img.src = imageUrl;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirection = (lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  };

  const findCityCoords = (cityName) => {
    const city = cities.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase()
    );
    return city ? city.coords : null;
  };

  const handleGuess = () => {
    if (!currentGuess.trim()) return;

    const guessedCoords = findCityCoords(currentGuess.trim());
    const isCorrect = currentGuess.trim().toLowerCase() === currentCity.name.toLowerCase();

    const newGuess = {
      guess: currentGuess.trim(),
      correct: isCorrect,
      timestamp: new Date(),
      distance: guessedCoords ? calculateDistance(
        guessedCoords[1], guessedCoords[0], 
        currentCity.coords[1], currentCity.coords[0]
      ) : null,
      direction: guessedCoords ? getDirection(
        guessedCoords[1], guessedCoords[0], 
        currentCity.coords[1], currentCity.coords[0]
      ) : null
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (newGuess.correct) {
      setGameState('won');
      // Update stats when game is won
      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      const attempts = newGuesses.length;
      const score = 6 - attempts; // Score based on attempts (5 for perfect, 1 for barely won)
      updateGameStats(score, gameTime, attempts);
    } else if (newGuesses.length >= 5) {
      setGameState('lost');
      setShowAnswer(true);
      // Update stats when game is lost
      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      const attempts = newGuesses.length;
      updateGameStats(0, gameTime, attempts);
    } else {
      // More reliable zoom progression for satellite imagery
      const zoomLevels = [14, 13, 12, 11, 10]; // Start at 14, decrease by 1 each time
      const nextZoom = zoomLevels[newGuesses.length];
      setCurrentZoom(nextZoom);
      generateSatelliteImage(currentCity.coords, nextZoom);
    }
  };

  const handleGiveUp = () => {
    setGameState('lost');
    setShowAnswer(true);
    // Update stats when player gives up
    const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
    const attempts = guesses.length;
    updateGameStats(0, gameTime, attempts);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const handleGuessChange = (value) => {
    setCurrentGuess(value);
    
    if (value.trim().length > 0) {
      const filtered = cities
        .map(city => city.name)
        .filter(city => 
          city.toLowerCase().includes(value.toLowerCase()) &&
          !guesses.some(guess => guess.guess.toLowerCase() === city.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCurrentGuess(suggestion);
    setShowSuggestions(false);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const getZoomLevelText = () => {
    if (currentZoom >= 14) return 'Very Close';
    if (currentZoom >= 12) return 'Close';
    if (currentZoom >= 10) return 'Medium Distance';
    return 'Far Away';
  };

  const getGuessesRemaining = () => {
    return Math.max(0, 5 - guesses.length);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Header />
      <Box sx={{ pt: 8, pb: 4, px: 3 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Game Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              🛰️ Satle
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.9)',
              mb: 3
            }}>
              Guess the city from satellite imagery
            </Typography>
            
            {/* Game Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
              <Chip 
                icon={<PublicIcon />}
                label={`Guesses: ${guesses.length}/5`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                icon={<VisibilityIcon />}
                label={`Zoom: ${getZoomLevelText()}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                icon={<LocationOnIcon />}
                label={`Remaining: ${getGuessesRemaining()}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Satellite Image */}
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  {loading ? (
                    <Box sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        Loading satellite image...
                      </Typography>
                    </Box>
                  ) : satelliteImage ? (
                    <Box sx={{ position: 'relative' }}>
                      <img 
                        src={satelliteImage} 
                        alt="Satellite view"
                        style={{ 
                          width: '100%', 
                          maxWidth: 600, 
                          height: 'auto',
                          borderRadius: 8,
                          border: '2px solid rgba(255,255,255,0.3)'
                        }}
                      />
                      {showAnswer && currentCity && (
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          p: 2,
                          borderRadius: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {currentCity.name}
                          </Typography>
                        </Box>
                      )}
                      {gameState === 'playing' && (
                        <Button
                          variant="contained"
                          onClick={handleGiveUp}
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'rgba(244, 67, 54, 0.9)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(244, 67, 54, 1)',
                            },
                            px: 2,
                            py: 1,
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Give Up
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        No satellite image available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Game Controls */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                height: 'fit-content'
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Game Status */}
                  {gameState === 'won' && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      🎉 Congratulations! You guessed correctly!
                    </Alert>
                  )}
                  
                  {gameState === 'lost' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      😔 Game Over! The correct answer was {currentCity?.name}
                    </Alert>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Input and Button */}
                  {gameState === 'playing' && (
                    <Box sx={{ mb: 3, position: 'relative' }}>
                      <TextField
                        fullWidth
                        value={currentGuess}
                        onChange={(e) => handleGuessChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={(e) => setAnchorEl(e.currentTarget)}
                        placeholder="Enter city name..."
                        variant="outlined"
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255,255,255,0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#43cea2',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: 'white',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                        }}
                      />
                      
                      {/* Suggestions Menu */}
                      <Popper
                        open={showSuggestions && suggestions.length > 0}
                        anchorEl={anchorEl}
                        placement="bottom-start"
                        sx={{ zIndex: 1300 }}
                      >
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <Paper
                            sx={{
                              bgcolor: 'rgba(18, 18, 19, 0.95)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              maxHeight: 300,
                              overflow: 'auto',
                              mt: 1,
                              minWidth: anchorEl?.offsetWidth || 300,
                            }}
                          >
                            <List sx={{ p: 0 }}>
                              {suggestions.map((suggestion, index) => (
                                <ListItem
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  sx={{
                                    color: 'white',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'rgba(255,255,255,0.1)',
                                    },
                                    py: 1.5,
                                  }}
                                >
                                  <ListItemText
                                    primary={suggestion}
                                    sx={{
                                      '& .MuiListItemText-primary': {
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                      }
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </ClickAwayListener>
                      </Popper>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleGuess}
                        disabled={!currentGuess.trim()}
                        startIcon={<SearchIcon />}
                        sx={{
                          bgcolor: '#43cea2',
                          '&:hover': {
                            bgcolor: '#3bb08f',
                          },
                          py: 1.5,
                          fontSize: '1.1rem'
                        }}
                      >
                        Submit Guess
                      </Button>
                    </Box>
                  )}

                  {/* New Game Button */}
                  {(gameState === 'won' || gameState === 'lost') && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={startNewGame}
                      sx={{
                        bgcolor: '#43cea2',
                        '&:hover': {
                          bgcolor: '#3bb08f',
                        },
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Play Again
                    </Button>
                  )}

                  {/* Guesses History */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Your Guesses
                    </Typography>
                    <List sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
                      {guesses.map((guess, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemText
                            primary={guess.guess}
                            secondary={
                              guess.correct 
                                ? `Guess ${index + 1} - Correct!` 
                                : guess.distance 
                                  ? `Guess ${index + 1} - ${guess.direction} ${Math.round(guess.distance)}km`
                                  : `Guess ${index + 1}`
                            }
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: guess.correct ? '#4caf50' : '#f44336',
                                fontWeight: 'bold'
                              },
                              '& .MuiListItemText-secondary': {
                                color: 'rgba(255,255,255,0.7)'
                              }
                            }}
                          />
                          <Chip
                            label={guess.correct ? '✓' : '✗'}
                            size="small"
                            color={guess.correct ? 'success' : 'error'}
                            sx={{ ml: 1 }}
                          />
                        </ListItem>
                      ))}
                      {guesses.length === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="No guesses yet"
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'rgba(255,255,255,0.5)',
                                fontStyle: 'italic'
                              }
                            }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Satle; 