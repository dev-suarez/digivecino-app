import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { getAuthErrorMessage } from '@/utils/authErrors';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    phone: '',
    address: '',
    neighborhood: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading, error, clearError } = useAuth();
  const { 
    errors, 
    validateRegisterForm, 
    formatRUT, 
    clearError: clearValidationError 
  } = useAuthValidation();

  useEffect(() => {
    if (error) {
      Alert.alert('Error de Registro', getAuthErrorMessage(error));
    }
  }, [error]);

  const handleRegister = async () => {
    if (!validateRegisterForm(formData)) return;

    try {
      clearError();
      await register(formData);
      
      Alert.alert(
        'Registro Exitoso',
        'Tu cuenta ha sido creada. Un administrador del barrio debe verificar tu identidad antes de que puedas acceder a todas las funciones.',
        [
          {
            text: 'Entendido',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );
    } catch (error) {
      // Error is handled by the context and useEffect above
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearValidationError(field);
    }
    if (error) clearError();
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#0A3161" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Shield size={32} color="#0A3161" />
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a la red de seguridad vecinal</Text>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Nombre completo"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                autoCapitalize="words"
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.rut && styles.inputError]}
                placeholder="RUT (ej: 12.345.678-9)"
                value={formData.rut}
                onChangeText={(text) => {
                  const formatted = formatRUT(text);
                  updateFormData('rut', formatted);
                }}
                keyboardType="numeric"
              />
            </View>
            {errors.rut ? <Text style={styles.errorText}>{errors.rut}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Teléfono (ej: +56 9 1234 5678)"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="Dirección completa"
                value={formData.address}
                onChangeText={(text) => updateFormData('address', text)}
                autoCapitalize="words"
              />
            </View>
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.neighborhood && styles.inputError]}
                placeholder="Barrio o sector"
                value={formData.neighborhood}
                onChangeText={(text) => updateFormData('neighborhood', text)}
                autoCapitalize="words"
              />
            </View>
            {errors.neighborhood ? <Text style={styles.errorText}>{errors.neighborhood}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Al crear una cuenta, aceptas nuestros{' '}
              <Text style={styles.linkText}>Términos de Servicio</Text>
              {' '}y{' '}
              <Text style={styles.linkText}>Política de Privacidad</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A3161',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#E63946',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#E63946',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#0A3161',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#0A3161',
    fontWeight: '500',
  },
});