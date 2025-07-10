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
import NotificationModal from './NotificationModal';
import officialCountries from './officialCountries';

const Game = ({ targetCountry = null, isOnline = false, onAnswerSubmit = null, disabled = false, opponentRoundsWon = 0 }) => {
  // Early return if targetCountry is null in online mode - this prevents useState from being called
  if (isOnline && (!targetCountry || targetCountry === null || targetCountry === undefined)) {
    console.log('Game component: Early return due to null targetCountry:', targetCountry);
    return (
      <Box sx={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#2b2b2b',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Header />
        <Toolbar />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ color: '#43cea2' }}>
            Loading Game...
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            Preparing your multiplayer match
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Target: {targetCountry || 'Not set yet'}
          </Typography>
        </Box>
      </Box>
    );
  }

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
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const mapRef = useRef(null);
  
  // Game state
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Online mode specific state
  const [onlineRoundsWon, setOnlineRoundsWon] = useState(0);
  const [onlineRoundsPlayed, setOnlineRoundsPlayed] = useState(0);
  const [onlineTargetCountries, setOnlineTargetCountries] = useState([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [onlineGameWon, setOnlineGameWon] = useState(false);
  const [roundResult, setRoundResult] = useState(null); // 'won', 'lost', null

  // Add state for showing more info
  const [showCountryInfo, setShowCountryInfo] = useState(false);

  // Add state for contact dialog
  const [contactOpen, setContactOpen] = useState(false);

  // Add state to track recently used countries for better variety
  const [recentlyUsedCountries, setRecentlyUsedCountries] = useState([]);

  // Add state for showing the intro modal
  const [showIntro, setShowIntro] = useState(!isOnline); // Don't show intro for online games

  // Helper function to select a random country
  const selectRandomCountry = (countriesList) => {
    if (!countriesList || countriesList.length === 0) {
      console.error('No countries list provided to selectRandomCountry');
      return null;
    }
    
    // Filter out countries that don't have valid geometry
    const validCountries = countriesList.filter(country => 
      country && 
      country.properties && 
      country.properties.name && 
      country.geometry && 
      country.geometry.coordinates &&
      country.geometry.coordinates.length > 0
    );
    
    if (validCountries.length === 0) {
      console.error('No valid countries found in list');
      return null;
    }
    
    // Avoid recently used countries for better variety
    const availableCountries = validCountries.filter(country => 
      !recentlyUsedCountries.includes(country.properties.name)
    );
    
    const countryList = availableCountries.length > 0 ? availableCountries : validCountries;
    
    if (countryList.length === 0) {
      console.error('No countries available after filtering');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * countryList.length);
    const randomCountry = countryList[randomIndex];
    
    if (!randomCountry) {
      console.error('Failed to select random country from list');
      return null;
    }
    
    console.log('Selected random country:', randomCountry?.properties?.name);
    return randomCountry;
  };

  // Function to start a new round
  const startNewRound = (countriesList) => {
    if (!countriesList || countriesList.length === 0) {
      console.error('No countries list provided to startNewRound');
      setMessage('Error: No countries available');
      return;
    }
    
    const newSecretCountry = selectRandomCountry(countriesList);
    if (newSecretCountry) {
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
      
      // Add to recently used countries
      if (newSecretCountry.properties && newSecretCountry.properties.name) {
        setRecentlyUsedCountries(prev => {
          const updated = [...prev, newSecretCountry.properties.name];
          // Keep only last 10 to prevent memory issues
          return updated.slice(-10);
        });
      }
    } else {
      console.error('Failed to select random country for new round');
      setMessage('Error starting new game - no valid countries available');
    }
  };

  // Debug logging for props
  useEffect(() => {
    console.log('Game component props:', { targetCountry, isOnline, disabled });
  }, [targetCountry, isOnline, disabled]);

  // Initialize online mode
  useEffect(() => {
    if (isOnline && targetCountry) {
      console.log('Initializing online mode with target:', targetCountry);
      setSecretCountry(targetCountry);
      setMessage(`Guess the country: ${targetCountry}`);
      setGameStartTime(Date.now());
      
      // For online mode, we need to find the country object from the countries list
      if (countries.length > 0) {
        const targetCountryObj = countries.find(c => c.properties.name === targetCountry);
        if (targetCountryObj) {
          setSecretCountry(targetCountryObj);
        }
      }
    }
  }, [isOnline, targetCountry, countries]);

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
        
        if (isOnline && targetCountry) {
          // For online mode, find the target country object
          const targetCountryObj = validCountries.find(c => c.properties.name === targetCountry);
          if (targetCountryObj) {
            setSecretCountry(targetCountryObj);
            setMessage(`Guess the country: ${targetCountry}`);
          } else {
            console.error('Target country not found in valid countries:', targetCountry);
            setMessage('Error: Target country not found');
          }
        } else if (!isOnline) {
          // For offline mode, start with a random country
          if (validCountries.length > 0) {
            startNewRound(validCountries);
          } else {
            console.error('No valid countries available for offline mode');
            setMessage('Error: No valid countries available');
          }
        }
        
        setGameStartTime(Date.now());
        
        // Set up country options for autocomplete
        const options = validCountries
          .filter(country => countryInfo[country.properties.name])
          .map(country => country.properties.name)
          .sort((a, b) => a.localeCompare(b)); // Proper alphabetical sorting
        setCountryOptions(options);
      })
      .catch(error => {
        console.error('Error loading countries:', error);
        setMessage('Error loading countries data');
      });
  }, [isOnline, targetCountry]);

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

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (guess.trim()) {
        handleGuess();
      }
    }
  };

  const handleGuess = () => {
    if (!guess || disabled) return;

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
      
      // Update stats when game is won
      updateGameStats(finalScore, Math.round(timeTaken / 1000), newGuessedCountries.length);
      
      if (isOnline) {
        // Online mode: increment rounds won and check if game is won
        const newRoundsWon = onlineRoundsWon + 1;
        setOnlineRoundsWon(newRoundsWon);
        setRoundResult('won');
        
        if (newRoundsWon >= 5) {
          // Player won the online game (first to 5)
          setOnlineGameWon(true);
          setMessage(`🎉 You won the online game! First to 5 countries! 🎉`);
          setGameOver(true);
          
          // Call onAnswerSubmit for online games with final result
          if (onAnswerSubmit) {
            console.log('Game component: Online game won, calling onAnswerSubmit with:', guessedCountry.properties.name);
            onAnswerSubmit(guessedCountry.properties.name);
          }
        } else {
          // Round won, but game continues
          setMessage(`🎉 Correct! Round ${currentRoundNumber} won! (${newRoundsWon}/5) 🎉`);
          setGameOver(true);
          
          // Call onAnswerSubmit for online games
          if (onAnswerSubmit) {
            console.log('Game component: Round won, calling onAnswerSubmit with:', guessedCountry.properties.name);
            onAnswerSubmit(guessedCountry.properties.name);
          }
        }
      } else {
        // Offline mode: normal win
        setMessage(`🎉 Congratulations! You found ${secretCountry.properties.name}! 🎉`);
        setGameOver(true);
      }
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
          const endTime = Date.now();
          const timeTaken = endTime - gameStartTime;
          const finalScore = calculateScore(timeTaken, newGuessedCountries.length);
          
          setGameEndTime(endTime);
          setScore(finalScore);
          saveBestScore(newGuessedCountries.length);
          
          // Update stats when game is won
          updateGameStats(finalScore, Math.round(timeTaken / 1000), newGuessedCountries.length);
          
          if (isOnline) {
            // Online mode: increment rounds won and check if game is won
            const newRoundsWon = onlineRoundsWon + 1;
            setOnlineRoundsWon(newRoundsWon);
            setRoundResult('won');
            
            if (newRoundsWon >= 5) {
              // Player won the online game (first to 5)
              setOnlineGameWon(true);
              setMessage(`🎉 You won the online game! First to 5 countries! 🎉`);
              setGameOver(true);
              
              // Call onAnswerSubmit for online games with final result
              if (onAnswerSubmit) {
                console.log('Game component: Online game won (dropdown), calling onAnswerSubmit with:', guessedCountry.properties.name);
                onAnswerSubmit(guessedCountry.properties.name);
              }
            } else {
              // Round won, but game continues
              setMessage(`🎉 Correct! Round ${currentRoundNumber} won! (${newRoundsWon}/5) 🎉`);
              setGameOver(true);
              
              // Call onAnswerSubmit for online games
              if (onAnswerSubmit) {
                console.log('Game component: Round won (dropdown), calling onAnswerSubmit with:', guessedCountry.properties.name);
                onAnswerSubmit(guessedCountry.properties.name);
              }
            }
          } else {
            // Offline mode: normal win
            setMessage(`🎉 Congratulations! You found ${secretCountry.properties.name}! 🎉`);
            setGameOver(true);
          }
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
    if (isOnline) {
      // For online mode, start a new round
      setCurrentRoundNumber(prev => prev + 1);
      setRoundResult(null);
      setGameOver(false);
      setShowSecret(false);
      setLastDistance(null);
      setGuess('');
      setGuessedCountries([]);
      setGameStartTime(Date.now());
      setGameEndTime(null);
      setScore(0);
      
      // Get a new target for the next round
      if (countries.length > 0) {
        const newTargetCountry = selectRandomCountry(countries);
        setSecretCountry(newTargetCountry);
        setMessage(`Round ${currentRoundNumber + 1}: Guess the country!`);
      }
    } else {
      // For offline mode, start new game with different country
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
    }
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
    
    // Update stats when game is given up
    updateGameStats(finalScore, Math.round(timeTaken / 1000), guessedCountries.length);
    
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

  const updateGameStats = async (finalScore, gameTime, bestStreak) => {
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
          gameId: 'globle',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: guessedCountries.length
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress('globle', finalScore, guessedCountries.length, bestStreak);
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const updateBadgeProgress = async (gameId, score, attempts, streak) => {
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
          gameId,
          score,
          attempts,
          streak
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

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Globle"
          description={"Guess the secret country! Each guess shows how close you are. The color indicates distance: red (close), yellow (far). Try to find the country in as few guesses as possible!"}
          color="primary"
        />
      </>
    );
  }

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
      
      {/* Online Mode Banner */}
      {isOnline && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 70, md: 80 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            backgroundColor: 'rgba(67, 206, 162, 0.95)',
            color: 'white',
            padding: { xs: '8px 16px', md: '12px 24px' },
            borderRadius: 2,
            boxShadow: 3,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '0.9rem', md: '1.1rem' }
            }}
          >
            🎮 ONLINE MODE - Round {currentRoundNumber}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '0.7rem', md: '0.9rem' },
              opacity: 0.9
            }}
          >
            You: {onlineRoundsWon} | Opponent: {opponentRoundsWon} | First to 5 wins!
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
                  disabled={gameOver || disabled}
                  fullWidth
                  variant="outlined"
                  size="small"
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      fontSize: '16px', // Prevents zoom on iOS
                      transform: 'scale(1)', // Prevents zoom
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
              disabled={gameOver || disabled}
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
                return filtered.slice(0, 10); // Limit to 10 options for better performance
              }}
              isOptionEqualToValue={(option, value) => 
                option.toLowerCase() === value.toLowerCase()
              }
            />
            <Button
              variant="contained"
              onClick={handleGuess}
              disabled={gameOver || disabled || !guess.trim()}
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
                    {isOnline ? 'Next Round' : (isMobile ? '↻' : 'Next Country')}
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