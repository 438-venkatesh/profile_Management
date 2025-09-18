import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import {
  createOrUpdateProfile,
  clearError,
  clearSuccess,
  clearProfile,
} from '../store/slices/profileSlice';
import { ProfileFormData } from '../types/profile';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorAlert from '../components/UI/ErrorAlert';
import SuccessAlert from '../components/UI/SuccessAlert';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, loading, error, success } = useSelector((state: RootState) => state.profile);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    age: '',
  });
  
  const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});
  const [localProfile, setLocalProfile] = useLocalStorage('profile', null);

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        age: profile.age?.toString() || '',
      });
    } else if (localProfile) {
      setFormData({
        name: localProfile.name || '',
        email: localProfile.email || '',
        age: localProfile.age?.toString() || '',
      });
    }
  }, [profile, localProfile]);

  const validateForm = (): boolean => {
    const errors: Partial<ProfileFormData> = {};

    // Strict Name Validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Name must not exceed 50 characters';
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(formData.name.trim())) {
      errors.name = 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
    } else if (formData.name.trim().split(' ').length < 2) {
      errors.name = 'Please enter your full name (first and last name)';
    }

    // Strict Email Validation
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 254) {
      errors.email = 'Email address is too long';
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email.trim())) {
      errors.email = 'Email must contain exactly one @ symbol and a valid domain';
    }

    // Strict Age Validation
    if (formData.age && formData.age.trim()) {
      const ageNum = parseInt(formData.age.trim());
      if (isNaN(ageNum)) {
        errors.age = 'Age must be a valid number';
      } else if (ageNum < 1) {
        errors.age = 'Age must be at least 1 year';
      } else if (ageNum > 120) {
        errors.age = 'Age cannot exceed 120 years';
      } else if (!Number.isInteger(ageNum)) {
        errors.age = 'Age must be a whole number';
      }
    } else {
      errors.age = 'Age is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const profileData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      age: parseInt(formData.age.trim()),
    };

    try {
      const result = await dispatch(createOrUpdateProfile(profileData));
      
      if (createOrUpdateProfile.fulfilled.match(result)) {
        // Save to localStorage
        if (result.payload.data) {
          setLocalProfile(result.payload.data);
        }
        // Navigate to profile display after successful creation/update
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
    });
    setFormErrors({});
    dispatch(clearProfile());
  };

  const handleGoBack = () => {
    navigate('/profile');
  };

  return (
    <Container maxWidth="md">
      {/* Breadcrumb Navigation */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/profile')}
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Profiles
          </Link>
          <Typography variant="body2" color="text.primary">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" color="primary">
              {profile ? 'Update Profile' : 'Create Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in your information below to create or update your profile
            </Typography>
          </Box>
        </Box>

        {loading && <LoadingSpinner message="Saving profile..." />}

        {!loading && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="Enter your first and last name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={!!formErrors.name}
                  helperText={formErrors.name || "Must be 2-50 characters, letters only, first and last name required"}
                  required
                  variant="outlined"
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!formErrors.email}
                  helperText={formErrors.email || "Enter a valid email address"}
                  required
                  variant="outlined"
                  inputProps={{ maxLength: 254 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange('age')}
                  error={!!formErrors.age}
                  helperText={formErrors.age || 'Enter your age (1-120 years)'}
                  required
                  variant="outlined"
                  inputProps={{ min: 1, max: 120 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {profile ? 'Update Profile' : 'Create Profile'}
              </Button>
              
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleClearForm}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                Clear Form
              </Button>

              <Button
                type="button"
                variant="text"
                size="large"
                onClick={handleGoBack}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <ErrorAlert
        open={!!error}
        message={error || ''}
        onClose={() => dispatch(clearError())}
      />

      <SuccessAlert
        open={!!success}
        message={success || ''}
        onClose={() => dispatch(clearSuccess())}
      />
    </Container>
  );
};

export default ProfileForm;