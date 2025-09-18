import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

interface SuccessAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ 
  open, 
  message, 
  onClose, 
  title = 'Success' 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessAlert;
