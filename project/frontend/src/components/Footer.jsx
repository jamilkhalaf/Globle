import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Link, 
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        bgcolor: 'rgba(30,34,44,0.98)',
        color: 'white',
        mt: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(67,206,162,0.05) 0%, rgba(24,90,157,0.05) 100%)',
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 4px 16px rgba(67, 206, 162, 0.3)',
                  }}
                >
                  <PublicIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#43cea2', mb: 0.5 }}>
                    MapZap
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    Educational Geography Platform
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.7 }}>
                Educational geography games designed to make learning about the world engaging, interactive, and fun. 
                Explore countries, capitals, flags, and cultures through our comprehensive collection of games.
              </Typography>
              
              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <IconButton
                  href="https://instagram.com/jamillkhalaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      borderColor: '#43cea2',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  href="mailto:jamilkhalaf04@gmail.com"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      borderColor: '#43cea2',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <EmailIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#43cea2', mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <SchoolIcon /> Educational Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link
                  component={RouterLink}
                  to="/educational-content"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Learning Resources
                </Link>
                <Link
                  component={RouterLink}
                  to="/about"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  About Our Games
                </Link>
                <Link
                  component={RouterLink}
                  to="/badges"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Achievement Badges
                </Link>
                <Link
                  component={RouterLink}
                  to="/online"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Online Multiplayer
                </Link>
              </Box>
            </Grid>

            {/* Legal & Support */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#43cea2', mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <SecurityIcon /> Legal & Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link
                  component={RouterLink}
                  to="/privacy-policy"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Privacy Policy
                </Link>
                <Link
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Contact Support
                </Link>
                <Link
                  href="mailto:jamilkhalaf04@gmail.com"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Email Support
                </Link>
                <Link
                  href="https://instagram.com/jamillkhalaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#43cea2',
                      bgcolor: 'rgba(67, 206, 162, 0.1)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#43cea2' }} />
                  Follow on Instagram
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Bottom Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                Educational content designed for students, teachers, and geography enthusiasts worldwide.
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                © {new Date().getFullYear()} Jamil Khalaf. All rights reserved.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Free Educational Games
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Interactive Learning
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Geography Education
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer; 