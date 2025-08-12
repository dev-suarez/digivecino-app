import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { TriangleAlert as AlertTriangle, MapPin, Clock, ChevronRight } from 'lucide-react-native';

type RecentAlertsProps = {
  isLoading: boolean;
};

export default function RecentAlerts({ isLoading }: RecentAlertsProps) {
  // Mock data for recent alerts
  const alerts = [
    {
      id: '1',
      type: 'Robo',
      location: 'Av. Alemania 01160',
      time: '15 min',
      status: 'activa',
    },
    {
      id: '2',
      type: 'Sospechoso',
      location: 'Calle Manuel Montt 850',
      time: '32 min',
      status: 'verificando',
    },
    {
      id: '3',
      type: 'Allanamiento',
      location: 'Pablo Neruda 02150',
      time: '2h',
      status: 'resuelta',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'activa':
        return '#E63946';
      case 'verificando':
        return '#FCA311';
      case 'resuelta':
        return '#2A9D8F';
      default:
        return '#64748B';
    }
  };

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity style={styles.alertItem}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTypeContainer}>
          <AlertTriangle size={16} color="#E63946" />
          <Text style={styles.alertType}>{item.type}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      <View style={styles.alertDetails}>
        <View style={styles.detailRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.detailText}>Hace {item.time}</Text>
        </View>
      </View>
      <ChevronRight size={16} color="#64748B" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Alertas Recientes</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A3161" />
          <Text style={styles.loadingText}>Cargando alertas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Alertas Recientes</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Ver Todas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={alerts}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  viewAllText: {
    fontSize: 14,
    color: '#0A3161',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTypeContainer: {
    alignItems: 'center',
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  alertDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
});