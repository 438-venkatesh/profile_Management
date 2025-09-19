import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { syncLocalChanges } from '../store/slices/profileSlice';
import { hybridProfileService } from '../services/hybridProfileService';

export function useOfflineSync() {
  const dispatch = useDispatch<AppDispatch>();

  const handleOnline = useCallback(() => {
    console.log('🌐 Back online - syncing local changes...');
    dispatch(syncLocalChanges() as any);
  }, [dispatch]);

  const handleOffline = useCallback(() => {
    console.log('📱 Gone offline - using cached data');
  }, []);

  useEffect(() => {
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if we're back online and need to sync
    if (navigator.onLine) {
      // Small delay to ensure the app is fully loaded
      const timer = setTimeout(() => {
        dispatch(syncLocalChanges() as any);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, dispatch]);

  return {
    isOnline: navigator.onLine,
    syncNow: () => dispatch(syncLocalChanges() as any),
    clearCache: () => hybridProfileService.clearCache(),
  };
}
