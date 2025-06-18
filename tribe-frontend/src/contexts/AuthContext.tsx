import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, RegisterData, AuthContextType } from './types';
import { authService } from '../services/authService';
import { cookieManager } from '../utils/cookieManager';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

//This is to wrap everything and check the state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking auth on app start...');
        
        if (authService.isAuthenticated()) {
          const currentUser = cookieManager.getUser();
          console.log('👤 Current user from cookies:', currentUser);
          
          if (currentUser && currentUser.id && currentUser.email) {
            // Convert stored user data back to User interface with proper validation
            const userObj: User = {
              id: parseInt(currentUser.id) || 0,
              email: currentUser.email,
              first_name: (currentUser.name || '').split(' ')[0] || '',
              last_name: (currentUser.name || '').split(' ').slice(1).join(' ') || '',
              role_id: parseInt(currentUser.role) || 1,
            };
            console.log('✅ User object created:', userObj);
            setUser(userObj);
            setIsAuthenticated(true);
          } else {
            console.log('❌ Invalid user data, clearing auth...');
            // Clear invalid authentication state
            setIsAuthenticated(false);
            setUser(null);
            authService.logout();
          }
        } else {
          console.log('❌ User not authenticated');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        authService.logout();
      }
      setLoading(false);
    };

    checkAuth();
    
    // Start automatic token refresh
    authService.scheduleTokenRefresh();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await authService.login(email, password);
      
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
      const message = error.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await authService.register(userData);
      
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      const message = error.message || 'Update failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      user, 
      loading, 
      error,
      register,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};