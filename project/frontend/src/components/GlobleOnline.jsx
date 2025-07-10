import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Stack, 
  Autocomplete, 
  Toolbar, 
  Tooltip, 
  useTheme, 
  useMediaQuery, 
  IconButton,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from './countryInfo';
import officialCountries from './officialCountries';
import PublicIcon from '@mui/icons-material/Public';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';

const GlobleOnline = ({ matchData, onAnswerSubmit, gameState, gameTimer }) => {
  console.log('🎮 GlobleOnline rendering with props:', { matchData, gameState, gameTimer });
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Game state
  const [countries, setCountries] = useState([]);
  const [secretCountry, setSecretCountry] = useState(null);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a country!');
  const [countryOptions, setCountryOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastDistance, setLastDistance] = useState(null);
  
  // Multiplayer state
  const [roundNumber, setRoundNumber] = useState(1);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [currentRoundWinner, setCurrentRoundWinner] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [finalWinner, setFinalWinner] = useState(null);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [roundResults, setRoundResults] = useState([]);
  
  const mapRef = useRef(null);

  useEffect(() => {
    if (matchData) {
      setOtherPlayers(matchData.players || []);
      // Set the secret country from match data
      if (matchData.secretCountry) {
        setSecretCountry(matchData.secretCountry);
      }
    }
  }, [matchData]);

  useEffect(() => {
    if (gameState === 'ended') {
      setGameEnded(true);
    }
  }, [gameState]);

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

  const getCountryCenter = (country) => {
    if (!country || !country.geometry) return { lat: 0, lon: 0 };
    
    const coordinates = country.geometry.coordinates;
    if (country.geometry.type === 'Polygon') {
      // Calculate centroid of polygon
      let sumLat = 0, sumLon = 0, count = 0;
      coordinates[0].forEach(coord => {
        sumLon += coord[0];
        sumLat += coord[1];
        count++;
      });
      return { lat: sumLat / count, lon: sumLon / count };
    } else if (country.geometry.type === 'MultiPolygon') {
      // Calculate centroid of first polygon
      let sumLat = 0, sumLon = 0, count = 0;
      coordinates[0][0].forEach(coord => {
        sumLon += coord[0];
        sumLat += coord[1];
        count++;
      });
      return { lat: sumLat / count, lon: sumLon / count };
    }
    return { lat: 0, lon: 0 };
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

  const getColor = (distance) => {
    if (distance === 0) return '#00ff00'; // Green for correct guess
    if (distance < 100) return '#ff0000'; // Red for very close
    if (distance < 500) return '#ff6600'; // Orange for close
    if (distance < 1000) return '#ffcc00'; // Yellow for medium
    if (distance < 2500) return '#ffff00'; // Light yellow for far
    return '#ffffff'; // White for very far
  };

  const getDistanceMessage = (distance, lastDistance) => {
    if (distance === 0) return 'Correct!';
    if (distance < 100) return 'Very hot!';
    if (distance < 500) return 'Hot!';
    if (distance < 1000) return 'Warm';
    if (distance < 2500) return 'Cold';
    return 'Very cold';
  };

  const handleGuess = () => {
    if (!guess.trim() || !secretCountry) return;

    const guessedCountry = countries.find(country => 
      country.properties.name.toLowerCase() === guess.toLowerCase()
    );

    if (!guessedCountry) {
      setMessage('Country not found. Try again!');
      return;
    }

    const secretCenter = getCountryCenter(secretCountry);
    const guessedCenter = getCountryCenter(guessedCountry);
    const distance = calculateDistance(
      secretCenter.lat, secretCenter.lon,
      guessedCenter.lat, guessedCenter.lon
    );

    const newGuess = {
      country: guessedCountry,
      distance: distance,
      message: getDistanceMessage(distance, lastDistance),
      isCorrect: distance === 0
    };

    setGuessedCountries(prev => [...prev, newGuess]);
    setLastDistance(distance);
    setGuess('');

    if (distance === 0) {
      // Correct guess - end round
      setMessage('Correct! Round complete!');
      setCurrentRoundWinner(matchData?.players?.[0]?.username || 'Player 1');
      
      // Submit answer to server
      onAnswerSubmit({
        answer: guessedCountry.properties.name,
        timeTaken: 60 - gameTimer,
        isCorrect: true,
        distance: distance
      });
    } else {
      setMessage(newGuess.message);
    }
  };

  const handleCountrySelect = (event, newValue) => {
    if (newValue) {
      setGuess(newValue.label);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const renderPlayerList = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Players
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {otherPlayers.map((player, index) => (
          <Card key={index} sx={{ 
            bgcolor: 'rgba(255,255,255,0.1)', 
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: 200
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ bgcolor: '#43cea2', width: 32, height: 32 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {player.username}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Wins: {index === 0 ? player1Wins : player2Wins}
              </Typography>
              {currentRoundWinner === player.username && (
                <Chip 
                  label="Round Winner!" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#ffd700', 
                    color: 'black', 
                    mt: 1,
                    fontWeight: 'bold'
                  }} 
                />
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  const renderRoundInfo = () => (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
        Round {roundNumber} of 3
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Chip 
          label={`${otherPlayers[0]?.username || 'Player 1'}: ${player1Wins}`}
          sx={{ bgcolor: player1Wins > player2Wins ? '#43cea2' : 'rgba(255,255,255,0.1)', color: 'white' }}
        />
        <Chip 
          label={`${otherPlayers[1]?.username || 'Player 2'}: ${player2Wins}`}
          sx={{ bgcolor: player2Wins > player1Wins ? '#43cea2' : 'rgba(255,255,255,0.1)', color: 'white' }}
        />
      </Box>
    </Box>
  );

  const renderGameInterface = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
        What country is this?
      </Typography>
      
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#43cea2', mb: 1 }}>
          Timer: {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {message}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Autocomplete
          options={countryOptions}
          getOptionLabel={(option) => option.label}
          onChange={handleCountrySelect}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Enter country name"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={gameEnded}
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
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handleGuess}
          disabled={!guess.trim() || gameEnded}
          sx={{ 
            bgcolor: '#43cea2',
            '&:hover': { bgcolor: '#3bb08f' }
          }}
        >
          Submit Guess
        </Button>
      </Box>
    </Box>
  );

  const renderMap = () => (
    <Box sx={{ height: 400, mb: 3 }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {guessedCountries.map((guess, index) => (
          <GeoJSON
            key={index}
            data={guess.country}
            style={{
              fillColor: getColor(guess.distance),
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            }}
          />
        ))}
      </MapContainer>
    </Box>
  );

  const renderAttempts = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Your Guesses
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {guessedCountries.map((guess, index) => (
          <Chip
            key={index}
            label={`${guess.country.properties.name} (${guess.distance.toFixed(0)}km)`}
            sx={{ 
              bgcolor: getColor(guess.distance),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderGameResult = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h3" sx={{ color: '#43cea2', mb: 2 }}>
        Game Over!
      </Typography>
      {finalWinner && (
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Winner: {finalWinner}
        </Typography>
      )}
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        Final Score: {player1Wins} - {player2Wins}
      </Typography>
    </Box>
  );

  const renderCountdown = () => (
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress sx={{ color: '#43cea2', mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'white' }}>
        Game starting in 3 seconds...
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
          <PublicIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Globle Online
        </Typography>

        {renderPlayerList()}
        {renderRoundInfo()}

        {gameState === 'countdown' && renderCountdown()}
        
        {gameState === 'playing' && (
          <>
            {renderGameInterface()}
            {renderMap()}
            {guessedCountries.length > 0 && renderAttempts()}
          </>
        )}
        
        {gameEnded && renderGameResult()}
      </Box>
    </Box>
  );
};

export default GlobleOnline; 