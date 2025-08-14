import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { User as UserIcon, Phone, MapPin } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types/auth';

interface ProfileEditModalProps {
  readonly visible: boolean;
  readonly user: User;
  readonly onClose: () => void;
}

export default function ProfileEditModal({ visible, user, onClose }: ProfileEditModalProps) {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    address: user.address,
    neighborhood: user.neighborhood,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData({
        name: user.name,
        phone: user.phone,
        address: user.address,
        neighborhood: user.neighborhood,
      });
    }
  }, [visible, user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(formData);
      onClose();
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Editar Información</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <UserIcon size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Barrio"
                value={formData.neighborhood}
                onChangeText={(text) => handleChange('neighborhood', text)}
              />
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0A3161',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

