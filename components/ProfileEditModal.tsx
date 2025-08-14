import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, User, Phone, MapPin, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthValidation } from '@/hooks/useAuthValidation';

interface ProfileEditModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

export default function ProfileEditModal({ visible, onClose }: ProfileEditModalProps) {
  const { user, updateProfile } = useAuth();
  const { errors, validateProfileForm, clearError, clearAllErrors } = useAuthValidation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && visible) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        neighborhood: user.neighborhood || '',
      });
      clearAllErrors();
    }
  }, [user, visible, clearAllErrors]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearError(field);
    }
  };

  const handleSave = async () => {
    if (!validateProfileForm(formData)) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      Alert.alert('Perfil Actualizado', 'Tu información ha sido actualizada exitosamente.', [
        { text: 'OK', onPress: onClose },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar tu perfil. Intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    clearAllErrors();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            disabled={isSaving}
          >
            <X size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                <User size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre completo"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  autoCapitalize="words"
                  editable={!isSaving}
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Phone size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+56 9 1234 5678"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text)}
                  keyboardType="phone-pad"
                  editable={!isSaving}
                />
              </View>
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <View style={[styles.inputWrapper, errors.address && styles.inputError]}>
                <MapPin size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Dirección completa"
                  value={formData.address}
                  onChangeText={(text) => updateFormData('address', text)}
                  autoCapitalize="words"
                  editable={!isSaving}
                />
              </View>
              {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Barrio/Sector</Text>
              <View style={[styles.inputWrapper, errors.neighborhood && styles.inputError]}>
                <MapPin size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del barrio o sector"
                  value={formData.neighborhood}
                  onChangeText={(text) => updateFormData('neighborhood', text)}
                  autoCapitalize="words"
                  editable={!isSaving}
                />
              </View>
              {errors.neighborhood ? <Text style={styles.errorText}>{errors.neighborhood}</Text> : null}
            </View>
          </View>

          <View style={styles.readOnlySection}>
            <Text style={styles.sectionTitle}>Información No Editable</Text>

            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>Email</Text>
              <View style={styles.readOnlyWrapper}>
                <Mail size={20} color="#94A3B8" style={styles.inputIcon} />
                <Text style={styles.readOnlyText}>{user?.email}</Text>
              </View>
              <Text style={styles.readOnlyNote}>
                Para cambiar tu email, contacta al administrador
              </Text>
            </View>

            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>RUT</Text>
              <View style={styles.readOnlyWrapper}>
                <User size={20} color="#94A3B8" style={styles.inputIcon} />
                <Text style={styles.readOnlyText}>{user?.rut}</Text>
              </View>
              <Text style={styles.readOnlyNote}>El RUT no puede ser modificado</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
  errorText: {
    color: '#E63946',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  readOnlySection: {
    marginBottom: 32,
  },
  readOnlyItem: {
    marginBottom: 20,
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  readOnlyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 16,
    color: '#64748B',
  },
  readOnlyNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0A3161',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

