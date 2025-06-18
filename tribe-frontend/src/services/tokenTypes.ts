import type { User } from '../contexts/types';

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
  user: User;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}