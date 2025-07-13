import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Fade, 
  useTheme, 
  useMediaQuery, 
  Toolbar, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import Header from './Header';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CookieIcon from '@mui/icons-material/Cookie';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { HeaderAd } from './AdPlacements';

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Toolbar />
      
      {/* Header Ad */}
      <HeaderAd />
      
      <Fade in timeout={800}>
        <Box sx={{ 
          flex: 1, 
          width: '100%', 
          maxWidth: 1000, 
          px: { xs: 2, md: 4 }, 
          py: { xs: 4, md: 6 },
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          justifyContent: 'center'
        }}>
          
          {/* Hero Section */}
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(0,188,212,0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px',
                  boxShadow: '0 16px 64px rgba(25, 118, 210, 0.4)',
                }}
              >
                <SecurityIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'white' }} />
              </Box>
              
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #1976d2 30%, #00bcd4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  letterSpacing: 2,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                Privacy Policy
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.7,
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 4,
                  fontWeight: 400,
                }}
              >
                Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our educational geography games.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>

          {/* Privacy Policy Content */}
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(30,34,44,0.95)',
              color: 'white',
              boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(67,206,162,0.1) 0%, rgba(24,90,157,0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              
              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DataUsageIcon /> Information We Collect
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    We collect information to provide and improve our educational services:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><PrivacyTipIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Game Performance Data" 
                        secondary="Scores, achievements, and learning progress to personalize your experience"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CookieIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Technical Information" 
                        secondary="Device type, browser, and performance metrics for optimization"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MonetizationOnIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Ad Interaction Data" 
                        secondary="Ad performance metrics to improve user experience and support development"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOnIcon /> Advertising and Analytics
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    We use advertising to keep our educational games free and accessible:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><SecurityIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Google AdSense" 
                        secondary="We use Google AdSense to display relevant advertisements and support free access"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PrivacyTipIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Analytics" 
                        secondary="Google Analytics helps us understand usage patterns and improve our games"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CookieIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Cookies" 
                        secondary="Essential cookies for functionality and optional cookies for personalization"
                      />
                    </ListItem>
                  </List>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', mt: 2 }}>
                    You can control cookie preferences through your browser settings. Ad blockers may affect site functionality.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon /> How We Use Your Information
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    Your information helps us provide better educational experiences:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><PrivacyTipIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Personalize Learning" 
                        secondary="Adapt game difficulty and content based on your progress and preferences"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DataUsageIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Improve Games" 
                        secondary="Analyze usage patterns to enhance educational content and user experience"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MonetizationOnIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Support Development" 
                        secondary="Ad revenue helps maintain free access and develop new educational features"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PrivacyTipIcon /> Data Protection
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    We implement security measures to protect your information:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><SecurityIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Encryption" 
                        secondary="Data transmitted between your device and our servers is encrypted"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><PrivacyTipIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Limited Access" 
                        secondary="Only authorized personnel have access to user data for support purposes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DataUsageIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="No Personal Data" 
                        secondary="We do not collect names, emails, or other personally identifiable information"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#43cea2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CookieIcon /> Your Rights and Choices
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    You have control over your data and privacy:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><PrivacyTipIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Cookie Control" 
                        secondary="Manage cookie preferences through your browser settings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><MonetizationOnIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Ad Preferences" 
                        secondary="Control ad personalization through Google AdSense settings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Data Access" 
                        secondary="Request information about data we collect about your usage"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />
              
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7,
                  textAlign: 'center',
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                We are committed to protecting your privacy while providing valuable educational content. 
                If you have questions about this privacy policy, please contact us through our support channels.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default PrivacyPolicy; 