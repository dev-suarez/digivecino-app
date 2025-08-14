import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, AuthError } from '@/types/auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

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
  readonly children: ReactNode;
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
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, []);

  const initializeAuth = () => {
    try {
      // Firebase auth state listener
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await loadUserProfile(firebaseUser);
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      });
      return unsubscribe;
    } catch (err) {
      console.error('Auth initialization error:', err);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return () => { };
    }
  };

  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const uid = firebaseUser.uid;
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        let email = userData.email ?? firebaseUser.email ?? '';
        if (!userData.email && firebaseUser.email) {
          await updateDoc(userRef, { email });
        }
        const user: User = {
          uid,
          email,
          name: userData.name,
          rut: userData.rut,
          phone: userData.phone,
          address: userData.address,
          neighborhood: userData.neighborhood,
          role: userData.role,
          isVerified: userData.isVerified,
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastActive: new Date(),
        };

        // Update last active timestamp
        await updateDoc(doc(db, 'users', uid), {
          lastActive: new Date(),
        });

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        console.error('User profile not found');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Firebase authentication
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      // El usuario se cargará automáticamente por onAuthStateChanged

    } catch (err: any) {
      const getErrorMessage = (code: string): string => {
        switch (code) {
          case 'auth/user-not-found':
            return 'Usuario no encontrado';
          case 'auth/wrong-password':
            return 'Contraseña incorrecta';
          case 'auth/invalid-email':
            return 'Email inválido';
          case 'auth/user-disabled':
            return 'Usuario deshabilitado';
          case 'auth/too-many-requests':
            return 'Demasiados intentos. Intenta más tarde';
          case 'auth/invalid-credential':
            return 'Credenciales inválidas';
          default:
            return err.message || 'Error de autenticación';
        }
      };

      setError({
        code: err.code || 'auth/unknown-error',
        message: getErrorMessage(err.code),
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Firebase authentication and Firestore
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: data.name,
        rut: data.rut,
        email: data.email,
        phone: data.phone,
        address: data.address,
        neighborhood: data.neighborhood,
        role: 'vecino',
        isVerified: false,
        createdAt: new Date(),
        lastActive: new Date(),
      });

      // El usuario se cargará automáticamente por onAuthStateChanged

    } catch (err: any) {
      const getErrorMessage = (code: string): string => {
        switch (code) {
          case 'auth/email-already-in-use':
            return 'El email ya está registrado';
          case 'auth/invalid-email':
            return 'Email inválido';
          case 'auth/weak-password':
            return 'La contraseña es muy débil (mínimo 6 caracteres)';
          case 'auth/operation-not-allowed':
            return 'Operación no permitida';
          default:
            return err.message || 'Error en el registro';
        }
      };

      setError({
        code: err.code || 'auth/unknown-error',
        message: getErrorMessage(err.code),
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Firebase signOut
      await signOut(auth);

      // El estado se actualizará automáticamente por onAuthStateChanged

    } catch (err: any) {
      setError({
        code: err.code || 'auth/unknown-error',
        message: err.message || 'Error al cerrar sesión',
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);

      // Validar email antes de enviar
      if (!email?.includes('@')) {
        throw new Error('Email inválido');
      }

      // Firebase password reset
      await sendPasswordResetEmail(auth, email);

    } catch (err: any) {
      const getErrorMessage = (code: string): string => {
        switch (code) {
          case 'auth/user-not-found':
            return 'No existe un usuario con este email';
          case 'auth/invalid-email':
            return 'Email inválido';
          case 'auth/too-many-requests':
            return 'Demasiados intentos. Espera antes de intentar nuevamente';
          default:
            return err.message || 'Error al enviar email de recuperación';
        }
      };

      setError({
        code: err.code || 'auth/unknown-error',
        message: getErrorMessage(err.code),
      });
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setError(null);

      if (!authState.user) {
        throw new Error('No hay usuario autenticado');
      }

      // Preparar datos para actualizar (excluir campos que no se pueden cambiar)
      const updateData = { ...data };
      delete updateData.uid;
      delete updateData.createdAt;

      // Agregar timestamp de actualización
      updateData.lastActive = new Date();

      // Firestore update
      await updateDoc(doc(db, 'users', authState.user.uid), updateData);

      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updateData } : null,
      }));

    } catch (err: any) {
      const getErrorMessage = (code: string): string => {
        switch (code) {
          case 'permission-denied':
            return 'No tienes permisos para actualizar este perfil';
          case 'not-found':
            return 'Perfil de usuario no encontrado';
          default:
            return err.message || 'Error al actualizar perfil';
        }
      };

      setError({
        code: err.code || 'auth/unknown-error',
        message: getErrorMessage(err.code),
      });
      throw err;
    }
  }, [authState.user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = useMemo(() => ({
    ...authState,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    error,
    clearError,
  }), [authState, login, register, logout, resetPassword, updateProfile, error, clearError]);

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