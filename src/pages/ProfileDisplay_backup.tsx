import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import {
  fetchAllProfiles,
  deleteProfile,
  clearError,
  clearSuccess,
  setProfile,
  clearProfile,
} from '../store/slices/profileSlice';
import { Profile } from '../types/profile';

// Simple date formatter without external dependency
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  } catch {
    return 'Invalid Date';
  }
};

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'email' | 'age' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  ageRange: { min: number | ''; max: number | '' };
  dateRange: { start: string; end: string };
  sortBy: SortField;
  sortOrder: SortOrder;
}

const ProfileDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profiles, loading, error, success } = useSelector((state: RootState) => state.profile);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    ageRange: { min: '', max: '' },
    dateRange: { start: '', end: '' },
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    dispatch(fetchAllProfiles() as any);
  }, [dispatch]);

  // Filter and sort profiles
  useEffect(() => {
    let filtered = [...profiles];

    // Search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Age range filter
    if (filters.ageRange.min !== '') {
      filtered = filtered.filter(profile => 
        profile.age && profile.age >= Number(filters.ageRange.min)
      );
    }
    if (filters.ageRange.max !== '') {
      filtered = filtered.filter(profile => 
        profile.age && profile.age <= Number(filters.ageRange.max)
      );
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(profile => 
        profile.createdAt && new Date(profile.createdAt) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(profile => 
        profile.createdAt && new Date(profile.createdAt) <= new Date(filters.dateRange.end)
      );
    }

    // Sort profiles
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'age':
          aValue = a.age || 0;
          bValue = b.age || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, filters]);

  useEffect(() => {
    // Auto-clear success message after 3 seconds
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleEditProfile = (profile: Profile) => {
    dispatch(setProfile(profile));
    navigate('/profile-form');
  };

  const handleDeleteClick = (profile: Profile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (profileToDelete) {
      dispatch(deleteProfile(profileToDelete.email) as any);
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProfileToDelete(null);
  };

  const handleCreateNew = () => {
    dispatch(clearProfile());
    navigate('/profile-form');
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearSuccess = () => {
    dispatch(clearSuccess());
  };

  const handleViewProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedProfile(null);
  };

  const handleSort = (field: SortField) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      ageRange: { min: '', max: '' },
      dateRange: { start: '', end: '' },
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchTerm('');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: ViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };


  if (loading && profiles.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading profiles...
        </Typography>
      </Box>
    );
  }

  const displayedProfiles = filteredProfiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View, edit, and manage user profiles with advanced filtering
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }} 
          onClose={handleClearSuccess}
        >
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={handleClearError}
        >
          {error}
        </Alert>
      )}

      {/* Search and Actions Bar */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
        border: '1px solid rgba(141, 95, 140, 0.1)',
        boxShadow: '0 4px 20px rgba(141, 95, 140, 0.08)',
      }}>
        <CardContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search profiles by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="table">
                <ListViewIcon />
              </ToggleButton>
              <ToggleButton value="grid">
                <GridViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              color={filtersExpanded ? "primary" : "inherit"}
            >
              Filters
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ 
                minWidth: 140,
                background: 'linear-gradient(135deg, #8D5F8C 0%, #B085B0 100%)',
                boxShadow: '0 4px 12px rgba(141, 95, 140, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6B4A6B 0%, #8D5F8C 100%)',
                  boxShadow: '0 6px 16px rgba(141, 95, 140, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Profile
            </Button>
          </Box>

          {/* Advanced Filters */}
          <Collapse in={filtersExpanded}>
            <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Min Age"
                    type="number"
                    size="small"
                    value={filters.ageRange.min}
                    onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, min: e.target.value || '' })}
                    inputProps={{ min: 0, max: 150 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Max Age"
                    type="number"
                    size="small"
                    value={filters.ageRange.max}
                    onChange={(e) => handleFilterChange('ageRange', { ...filters.ageRange, max: e.target.value || '' })}
                    inputProps={{ min: 0, max: 150 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    size="small"
                    value={filters.dateRange.start}
                    onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    size="small"
                    value={filters.dateRange.end}
                    onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="age">Age</MenuItem>
                    <MenuItem value="createdAt">Created Date</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    label="Order"
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {displayedProfiles.length} of {filteredProfiles.length} profiles
          {(searchTerm || filters.ageRange.min || filters.ageRange.max || filters.dateRange.start) && ' (filtered)'}
        </Typography>
      </Box>

      {/* Profiles Display */}
      {filteredProfiles.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No profiles found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || filters.ageRange.min || filters.ageRange.max || filters.dateRange.start
              ? 'No profiles match your current filters. Try adjusting your search criteria.'
              : 'Get started by creating your first profile'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create Profile
          </Button>
        </Card>
      ) : viewMode === 'table' ? (
        <Card sx={{
          boxShadow: '0 4px 20px rgba(141, 95, 140, 0.08)',
          border: '1px solid rgba(141, 95, 140, 0.1)',
        }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(141, 95, 140, 0.05)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                    <TableSortLabel
                      active={filters.sortBy === 'name'}
                      direction={filters.sortBy === 'name' ? filters.sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                      sx={{ '&.Mui-active': { color: 'primary.main' } }}
                    >
                      Profile
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                    <TableSortLabel
                      active={filters.sortBy === 'email'}
                      direction={filters.sortBy === 'email' ? filters.sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                      sx={{ '&.Mui-active': { color: 'primary.main' } }}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                    <TableSortLabel
                      active={filters.sortBy === 'age'}
                      direction={filters.sortBy === 'age' ? filters.sortOrder : 'asc'}
                      onClick={() => handleSort('age')}
                      sx={{ '&.Mui-active': { color: 'primary.main' } }}
                    >
                      Age
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                    <TableSortLabel
                      active={filters.sortBy === 'createdAt'}
                      direction={filters.sortBy === 'createdAt' ? filters.sortOrder : 'asc'}
                      onClick={() => handleSort('createdAt')}
                      sx={{ '&.Mui-active': { color: 'primary.main' } }}
                    >
                      Created
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.main' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedProfiles.map((profile) => (
                  <TableRow key={profile.email} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                            mr: 2,
                            fontSize: '1rem'
                          }}
                        >
                          {profile.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {profile.name}
                          </Typography>
                          <Chip
                            label="Active"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {profile.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {profile.age ? `${profile.age} years` : 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(profile.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewProfile(profile)}
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditProfile(profile)}
                          title="Edit Profile"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(profile)}
                          title="Delete Profile"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredProfiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedProfiles.map((profile) => (
              <Grid item xs={12} sm={6} md={4} key={profile.email}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Profile Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                          mr: 2,
                          fontSize: '1.2rem'
                        }}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" noWrap>
                          {profile.name}
                        </Typography>
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Profile Details */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {profile.email}
                        </Typography>
                      </Box>
                      
                      {profile.age && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CakeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {profile.age} years old
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Created: {formatDate(profile.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Actions */}
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewProfile(profile)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditProfile(profile)}
                        sx={{ flexGrow: 1 }}
                        size="small"
                      >
                        Edit
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(profile)}
                        size="small"
                        title="Delete Profile"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {filteredProfiles.length > rowsPerPage && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredProfiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add profile"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={handleCreateNew}
      >
        <AddIcon />
      </Fab>

      {/* Profile Details View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ 
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                mr: 2,
                fontSize: '1.2rem'
              }}
            >
              {selectedProfile?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedProfile?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Profile Details
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProfile && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedProfile.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedProfile.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Age
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedProfile.age ? `${selectedProfile.age} years old` : 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Account Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Profile ID
                    </Typography>
                    <Typography variant="body1" fontWeight={500} fontFamily="monospace">
                      {selectedProfile._id || 'Not available'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(selectedProfile.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(selectedProfile.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              handleCloseViewDialog();
              handleEditProfile(selectedProfile!);
            }}
          >
            Edit Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the profile for{' '}
            <strong>{profileToDelete?.name}</strong> ({profileToDelete?.email})?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileDisplay;