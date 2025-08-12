import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Settings, Shield, MapPin, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: 'Carmen Sánchez',
    email: 'carmen.sanchez@gmail.com',
    phone: '+56 9 1234 5678',
    address: 'Av. Alemania 01160, Temuco',
    neighborhood: 'Sector Amanecer',
    role: 'Vecino Validado',
    memberSince: 'Mayo 2023',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emergencyAlerts: true,
    suspiciousActivity: true,
    neighborhoodChat: true,
    cameraAlerts: false,
    soundAlerts: true,
    vibrationAlerts: true,
    nightModeFrom: '23:00',
    nightModeTo: '07:00',
    nightModeEnabled: true,
  });
  
  const toggleSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => console.log('Logout pressed') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage}
              />
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.memberSince}>Miembro desde {user.memberSince}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User size={18} color="#64748B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Bell size={18} color="#64748B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Bell size={18} color="#64748B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={18} color="#64748B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue}>{user.address}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={18} color="#64748B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Barrio</Text>
                <Text style={styles.infoValue}>{user.neighborhood}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Información</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Alertas de Emergencia</Text>
                <Text style={styles.settingDescription}>Recibir alertas de pánico y emergencias</Text>
              </View>
              <Switch
                value={notificationSettings.emergencyAlerts}
                onValueChange={() => toggleSetting('emergencyAlerts')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Actividad Sospechosa</Text>
                <Text style={styles.settingDescription}>Notificaciones sobre actividades sospechosas</Text>
              </View>
              <Switch
                value={notificationSettings.suspiciousActivity}
                onValueChange={() => toggleSetting('suspiciousActivity')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Chat Vecinal</Text>
                <Text style={styles.settingDescription}>Mensajes de los chats grupales</Text>
              </View>
              <Switch
                value={notificationSettings.neighborhoodChat}
                onValueChange={() => toggleSetting('neighborhoodChat')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Alertas de Cámaras</Text>
                <Text style={styles.settingDescription}>Movimientos detectados en cámaras</Text>
              </View>
              <Switch
                value={notificationSettings.cameraAlerts}
                onValueChange={() => toggleSetting('cameraAlerts')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Sonido en Alertas</Text>
                <Text style={styles.settingDescription}>Reproduce sonido con las notificaciones</Text>
              </View>
              <Switch
                value={notificationSettings.soundAlerts}
                onValueChange={() => toggleSetting('soundAlerts')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Modo Noche</Text>
                <Text style={styles.settingDescription}>Solo notificaciones de emergencia entre {notificationSettings.nightModeFrom} y {notificationSettings.nightModeTo}</Text>
              </View>
              <Switch
                value={notificationSettings.nightModeEnabled}
                onValueChange={() => toggleSetting('nightModeEnabled')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#0A3161" />
            <Text style={styles.settingsButtonText}>Configuración</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#E63946" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footerVersion}>
          <Text style={styles.versionText}>VigiVecino v1.0.0</Text>
        </View>
      </ScrollView>
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
  },
  header: {
    backgroundColor: '#0A3161',
    paddingVertical: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2A9D8F',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#94A3B8',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
  },
  editButton: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0A3161',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0A3161',
    fontWeight: '600',
    fontSize: 14,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtonsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0A3161',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  settingsButtonText: {
    color: '#0A3161',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E63946',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  logoutButtonText: {
    color: '#E63946',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  footerVersion: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});