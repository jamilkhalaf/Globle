import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const NotificationModal = ({ open, onClose, title, description, buttonText = 'Ready', color = 'primary' }) => (
  <Dialog open={open} disableEscapeKeyDown disableBackdropClick>
    <DialogTitle sx={{ fontWeight: 800, fontSize: 28, color, textAlign: 'center' }}>{title}</DialogTitle>
    <DialogContent>
      <Typography sx={{ mb: 2, color: 'yellow', fontSize: 18, textAlign: 'center' }}>
        {description}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
      <Button variant="contained" color={color} size="large" sx={{ fontWeight: 700, px: 4, fontSize: 20 }} onClick={onClose}>
        {buttonText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default NotificationModal; 