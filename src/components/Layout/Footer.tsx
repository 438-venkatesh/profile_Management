import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Grid,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderTop: '1px solid',
        borderColor: 'rgba(141, 95, 140, 0.1)',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}>
                <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="primary">
                Profile Manager
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ 
              fontSize: '0.95rem',
              lineHeight: 1.6,
              maxWidth: 480,
            }}>
              A modern, professional profile management system built with React, 
              Redux, and Material-UI. Manage user profiles with full CRUD operations 
              and a beautiful, responsive interface.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                • Create & Update Profiles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View All Profiles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Search & Filter
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Delete Profiles
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom>
              Technology Stack
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                • React 18
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Redux Toolkit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Material-UI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • TypeScript
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: '0.875rem',
            fontWeight: 500,
          }}>
            © {currentYear} Profile Manager.Venkatesh Ponnuru.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="#"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">GitHub</Typography>
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <LinkedInIcon fontSize="small" />
              <Typography variant="body2">LinkedIn</Typography>
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <EmailIcon fontSize="small" />
              <Typography variant="body2">Contact</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
