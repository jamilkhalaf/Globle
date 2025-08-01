import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, Toolbar, Fade, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import countryInfo from './countryInfo';
import NotificationModal from './NotificationModal';
import AdPopup from './AdPopup';
import officialCountries from './officialCountries';
import SmartAdComponent from './SmartAdComponent';
import { GameCompletionAd } from './AdPlacements';

// Robust mapping from country name to ISO 3166-1 alpha-2 code
const nameToCode = {
  'Afghanistan': 'af', 'American Samoa': 'as', 'Albania': 'al', 'Algeria': 'dz', 'Andorra': 'ad', 'Angola': 'ao',
  'Antigua and Barbuda': 'ag', 'Argentina': 'ar', 'Armenia': 'am', 'Australia': 'au', 'Austria': 'at', 
  'Azerbaijan': 'az', 'Bahamas': 'bs', 'Bahrain': 'bh', 'Bangladesh': 'bd', 'Barbados': 'bb', "St. Vincent and the Grenadines": "vc", 
  'Belarus': 'by', 'Belgium': 'be', 'Belize': 'bz', 'Benin': 'bj', 'Bhutan': 'bt',
  'Bermuda': 'bm', 'Bolivia': 'bo', 'Bosnia and Herzegovina': 'ba', 'Botswana': 'bw', 'Brazil': 'br', 'Brunei Darussalam': 'bn', 'Comoros': 'km',
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
  'Venezuela': 've', 'Venezuela, RB': 've', 'Viet Nam': 'vn', 'Vietnam': 'vn', 'Yemen': 'ye', 'Zambia': 'zm', 'Zimbabwe': 'zw',
};

const allCountries = Object.keys(countryInfo).filter(
  name => name.length > 2 && officialCountries.includes(name)
);
const countryOptions = allCountries.map(name => ({ label: name, code: nameToCode[name] || name.slice(0,2).toLowerCase() }));

