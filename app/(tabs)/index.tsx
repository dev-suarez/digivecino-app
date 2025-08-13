import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Shield, Bell, MessageSquare, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import PanicButton from '@/components/PanicButton';
import NeighborhoodStats from '@/components/NeighborhoodStats';
import RecentAlerts from '@/components/RecentAlerts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function HomeScreen() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsub = onSnapshot(doc(db, 'users', uid), snap => {
      setProfile(snap.data());
    });
    return unsub;
  }, []);

  const userName = profile?.name ?? 'Vecino';
  const neighborhood = profile?.neighborhood ?? 'Sector Amanecer';
  const alertLevel = profile?.alertLevel ?? 'Moderado';

  const handlePanicButtonPress = () => {
    if (Platform.OS !== 'web') {
      // On native platforms, implement haptic feedback if desired
    }

    Alert.alert(
      '¿Activar Alerta de Emergencia?',
      'Esto notificará a todos los vecinos y autoridades de tu ubicación.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'ACTIVAR ALERTA',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Alerta Activada', 'Las autoridades han sido notificadas y están en camino.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Shield size={24} color="#0A3161" />
          <Text style={styles.headerTitle}>VigiVecino</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hola, {userName}</Text>
          <Text style={styles.neighborhoodText}>{neighborhood}</Text>
          <View style={styles.alertLevelContainer}>
            <Text style={styles.alertLevelLabel}>Nivel de Alerta:</Text>
            <View style={[styles.alertLevelBadge, { backgroundColor: alertLevel === 'Alto' ? '#E63946' : '#FCA311' }] }>
              <Text style={styles.alertLevelText}>{alertLevel}</Text>
            </View>
          </View>
        </View>

        <PanicButton onPress={handlePanicButtonPress} />

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={24} color="#0A3161" />
            <Text style={styles.actionText}>Notificar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={24} color="#0A3161" />
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <AlertTriangle size={24} color="#0A3161" />
            <Text style={styles.actionText}>Reportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <CheckCircle size={24} color="#0A3161" />
            <Text style={styles.actionText}>Verificar</Text>
          </TouchableOpacity>
        </View>

        <NeighborhoodStats />

        <RecentAlerts />
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
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3161',
    marginLeft: 8,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  neighborhoodText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  alertLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertLevelLabel: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  alertLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  alertLevelText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minWidth: 72,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
});
