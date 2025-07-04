import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Fade, 
  useTheme, 
  useMediaQuery, 
  Toolbar, 
  TextField, 
  Button, 
  Alert,
  Link,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from './Header';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Signup = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'error' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setAlert({ show: false, message: '', severity: 'error' });

    try {
      const response = await fetch('http://api.jamilweb.click/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setAlert({
          show: true,
          message: 'Account created successfully! Welcome to Globle!',
          severity: 'success'
        });

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setAlert({
          show: true,
          message: data.message || 'Registration failed',
          severity: 'error'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'Network error. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isMobile
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'radial-gradient(ellipse at 60% 40%, #232a3b 60%, #121213 100%)',
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Toolbar />
      <Fade in timeout={800}>
        <Container maxWidth="sm" sx={{ flex: 1, py: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: 'rgba(30,34,44,0.95)',
                color: 'white',
                boxShadow: '0 20px 60px 0 rgba(31,38,135,0.5)',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: 400,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: { xs: 70, md: 80 },
                  height: { xs: 70, md: 80 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                }}
              >
                <PersonAddIcon sx={{ fontSize: { xs: 35, md: 40 }, color: 'white' }} />
              </Box>

              {/* Title */}
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 900,
                  color: 'transparent',
                  background: 'linear-gradient(90deg, #4CAF50 30%, #45a049 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: 1,
                }}
              >
                Join Globle
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#b0c4de',
                  fontWeight: 500,
                  mb: 3,
                  lineHeight: 1.4,
                }}
              >
                Create your account and start playing
              </Typography>

              {/* Alert */}
              {alert.show && (
                <Alert 
                  severity={alert.severity} 
                  sx={{ mb: 3, textAlign: 'left' }}
                  onClose={() => setAlert({ show: false, message: '', severity: 'error' })}
                >
                  {alert.message}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: '#4CAF50',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: '#4CAF50',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: '#4CAF50',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: '#4CAF50',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#f44336',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #4CAF50 30%, #45a049 100%)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #45a049 30%, #388e3c 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                  }}
                >
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: '#4CAF50',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Fade>
    </Box>
  );
};

export default Signup; 