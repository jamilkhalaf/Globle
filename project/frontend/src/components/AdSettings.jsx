import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import monetizationManager from '../utils/monetizationManager';
import BlockIcon from '@mui/icons-material/Block';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CoffeeIcon from '@mui/icons-material/Coffee';

const AdSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [preferences, setPreferences] = useState({
    showAds: true,
    adFrequency: 'normal'
  });
  const [stats, setStats] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current preferences
    const currentPrefs = monetizationManager.userPreferences;
    setPreferences({
      showAds: currentPrefs.showAds,
      adFrequency: currentPrefs.adFrequency
    });

    // Load stats
    setStats(monetizationManager.getRevenueStats());
  }, []);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    monetizationManager.updatePreferences(preferences);
    setStats(monetizationManager.getRevenueStats());
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const getFrequencyDescription = (frequency) => {
    switch (frequency) {
      case 'low':
        return 'Fewer ads, longer intervals between them';
      case 'normal':
        return 'Standard ad frequency';
      case 'high':
        return 'More ads, shorter intervals between them';
      default:
        return '';
    }
  };

  const handleSupportAction = (action) => {
    switch (action) {
      case 'disable_adblock':
        alert('To disable your ad blocker:\n\n1. Click the ad blocker icon in your browser\n2. Select "Disable for this site"\n3. Refresh the page\n\nThank you for supporting us!');
        break;
      case 'donate':
        window.open('https://www.buymeacoffee.com/yourusername', '_blank');
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Geography Games Collection',
            text: 'Check out these awesome geography games!',
            url: window.location.origin
          });
        } else {
          navigator.clipboard.writeText(window.location.origin);
          alert('Link copied to clipboard! Share it with your friends.');
        }
        break;
      default:
        break;
    }
  };

  const adBlockerMessage = monetizationManager.showAdBlockerMessage();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        padding: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{
          fontWeight: 900,
          color: 'white',
          textAlign: 'center',
          mb: 3,
          letterSpacing: 1
        }}
      >
        Advertisement Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Ad Blocker Detection Alert */}
      {stats.adBlocked && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3, width: '100%', maxWidth: 800 }}
          icon={<BlockIcon />}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Ad Blocker Detected
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            We notice you're using an ad blocker. Our games are free thanks to advertising revenue. 
            Here are some ways you can support us:
          </Typography>
          <List dense sx={{ mb: 2 }}>
            <ListItem>
              <ListItemIcon>
                <FavoriteIcon sx={{ color: '#ff6b6b' }} />
              </ListItemIcon>
              <ListItemText primary="Disable your ad blocker for this site" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CoffeeIcon sx={{ color: '#4ecdc4' }} />
              </ListItemIcon>
              <ListItemText primary="Make a small donation to support development" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ShareIcon sx={{ color: '#45b7d1' }} />
              </ListItemIcon>
              <ListItemText primary="Share our games with friends" />
            </ListItem>
          </List>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleSupportAction('disable_adblock')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                textTransform: 'none',
              }}
            >
              Disable Ad Blocker
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSupportAction('donate')}
              sx={{
                borderColor: '#4ecdc4',
                color: '#4ecdc4',
                fontWeight: 600,
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                textTransform: 'none',
              }}
            >
              Donate
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSupportAction('share')}
              sx={{
                borderColor: '#45b7d1',
                color: '#45b7d1',
                fontWeight: 600,
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                textTransform: 'none',
              }}
            >
              Share
            </Button>
          </Box>
        </Alert>
      )}

      <Grid container spacing={3} sx={{ maxWidth: 800, width: '100%' }}>
        {/* Ad Preferences */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={8}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(30,34,44,0.98)',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              height: 'fit-content'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Ad Preferences
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.showAds}
                  onChange={(e) => handlePreferenceChange('showAds', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#1976d2',
                    },
                  }}
                />
              }
              label="Show advertisements"
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Ad Frequency
            </Typography>
            
            <RadioGroup
              value={preferences.adFrequency}
              onChange={(e) => handlePreferenceChange('adFrequency', e.target.value)}
            >
              <FormControlLabel
                value="low"
                control={<Radio sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                label="Low"
              />
              <FormControlLabel
                value="normal"
                control={<Radio sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                label="Normal"
              />
              <FormControlLabel
                value="high"
                control={<Radio sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                label="High"
              />
            </RadioGroup>

            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                display: 'block',
                mt: 1,
                fontStyle: 'italic'
              }}
            >
              {getFrequencyDescription(preferences.adFrequency)}
            </Typography>

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0097a7 100%)',
                }
              }}
              fullWidth
            >
              Save Settings
            </Button>
          </Paper>
        </Grid>

        {/* Ad Statistics */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={8}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(30,34,44,0.98)',
              color: 'white',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
              height: 'fit-content'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Ad Statistics
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Today's Impressions
              </Typography>
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 600 }}>
                {stats.dailyImpressions || 0}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Total Impressions
              </Typography>
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 600 }}>
                {stats.totalImpressions || 0}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Estimated Revenue
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 600 }}>
                ${(stats.estimatedRevenue || 0).toFixed(2)}
              </Typography>
            </Box>

            {stats.fallbackShown > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Fallback Content Shown
                </Typography>
                <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                  {stats.fallbackShown}
                </Typography>
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                display: 'block',
                mt: 2,
                textAlign: 'center'
              }}
            >
              Revenue estimates are approximate and may vary based on actual ad performance.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Information Card */}
      <Card
        sx={{
          mt: 3,
          maxWidth: 800,
          width: '100%',
          background: 'rgba(30,34,44,0.98)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)'
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            About Our Ads
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            We use advertisements to keep our games free and accessible to everyone. 
            Your ad preferences help us provide a better experience while supporting the development of new features.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            • Ads are carefully placed to minimize disruption to gameplay<br/>
            • We respect your privacy and don't collect personal information through ads<br/>
            • You can adjust ad frequency or disable ads entirely<br/>
            • Ad revenue helps us maintain and improve our games<br/>
            • If you use an ad blocker, consider alternative ways to support us
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdSettings; 