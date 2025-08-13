import { useState } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

export function useAuthValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRUT = (rut: string): boolean => {
    const cleanRUT = rut.replace(/[^0-9kK]/g, '');
    if (cleanRUT.length < 8 || cleanRUT.length > 9) return false;
    
    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toUpperCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = sum % 11;
    const calculatedDV = remainder < 2 ? remainder.toString() : remainder === 10 ? 'K' : (11 - remainder).toString();
    
    return dv === calculatedDV;
  };

  const formatRUT = (rut: string): string => {
    const cleanRUT = rut.replace(/[^0-9kK]/g, '');
    if (cleanRUT.length <= 1) return cleanRUT;
    
    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1);
    
    let formattedBody = '';
    for (let i = 0; i < body.length; i++) {
      if (i > 0 && (body.length - i) % 3 === 0) {
        formattedBody += '.';
      }
      formattedBody += body[i];
    }
    
    return `${formattedBody}-${dv}`;
  };

  const validateLoginForm = (email: string, password: string): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un email válido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateRegisterForm = (formData: any): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es requerido';
      isValid = false;
    } else if (!validateRUT(formData.rut)) {
      newErrors.rut = 'RUT inválido';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
      isValid = false;
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'El barrio es requerido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateEmail,
    validateRUT,
    formatRUT,
    validateLoginForm,
    validateRegisterForm,
    clearError,
    clearAllErrors,
  };
}