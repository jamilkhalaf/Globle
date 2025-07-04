import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Fade, Toolbar, ToggleButton, ToggleButtonGroup, TextField, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Header from './Header';
import NotificationModal from './NotificationModal';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import officialCountries from './officialCountries';

// Country to code mapping (from Flagle)
const countryToCode = {
  'Afghanistan': 'af', 'Albania': 'al', 'Algeria': 'dz', 'Andorra': 'ad', 'Angola': 'ao',
  'Argentina': 'ar', 'Armenia': 'am', 'Australia': 'au', 'Austria': 'at', 'Azerbaijan': 'az',
  'Bahamas': 'bs', 'Bahrain': 'bh', 'Bangladesh': 'bd', 'Barbados': 'bb', 'Belarus': 'by',
  'Belgium': 'be', 'Belize': 'bz', 'Benin': 'bj', 'Bhutan': 'bt', 'Bolivia': 'bo',
  'Bosnia and Herzegovina': 'ba', 'Botswana': 'bw', 'Brazil': 'br', 'Brunei': 'bn', 'Bulgaria': 'bg',
  'Burkina Faso': 'bf', 'Burundi': 'bi', 'Cabo Verde': 'cv', 'Cambodia': 'kh', 'Cameroon': 'cm',
  'Canada': 'ca', 'Central African Republic': 'cf', 'Chad': 'td', 'Chile': 'cl', 'China': 'cn',
  'Colombia': 'co', 'Comoros': 'km', 'Congo': 'cg', 'Congo, Dem. Rep.': 'cd', 'Costa Rica': 'cr',
  'Croatia': 'hr', 'Cuba': 'cu', 'Cyprus': 'cy', 'Czechia': 'cz', 'Denmark': 'dk',
  'Djibouti': 'dj', 'Dominica': 'dm', 'Dominican Republic': 'do', 'Ecuador': 'ec', 'Egypt': 'eg',
  'El Salvador': 'sv', 'Equatorial Guinea': 'gq', 'Eritrea': 'er', 'Estonia': 'ee', 'Eswatini': 'sz',
  'Ethiopia': 'et', 'Fiji': 'fj', 'Finland': 'fi', 'France': 'fr', 'Gabon': 'ga',
  'Gambia': 'gm', 'Georgia': 'ge', 'Germany': 'de', 'Ghana': 'gh', 'Greece': 'gr',
  'Grenada': 'gd', 'Guatemala': 'gt', 'Guinea': 'gn', 'Guinea-Bissau': 'gw', 'Guyana': 'gy',
  'Haiti': 'ht', 'Honduras': 'hn', 'Hungary': 'hu', 'Iceland': 'is', 'India': 'in',
  'Indonesia': 'id', 'Iran': 'ir', 'Iraq': 'iq', 'Ireland': 'ie', 'Israel': 'il',
  'Italy': 'it', 'Jamaica': 'jm', 'Japan': 'jp', 'Jordan': 'jo', 'Kazakhstan': 'kz',
  'Kenya': 'ke', 'Kiribati': 'ki', 'Korea, North': 'kp', 'Korea, South': 'kr', 'Kuwait': 'kw',
  'Kyrgyzstan': 'kg', 'Laos': 'la', 'Latvia': 'lv', 'Lebanon': 'lb', 'Lesotho': 'ls',
  'Liberia': 'lr', 'Libya': 'ly', 'Liechtenstein': 'li', 'Lithuania': 'lt', 'Luxembourg': 'lu',
  'Madagascar': 'mg', 'Malawi': 'mw', 'Malaysia': 'my', 'Maldives': 'mv', 'Mali': 'ml',
  'Malta': 'mt', 'Marshall Islands': 'mh', 'Mauritania': 'mr', 'Mauritius': 'mu', 'Mexico': 'mx',
  'Micronesia': 'fm', 'Moldova': 'md', 'Monaco': 'mc', 'Mongolia': 'mn', 'Montenegro': 'me',
  'Morocco': 'ma', 'Mozambique': 'mz', 'Myanmar': 'mm', 'Namibia': 'na', 'Nauru': 'nr',
  'Nepal': 'np', 'Netherlands': 'nl', 'New Zealand': 'nz', 'Nicaragua': 'ni', 'Niger': 'ne',
  'Nigeria': 'ng', 'North Macedonia': 'mk', 'Norway': 'no', 'Oman': 'om', 'Pakistan': 'pk',
  'Palau': 'pw', 'Palestine': 'ps', 'Panama': 'pa', 'Papua New Guinea': 'pg', 'Paraguay': 'py',
  'Peru': 'pe', 'Philippines': 'ph', 'Poland': 'pl', 'Portugal': 'pt', 'Qatar': 'qa',
  'Romania': 'ro', 'Russia': 'ru', 'Rwanda': 'rw', 'Saint Kitts and Nevis': 'kn', 'Saint Lucia': 'lc',
  'Saint Vincent and the Grenadines': 'vc', 'Samoa': 'ws', 'San Marino': 'sm', 'Sao Tome and Principe': 'st', 'Saudi Arabia': 'sa',
  'Senegal': 'sn', 'Serbia': 'rs', 'Seychelles': 'sc', 'Sierra Leone': 'sl', 'Singapore': 'sg',
  'Slovakia': 'sk', 'Slovenia': 'si', 'Solomon Islands': 'sb', 'Somalia': 'so', 'South Africa': 'za',
  'South Sudan': 'ss', 'Spain': 'es', 'Sri Lanka': 'lk', 'Sudan': 'sd', 'Suriname': 'sr',
  'Sweden': 'se', 'Switzerland': 'ch', 'Syria': 'sy', 'Tajikistan': 'tj', 'Tanzania': 'tz',
  'Thailand': 'th', 'Timor-Leste': 'tl', 'Togo': 'tg', 'Tonga': 'to', 'Trinidad and Tobago': 'tt',
  'Tunisia': 'tn', 'Turkey': 'tr', 'Turkmenistan': 'tm', 'Tuvalu': 'tv', 'Uganda': 'ug',
  'Ukraine': 'ua', 'United Arab Emirates': 'ae', 'United Kingdom': 'gb', 'United States': 'us', 'Uruguay': 'uy',
  'Uzbekistan': 'uz', 'Vanuatu': 'vu', 'Vatican City': 'va', 'Venezuela': 've', 'Vietnam': 'vn',
  'Yemen': 'ye', 'Zambia': 'zm', 'Zimbabwe': 'zw'
};

