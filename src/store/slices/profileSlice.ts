import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile, ProfileState } from '../../types/profile';
import { hybridProfileService } from '../../services/hybridProfileService';

const initialState: ProfileState = {
  profile: null,
  profiles: [],
  loading: false,
  error: null,
  success: null,
};

// Async thunks
export const createOrUpdateProfile = createAsyncThunk(
  'profile/createOrUpdateProfile',
  async (profileData: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await hybridProfileService.createOrUpdateProfile(profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save profile');
    }
  }
);

export const fetchProfileByEmail = createAsyncThunk(
  'profile/fetchProfileByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await hybridProfileService.getProfileByEmail(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const fetchAllProfiles = createAsyncThunk(
  'profile/fetchAllProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await hybridProfileService.getAllProfiles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profiles');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await hybridProfileService.deleteProfile(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete profile');
    }
  }
);

// Sync local changes when back online
export const syncLocalChanges = createAsyncThunk(
  'profile/syncLocalChanges',
  async (_, { rejectWithValue }) => {
    try {
      await hybridProfileService.syncLocalChanges();
      // After sync, refresh all profiles
      const response = await hybridProfileService.getAllProfiles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sync local changes');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.success = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    clearProfiles: (state) => {
      state.profiles = [];
    },
    clearCache: (state) => {
      // Clear cache action - the actual clearing is handled by the service
      state.profiles = [];
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    // Create or Update Profile
    builder
      .addCase(createOrUpdateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data || null;
        state.success = action.payload.message;
        state.error = null;
        // Update the profiles array if it exists
        if (action.payload.data) {
          const existingIndex = state.profiles.findIndex(p => p.email === action.payload.data!.email);
          if (existingIndex >= 0) {
            state.profiles[existingIndex] = action.payload.data;
          } else {
            state.profiles.push(action.payload.data);
          }
        }
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      });

    // Fetch Profile by Email
    builder
      .addCase(fetchProfileByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data || null;
        state.error = null;
      })
      .addCase(fetchProfileByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profile = null;
      });

    // Fetch All Profiles
    builder
      .addCase(fetchAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profiles = [];
      });

    // Delete Profile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.success = 'Profile deleted successfully';
        state.error = null;
        // Remove the deleted profile from the profiles array
        const email = action.meta.arg;
        state.profiles = state.profiles.filter(p => p.email !== email);
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      });

    // Sync Local Changes
    builder
      .addCase(syncLocalChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncLocalChanges.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data || [];
        state.success = 'Local changes synced successfully';
        state.error = null;
      })
      .addCase(syncLocalChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      });
  },
});

export const { clearError, clearSuccess, clearProfile, setProfile, clearProfiles, clearCache } = profileSlice.actions;
export default profileSlice.reducer;
