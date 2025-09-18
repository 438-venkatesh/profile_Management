import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  List as ListIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearProfile } from '../../store/slices/profileSlice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.profile);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const getFirstName = (name: string) => {
    return name.split(' ')[0];
  };

  const getLastName = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(clearProfile());
    handleMenuClose();
    navigate('/profile-form');
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #8D5F8C 0%, #B085B0 100%)',
      boxShadow: '0 4px 20px rgba(141, 95, 140, 0.2)',
      borderRadius: '0 0 24px 24px',
      mx: 2,
      mt: 2,
    }}>
      <AppBar position="static" elevation={0} sx={{ 
        backgroundColor: 'transparent',
        borderRadius: '0 0 24px 24px',
        boxShadow: 'none',
      }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              p: 1.5,
              borderRadius: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }
            }} onClick={() => navigate('/profile')}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}>
                <PersonIcon sx={{ color: 'white', fontSize: 26 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Profile Manager
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ 
                    opacity: 0.9,
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Professional Dashboard
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<ListIcon />}
              onClick={() => navigate('/profile')}
              sx={{
                backgroundColor: location.pathname === '/profile' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
                borderRadius: 6,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255,255,255,0.3)',
                minHeight: 48,
              }}
            >
              All Profiles
            </Button>
            
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => navigate('/profile-form')}
              sx={{
                backgroundColor: location.pathname === '/profile-form' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
                borderRadius: 6,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255,255,255,0.3)',
                minHeight: 48,
              }}
            >
              Add Profile
            </Button>

            {profile && (
              <>
                <Box sx={{ 
                  ml: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }
                }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'rgba(255,255,255,0.25)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: '2px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {getInitials(profile.name)}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      lineHeight: 1.1,
                      mb: 0.5,
                    }}>
                      {getFirstName(profile.name)}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      lineHeight: 1,
                      display: 'block',
                      mb: 0.5,
                    }}>
                      {getLastName(profile.name)}
                    </Typography>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.3)',
                        color: 'white',
                        fontSize: '0.65rem',
                        height: 18,
                        fontWeight: 500,
                        border: '1px solid rgba(76, 175, 80, 0.5)',
                      }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleProfileMenuOpen}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      border: '2px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        transform: 'scale(1.05)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <AccountCircleIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(141, 95, 140, 0.2)',
                      border: '1px solid rgba(141, 95, 140, 0.1)',
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {getFirstName(profile.name)} {getLastName(profile.name)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {profile.email}
                    </Typography>
                  </Box>
                  <MenuItem 
                    onClick={() => { handleMenuClose(); navigate('/profile-form'); }}
                    sx={{
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(141, 95, 140, 0.1)',
                      }
                    }}
                  >
                    <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                    Edit Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      fontWeight: 500,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      }
                    }}
                  >
                    <AccountCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