// US state to code mapping
const stateToCode = {
  'Alabama': 'al', 'Alaska': 'ak', 'Arizona': 'az', 'Arkansas': 'ar', 'California': 'ca',
  'Colorado': 'co', 'Connecticut': 'ct', 'Delaware': 'de', 'Florida': 'fl', 'Georgia': 'ga',
  'Hawaii': 'hi', 'Idaho': 'id', 'Illinois': 'il', 'Indiana': 'in', 'Iowa': 'ia',
  'Kansas': 'ks', 'Kentucky': 'ky', 'Louisiana': 'la', 'Maine': 'me', 'Maryland': 'md',
  'Massachusetts': 'ma', 'Michigan': 'mi', 'Minnesota': 'mn', 'Mississippi': 'ms', 'Missouri': 'mo',
  'Montana': 'mt', 'Nebraska': 'ne', 'Nevada': 'nv', 'New Hampshire': 'nh', 'New Jersey': 'nj',
  'New Mexico': 'nm', 'New York': 'ny', 'North Carolina': 'nc', 'North Dakota': 'nd', 'Ohio': 'oh',
  'Oklahoma': 'ok', 'Oregon': 'or', 'Pennsylvania': 'pa', 'Rhode Island': 'ri', 'South Carolina': 'sc',
  'South Dakota': 'sd', 'Tennessee': 'tn', 'Texas': 'tx', 'Utah': 'ut', 'Vermont': 'vt',
  'Virginia': 'va', 'Washington': 'wa', 'West Virginia': 'wv', 'Wisconsin': 'wi', 'Wyoming': 'wy'
};

// Only use official 195 countries for world mode
const countryList = Object.keys(countryToCode).filter(c => officialCountries.includes(c));
const stateList = Object.keys(stateToCode);

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Add API update functions
const updateGameStats = async (finalScore, streak, attempts) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetch('http://136.36.59.111:5051/api/games/update-stats', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: 'shaple',
        score: finalScore,
        streak: streak,
        attempts: attempts
      }),
    });
    await fetch('http://136.36.59.111:5051/api/badges/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: 'shaple',
        score: finalScore,
        streak: streak,
        attempts: attempts
      }),
    });
  } catch (error) {
    // Optionally handle error
    console.error('Error updating Shaple stats/badges:', error);
  }
};

