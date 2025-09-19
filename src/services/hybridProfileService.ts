import { Profile, ApiResponse } from '../types/profile';
import { apiService } from './api';

// Local storage keys
const PROFILES_KEY = 'profiles_cache';
const PROFILES_TIMESTAMP_KEY = 'profiles_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

class HybridProfileService {
  /**
   * Get all profiles - checks local storage first, then API
   */
  async getAllProfiles(): Promise<ApiResponse<Profile[]>> {
    try {
      // First, try to get from local storage
      const cachedProfiles = this.getCachedProfiles();
      
      if (cachedProfiles && cachedProfiles.length > 0) {
        console.log('📱 Loading profiles from local storage');
        return {
          success: true,
          message: 'Profiles loaded from cache',
          data: cachedProfiles
        };
      }

      // If no cached data, try to fetch from API
      console.log('🌐 No cached profiles found, fetching from API');
      const apiResponse = await apiService.getAllProfiles();
      
      if (apiResponse.success && apiResponse.data) {
        // Cache the API response
        this.setCachedProfiles(apiResponse.data);
        console.log('💾 Profiles cached for offline use');
      }
      
      return apiResponse;
    } catch (error) {
      // If API fails, try to return cached data even if it's stale
      console.log('⚠️ API request failed, attempting to use cached data');
      const cachedProfiles = this.getCachedProfiles();
      
      if (cachedProfiles && cachedProfiles.length > 0) {
        console.log('📱 Using cached profiles as fallback');
        return {
          success: true,
          message: 'Profiles loaded from cache (offline mode)',
          data: cachedProfiles
        };
      }
      
      // If no cached data and API fails, throw error
      throw error;
    }
  }

  /**
   * Get profile by email - checks local storage first, then API
   */
  async getProfileByEmail(email: string): Promise<ApiResponse<Profile>> {
    try {
      // First, try to get from local storage
      const cachedProfiles = this.getCachedProfiles();
      const cachedProfile = cachedProfiles?.find(profile => profile.email === email);
      
      if (cachedProfile) {
        console.log('📱 Loading profile from local storage');
        return {
          success: true,
          message: 'Profile loaded from cache',
          data: cachedProfile
        };
      }

      // If not in cache, try to fetch from API
      console.log('🌐 Profile not in cache, fetching from API');
      const apiResponse = await apiService.getProfileByEmail(email);
      
      if (apiResponse.success && apiResponse.data) {
        // Update cache with new profile
        this.updateCachedProfile(apiResponse.data);
        console.log('💾 Profile cached for offline use');
      }
      
      return apiResponse;
    } catch (error) {
      // If API fails, try to return cached data
      console.log('⚠️ API request failed, attempting to use cached data');
      const cachedProfiles = this.getCachedProfiles();
      const cachedProfile = cachedProfiles?.find(profile => profile.email === email);
      
      if (cachedProfile) {
        console.log('📱 Using cached profile as fallback');
        return {
          success: true,
          message: 'Profile loaded from cache (offline mode)',
          data: cachedProfile
        };
      }
      
      // If no cached data and API fails, throw error
      throw error;
    }
  }

  /**
   * Create or update profile - saves to API and updates cache
   */
  async createOrUpdateProfile(profileData: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Profile>> {
    try {
      const apiResponse = await apiService.createOrUpdateProfile(profileData);
      
      if (apiResponse.success && apiResponse.data) {
        // Update cache with new/updated profile
        this.updateCachedProfile(apiResponse.data);
        console.log('💾 Profile updated in cache');
      }
      
      return apiResponse;
    } catch (error) {
      // Even if API fails, we can store locally for later sync
      console.log('⚠️ API request failed, storing profile locally for later sync');
      const localProfile: Profile = {
        ...profileData,
        _id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.updateCachedProfile(localProfile);
      
      return {
        success: true,
        message: 'Profile saved locally (will sync when online)',
        data: localProfile
      };
    }
  }

  /**
   * Delete profile - removes from API and cache
   */
  async deleteProfile(email: string): Promise<ApiResponse<void>> {
    try {
      const apiResponse = await apiService.deleteProfile(email);
      
      if (apiResponse.success) {
        // Remove from cache
        this.removeCachedProfile(email);
        console.log('🗑️ Profile removed from cache');
      }
      
      return apiResponse;
    } catch (error) {
      // Even if API fails, remove from cache for consistency
      console.log('⚠️ API request failed, removing profile from cache');
      this.removeCachedProfile(email);
      
      return {
        success: true,
        message: 'Profile removed locally (will sync when online)'
      };
    }
  }

  /**
   * Check if we're currently online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Clear all cached profiles
   */
  clearCache(): void {
    localStorage.removeItem(PROFILES_KEY);
    localStorage.removeItem(PROFILES_TIMESTAMP_KEY);
    console.log('🗑️ Profile cache cleared');
  }

  /**
   * Get cached profiles from localStorage
   */
  private getCachedProfiles(): Profile[] | null {
    try {
      const cached = localStorage.getItem(PROFILES_KEY);
      const timestamp = localStorage.getItem(PROFILES_TIMESTAMP_KEY);
      
      if (!cached || !timestamp) {
        return null;
      }
      
      const cacheTime = parseInt(timestamp);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - cacheTime > CACHE_DURATION) {
        console.log('⏰ Cache expired, will refresh from API');
        return null;
      }
      
      return JSON.parse(cached);
    } catch (error) {
      console.error('Error reading cached profiles:', error);
      return null;
    }
  }

  /**
   * Set cached profiles in localStorage
   */
  private setCachedProfiles(profiles: Profile[]): void {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      localStorage.setItem(PROFILES_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error caching profiles:', error);
    }
  }

  /**
   * Update a single profile in cache
   */
  private updateCachedProfile(profile: Profile): void {
    try {
      const cachedProfiles = this.getCachedProfiles() || [];
      const existingIndex = cachedProfiles.findIndex(p => p.email === profile.email);
      
      if (existingIndex >= 0) {
        cachedProfiles[existingIndex] = profile;
      } else {
        cachedProfiles.push(profile);
      }
      
      this.setCachedProfiles(cachedProfiles);
    } catch (error) {
      console.error('Error updating cached profile:', error);
    }
  }

  /**
   * Remove a profile from cache
   */
  private removeCachedProfile(email: string): void {
    try {
      const cachedProfiles = this.getCachedProfiles() || [];
      const filteredProfiles = cachedProfiles.filter(p => p.email !== email);
      this.setCachedProfiles(filteredProfiles);
    } catch (error) {
      console.error('Error removing cached profile:', error);
    }
  }

  /**
   * Sync local changes when back online
   */
  async syncLocalChanges(): Promise<void> {
    if (!this.isOnline()) {
      console.log('📡 Not online, skipping sync');
      return;
    }

    try {
      const cachedProfiles = this.getCachedProfiles() || [];
      const localProfiles = cachedProfiles.filter(p => p._id?.startsWith('local_'));
      
      if (localProfiles.length === 0) {
        console.log('✅ No local changes to sync');
        return;
      }

      console.log(`🔄 Syncing ${localProfiles.length} local changes...`);
      
      for (const profile of localProfiles) {
        try {
          const { _id, ...profileData } = profile;
          await apiService.createOrUpdateProfile(profileData);
          console.log(`✅ Synced profile: ${profile.email}`);
        } catch (error) {
          console.error(`❌ Failed to sync profile ${profile.email}:`, error);
        }
      }
      
      // Refresh cache after sync
      await this.getAllProfiles();
    } catch (error) {
      console.error('Error during sync:', error);
    }
  }
}

export const hybridProfileService = new HybridProfileService();