function getRandomCountry(exclude) {
  const options = allCountries.filter(c => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

const NUM_PIECES = 8;

const Flagle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [target, setTarget] = useState(() => getRandomCountry());
  const [guess, setGuess] = useState('');
  const [revealedPieces, setRevealedPieces] = useState([]); // Array of revealed piece indices
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Guess the country!');
  const [streak, setStreak] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [round, setRound] = useState(0); // Used to force remount flag box
  const [showIntro, setShowIntro] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [showAdPopup, setShowAdPopup] = useState(false);
  
  // Add state to track if ad popup has been shown and closed
  const [adPopupShown, setAdPopupShown] = useState(false);

  // Add effect to show ad popup after intro closes
  useEffect(() => {
    if (!showIntro && !showAdPopup && !adPopupShown) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowAdPopup(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showIntro, showAdPopup, adPopupShown]);

  const countryCode = useMemo(() => nameToCode[target] || target.slice(0,2).toLowerCase(), [target]);
  const flagSrc = `/flags/${countryCode}.png`;

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
          gameId: 'flagle',
          score: finalScore,
          gameTime,
          bestStreak,
          attempts: 6 // Flagle has 6 attempts
        }),
      });

      if (response.ok) {
        // Update badge progress
        await updateBadgeProgress('flagle', finalScore, 6, bestStreak);
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

  // For guess checking, always use the selected country from autocomplete if available
  const handleGuess = () => {
    let guessToCheck = guess.trim();
    if (!guessToCheck) return;
    
    // Check if the guess exists in the country options (case-insensitive)
    const validCountry = countryOptions.find(opt => 
      opt.label.toLowerCase() === guessToCheck.toLowerCase()
    );
    
    if (!validCountry) {
      // Silently ignore invalid countries without showing error
      return;
    }
    
    // Use the exact country name from the options to ensure consistency
    const exactCountryName = validCountry.label;
    setGuesses(g => [...g, exactCountryName]);
    
    if (exactCountryName.toLowerCase() === target.toLowerCase()) {
      setMessage('🎉 Correct!');
      setGameOver(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestScore(prev => Math.max(prev, newStreak));
      
      // Reveal all pieces when correct
      setRevealedPieces(Array.from({length: NUM_PIECES}, (_, i) => i));
      
      // Update stats when game is won
      updateGameStats(newStreak, 0, newStreak);
    } else {
      if (revealedPieces.length < NUM_PIECES - 1) {
        // Reveal a random unrevealed piece
        const unrevealed = Array.from({length: NUM_PIECES}, (_, i) => i).filter(i => !revealedPieces.includes(i));
        const randomIdx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        setRevealedPieces(prev => [...prev, randomIdx]);
        setMessage('Incorrect!');
      } else {
        // Reveal the last piece and end the game
        const unrevealed = Array.from({length: NUM_PIECES}, (_, i) => i).filter(i => !revealedPieces.includes(i));
        setRevealedPieces(prev => [...prev, ...unrevealed]);
        setMessage(`Out of guesses! The answer was ${target}`);
        setGameOver(true);
        setStreak(0);
        
        // Update stats when game is lost
        updateGameStats(0, 0, 0);
      }
    }
    setGuess('');
    setInputValue('');
  };

  const handleNext = () => {
    setRevealedPieces([]); // Hide all pieces immediately
    setRound(r => r + 1); // Force remount of flag box
    setTimeout(() => {
      const next = getRandomCountry(target);
      setTarget(next);
      setGuess('');
      setInputValue('');
      setGuesses([]);
      setGameOver(false);
      setMessage('Guess the country!');
    }, 0);
  };

  // Pie layout: 8 pieces (simulate with overlay boxes hiding parts of the flag)
  // We'll use a 2x4 grid for simplicity
  const gridRows = 2;
  const gridCols = 4;
  const pieces = [];
  let pieceNum = 0;
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      pieceNum++;
      pieces.push({ row, col, num: pieceNum });
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#232a3b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />
      <Toolbar />
      <NotificationModal
        open={showIntro}
        onClose={() => {
          setShowIntro(false);
          // setShowAdPopup(true); // This will be handled by useEffect
        }}
        title="How to Play Flagle"
        description={"Guess the country by its flag! Each wrong guess reveals a new part of the flag. You have 8 tries. Type or select a country and press Guess. Good luck!"}
        color="warning"
      />
      {/* AdPopup is now rendered in the main game view */}
      <Fade in timeout={600}>
        <Paper elevation={8} sx={{ mt: { xs: 2, md: 6 }, p: { xs: 1.5, md: 5 }, borderRadius: 4, maxWidth: { xs: 320, sm: 380, md: 600 }, width: '100%', textAlign: 'center', position: 'relative', background: 'rgba(30,34,44,0.98)', color: 'white', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', display: showIntro ? 'none' : 'block' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 900, color: 'transparent', background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Flagle</Typography>
          <Typography variant="h5" sx={{ mb: 3, color: '#b0c4de', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{message}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
            <Box
              key={round}
              sx={{ position: 'relative', width: { xs: 320, md: 400 }, height: { xs: 200, md: 250 }, borderRadius: 4, overflow: 'hidden', boxShadow: 6, bgcolor: '#222', border: '3px solid #1976d2' }}>
              {/* Overlay pieces first, then flag image, so overlays always render before flag is visible */}
              <img
                src={flagSrc}
                alt="flag"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: revealedPieces.length === 0 ? 'none' : 'block',
                  userSelect: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                }}
                draggable={false}
              />
              {/* Overlay pieces */}
              {pieces.map((piece, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: 'absolute',
                    top: `${piece.row * 50}%`,
                    left: `${piece.col * 25}%`,
                    width: '25%',
                    height: '50%',
                    bgcolor: revealedPieces.includes(idx) ? 'transparent' : '#232a3b',
                    border: revealedPieces.includes(idx) ? 'none' : '2px solid #121213',
                    transition: 'background 0.4s',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                />
              ))}
            </Box>
          </Box>
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
                // Only handle actual selections, not navigation
                if (reason === 'selectOption' && newValue && newValue.label) {
                  setGuess(newValue.label);
                  setInputValue(newValue.label);
                  // Auto-submit when user selects from dropdown
                  setTimeout(() => {
                    // Use the selected value directly instead of relying on state
                    const selectedCountry = newValue.label;
                    if (selectedCountry) {
                      handleGuess();
                    }
                  }, 0);
                } else if (typeof newValue === 'string') {
                  setGuess(newValue);
                  setInputValue(newValue);
                  // Don't auto-submit for string input, let user press Enter or click Guess
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!gameOver) {
                  handleGuess();
                  } else {
                    handleNext();
                  }
                }
              }}
              slotProps={{
                popper: {
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false,
                  },
                ],
                },
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
                />
              )}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleGuess} disabled={gameOver} sx={{ minWidth: 120, fontSize: 22, fontWeight: 700, borderRadius: 3, px: 3, py: 2 }}>Guess</Button>
          </Stack>
          <Typography variant="h6" sx={{ color: '#b0c4de', mb: 2, fontWeight: 600 }}>Guesses: {guesses.length} / {NUM_PIECES}</Typography>
          <Typography variant="h6" sx={{ color: '#4caf50', mb: 2, fontWeight: 700 }}>Streak: {streak}</Typography>
          {gameOver && (
            <Button variant="contained" color="success" onClick={handleNext} sx={{ mt: 3, fontSize: 22, fontWeight: 700, borderRadius: 3, px: 4, py: 2 }}>Next Flag</Button>
          )}
        </Paper>
      </Fade>

      {/* Game Completion Ad - Shows when game is over */}
      <GameCompletionAd show={gameOver} />

      {/* Ad Popup - Shows after notification modal closes */}
      <AdPopup
        open={showAdPopup}
        onClose={() => {
          setShowAdPopup(false);
          setAdPopupShown(true); // Mark ad popup as shown
        }}
        title="Support Us"
      />

      {/* Mobile Banner Ad - Fixed at bottom on mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '8px'
          }}
        >
          <SmartAdComponent
            adSlot="mobile-banner"
            adType="mobile"
            adFormat="horizontal"
            responsive={true}
            style={{
              width: '100%',
              minHeight: '50px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
        </Box>
      )}

      {/* Desktop Sidebar Ad - Fixed on right side */}
      {!isMobile && (
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
      )}
    </Box>
  );
};

export default Flagle; 