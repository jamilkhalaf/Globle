import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Fade, 
  useTheme, 
  useMediaQuery, 
  Toolbar, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import Header from './Header';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';
import ExploreIcon from '@mui/icons-material/Explore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { HeaderAd } from './AdPlacements';

const EducationalContent = () => {
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
          maxWidth: 1200, 
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
                Geography Learning Resources
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
                Comprehensive educational content to enhance your geographical knowledge and understanding of our world's diverse cultures, landscapes, and political systems.
              </Typography>
            </Box>
          </Paper>

          {/* Learning Benefits Section */}
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
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #43cea2 30%, #185a9d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  letterSpacing: 2,
                  textAlign: 'center'
                }}
              >
                Why Geography Education Matters
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#43cea2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PsychologyIcon /> Cognitive Development
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><EmojiEventsIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Spatial Awareness" 
                            secondary="Understanding location, distance, and relationships between places"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><TrendingUpIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Critical Thinking" 
                            secondary="Analyzing patterns, connections, and global relationships"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><ExploreIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Problem Solving" 
                            secondary="Applying geographical knowledge to real-world challenges"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#43cea2', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PublicIcon /> Global Understanding
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><FlagIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Cultural Awareness" 
                            secondary="Understanding diverse cultures, traditions, and perspectives"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><MapIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Political Geography" 
                            secondary="Understanding borders, territories, and international relations"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><GroupsIcon sx={{ color: '#43cea2' }} /></ListItemIcon>
                          <ListItemText 
                            primary="Demographics" 
                            secondary="Understanding population patterns and human geography"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Educational Topics */}
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
                background: 'linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(233,30,99,0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #9c27b0 30%, #e91e63 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  letterSpacing: 2,
                  textAlign: 'center'
                }}
              >
                Key Geography Learning Topics
              </Typography>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    <FlagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    World Flags and Symbols
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    Understanding national flags is crucial for global awareness and cultural appreciation. Each flag represents a country's history, values, and identity.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label="Flag Colors & Meanings" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Historical Significance" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Cultural Symbols" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Design Principles" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                    Our Flagle game helps you master flag recognition through interactive challenges and detailed explanations.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Countries and Capitals
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    Knowledge of countries and their capitals is fundamental to understanding global politics, economics, and cultural geography.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label="Political Geography" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Economic Centers" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Cultural Hubs" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Historical Capitals" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                    Our Capitals game tests your knowledge with multiple-choice questions and provides educational context.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Population and Demographics
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    Understanding population patterns helps explain economic development, cultural diversity, and global challenges.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label="Population Density" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Urban vs Rural" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Age Demographics" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Migration Patterns" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                    Our Population game teaches you about global demographics through interactive learning.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    <ExploreIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Physical Geography
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    Understanding landforms, climate, and natural resources is essential for comprehending human-environment interactions.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label="Landforms" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Climate Zones" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Natural Resources" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                    <Chip label="Environmental Issues" sx={{ bgcolor: 'rgba(156,39,176,0.2)', color: 'white' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                    Our interactive globe games help you understand physical geography through exploration.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Paper>

          {/* Learning Strategies */}
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
                background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,87,34,0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #ff9800 30%, #ff5722 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  letterSpacing: 2,
                  textAlign: 'center'
                }}
              >
                Effective Learning Strategies
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon /> Spaced Repetition
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Review geographical information at increasing intervals to strengthen memory retention and improve long-term learning outcomes.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                        Our games use progressive difficulty to reinforce learning through repetition.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PsychologyIcon /> Active Learning
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Engage with geographical concepts through interactive challenges rather than passive memorization for better understanding.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                        Our interactive games require active participation and decision-making.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEventsIcon /> Gamification
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Use game mechanics like points, levels, and challenges to make learning engaging and motivating.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                        Our platform uses scoring, streaks, and achievements to enhance motivation.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Educational Resources */}
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
                background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(139,195,74,0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #4caf50 30%, #8bc34a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  letterSpacing: 2,
                  textAlign: 'center'
                }}
              >
                Additional Learning Resources
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#4caf50', mb: 2 }}>For Students</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Geography Textbooks" 
                            secondary="Comprehensive guides covering physical and human geography"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Online Courses" 
                            secondary="Structured learning programs from educational platforms"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Study Groups" 
                            secondary="Collaborative learning with peers and mentors"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Practice Tests" 
                            secondary="Regular assessment to track learning progress"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#4caf50', mb: 2 }}>For Teachers</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Lesson Plans" 
                            secondary="Structured activities incorporating our games"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Assessment Tools" 
                            secondary="Track student progress and learning outcomes"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Interactive Whiteboards" 
                            secondary="Use our games for classroom demonstrations"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Professional Development" 
                            secondary="Workshops on gamification in education"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
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
                Our geography games complement traditional learning methods by providing interactive, engaging experiences 
                that reinforce classroom concepts and make learning geography enjoyable for all ages and skill levels.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default EducationalContent; 