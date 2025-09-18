import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

interface ErrorAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  open, 
  message, 
  onClose, 
  title = 'Error' 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
