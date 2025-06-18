import { useEffect, useRef } from 'react';
import { authService } from '../services/authService';
import { cookieManager } from '../utils/cookieManager';

export const useTokenRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to check and refresh token
    const checkAndRefreshToken = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.refreshToken();
          console.log('🔄 Token automatically refreshed');
        } catch (error) {
          console.error('❌ Automatic token refresh failed:', error);
          // Force logout on refresh failure
          await authService.logout();
          window.location.href = '/login';
        }
      }
    };

    // Check immediately if we have a valid token
    const initializeTokenCheck = async () => {
      if (cookieManager.isAuthenticated()) {
        // Check if we need to refresh immediately (in case token expired while app was closed)
        try {
          await authService.refreshToken();
        } catch (error) {
          console.warn('Initial token refresh failed:', error);
        }
      }
    };

    // Start initial check
    initializeTokenCheck();

    // Set up periodic refresh every 14 minutes (1 minute before 15-minute access token expires)
    intervalRef.current = setInterval(checkAndRefreshToken, 14 * 60 * 1000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manual refresh function
  const refreshNow = async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  return { refreshNow };
}; 