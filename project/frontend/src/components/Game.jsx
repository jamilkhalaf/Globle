import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Box, TextField, Button, Typography, Paper, Stack, Autocomplete, Toolbar, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import 'leaflet/dist/leaflet.css';
import countryInfo from './countryInfo';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const Game = () => {
  const navigate = useNavigate();
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
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  const selectRandomCountry = (countryList) => {
    // Filter out countries that are too small or have invalid coordinates
    const validCountries = countryList.filter(country => {
      try {
        const center = getCountryCenter(country);
        return center.lat !== 0 && center.lon !== 0;
      } catch (e) {
        return false;
      }
    });
    
    // Debug: Check if Monaco is in the dataset
    const monaco = countryList.find(c => c.properties.name === 'Monaco');
    if (monaco) {
      console.log('Monaco found in dataset');
    } else {
      console.log('Monaco NOT found in dataset');
      console.log('Available countries near Monaco:', countryList.filter(c => 
        c.properties.name.includes('France') || 
        c.properties.name.includes('Italy') || 
        c.properties.name.includes('Spain')
      ).map(c => c.properties.name));
    }
    
    const randomIndex = Math.floor(Math.random() * validCountries.length);
    const selectedCountry = validCountries[randomIndex];
    
    console.log(`Selected country: ${selectedCountry.properties.name}`);
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
    const newSecretCountry = selectRandomCountry(countries);
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

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const getCountryFlag = (countryName) => {
    // Direct flag emoji mapping for better reliability
    const countryFlags = {
      // North America
      'United States': '🇺🇸',
      'USA': '🇺🇸',
      'United States of America': '🇺🇸',
      'Canada': '🇨🇦',
      'Mexico': '🇲🇽',
      
      // Central America
      'Guatemala': '🇬🇹',
      'Belize': '🇧🇿',
      'El Salvador': '🇸🇻',
      'Honduras': '🇭🇳',
      'Nicaragua': '🇳🇮',
      'Costa Rica': '🇨🇷',
      'Panama': '🇵🇦',
      
      // Caribbean
      'Cuba': '🇨🇺',
      'Jamaica': '🇯🇲',
      'Haiti': '🇭🇹',
      'Dominican Republic': '🇩🇴',
      'Puerto Rico': '🇵🇷',
      'Bahamas': '🇧🇸',
      'Barbados': '🇧🇧',
      'Trinidad and Tobago': '🇹🇹',
      'Grenada': '🇬🇩',
      'Saint Vincent and the Grenadines': '🇻🇨',
      'Saint Lucia': '🇱🇨',
      'Dominica': '🇩🇲',
      'Antigua and Barbuda': '🇦🇬',
      'Saint Kitts and Nevis': '🇰🇳',
      'Montserrat': '🇲🇸',
      'Falkland Islands': '🇫🇰',
      
      // South America
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Peru': '🇵🇪',
      'Colombia': '🇨🇴',
      'Venezuela': '🇻🇪',
      'Ecuador': '🇪🇨',
      'Bolivia': '🇧🇴',
      'Paraguay': '🇵🇾',
      'Uruguay': '🇺🇾',
      'Guyana': '🇬🇾',
      'Suriname': '🇸🇷',
      'French Guiana': '🇬🇫',
      
      // Europe
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Portugal': '🇵🇹',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Luxembourg': '🇱🇺',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Poland': '🇵🇱',
      'Czech Republic': '🇨🇿',
      'Czechia': '🇨🇿',
      'Slovakia': '🇸🇰',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Greece': '🇬🇷',
      'Albania': '🇦🇱',
      'North Macedonia': '🇲🇰',
      'Serbia': '🇷🇸',
      'Montenegro': '🇲🇪',
      'Bosnia and Herzegovina': '🇧🇦',
      'Croatia': '🇭🇷',
      'Slovenia': '🇸🇮',
      'Ukraine': '🇺🇦',
      'Belarus': '🇧🇾',
      'Moldova': '🇲🇩',
      'Lithuania': '🇱🇹',
      'Latvia': '🇱🇻',
      'Estonia': '🇪🇪',
      'Finland': '🇫🇮',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Iceland': '🇮🇸',
      'Ireland': '🇮🇪',
      
      // Asia
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'North Korea': '🇰🇵',
      'India': '🇮🇳',
      'Pakistan': '🇵🇰',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Nepal': '🇳🇵',
      'Bhutan': '🇧🇹',
      'Maldives': '🇲🇻',
      'Afghanistan': '🇦🇫',
      'Iran': '🇮🇷',
      'Iraq': '🇮🇶',
      'Syria': '🇸🇾',
      'Lebanon': '🇱🇧',
      'Jordan': '🇯🇴',
      'Israel': '🇮🇱',
      'Palestine': '🇵🇸',
      'Saudi Arabia': '🇸🇦',
      'Yemen': '🇾🇪',
      'Oman': '🇴🇲',
      'United Arab Emirates': '🇦🇪',
      'Qatar': '🇶🇦',
      'Kuwait': '🇰🇼',
      'Bahrain': '🇧🇭',
      'Kazakhstan': '🇰🇿',
      'Uzbekistan': '🇺🇿',
      'Turkmenistan': '🇹🇲',
      'Kyrgyzstan': '🇰🇬',
      'Tajikistan': '🇹🇯',
      'Mongolia': '🇲🇳',
      'Vietnam': '🇻🇳',
      'Laos': '🇱🇦',
      'Cambodia': '🇰🇭',
      'Thailand': '🇹🇭',
      'Myanmar': '🇲🇲',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Brunei': '🇧🇳',
      'East Timor': '🇹🇱',
      'Taiwan': '🇹🇼',
      'Hong Kong': '🇭🇰',
      'Macau': '🇲🇴',
      
      // Oceania
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Papua New Guinea': '🇵🇬',
      'Fiji': '🇫🇯',
      'Solomon Islands': '🇸🇧',
      'Vanuatu': '🇻🇺',
      'New Caledonia': '🇳🇨',
      'Samoa': '🇼🇸',
      'American Samoa': '🇦🇸',
      'Tonga': '🇹🇴',
      'Tuvalu': '🇹🇻',
      'Kiribati': '🇰🇮',
      'Nauru': '🇳🇷',
      'Palau': '🇵🇼',
      'Micronesia': '🇫🇲',
      'Marshall Islands': '🇲🇭',
      'Cook Islands': '🇨🇰',
      'Niue': '🇳🇺',
      'Tokelau': '🇹🇰',
      'French Polynesia': '🇵🇫',
      'Wallis and Futuna': '🇼🇫',
      'Pitcairn Islands': '🇵🇳',
      'Guam': '🇬🇺',
      'Northern Mariana Islands': '🇲🇵',
      
      // Africa
      'South Africa': '🇿🇦',
      'Egypt': '🇪🇬',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'Morocco': '🇲🇦',
      'Algeria': '🇩🇿',
      'Tunisia': '🇹🇳',
      'Libya': '🇱🇾',
      'Sudan': '🇸🇩',
      'South Sudan': '🇸🇸',
      'Chad': '🇹🇩',
      'Niger': '🇳🇪',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Senegal': '🇸🇳',
      'Guinea': '🇬🇳',
      'Sierra Leone': '🇸🇱',
      'Liberia': '🇱🇷',
      'Ivory Coast': '🇨🇮',
      'Ghana': '🇬🇭',
      'Togo': '🇹🇬',
      'Benin': '🇧🇯',
      'Cameroon': '🇨🇲',
      'Central African Republic': '🇨🇫',
      'Equatorial Guinea': '🇬🇶',
      'Gabon': '🇬🇦',
      'Republic of the Congo': '🇨🇬',
      'Democratic Republic of the Congo': '🇨🇩',
      'Angola': '🇦🇴',
      'Zambia': '🇿🇲',
      'Zimbabwe': '🇿🇼',
      'Botswana': '🇧🇼',
      'Namibia': '🇳🇦',
      'Mozambique': '🇲🇿',
      'Malawi': '🇲🇼',
      'Tanzania': '🇹🇿',
      'United Republic of Tanzania': '🇹🇿',
      'Uganda': '🇺🇬',
      'Rwanda': '🇷🇼',
      'Burundi': '🇧🇮',
      'Ethiopia': '🇪🇹',
      'Eritrea': '🇪🇷',
      'Djibouti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Madagascar': '🇲🇬',
      'Comoros': '🇰🇲',
      'Mauritius': '🇲🇺',
      'Seychelles': '🇸🇨',
      'Cape Verde': '🇨🇻',
      'Guinea-Bissau': '🇬🇼',
      'The Gambia': '🇬🇲',
      'Mauritania': '🇲🇷',
      'Western Sahara': '🇪🇭',
      'Polisario Front': '🇪🇭',
      'Sahrawi Arab Democratic Republic': '🇪🇭',
      'Guinea-Bissau': '🇬🇼',
      'São Tomé and Príncipe': '🇸🇹',
      'Equatorial Guinea': '🇬🇶',
      'Chad': '🇹🇩',
      'Niger': '🇳🇪',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Senegal': '🇸🇳',
      'Guinea': '🇬🇳',
      'Sierra Leone': '🇸🇱',
      'Liberia': '🇱🇷',
      'Ivory Coast': '🇨🇮',
      'Ghana': '🇬🇭',
      'Togo': '🇹🇬',
      'Benin': '🇧🇯',
      'Cameroon': '🇨🇲',
      'Central African Republic': '🇨🇫',
      'Gabon': '🇬🇦',
      'Republic of the Congo': '🇨🇬',
      'Democratic Republic of the Congo': '🇨🇩',
      'Angola': '🇦🇴',
      'Zambia': '🇿🇲',
      'Zimbabwe': '🇿🇼',
      'Botswana': '🇧🇼',
      'Namibia': '🇳🇦',
      'Mozambique': '🇲🇿',
      'Malawi': '🇲🇼',
      'Tanzania': '🇹🇿',
      'Uganda': '🇺🇬',
      'Rwanda': '🇷🇼',
      'Burundi': '🇧🇮',
      'Ethiopia': '🇪🇹',
      'Eritrea': '🇪🇷',
      'Djibouti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Madagascar': '🇲🇬',
      'Comoros': '🇰🇲',
      'Mauritius': '🇲🇺',
      'Seychelles': '🇸🇨',
      'Cape Verde': '🇨🇻',
      'The Gambia': '🇬🇲',
      'Mauritania': '🇲🇷',
      'Western Sahara': '🇪🇭',
      'Polisario Front': '🇪🇭',
      'Sahrawi Arab Democratic Republic': '🇪🇭',
      
      // Russia and former Soviet states
      'Russia': '🇷🇺',
      'Belarus': '🇧🇾',
      'Ukraine': '🇺🇦',
      'Moldova': '🇲🇩',
      'Lithuania': '🇱🇹',
      'Latvia': '🇱🇻',
      'Estonia': '🇪🇪',
      'Georgia': '🇬🇪',
      'Armenia': '🇦🇲',
      'Azerbaijan': '🇦🇿',
      'Kazakhstan': '🇰🇿',
      'Uzbekistan': '🇺🇿',
      'Turkmenistan': '🇹🇲',
      'Kyrgyzstan': '🇰🇬',
      'Tajikistan': '🇹🇯',
      
      // Middle East
      'Turkey': '🇹🇷',
      'Cyprus': '🇨🇾',
      'Northern Cyprus': '🇨🇾',
      'Iraq': '🇮🇶',
      'Iran': '🇮🇷',
      'Afghanistan': '🇦🇫',
      'Pakistan': '🇵🇰',
      'India': '🇮🇳',
      'Nepal': '🇳🇵',
      'Bhutan': '🇧🇹',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Maldives': '🇲🇻',
      'Myanmar': '🇲🇲',
      'Thailand': '🇹🇭',
      'Laos': '🇱🇦',
      'Cambodia': '🇰🇭',
      'Vietnam': '🇻🇳',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Brunei': '🇧🇳',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'East Timor': '🇹🇱',
      'Papua New Guinea': '🇵🇬',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Fiji': '🇫🇯',
      'Solomon Islands': '🇸🇧',
      'Vanuatu': '🇻🇺',
      'New Caledonia': '🇳🇨',
      'Samoa': '🇼🇸',
      'American Samoa': '🇦🇸',
      'Tonga': '🇹🇴',
      'Tuvalu': '🇹🇻',
      'Kiribati': '🇰🇮',
      'Nauru': '🇳🇷',
      'Palau': '🇵🇼',
      'Micronesia': '🇫🇲',
      'Marshall Islands': '🇲🇭',
      'Cook Islands': '🇨🇰',
      'Niue': '🇳🇺',
      'Tokelau': '🇹🇰',
      'French Polynesia': '🇵🇫',
      'Wallis and Futuna': '🇼🇫',
      'Pitcairn Islands': '🇵🇳',
      'Guam': '🇬🇺',
      'Northern Mariana Islands': '🇲🇵',
      'Lesotho': '🇱🇸',
      'eSwatini': '🇸🇿'
    };
    
    return countryFlags[countryName] || '🏳️'; // Return flag emoji or default flag
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
      backgroundColor: '#2b2b2b'
    }} onMouseMove={handleMouseMove}>
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
        backgroundColor: '#2b2b2b'
      }}>
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={3}
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
            backgroundColor: '#2b2b2b'
          }}
          zoomControl={false}
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
            map.setMinZoom(3);
            map.setMaxZoom(10);
            map.setMaxBounds([[-85, -180], [85, 180]]);
            map.on('zoomend', () => {
              const currentZoom = map.getZoom();
              if (currentZoom < 3) {
                map.setZoom(3);
              }
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
                eventHandlers={{
                  mouseover: (e) => {
                    setHoveredCountry(country);
                  },
                  mouseout: () => {
                    setHoveredCountry(null);
                  }
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

      {/* Hover Tooltip */}
      {hoveredCountry && (
        <Box
          sx={{
            position: 'fixed',
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 2000,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>
              {getCountryFlag(hoveredCountry.properties.name)}
            </span>
            <span>{hoveredCountry.properties.name}</span>
          </Box>
          {(() => {
            const info = countryInfo[hoveredCountry.properties.name];
            if (!info) return <Typography variant="body2" sx={{ color: '#ccc' }}>No info available.</Typography>;
            return (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Capital: <b>{info.capital}</b></Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Population: <b>{info.population.toLocaleString()}</b></Typography>
              </Box>
            );
          })()}
        </Box>
      )}

      {/* Game Info Panel */}
      <Paper
        sx={{
          position: 'absolute',
          top: 80,
          left: 20,
          padding: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          zIndex: 1000,
          maxWidth: '320px',
          width: '320px',
          boxShadow: 3,
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: gameOver ? '#4CAF50' : '#1976d2',
                fontSize: '1.1rem',
                lineHeight: 1.3
              }}
            >
              {message}
            </Typography>
            {!gameOver && (
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#ccc' }}>
                Type a country name
              </Typography>
            )}
            {gameOver && (
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#4CAF50' }}>
                Score: {score} • Time: {gameEndTime ? formatTime(gameEndTime - gameStartTime) : '--'}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                  placeholder="Country name"
                  disabled={gameOver}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      fontSize: '0.9rem',
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      },
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
                  maxHeight: '150px',
                  fontSize: '0.9rem'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleGuess}
              disabled={gameOver}
              size="small"
              sx={{
                minWidth: '60px',
                backgroundColor: '#1976d2',
                fontSize: '0.8rem',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Guess
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
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
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  },
                }}
              >
                Give Up
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
                  fontSize: '0.8rem',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                  },
                }}
              >
                Next Country
              </Button>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: 1,
            borderRadius: 1
          }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#ccc' }}>
              Guessed:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold',
                color: '#1976d2',
                fontSize: '0.9rem'
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
            padding: 1,
            borderRadius: 1
          }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#ccc' }}>
              Best Attempts:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold',
                color: '#4CAF50',
                fontSize: '0.9rem'
              }}
            >
              {bestScore || '--'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Footer with ? button */}
      <Box sx={{
        position: 'fixed',
        bottom: 16,
        left: 0,
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 2001
      }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: '50%', minWidth: 0, width: 40, height: 40, fontSize: 24, color: 'white', borderColor: 'white', backgroundColor: 'rgba(0,0,0,0.7)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' } }}
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