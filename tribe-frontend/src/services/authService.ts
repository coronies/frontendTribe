import axios from 'axios';
import {type TokenData, type UserData } from '../utils/typesCookies';
import { cookieManager } from '../utils/cookieManager';
import { API_BASE_URL } from '../contexts/config';
import type {LoginResponse, RegisterData } from '../contexts/types';
import type { AuthResponse, RefreshResponse } from './tokenTypes';
import type { User } from '../contexts/types';
class AuthService {
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.setupAxiosInterceptors();
  }

  // Setup axios interceptors for automatic token management
  private setupAxiosInterceptors(): void {
    // Request interceptor to add token to headers
    axios.interceptors.request.use(
      (config) => {
        const token = cookieManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for automatic token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Login method
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('🔍 Login attempt for:', email);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log('✅ Login response:', response.data);
      console.log('📊 Response status:', response.status);

      // Check if the response indicates success
      if (response.status !== 200 || !response.data.success || !response.data.accessToken) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { user, accessToken, refreshToken } = response.data;

      console.log('🔍 Raw response data:', response.data);
      console.log('👤 User object:', user);
      console.log('🔑 Access token:', accessToken);
      console.log('🔄 Refresh token:', refreshToken);

      // Temporarily relaxed validation to debug
      if (!user) {
        throw new Error('No user data received from server');
      }

      // Store tokens and user data with safe fallbacks
      cookieManager.setTokens({ accessToken, refreshToken });
      cookieManager.setUser({
        id: (user.id || user.userId || 'unknown').toString(),
        name: `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || user.name || 'Unknown User',
        email: user.email || 'unknown@email.com',
        role: (user.role_id || user.roleId || user.role || 1).toString(),
      });

      return user;
    } catch (error: any) {
      console.log('❌ Login error:', error);
      console.log('❌ Response data:', error.response?.data);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  }

  // Register method
  async register(userData: RegisterData): Promise<User> {
    try {
      console.log('🔍 Frontend form data received:', userData);
      
      // Transform frontend data to backend format - exact format as API expects
      const backendData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role_id,
        isVerified: userData.is_verified,
        universityId: userData.university_id
      };

      console.log('🚀 Data being sent to backend:', backendData);
      console.log('📡 API endpoint:', `${API_BASE_URL}/auth/register`);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, backendData);

      console.log('✅ Backend response:', response.data);
      console.log('📊 Response status:', response.status);

      // Check if the response indicates success
      if ((response.status !== 200 && response.status !== 201) || !response.data.success || !response.data.accessToken) {
        throw new Error(response.data.message || 'Registration failed');
      }

      const { user, accessToken, refreshToken } = response.data;

      console.log('🔍 Raw registration response data:', response.data);
      console.log('👤 User object:', user);
      console.log('🔑 Access token:', accessToken);
      console.log('🔄 Refresh token:', refreshToken);

      // Temporarily relaxed validation to debug
      if (!user) {
        throw new Error('No user data received from server');
      }

      // Store tokens and user data with safe fallbacks
      cookieManager.setTokens({ accessToken, refreshToken });
      cookieManager.setUser({
        id: (user.id || user.userId || 'unknown').toString(),
        name: `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || user.name || 'Unknown User',
        email: user.email || 'unknown@email.com',
        role: (user.role_id || user.roleId || user.role || 1).toString(),
      });

      return user;
    } catch (error: any) {
      console.log('❌ Registration error:', error);
      console.log('❌ Response data:', error.response?.data);
      
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  }

  // Refresh token method
  async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    try {
      const refreshToken = cookieManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      this.refreshPromise = (async () => {
        const response = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens
        cookieManager.setTokens({ 
          accessToken, 
          refreshToken: newRefreshToken 
        });

        return accessToken;
      })();

      const newToken = await this.refreshPromise;
      return newToken;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw new Error('Session expired. Please log in again.');
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      const refreshToken = cookieManager.getRefreshToken();
      if (refreshToken) {
        await axios.post(`${API_BASE_URL}/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local auth data
      cookieManager.clearAuth();
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // Get current user
  getCurrentUser(): UserData | null {
    return cookieManager.getUser();
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return cookieManager.isAuthenticated();
  }

  // Update user data
  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const response = await axios.put<User>(`${API_BASE_URL}/users/${currentUser.id}`, userData);
      const updatedUser = response.data;

      // Update stored user data
      cookieManager.setUser({
        id: updatedUser.id.toString(),
        name: `${updatedUser.first_name} ${updatedUser.last_name}`,
        email: updatedUser.email,
        role: updatedUser.role_id.toString(),
      });

      return updatedUser;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed';
      throw new Error(message);
    }
  }

  // Schedule automatic token refresh (call this when app starts)
  scheduleTokenRefresh(): void {
    // Refresh token every 14 minutes (1 minute before expiry)
    setInterval(async () => {
      if (this.isAuthenticated()) {
        try {
          await this.refreshToken();
          console.log('Token automatically refreshed');
        } catch (error) {
          console.error('Automatic token refresh failed:', error);
        }
      }
    }, 14 * 60 * 1000); // 14 minutes
  }
}

export const authService = new AuthService(); 