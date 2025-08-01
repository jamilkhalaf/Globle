import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Button, 
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartAdComponent from './SmartAdComponent';

const AdPopup = ({ open, onClose, title = "Support Us" }) => {
  const handleClose = () => {
    console.log('AdPopup: handleClose called');
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      disableEscapeKeyDown 
      maxWidth="sm"
      fullWidth
      onClose={(event, reason) => {
        console.log('AdPopup: Dialog onClose called with reason:', reason);
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'rgba(30,34,44,0.95)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 16px 64px 0 rgba(31,38,135,0.4)',
          zIndex: 10000 // Ensure it's above everything
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 800, 
        fontSize: 24, 
        color: 'white', 
        textAlign: 'center',
        position: 'relative',
        pb: 1
      }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              color: 'white'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        <Typography sx={{ 
          mb: 3, 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: 16, 
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Enjoying the game? Consider supporting us by viewing this ad!
        </Typography>
        
        {/* Square Ad */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <SmartAdComponent
            adSlot="1417136750"
            adType="square"
            adFormat="auto"
            responsive={true}
            style={{
              width: '300px',
              minHeight: '250px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
        </Box>
        
        <Typography sx={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: 14, 
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Thanks for your support! 🎮
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          sx={{ 
            fontWeight: 700, 
            px: 4, 
            fontSize: 16,
            background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #00acc1 100%)'
            }
          }} 
          onClick={handleClose}
        >
          Continue Playing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdPopup; 