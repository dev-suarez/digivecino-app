import { AuthError } from '@/types/auth';

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No existe una cuenta con este email';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este email';
    case 'auth/weak-password':
      return 'La contraseña es muy débil';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta más tarde';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu internet';
    case 'auth/requires-recent-login':
      return 'Debes iniciar sesión nuevamente para realizar esta acción';
    default:
      return error.message || 'Error desconocido';
  }
};

export const isAuthError = (error: any): error is AuthError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};