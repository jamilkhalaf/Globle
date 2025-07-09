import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { PhotoCamera, CloudUpload, Delete } from '@mui/icons-material';

const ProfilePictureUpload = ({ open, onClose, onUpdate, currentProfilePicture }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview URL with error handling
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.onerror = () => {
        setError('Failed to read the selected file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await fetch('/api/auth/profile-picture', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update profile picture';
        
        // Try to parse error response
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Try to parse response JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      onUpdate(data.profilePicture);
      onClose();
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    onClose();
  };

  const handleFileInputClick = () => {
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    // Reset the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'white', bgcolor: '#121213' }}>
        Update Profile Picture
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#121213', color: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={previewUrl || currentProfilePicture}
              sx={{ width: 80, height: 80, bgcolor: '#43cea2' }}
            >
              <PhotoCamera />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {previewUrl ? 'New Profile Picture' : 'Current Profile Picture'}
              </Typography>
              {selectedFile && (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              onClick={handleFileInputClick}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Choose Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Button>

            {selectedFile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Selected: {selectedFile.name}
                </Typography>
                <IconButton
                  onClick={handleRemoveFile}
                  size="small"
                  sx={{ color: '#f44336' }}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
            Supported formats: JPEG, PNG, GIF, WebP. Maximum file size: 5MB.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#121213', color: 'white' }}>
        <Button 
          onClick={handleClose}
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || !selectedFile}
          variant="contained"
          sx={{
            bgcolor: '#43cea2',
            color: 'white',
            '&:hover': {
              bgcolor: '#3bb08f',
            },
            '&:disabled': {
              bgcolor: 'rgba(67,206,162,0.3)',
              color: 'rgba(255,255,255,0.5)',
            },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update Picture'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfilePictureUpload; 