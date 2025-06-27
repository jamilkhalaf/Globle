import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack, Fade, Avatar, Toolbar } from '@mui/material';
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
  

const Population = () => {
  const [countries, setCountries] = useState([]); // [left, right]
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    // Initial two random countries
    const left = getRandomCountry();
    const right = getRandomCountry(left);
    setCountries([left, right]);
    setMessage('Which country has a higher population?');
  }, []);

  const handleGuess = (guessIdx) => {
    const [left, right] = countries;
    const popLeft = getPopulation(left);
    const popRight = getPopulation(right);
    const correct = (guessIdx === 0 && popLeft >= popRight) || (guessIdx === 1 && popRight > popLeft);
    if (correct) {
      setScore(score + 1);
      setMessage('Correct!');
      setTimeout(() => {
        // On correct, reload two new random countries
        const newLeft = getRandomCountry();
        const newRight = getRandomCountry(newLeft);
        setCountries([newLeft, newRight]);
        setMessage('Which country has a higher population?');
        setFadeKey(fadeKey + 1);
      }, 900);
    } else {
      setScore(0);
      setMessage(`Wrong! The answer was ${popLeft > popRight ? left : right}.`);
      setTimeout(() => {
        // Both change
        const newLeft = getRandomCountry();
        const newRight = getRandomCountry(newLeft);
        setCountries([newLeft, newRight]);
        setMessage('Which country has a higher population?');
        setFadeKey(fadeKey + 1);
      }, 1400);
    }
  };

  if (countries.length < 2) return null;
  const [left, right] = countries;

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />
      <Toolbar />
      <Fade in key={fadeKey} timeout={600}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minWidth: 340, maxWidth: 480, textAlign: 'center', background: 'rgba(30,34,44,0.92)', color: 'white', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', backdropFilter: 'blur(8px)', mt: { xs: 10, md: 14 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'transparent', background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Population Showdown
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, color: '#b0c4de' }}>{message}</Typography>
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            {[left, right].map((name, idx) => (
              <Button key={name} onClick={() => handleGuess(idx)} sx={{
                p: 0,
                borderRadius: 3,
                minWidth: 160,
                minHeight: 180,
                maxWidth: 180,
                maxHeight: 220,
                background: 'rgba(25,118,210,0.10)',
                '&:hover': { background: 'rgba(25,118,210,0.22)', transform: 'scale(1.05)' },
                boxShadow: '0 2px 12px 0 #1976d255',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, width: '100%' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    fontSize: 60, 
                    mb: 2, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
                    }
                  }}>
                    {getCountryFlag(name)}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: '#90caf9', 
                    fontWeight: 600, 
                    fontSize: 18, 
                    mb: 1, 
                    wordBreak: 'break-word',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}>
                    {name}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
          <Typography variant="body1" sx={{ color: '#b0c4de', mb: 2 }}>Score: {score}</Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Population; 