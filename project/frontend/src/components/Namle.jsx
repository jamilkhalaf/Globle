import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, Typography, Button, Paper, Stack, Autocomplete, TextField, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton, useTheme, useMediaQuery, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@mui/material';
import Header from './Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from './countryInfo';
import officialCountries from './officialCountries';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationModal from './NotificationModal';

const Namle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [namedCountries, setNamedCountries] = useState(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [inputError, setInputError] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const timerRef = useRef(null);
  const mapRef = useRef(null);

  // Continent data
  const continents = {
    'Africa': [
      'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi','Cabo Verde', 'Cameroon', 'Central African Republic', 
      'Chad','Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Ivory Coast', 'Djibouti', 'Egypt', 'Equatorial Guinea', 
      'Eritrea','eSwatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 
      'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 
      'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 
      'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'United Republic of Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
    ],
    'Asia': [
      'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Cyprus',
      'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 
      'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 
      'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 
      'Saudi Arabia', 'Singapore', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thailand', 'East Timor', 'Turkey', 
      'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'
    ],
    'Europe': [
      'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 
      'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Kosovo',
      'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 
      'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania','Russia', 'San Marino', 'Republic of Serbia', 
      'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'
    ],
    'North America': [
      'Antigua and Barbuda', 'Bahamas, The', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 'Cuba', 'Dominica', 
      'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 
      'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'St. Lucia', 'St. Vincent and the Grenadines', 
      'Trinidad and Tobago', 'United States of America'
    ],
    'South America': [
      'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 
      'Uruguay', 'Venezuela'
    ],
    'Oceania': [
      'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia, Fed. Sts.', 'Nauru', 'New Zealand', 
      'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu'
    ]
  };

  // Territories that should be highlighted but not counted as separate countries
  const territories = {
    'Greenland': 'Denmark',
    'French Guiana': 'France',
    'Guadeloupe': 'France',
    'Martinique': 'France',
    'Mayotte': 'France',
    'Reunion': 'France',
    'Saint Martin': 'France',
    'Saint Pierre and Miquelon': 'France',
    'Saint Barthelemy': 'France',
    'Wallis and Futuna': 'France',
    'New Caledonia': 'France',
    'French Polynesia': 'France',
    'Saint Helena': 'United Kingdom',
    'South Georgia and the South Sandwich Islands': 'United Kingdom',
    'Falkland Islands': 'United Kingdom',
    'South Sandwich Islands': 'United Kingdom',
    'South Georgia': 'United Kingdom',
    'Somaliland': 'Somalia',
    'Western Sahara': 'Morocco',
  };

  // Mapping between GeoJSON names and progress tracking names
  const countryNameMapping = {
    'Republic of Serbia': 'Serbia',
    'Bahamas, The': 'Bahamas',
    'United States of America': 'United States',
    'St. Lucia': 'Saint Lucia',
    'St. Vincent and the Grenadines': 'Saint Vincent and the Grenadines'
  };

  // Reverse mapping for checking progress
  const reverseCountryNameMapping = Object.fromEntries(
    Object.entries(countryNameMapping).map(([key, value]) => [value, key])
  );

  // Additional user-friendly name mappings
  const userFriendlyMappings = {
    'Bahamas': 'Bahamas, The',
    'USA': 'United States of America',
    'US': 'United States of America',
    'America': 'United States of America',
    'United States': 'United States of America',
    'Saint Lucia': 'St. Lucia',
    'Saint Vincent and the Grenadines': 'St. Vincent and the Grenadines',
    'St. Kitts and Nevis': 'Saint Kitts and Nevis',
    'Antigua': 'Antigua and Barbuda',
    'Barbuda': 'Antigua and Barbuda',
    'Dominican Rep': 'Dominican Republic',
    'Dominican Republic': 'Dominican Republic',
    'El Salvador': 'El Salvador',
    'Grenada': 'Grenada',
    'Guatemala': 'Guatemala',
    'Haiti': 'Haiti',
    'Honduras': 'Honduras',
    'Jamaica': 'Jamaica',
    'Mexico': 'Mexico',
    'Nicaragua': 'Nicaragua',
    'Panama': 'Panama',
    'Trinidad': 'Trinidad and Tobago',
    'Tobago': 'Trinidad and Tobago',
    'Costa Rica': 'Costa Rica',
    'Cuba': 'Cuba',
    'Dominica': 'Dominica',
    'Belize': 'Belize',
    'Canada': 'Canada'
  };

  // Load countries data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        // Use the 195 official countries from officialCountries.js
        // Also include mapped countries (GeoJSON names that map to official countries)
        // And include territories for highlighting
        const validCountries = data.features.filter(country => {
          const countryName = country.properties.name;
          const isOfficial = officialCountries.includes(countryName);
          const isMapped = officialCountries.includes(countryNameMapping[countryName]);
          const isTerritory = Object.keys(territories).includes(countryName);
          
          // Debug: Check for Greenland and other territories
          if (countryName.toLowerCase().includes('greenland') || 
              countryName.toLowerCase().includes('kalaallit') ||
              countryName.toLowerCase().includes('grønland')) {
            console.log('Found Greenland-like country:', countryName);
          }
          
          if (isOfficial || isMapped || isTerritory) {
            console.log('Loading country:', countryName, 'Official:', isOfficial, 'Mapped:', isMapped, 'Territory:', isTerritory);
          }
          
          return isOfficial || isMapped || isTerritory;
        });
        
        console.log('Total countries loaded:', validCountries.length);
        console.log('All loaded country names:', validCountries.map(c => c.properties.name));
        
        setCountries(validCountries);
        
        // Create options for autocomplete using the official countries
        const options = officialCountries.map(countryName => ({
          label: countryName,
          value: countryName
        }));
        setCountryOptions(options);
      })
      .catch(error => {
        console.error('Error loading countries:', error);
      });
  }, []);

  const totalCountries = officialCountries.length;
  const namedCount = namedCountries.size;
  const remainingCount = totalCountries - namedCount;

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setGameStarted(true);
    setTimerRunning(true);
    setTimer(0);
    setNamedCountries(new Set());
    setGameFinished(false);
    setShowResults(false);
    setInputValue('');
    setInputError('');
  };

  const finishGame = () => {
    setTimerRunning(false);
    setGameFinished(true);
    setShowResults(true);
  };

  const handleGuess = () => {
    if (!inputValue.trim()) return;
    
    // Check if the input matches any official country name
    const validCountry = officialCountries.some(countryName => 
      countryName.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    // Also check if the input matches any reverse mapping (user-friendly name to official name)
    const reverseMappingMatch = Object.entries(reverseCountryNameMapping).find(([userFriendly, official]) => 
      userFriendly.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    // Check if the input matches any user-friendly mapping
    const userFriendlyMatch = Object.entries(userFriendlyMappings).find(([userFriendly, official]) => 
      userFriendly.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    if (!validCountry && !reverseMappingMatch && !userFriendlyMatch) {
      setInputError('Invalid country name. Please select a valid country.');
      return;
    } else if (namedCountries.has(inputValue.trim()) || 
               (reverseMappingMatch && namedCountries.has(reverseMappingMatch[1])) ||
               (userFriendlyMatch && namedCountries.has(userFriendlyMatch[1]))) {
      setInputError('You already named this country. Try a different one.');
      return;
    } else {
      setInputError('');
    }

    // Use the official country name for progress tracking
    const countryName = reverseMappingMatch ? reverseMappingMatch[1] : 
                       userFriendlyMatch ? userFriendlyMatch[1] : 
                       inputValue.trim();
    
    setNamedCountries(prev => new Set([...prev, countryName]));
    setInputValue('');

    // Check if all countries are named
    if (namedCountries.size + 1 >= totalCountries) {
      finishGame();
    }
  };

  const isCountryOrTerritoryNamed = (countryName) => {
    console.log('Checking if country is named:', countryName);
    console.log('Named countries:', Array.from(namedCountries));
    
    // Check if the country itself is named
    if (namedCountries.has(countryName)) {
      console.log('Direct match found for:', countryName);
      return true;
    }
    
    // Check if this is a territory and its parent country is named
    const parentCountry = territories[countryName];
    console.log('Territory check for:', countryName, '->', parentCountry);
    if (parentCountry && namedCountries.has(parentCountry)) {
      console.log('Territory match found for:', countryName, '->', parentCountry);
      return true;
    }
    
    // Check if this is a mapped country name (GeoJSON name)
    const progressName = countryNameMapping[countryName];
    if (progressName && namedCountries.has(progressName)) {
      console.log('Country mapping match found for:', countryName, '->', progressName);
      return true;
    }
    
    // Check if this country name is in user-friendly mappings and the user-friendly name is named
    const userFriendlyEntry = Object.entries(userFriendlyMappings).find(([userFriendly, official]) => 
      official === countryName
    );
    if (userFriendlyEntry && namedCountries.has(userFriendlyEntry[1])) {
      console.log('User-friendly mapping match found for:', countryName, '->', userFriendlyEntry[1]);
      return true;
    }
    
    // Check if this is a GeoJSON name that maps to a user-friendly name
    const reverseUserFriendlyEntry = Object.entries(userFriendlyMappings).find(([userFriendly, official]) => 
      userFriendly === countryName
    );
    if (reverseUserFriendlyEntry && namedCountries.has(reverseUserFriendlyEntry[1])) {
      console.log('Reverse user-friendly mapping match found for:', countryName, '->', reverseUserFriendlyEntry[1]);
      return true;
    }
    
    // Check if this GeoJSON name has a user-friendly equivalent that's named
    const userFriendlyForGeoJSON = Object.entries(userFriendlyMappings).find(([userFriendly, official]) => 
      official === countryName
    );
    if (userFriendlyForGeoJSON) {
      const userFriendlyName = userFriendlyForGeoJSON[0];
      if (namedCountries.has(userFriendlyName)) {
        console.log('User-friendly name match found for:', countryName, '->', userFriendlyName);
        return true;
      }
    }
    
    console.log('No match found for:', countryName);
    return false;
  };

  const getMissedCountries = () => {
    return officialCountries.filter(countryName => !namedCountries.has(countryName));
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
          gameId: 'namle',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: totalCountries
        }),
      });

      if (response.ok) {
        await updateBadgeProgress('namle', finalScore, totalCountries, 0);
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
        if (data.totalNewBadges > 0 && data.newBadges) {
          console.log(`🎉 Unlocked ${data.totalNewBadges} new badges!`, data.newBadges);
        }
      }
    } catch (error) {
      console.error('Error updating badge progress:', error);
    }
  };

  useEffect(() => {
    if (gameFinished) {
      const score = Math.round((namedCount / totalCountries) * 100);
      updateGameStats(score, timer, 0);
    }
  }, [gameFinished, namedCount, totalCountries, timer]);

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Namle"
          description={
            "Name all 195 countries on the world map from memory! Type country names and see them highlighted as you go. Try to name them all as fast as you can. Use the timer and progress to track your challenge. Good luck!"
          }
          color="primary"
          buttonText="Start Game"
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
      touchAction: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
      <Header />
      <Toolbar />
      
      {/* Game Controls */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatTime(timer)}
            </Typography>
          </Box>
          
          <Chip 
            label={`Named: ${namedCount}/${totalCountries}`}
            size="small"
            sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
          
          <Chip 
            label={`Remaining: ${remainingCount}`}
            size="small"
            sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />

          {!gameStarted ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={startGame}
              sx={{
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 1,
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              Start Game
            </Button>
          ) : (
            <Stack spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<StopIcon />}
                onClick={finishGame}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  fontWeight: 600,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)'
                  }
                }}
              >
                Give Up
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => setShowViewDialog(true)}
                sx={{
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  fontWeight: 600,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#1976D2',
                    color: '#1976D2',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)'
                  }
                }}
              >
                View Progress
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Input Section */}
      {gameStarted && !gameFinished && (
        <Paper
          sx={{
            position: 'absolute',
            top: { xs: 70, md: 80 },
            right: { xs: 10, md: 20 },
            padding: { xs: 1, md: 2 },
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            zIndex: 1000,
            maxWidth: { xs: '200px', md: '300px' },
            width: { xs: '200px', md: '300px' },
            boxShadow: 3,
            borderRadius: { xs: 1, md: 2 },
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
              Name a Country
            </Typography>
            <Autocomplete
              freeSolo={false}
              disableClearable
              options={countryOptions}
              getOptionLabel={option => typeof option === 'string' ? option : option.label}
              value={inputValue}
              inputValue={inputValue}
              onInputChange={(event, newInputValue, reason) => {
                setInputValue(newInputValue);
                setInputError('');
              }}
              onChange={(event, newValue, reason) => {
                if (reason === 'selectOption') {
                  // User selected an option from dropdown
                  if (newValue && newValue.label) {
                    const countryName = newValue.label;
                    setInputValue(countryName);
                    // Use setTimeout to ensure inputValue is updated before calling handleGuess
                    setTimeout(() => {
                      // Check if this country is already named
                      const isAlreadyNamed = namedCountries.has(countryName) ||
                        Object.entries(userFriendlyMappings).some(([userFriendly, official]) => 
                          official === countryName && namedCountries.has(userFriendly)
                        );
                      
                      if (isAlreadyNamed) {
                        setInputError('You already named this country. Try a different one.');
                      } else {
                        // Process the guess with the selected country name
                        const validCountry = officialCountries.some(country => 
                          country.toLowerCase() === countryName.toLowerCase()
                        );
                        
                        const userFriendlyMatch = Object.entries(userFriendlyMappings).find(([userFriendly, official]) => 
                          userFriendly.toLowerCase() === countryName.toLowerCase()
                        );
                        
                        if (validCountry || userFriendlyMatch) {
                          const finalCountryName = userFriendlyMatch ? userFriendlyMatch[1] : countryName;
                          setNamedCountries(prev => new Set([...prev, finalCountryName]));
                          setInputValue('');
                          setInputError('');
                          
                          // Check if all countries are named
                          if (namedCountries.size + 1 >= totalCountries) {
                            finishGame();
                          }
                        } else {
                          setInputError('Invalid country name. Please select a valid country.');
                        }
                      }
                    }, 0);
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Type country name"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.75rem',
                      '& fieldset': {
                        borderColor: inputError ? '#f44336' : 'rgba(255,255,255,0.3)',
                      },
                    }
                  }}
                  inputProps={{ 
                    ...params.inputProps, 
                    style: { fontSize: 12 }
                  }}
                  error={!!inputError}
                  helperText={inputError}
                />
              )}
              sx={{ 
                '& .MuiAutocomplete-input': {
                  fontSize: '0.75rem'
                },
                '& .MuiAutocomplete-option': {
                  fontSize: '0.75rem',
                  padding: '8px 12px'
                }
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                // Only allow submission if a valid country is selected
                const selectedCountry = countryOptions.find(option => 
                  option.label.toLowerCase() === inputValue.toLowerCase()
                );
                
                if (selectedCountry) {
                  // Simulate selecting the option
                  const event = { target: { value: selectedCountry } };
                  const newValue = selectedCountry;
                  const reason = 'selectOption';
                  
                  // Check if this country is already named
                  const isAlreadyNamed = namedCountries.has(selectedCountry.label) ||
                    Object.entries(userFriendlyMappings).some(([userFriendly, official]) => 
                      official === selectedCountry.label && namedCountries.has(userFriendly)
                    );
                  
                  if (isAlreadyNamed) {
                    setInputError('You already named this country. Try a different one.');
                  } else {
                    // Process the guess with the selected country name
                    const validCountry = officialCountries.some(country => 
                      country.toLowerCase() === selectedCountry.label.toLowerCase()
                    );
                    
                    const userFriendlyMatch = Object.entries(userFriendlyMappings).find(([userFriendly, official]) => 
                      userFriendly.toLowerCase() === selectedCountry.label.toLowerCase()
                    );
                    
                    if (validCountry || userFriendlyMatch) {
                      const finalCountryName = userFriendlyMatch ? userFriendlyMatch[1] : selectedCountry.label;
                      setNamedCountries(prev => new Set([...prev, finalCountryName]));
                      setInputValue('');
                      setInputError('');
                      
                      // Check if all countries are named
                      if (namedCountries.size + 1 >= totalCountries) {
                        finishGame();
                      }
                    } else {
                      setInputError('Invalid country name. Please select a valid country.');
                    }
                  }
                } else {
                  setInputError('Please select a country from the dropdown menu.');
                }
              }}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 1,
                fontSize: '0.75rem',
                py: 0.5,
                textTransform: 'none'
              }}
            >
              Name Country
            </Button>
          </Stack>
        </Paper>
      )}

      {/* World Map */}
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
            const isNamed = isCountryOrTerritoryNamed(country.properties.name);
            
            return (
              <GeoJSON
                key={index}
                data={country}
                style={{
                  fillColor: isNamed ? '#4caf50' : '#333',
                  fillOpacity: isNamed ? 0.9 : 0.3,
                  color: isNamed ? '#2e7d32' : '#666',
                  weight: isNamed ? 2 : 1
                }}
              />
            );
          })}
        </MapContainer>
      </Box>

      {/* View Progress Dialog */}
      <Dialog 
        open={showViewDialog} 
        onClose={() => setShowViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(30,34,44,0.98)',
            color: 'white',
          }
        }}
      >
        <DialogTitle 
          component="div"
          sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            Progress by Continent
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Countries Named: {namedCount}/{totalCountries}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {Object.entries(continents).map(([continent, countries]) => {
              const continentNamedCountries = countries.filter(country => namedCountries.has(country));
              const continentTotal = countries.length;
              const continentProgress = (continentNamedCountries.length / continentTotal) * 100;
              
              return (
                <Accordion 
                  key={continent}
                  sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    '&:before': { display: 'none' },
                    '& .MuiAccordionSummary-root': {
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 1,
                    }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {continent}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip 
                          label={`${continentNamedCountries.length}/${continentTotal}`}
                          size="small"
                          sx={{ 
                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {Math.round(continentProgress)}%
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={continentProgress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          mb: 2,
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
                            borderRadius: 3,
                          }
                        }}
                      />
                      {continentNamedCountries.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {continentNamedCountries.map((country) => (
                            <Chip 
                              key={country}
                              label={country}
                              size="small"
                              sx={{ 
                                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                          No countries named yet in this continent
                        </Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={() => setShowViewDialog(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              textTransform: 'none'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog */}
      <Dialog 
        open={showResults} 
        onClose={() => setShowResults(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(30,34,44,0.98)',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
        }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            Game Complete!
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Time: {formatTime(timer)} | Countries Named: {namedCount}/{totalCountries}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Score: {Math.round((namedCount / totalCountries) * 100)}%
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip 
                  icon={<CheckCircleIcon />}
                  label={`Named: ${namedCount}`}
                  sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  label={`Missed: ${getMissedCountries().length}`}
                  sx={{ 
                    background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Stack>
            </Box>

            {getMissedCountries().length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Countries You Missed:
                </Typography>
                <Box sx={{ 
                  maxHeight: 200, 
                  overflowY: 'auto',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  {getMissedCountries().map((country) => (
                    <Chip 
                      key={country}
                      label={country}
                      size="small"
                      sx={{ 
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={() => {
              setShowResults(false);
              setGameStarted(false);
              setGameFinished(false);
              setTimer(0);
              setTimerRunning(false);
              setNamedCountries(new Set());
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              textTransform: 'none'
            }}
          >
            Play Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Namle; 