import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { TriangleAlert as AlertTriangle, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function timeAgo(timestamp: Timestamp) {
  const diff = Date.now() - timestamp.toDate().getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(5));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAlerts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const getStatusColor = (status: string) => {
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

  const renderAlertItem = ({ item }: { item: any }) => (
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
        {item.createdAt && (
          <View style={styles.detailRow}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.detailText}>Hace {timeAgo(item.createdAt)}</Text>
          </View>
        )}
      </View>
      <ChevronRight size={16} color="#64748B" />
    </TouchableOpacity>
  );

  if (loading) {
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
