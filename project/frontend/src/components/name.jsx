import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, Typography, Paper, Stack, Toolbar, useTheme, useMediaQuery, Button, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from './countryInfo';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import NotificationModal from './NotificationModal';
import officialCountries from './officialCountries';

const Name = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]);
  const [targetCountry, setTargetCountry] = useState(null);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('Loading...');
  const [gameOver, setGameOver] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [clickedCountry, setClickedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const mapRef = useRef(null);
  const [bestScore, setBestScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Add state for contact dialog
  const [contactOpen, setContactOpen] = useState(false);

  // Add state for notification modal
  const [showIntro, setShowIntro] = useState(true);

  const updateGameStats = async (finalScore, gameTime, bestStreak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5051/api/games/update-stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: 'findle',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: 1 // Findle is one country per game
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress('findle', finalScore, 1, bestStreak);
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const updateBadgeProgress = async (gameId, score, attempts, streak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5051/api/badges/update', {
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

  // Load countries data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        setCountries(data.features);
        startNewRound(data.features);
        setGameStartTime(Date.now());
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Check for invalid coordinates
    if ((lat1 === 0 && lon1 === 0) || (lat2 === 0 && lon2 === 0) || 
        isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      return 5000;
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

    return Math.min(distance, 20000);
  };

  const selectRandomCountry = (countryList) => {
    // Filter out countries that are too small, have invalid coordinates, or aren't in the official 195 countries
    const validCountries = countryList.filter(country => {
      try {
        const center = getCountryCenter(country);
        const hasValidCoordinates = center.lat !== 0 && center.lon !== 0;
        const isOfficialCountry = countryInfo[country.properties.name] && officialCountries.includes(country.properties.name);
        return hasValidCoordinates && isOfficialCountry;
      } catch (e) {
        return false;
      }
    });
    
    // Use a more robust random selection
    const randomIndex = Math.floor(Math.random() * validCountries.length);
    const selectedCountry = validCountries[randomIndex];
    
    return selectedCountry;
  };

  const startNewRound = (countryList) => {
    const randomCountry = selectRandomCountry(countryList);
    setTargetCountry(randomCountry);
    setMessage(`Click on ${randomCountry.properties.name} on the map!`);
    setShowTarget(false);
    setClickedCountry(null);
    setIsLoading(false);
    setShowContinueButton(false);
    
    // Reset map view to world view
    if (mapRef.current) {
      mapRef.current.setView([20, 0], isMobile ? 2 : 3, {
        animate: true,
        duration: 1
      });
    }
  };

  const handleCountryClick = (clickedCountry) => {
    if (isLoading || !targetCountry || showContinueButton) return;
    
    setIsLoading(true);
    setClickedCountry(clickedCountry);
    
    const clickedName = clickedCountry.properties.name;
    const targetName = targetCountry.properties.name;
    
    if (clickedName === targetName) {
      // Correct guess
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestScore(prev => Math.max(prev, newStreak));
      setMessage(`🎉 Correct! +1 point!`);
      setShowTarget(true);
      setShowContinueButton(true);
      setIsLoading(false);
      
      // Update stats after each correct answer
      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      updateGameStats(newStreak, gameTime, newStreak);
      
      // Zoom in to the correct country
      zoomToCountry(targetCountry);
    } else {
      // Wrong guess
      setStreak(0);
      setMessage(`❌ Wrong! That's ${clickedName}. The correct answer was ${targetName}.`);
      setShowTarget(true);
      setShowContinueButton(true);
      setIsLoading(false);
      
      // Update stats when game ends (wrong answer)
      const gameTime = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
      updateGameStats(0, gameTime, 0);
      
      // Zoom in to the correct country
      zoomToCountry(targetCountry);
    }
  };

  const continueToNextRound = () => {
    startNewRound(countries);
    setGameStartTime(Date.now()); // Reset timer for new round
  };

  const zoomToCountry = (country) => {
    if (mapRef.current && country) {
      try {
        const center = getCountryCenter(country);
        if (center.lat !== 0 && center.lon !== 0) {
          mapRef.current.setView([center.lat, center.lon], 6, {
            animate: true,
            duration: 1
          });
        }
      } catch (e) {
        console.error('Error zooming to country:', e);
      }
    }
  };

  const resetGame = () => {
    setStreak(0);
    setBestScore(0);
    setGameOver(false);
    setGameStartTime(Date.now());
    startNewRound(countries);
  };

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Findle (Name Game)"
          description={"Find the country on the map! Each round, a country is named and you must click it on the map. Try to keep your streak going!"}
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
      touchAction: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
      <Header />
      <Toolbar />
      
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
            const isTarget = targetCountry && country.properties.name === targetCountry.properties.name;
            const isClicked = clickedCountry && country.properties.name === clickedCountry.properties.name;
            
            let fillColor = '#333'; // Default for unclicked countries
            if (isTarget && (showTarget || showContinueButton)) {
              fillColor = '#4CAF50'; // Green for correct target
            } else if (isClicked && !isTarget) {
              fillColor = '#f44336'; // Red for wrong guess
            }
            
            return (
              <GeoJSON
                key={index}
                data={country}
                style={{
                  fillColor: fillColor,
                  fillOpacity: (isTarget && (showTarget || showContinueButton)) || isClicked ? 0.9 : 0.3,
                  color: '#666',
                  weight: 1
                }}
                eventHandlers={{
                  click: () => handleCountryClick(country)
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
          maxWidth: { xs: '280px', md: '320px' },
          width: { xs: '280px', md: '320px' },
          boxShadow: 3,
          borderRadius: { xs: 1, md: 2 },
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Stack spacing={isMobile ? 1 : 2}>
          <Typography 
            variant={isMobile ? "body1" : "h6"}
            sx={{ 
              fontWeight: 'bold',
              color: '#1976d2',
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              lineHeight: 1.2,
              textAlign: 'center',
              mb: { xs: 0.5, md: 1 }
            }}
          >
            {message}
          </Typography>
          
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
              Streak:
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 'bold',
                color: '#4CAF50',
                fontSize: { xs: '0.6rem', md: '0.75rem' }
              }}
            >
              {streak}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={resetGame}
            size="small"
            sx={{
              borderColor: '#666',
              color: '#ccc',
              fontSize: { xs: '0.6rem', md: '0.8rem' },
              height: { xs: '28px', md: '36px' },
              '&:hover': {
                borderColor: '#999',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Reset Game
          </Button>

          {showContinueButton && (
            <Button
              variant="contained"
              onClick={continueToNextRound}
              size="small"
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                fontSize: { xs: '0.6rem', md: '0.8rem' },
                height: { xs: '28px', md: '36px' },
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Continue
            </Button>
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

export default Name; 