const Shaple = () => {
  const [mode, setMode] = useState('world');
  const [secret, setSecret] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [guessesLeft, setGuessesLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (!showIntro) startNewGame();
    // eslint-disable-next-line
  }, [mode, showIntro]);

  const startNewGame = () => {
    setSecret(mode === 'world' ? getRandom(countryList) : getRandom(stateList));
    setGuess('');
    setMessage('');
    setGuessesLeft(5);
    setGameOver(false);
  };

  const getImageSrc = () => {
    if (mode === 'world') {
      const code = countryToCode[secret];
      return code ? `/all/${code}/1024.png` : '';
    } else {
      const code = stateToCode[secret];
      return code ? `/us/${code}/1024.png` : '';
    }
  };

  const handleGuess = () => {
    if (gameOver || !secret) return;
    const guessName = guess.trim();
    const validList = mode === 'world' ? countryList : stateList;
    if (!validList.includes(guessName)) {
      setMessage('Not a valid ' + (mode === 'world' ? 'country' : 'state'));
      setGuess('');
      return;
    }
    if (guessName.toLowerCase() === secret.toLowerCase()) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMessage('Correct!');
      setShowContinue(true);
      setGuess('');
      setGameOver(true);
      // Update stats and badges for win
      updateGameStats(score + 1, streak + 1, 5 - guessesLeft + 1);
      return;
    } else {
      setMessage(`Wrong! ${guessesLeft - 1} guesses left.`);
      if (guessesLeft - 1 === 0) {
        setStreak(0);
        setMessage(`Out of guesses! The answer was ${secret}`);
        setGameOver(true);
        setTimeout(() => {
          // Update stats and badges for loss
          updateGameStats(score, 0, 5);
          setShowContinue(true);
        }, 200);
      } else {
        setGuessesLeft(guessesLeft - 1);
      }
      setGuess('');
    }
  };

  const handleMode = (e, val) => {
    if (val) {
      setMode(val);
      setScore(0);
      setStreak(0);
      setMessage('');
      setGuessesLeft(5);
      setGameOver(false);
    }
  };

  const handleGiveUp = () => {
    if (gameOver || !secret) return;
    setStreak(0);
    setMessage(`Gave up! The answer was ${secret}`);
    setGameOver(true);
    setShowContinue(true);
    // Do NOT call updateGameStats here (no win, no loss recorded)
  };

  const handleContinue = () => {
    setShowContinue(false);
    startNewGame();
  };

  useEffect(() => {
    if (!showContinue) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showContinue]);

  if (showIntro) {
    return (
      <>
        <Header />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Shaple"
          description="Guess the country or US state by its shape! You have 5 guesses. Choose a mode, look at the silhouette, and type your answer."
          color="primary"
        />
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
      <Header />
      <Toolbar />
      <Fade in timeout={600}>
        <Paper elevation={8} sx={{ mt: { xs: 2, md: 6 }, p: { xs: 2, md: 4 }, borderRadius: 4, maxWidth: { xs: 350, sm: 600, md: 500 }, width: '100%', textAlign: 'center', position: 'relative', background: 'rgba(30,34,44,0.98)', color: 'white', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 900, color: 'transparent', background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Shaple</Typography>
          <ToggleButtonGroup value={mode} exclusive onChange={handleMode} sx={{ mb: 2 }}>
            <ToggleButton value="world">World</ToggleButton>
            <ToggleButton value="us">US States</ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ my: 3, minHeight: 200 }}>
            {secret && <img src={getImageSrc()} alt="shape" style={{ maxHeight: 200, filter: 'drop-shadow(0 0 8px #43cea2)' }} />}
          </Box>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <Autocomplete
              freeSolo
              options={mode === 'world' ? countryList : stateList}
              value={guess}
              onInputChange={(e, newValue) => setGuess(newValue || '')}
              onChange={(e, newValue) => setGuess(newValue || '')}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label={mode === 'world' ? 'Country' : 'State'} sx={{ input: { color: 'white' }, label: { color: 'white' } }} autoFocus />
              )}
              disabled={gameOver && !showContinue}
            />
            <Button variant="contained" onClick={handleGuess} sx={{ background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)', color: 'white', fontWeight: 'bold' }} disabled={gameOver && !showContinue}>Guess</Button>
            <Button variant="outlined" onClick={handleGiveUp} sx={{ color: '#f44336', borderColor: '#f44336', fontWeight: 'bold', ml: 1 }} disabled={gameOver}>Give Up</Button>
          </Stack>
          <Typography variant="h6" sx={{ mb: 2, color: message.startsWith('Correct') ? '#43cea2' : '#f44336', minHeight: 32 }}>{message}</Typography>
          {showContinue && (
            <Button variant="contained" color="success" onClick={handleContinue} sx={{ mt: 2 }}>Continue</Button>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography>Score: {score}</Typography>
            <Typography>Streak: {streak}</Typography>
            <Typography>Guesses Left: {guessesLeft}</Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Shaple; 