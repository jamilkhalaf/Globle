import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Button, Stack, Fade, Autocomplete, TextField, Toolbar, Dialog, DialogTitle, DialogContent, IconButton, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import countryInfo from './countryInfo';
import countryExtra from './countryExtra';
import NotificationModal from './NotificationModal';
import CloseIcon from '@mui/icons-material/Close';
import officialCountries from './officialCountries';
import SmartAdComponent from './SmartAdComponent';

const NUM_TRIES = 6;

const allCountries = Object.keys(countryInfo).filter(name => name.length > 2 && officialCountries.includes(name));
const countryOptions = allCountries.map(name => ({ label: name }));

function getRandomCountry(exclude) {
  const options = allCountries.filter(c => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function getFlagCode(name) {
  // Use the same mapping logic as Flagle
  const nameToCode = {
    'Afghanistan': 'af', 'American Samoa': 'as', 'Albania': 'al', 'Algeria': 'dz', 'Andorra': 'ad', 'Angola': 'ao',
    'Antigua and Barbuda': 'ag', 'Argentina': 'ar', 'Armenia': 'am', 'Australia': 'au', 'Austria': 'at', 
    'Azerbaijan': 'az', 'Bahamas, The': 'bs', 'Bahrain': 'bh', 'Bangladesh': 'bd', 'Barbados': 'bb', "St. Vincent and the Grenadines": "vc", 
    'Belarus': 'by', 'Belgium': 'be', 'Belize': 'bz', 'Benin': 'bj', 'Bhutan': 'bt',
    'Bermuda': 'bm',
    'Bolivia': 'bo', 'Bosnia and Herzegovina': 'ba', 'Botswana': 'bw', 'Brazil': 'br', 'Brunei Darussalam': 'bn', 'Comoros': 'km',
    'Bulgaria': 'bg', 'Burkina Faso': 'bf', 'Burundi': 'bi', 'Cabo Verde': 'cv', 'Cambodia': 'kh',
    'Cameroon': 'cm', 'Canada': 'ca', 'Cayman Islands': 'ky', 'Central African Republic': 'cf', 'Chad': 'td', 'Chile': 'cl',
    'China': 'cn', 'Colombia': 'co', 'Comoros': 'km', 'Congo, Dem. Rep.': 'cd', 'Congo, Rep.': 'cg',
    'Costa Rica': 'cr', 'Cote dIvoire': 'ci', 'Croatia': 'hr', 'Cuba': 'cu', 'Cyprus': 'cy',
    'Czechia': 'cz', 'Denmark': 'dk', 'Djibouti': 'dj', 'Dominica': 'dm', 'Dominican Republic': 'do',
    'Ecuador': 'ec', 'Egypt, Arab Rep.': 'eg', 'El Salvador': 'sv', 'Equatorial Guinea': 'gq', 'Eritrea': 'er',
    'Estonia': 'ee', 'Eswatini': 'sz', 'Ethiopia': 'et', 'Fiji': 'fj', 'Finland': 'fi',
    'France': 'fr', 'Faroe Islands': 'fo', 'Gabon': 'ga', 'Gambia, The': 'gm', 'Georgia': 'ge', 'Germany': 'de',
    'Ghana': 'gh', 'Greece': 'gr', 'Grenada': 'gd', 'Guatemala': 'gt', 'Guinea': 'gn',
    'Guinea-Bissau': 'gw', 'Guyana': 'gy', 'Haiti': 'ht', 'Honduras': 'hn', 'Hungary': 'hu',
    'Iceland': 'is', 'India': 'in', 'Indonesia': 'id', 'Iran, Islamic Rep.': 'ir', 'Iraq': 'iq',
    'Ireland': 'ie', 'Israel': 'il', 'Italy': 'it', 'Jamaica': 'jm', 'Japan': 'jp',
    'Jordan': 'jo', 'Kazakhstan': 'kz', 'Kenya': 'ke', 'Kiribati': 'ki', 'Korea, Dem. Peoples Rep.': 'kp',
    'Korea, Rep.': 'kr', 'Kuwait': 'kw', 'Kosovo': 'xk', 'Kyrgyz Republic': 'kg', 'Lao PDR': 'la', 'Latvia': 'lv',
    'Lebanon': 'lb', 'Lesotho': 'ls', 'Liberia': 'lr', 'Libya': 'ly', 'Liechtenstein': 'li',
    'Lithuania': 'lt', 'Luxembourg': 'lu', 'Madagascar': 'mg', 'Malawi': 'mw', 'Malaysia': 'my',
    'Maldives': 'mv', 'Mali': 'ml', 'Malta': 'mt', 'Marshall Islands': 'mh', 'Mauritania': 'mr',
    'Mauritius': 'mu', 'Mexico': 'mx', 'Micronesia, Fed. Sts.': 'fm', 'Moldova': 'md', 'Monaco': 'mc',
    'Mongolia': 'mn', 'Montenegro': 'me', 'Morocco': 'ma', 'Mozambique': 'mz', 'Myanmar': 'mm',
    'Namibia': 'na', 'Nauru': 'nr', 'Nepal': 'np', 'Netherlands': 'nl', 'New Zealand': 'nz',
    'Nicaragua': 'ni', 'Niger': 'ne', 'Nigeria': 'ng', 'North Macedonia': 'mk', 'Norway': 'no',
    'Oman': 'om', 'Pakistan': 'pk', 'Palau': 'pw', 'Palestine': 'ps', 'Panama': 'pa',
    'Papua New Guinea': 'pg', 'Paraguay': 'py', 'Peru': 'pe', 'Philippines': 'ph', 'Poland': 'pl',
    'Portugal': 'pt', 'Qatar': 'qa', 'Romania': 'ro', 'Russia': 'ru', 'Rwanda': 'rw',
    'Saint Kitts and Nevis': 'kn', 'Saint Lucia': 'lc', 'Saint Vincent and the Grenadines': 'vc', 'Samoa': 'ws', 'San Marino': 'sm',
    'Sao Tome and Principe': 'st', 'Saudi Arabia': 'sa', 'Senegal': 'sn', 'Serbia': 'rs', 'Seychelles': 'sc',
    'Sierra Leone': 'sl', 'Singapore': 'sg', 'Slovak Republic': 'sk', 'Slovenia': 'si', 'Solomon Islands': 'sb',
    'Somalia': 'so', 'South Africa': 'za', 'South Sudan': 'ss', 'Spain': 'es', 'Sri Lanka': 'lk',
    'Sudan': 'sd', 'Suriname': 'sr', 'Sweden': 'se', 'Switzerland': 'ch', 'Syrian Arab Republic': 'sy',
    'Tajikistan': 'tj', 'Tanzania': 'tz', 'Thailand': 'th', 'Timor-Leste': 'tl', 'Togo': 'tg',
    'Tonga': 'to', 'Trinidad and Tobago': 'tt', 'Tunisia': 'tn', 'Turkey': 'tr', 'Turkmenistan': 'tm',
    'Tuvalu': 'tv', 'Uganda': 'ug', 'Ukraine': 'ua', 'United Arab Emirates': 'ae', 'United Kingdom': 'gb',
    'United States': 'us', 'United States of America': 'us', 'Uruguay': 'uy', 'Uzbekistan': 'uz', 'Vanuatu': 'vu',
    'Venezuela, RB': 've', 'Viet Nam': 'vn', 'Vietnam': 'vn', 'Yemen, Rep.': 'ye', 'Zambia': 'zm', 'Zimbabwe': 'zw',
  };
  return nameToCode[name] || name.slice(0,2).toLowerCase();
}

const hintOrder = [
  'population',
  'capital',
  'famous',
  'shape',
  'bordering',
  'flag',
];

function getHints(country, extra, revealed, target) {
  const hints = [];
  if (revealed >= 1) {
    hints.push({ label: 'Population', value: country.population?.toLocaleString() });
  }
  if (revealed >= 2) {
    hints.push({ label: 'Capital', value: country.capital });
  }
  if (revealed >= 3 && extra) {
    const cities = extra.famousCities?.join(', ');
    const places = extra.famousPlaces?.join(', ');
    hints.push({ label: 'Famous city/place', value: [cities, places].filter(Boolean).join(' / ') });
  }
  if (revealed >= 4) {
    // Show country shape instead of landmark image
    const countryCode = getFlagCode(target);
    const shapeSrc = `/all/${countryCode}/1024.png`;
    hints.push({ label: 'Country Shape', value: shapeSrc, type: 'shape' });
  }
  if (revealed >= 5 && extra) {
    let border = 'None';
    if (extra.island) border = 'Island';
    else if (extra.landlocked) border = 'Landlocked';
    else if (extra.bordering && extra.bordering.length > 0) border = extra.bordering.join(', ');
    hints.push({ label: 'Bordering/Island', value: border });
  }
  if (revealed >= 6 && extra) {
    hints.push({ label: 'Hemisphere', value: extra.hemisphere ? extra.hemisphere.charAt(0).toUpperCase() + extra.hemisphere.slice(1) : '' });
  }
  return hints;
}

const Worldle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [target, setTarget] = useState(() => getRandomCountry());
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Guess the country!');
  const [streak, setStreak] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [openImage, setOpenImage] = useState(null);
  const [revealed, setRevealed] = useState(1); // Start with first hint
  const [round, setRound] = useState(0);
  const [scrollHint, setScrollHint] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const country = countryInfo[target];
  const extra = countryExtra[target];
  const flagCode = getFlagCode(target);
  const flagSrc = `/flags/${flagCode}.png`;

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
          gameId: 'worldle',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: 6 // Worldle has 6 attempts
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress('worldle', finalScore, 6, bestStreak);
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

  const handleGuess = () => {
    if (!guess.trim()) return;
    const validCountry = countryOptions.some(opt => opt.label.toLowerCase() === guess.trim().toLowerCase());
    if (!validCountry) {
      setInputError('Invalid country name. Please select a valid country.');
      return;
    } else if (guesses.some(g => g.trim().toLowerCase() === guess.trim().toLowerCase())) {
      setInputError('You already guessed that country. Try a different one.');
      return;
    } else {
      setInputError('');
    }
    setGuesses(g => [...g, guess]);
    if (guess.trim().toLowerCase() === target.toLowerCase()) {
      setMessage('🎉 Correct!');
      setGameOver(true);
      setRevealed(6);
      
      // Calculate score based on number of guesses (fewer guesses = higher score)
      const score = Math.max(1, NUM_TRIES - guesses.length);
      setBestScore(prev => Math.max(prev, score));
      
      // Update stats when game is won
      updateGameStats(score, 0, 0);
    } else if (guesses.length + 1 >= NUM_TRIES) {
      setMessage(`Out of guesses! The answer was ${target}`);
      setGameOver(true);
      setRevealed(6);
      
      // Update stats when game is lost
      updateGameStats(0, 0, 0);
    } else {
      setRevealed(r => Math.min(r + 1, 6));
      setMessage('Incorrect!');
    }
    setGuess('');
    setInputValue('');
  };

  const handleNext = () => {
    setTarget(getRandomCountry(target));
    setGuess('');
    setInputValue('');
    setGuesses([]);
    setRevealed(1);
    setGameOver(false);
    setMessage('Guess the country!');
    setInputError('');
    setRound(r => r + 1);
  };

  const hints = getHints(country, extra, revealed, target);

  React.useEffect(() => {
    setScrollHint(hints.length > 3);
  }, [hints.length, round]);

  if (showIntro) {
    return (
      <>
        <Header />
        <Toolbar />
        <NotificationModal
          open={showIntro}
          onClose={() => setShowIntro(false)}
          title="How to Play Worldle"
          description={"Guess the country based on hints! Each wrong guess reveals a new hint: population, capital, famous places, country shape, borders, hemisphere, and flag. You have 5 tries. Good luck!"}
          color="success"
        />
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#232a3b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />
      <Toolbar />
      <Fade in timeout={600}>
        <Paper elevation={8} sx={{ mt: { xs: 2, md: 6 }, p: { xs: 1.5, md: 5 }, borderRadius: 4, maxWidth: { xs: 320, sm: 380, md: 600 }, width: '100%', textAlign: 'center', position: 'relative', background: 'rgba(30,34,44,0.98)', color: 'white', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 900, color: 'transparent', background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Worldle</Typography>
          <Typography variant="h5" sx={{ mb: 3, color: '#b0c4de', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{message}</Typography>
          <Stack spacing={2} sx={{ mb: 3, alignItems: 'center',
            maxHeight: { xs: 260, md: 320 },
            overflowY: 'auto',
            width: '100%',
            pb: 2,
          }}>
            {scrollHint && (
              <Typography variant="caption" sx={{ color: '#b0c4de', mb: 1, fontWeight: 500, textAlign: 'center', width: '100%' }}>
                Scroll for more hints
              </Typography>
            )}
            {hints.map((hint, idx) => (
              hint.type === 'shape' ? (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 1 }}>
                  <img
                    src={hint.value}
                    alt="country shape"
                    style={{ width: 160, height: 100, objectFit: 'contain', borderRadius: 6, border: '2px solid #1976d2', background: '#fff', cursor: 'pointer' }}
                    onClick={() => setOpenImage({ type: 'shape', src: hint.value })}
                  />
                </Box>
              ) : (
                <Paper key={idx} elevation={3} sx={{ px: { xs: 2, md: 3 }, py: { xs: 1.2, md: 2 }, borderRadius: 3, background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 600, fontSize: { xs: 16, md: 18 }, width: '100%', maxWidth: 420, textAlign: 'left', mb: 1 }}>
                  <b>{hint.label}:</b> {hint.value}
                </Paper>
              )
            ))}
            {revealed === 6 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 1 }}>
                <img
                  src={flagSrc}
                  alt="flag"
                  style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '2px solid #1976d2', background: '#fff', cursor: 'pointer' }}
                  onClick={() => setOpenImage({ type: 'flag', src: flagSrc })}
                />
              </Box>
            )}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
            <Autocomplete
              freeSolo
              disableClearable
              options={countryOptions}
              getOptionLabel={option => typeof option === 'string' ? option : option.label}
              value={guess}
              inputValue={inputValue}
              onInputChange={(event, newInputValue, reason) => {
                setInputValue(newInputValue);
                setGuess(newInputValue);
              }}
              onChange={(event, newValue, reason) => {
                if (typeof newValue === 'string') {
                  setGuess(newValue);
                  setInputValue(newValue);
                  handleGuess();
                } else if (newValue && newValue.label) {
                  setGuess(newValue.label);
                  setInputValue(newValue.label);
                  handleGuess();
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Country name"
                  disabled={gameOver}
                  size="medium"
                  variant="outlined"
                  sx={{ bgcolor: 'white', borderRadius: 3, flex: 1, fontSize: { xs: 22, md: 28 }, input: { fontWeight: 700, fontSize: { xs: 22, md: 28 } } }}
                  inputProps={{ ...params.inputProps, style: { fontWeight: 700, fontSize: 24, padding: '18px 16px' } }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (!gameOver) {
                        handleGuess();
                      } else {
                        handleNext();
                      }
                    }
                  }}
                  error={!!inputError}
                  helperText={inputError}
                />
              )}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleGuess} disabled={gameOver} sx={{ minWidth: 120, fontSize: 22, fontWeight: 700, borderRadius: 3, px: 3, py: 2 }}>Guess</Button>
          </Stack>
          <Typography variant="h6" sx={{ color: '#b0c4de', mb: 2, fontWeight: 600 }}>Guesses: {guesses.length} / {NUM_TRIES}</Typography>
          {gameOver && (
            <Button variant="contained" color="success" onClick={handleNext} sx={{ mt: 3, fontSize: 22, fontWeight: 700, borderRadius: 3, px: 4, py: 2 }}>Next Country</Button>
          )}
        </Paper>
      </Fade>
      {/* Image/Flag Dialog */}
      <Dialog open={!!openImage} onClose={() => setOpenImage(null)} maxWidth="md" PaperProps={{ sx: { borderRadius: 3, bgcolor: '#232a3b' } }}>
        <DialogTitle sx={{ color: 'white', background: 'rgba(30,34,44,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <span>{openImage?.type === 'flag' ? 'Flag' : openImage?.type === 'shape' ? 'Country Shape' : 'Country Image'}</span>
          <IconButton onClick={() => setOpenImage(null)} sx={{ color: 'white' }} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(30,34,44,0.98)', p: 3 }}>
          {openImage && (
            <img
              src={openImage.src}
              alt={openImage.type}
              style={{ maxWidth: '80vw', maxHeight: '60vh', borderRadius: 8, border: '3px solid #1976d2', background: '#fff', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Desktop Sidebar Ads - Fixed on left and right sides */}
      {!isMobile && (
        <>
          {/* Left Sidebar Ad */}
          <Box
            sx={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '160px',
              zIndex: 999
            }}
          >
            <SmartAdComponent
              adSlot="9833563267"
              adType="sidebar"
              adFormat="auto"
              responsive={true}
              style={{
                width: '160px',
                minHeight: '600px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>

          {/* Right Sidebar Ad */}
          <Box
            sx={{
              position: 'fixed',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '160px',
              zIndex: 999
            }}
          >
            <SmartAdComponent
              adSlot="5275872162"
              adType="sidebar"
              adFormat="auto"
              responsive={true}
              style={{
                width: '160px',
                minHeight: '600px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Worldle; 