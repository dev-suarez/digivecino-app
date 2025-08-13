import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, AuthError } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [error, setError] = useState<AuthError | null>(null);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // TODO: Replace with Firebase auth state listener
      // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      //   if (firebaseUser) {
      //     loadUserProfile(firebaseUser.uid);
      //   } else {
      //     setAuthState({
      //       user: null,
      //       isLoading: false,
      //       isAuthenticated: false,
      //     });
      //   }
      // });
      // return unsubscribe;

      // Simulate auth check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      console.error('Auth initialization error:', err);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // TODO: Replace with Firebase authentication
      // const userCredential = await signInWithEmailAndPassword(
      //   auth,
      //   credentials.email,
      //   credentials.password
      // );
      // await loadUserProfile(userCredential.user.uid);

      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data
      const mockUser: User = {
        uid: 'mock-uid',
        email: credentials.email,
        name: 'Usuario Demo',
        rut: '12.345.678-9',
        phone: '+56 9 1234 5678',
        address: 'Av. Alemania 01160, Temuco',
        neighborhood: 'Sector Amanecer',
        role: 'vecino',
        isVerified: true,
        createdAt: new Date(),
        lastActive: new Date(),
      };

      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (err: any) {
      setError({
        code: err.code || 'auth/unknown-error',
        message: err.message || 'Error de autenticación',
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // TODO: Replace with Firebase authentication and Firestore
      // const userCredential = await createUserWithEmailAndPassword(
      //   auth,
      //   data.email,
      //   data.password
      // );
      // 
      // await setDoc(doc(db, 'users', userCredential.user.uid), {
      //   name: data.name,
      //   rut: data.rut,
      //   email: data.email,
      //   phone: data.phone,
      //   address: data.address,
      //   neighborhood: data.neighborhood,
      //   role: 'vecino',
      //   isVerified: false,
      //   createdAt: new Date(),
      //   lastActive: new Date(),
      // });

      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      setError({
        code: err.code || 'auth/unknown-error',
        message: err.message || 'Error en el registro',
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      
      // TODO: Replace with Firebase signOut
      // await signOut(auth);
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (err: any) {
      setError({
        code: err.code || 'auth/unknown-error',
        message: err.message || 'Error al cerrar sesión',
      });
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      
      // TODO: Replace with Firebase password reset
      // await sendPasswordResetEmail(auth, email);
      
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: any) {
      setError({
        code: err.code || 'auth/unknown-error',
        message: err.message || 'Error al enviar email de recuperación',
      });
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      
      if (!authState.user) throw new Error('No user logged in');

      // TODO: Replace with Firestore update
      // await updateDoc(doc(db, 'users', authState.user.uid), data);
      
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));
    } catch (err: any) {
      setError({
        code: err.code || 'auth/unknown-error',
        message: err.message || 'Error al actualizar perfil',
      });
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}