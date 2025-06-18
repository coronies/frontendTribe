export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (data: RegisterData) => Promise<User>;
  updateUser: (data: Partial<User>) => Promise<User>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  university_id: string;
  role_id: number;
  is_verified: boolean;
}

export interface FormData {
  email: string;
  password: string;
}

export interface FormErrors {
  email: string;
  password: string;
  general?: string;
}