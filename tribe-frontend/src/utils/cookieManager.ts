import Cookies from 'js-cookie';

// Cookie configuration
const COOKIE_CONFIG = {
  secure: window.location.protocol === 'https:',
  sameSite: 'strict' as const,
  path: '/',
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

class CookieManager {
  // Set access token (15 minutes expiry)
  setAccessToken(token: string): void {
    try {
      Cookies.set(ACCESS_TOKEN_KEY, token, {
        ...COOKIE_CONFIG,
        expires: 1/96, // 15 minutes (1/96 of a day)
      });
    } catch (error) {
      console.warn('Failed to set access token in cookies, using localStorage:', error);
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }

  // Set refresh token (7 days expiry)
  setRefreshToken(token: string): void {
    try {
      Cookies.set(REFRESH_TOKEN_KEY, token, {
        ...COOKIE_CONFIG,
        expires: 7, // 7 days
      });
    } catch (error) {
      console.warn('Failed to set refresh token in cookies, using localStorage:', error);
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  }

  // Set user data (7 days expiry)
  setUser(user: UserData): void {
    try {
      Cookies.set(USER_KEY, JSON.stringify(user), {
        ...COOKIE_CONFIG,
        expires: 7, // 7 days
      });
    } catch (error) {
      console.warn('Failed to set user in cookies, using localStorage:', error);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  // Set both tokens at once
  setTokens(tokenData: TokenData): void {
    this.setAccessToken(tokenData.accessToken);
    this.setRefreshToken(tokenData.refreshToken);
  }

  // Get access token
  getAccessToken(): string | null {
    try {
      return Cookies.get(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to get access token from cookies, trying localStorage:', error);
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
  }

  // Get refresh token
  getRefreshToken(): string | null {
    try {
      return Cookies.get(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to get refresh token from cookies, trying localStorage:', error);
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
  }

  // Get user data
  getUser(): UserData | null {
    try {
      const userStr = Cookies.get(USER_KEY) || localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.warn('Failed to get user from cookies, trying localStorage:', error);
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken());
  }

  // Clear all auth data
  clearAuth(): void {
    try {
      // Clear cookies
      Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
      Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
      Cookies.remove(USER_KEY, { path: '/' });
    } catch (error) {
      console.warn('Error clearing cookies:', error);
    }

    // Clear localStorage as fallback
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('authToken'); // Remove old token if exists
  }

  // Update access token only (for refresh operations)
  updateAccessToken(newToken: string): void {
    this.setAccessToken(newToken);
  }
}

export const cookieManager = new CookieManager(); 