export interface User {
  uid: string;
  email: string;
  name: string;
  rut: string;
  phone: string;
  address: string;
  neighborhood: string;
  role: 'vecino' | 'admin_barrial' | 'seguridad' | 'carabinero';
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  profileImage?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  neighborhood: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
}