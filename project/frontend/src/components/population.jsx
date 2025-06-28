import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Stack, Fade, Avatar, Toolbar, useTheme, useMediaQuery, IconButton } from '@mui/material';
import countryInfo from './countryInfo';
import Header from './Header';

const getRandomCountry = (exclude) => {
  const keys = Object.keys(countryInfo).filter(k => k !== exclude);
  return keys[Math.floor(Math.random() * keys.length)];
};

const getPopulation = (name) => countryInfo[name]?.population || 0;

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
    'ST. Lucia': '🇱🇨',
    'Dominica': '🇩🇲',
    'Antigua and Barbuda': '🇦🇬',
    'Saint Kitts and Nevis': '🇰🇳',
    'Montserrat': '🇲🇸',
    'Falkland Islands': '🇫🇰',
    'Curacao': '🇨🇼',
    
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
    'Malta': '🇲🇹',
    'Russian Federation': '🇷🇺',
    
    // Asia
    'China': '🇨🇳',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'North Korea': '🇰🇵',
    'Korea, Rep.': '🇰🇷',
    'Korea, Dem. Peoples Rep.': '🇰🇵',
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
    'Timor-Leste': '🇹🇱',
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
    'São Tomé and Príncipe': '🇸🇹',
    'Lesotho': '🇱🇸',
    'eSwatini': '🇸🇿'
  };
  
  return countryFlags[countryName] || '🏳️'; // Return flag emoji or default flag
};
  

const Population = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [countries, setCountries] = useState([]); // [left, right]
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [fadeKey, setFadeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the random country generation to prevent unnecessary re-renders
  const generateNewCountries = useCallback(() => {
    const left = getRandomCountry();
    const right = getRandomCountry(left);
    return [left, right];
  }, []);

  useEffect(() => {
    // Initial two random countries
    setCountries(generateNewCountries());
    setMessage('Which country has a higher population?');
  }, [generateNewCountries]);

  const handleGuess = useCallback((guessIdx) => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    const [left, right] = countries;
    const popLeft = getPopulation(left);
    const popRight = getPopulation(right);
    const correct = (guessIdx === 0 && popLeft >= popRight) || (guessIdx === 1 && popRight > popLeft);
    
    if (correct) {
      setScore(prev => prev + 1);
      setMessage('Correct! 🎉');
      
      // Faster transition for correct answers
      setTimeout(() => {
        setCountries(generateNewCountries());
        setMessage('Which country has a higher population?');
        setFadeKey(prev => prev + 1);
        setIsLoading(false);
      }, 600);
    } else {
      setScore(0);
      setMessage(`Wrong! The answer was ${popLeft > popRight ? left : right}.`);
      
      setTimeout(() => {
        setCountries(generateNewCountries());
        setMessage('Which country has a higher population?');
        setFadeKey(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
    }
  }, [countries, isLoading, generateNewCountries]);

  if (countries.length < 2) return null;
  const [left, right] = countries;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      overflow: 'hidden', // Prevent scrolling issues on mobile
      position: 'relative'
    }}>
      <Header />
      <Toolbar />
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        px: { xs: 2, md: 4 },
        py: { xs: 1, md: 2 }
      }}>
        <Fade in key={fadeKey} timeout={400}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: { xs: 3, md: 4 }, 
              width: { xs: '100%', md: 480 }, 
              maxWidth: { xs: '100%', md: 480 },
              textAlign: 'center', 
              background: 'rgba(30,34,44,0.95)', 
              color: 'white', 
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', 
              backdropFilter: 'blur(12px)', 
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background gradient overlay */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
              pointerEvents: 'none'
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  mb: { xs: 2, md: 3 }, 
                  fontWeight: 'bold', 
                  color: 'transparent', 
                  background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Population Showdown
              </Typography>
              
              <Typography 
                variant={isMobile ? "body1" : "subtitle1"} 
                sx={{ 
                  mb: { xs: 3, md: 4 }, 
                  color: '#b0c4de',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {message}
              </Typography>
              
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={isMobile ? 2 : 3} 
                justifyContent="center" 
                alignItems="center" 
                sx={{ mb: { xs: 3, md: 4 } }}
              >
                {[left, right].map((name, idx) => (
                  <Button 
                    key={`${name}-${fadeKey}`} 
                    onClick={() => handleGuess(idx)}
                    disabled={isLoading}
                    sx={{
                      p: 0,
                      borderRadius: { xs: 3, md: 4 },
                      width: { xs: '100%', md: 200 },
                      height: { xs: 120, md: 160 },
                      background: 'rgba(25,118,210,0.15)',
                      border: '2px solid rgba(25,118,210,0.3)',
                      '&:hover': { 
                        background: 'rgba(25,118,210,0.25)', 
                        transform: 'translateY(-2px)',
                        border: '2px solid rgba(25,118,210,0.5)',
                        boxShadow: '0 8px 25px rgba(25,118,210,0.3)'
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                        transition: 'transform 0.1s'
                      },
                      '&:disabled': {
                        opacity: 0.7,
                        transform: 'none'
                      },
                      boxShadow: '0 4px 20px rgba(25,118,210,0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Button background gradient */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      pointerEvents: 'none'
                    }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      p: { xs: 1.5, md: 2 }, 
                      width: '100%',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Box sx={{ 
                        width: { xs: 50, md: 70 }, 
                        height: { xs: 50, md: 70 }, 
                        fontSize: { xs: 32, md: 48 }, 
                        mb: { xs: 1, md: 1.5 }, 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        }
                      }}>
                        {getCountryFlag(name)}
                      </Box>
                      <Typography 
                        variant={isMobile ? "body1" : "h6"} 
                        sx={{ 
                          color: '#90caf9', 
                          fontWeight: 600, 
                          fontSize: { xs: 16, md: 18 }, 
                          mb: { xs: 0.5, md: 1 }, 
                          wordBreak: 'break-word',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {name}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
              
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)'
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    color: '#4caf50', 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Score: {score}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Population; 