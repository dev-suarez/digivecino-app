import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Shield } from 'lucide-react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function NeighborhoodStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'stats', 'summary'), snap => {
      setStats(snap.data());
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Estadísticas del Barrio</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A3161" />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </View>
    );
  }

  if (!stats) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Estadísticas del Barrio</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <AlertTriangle size={20} color="#E63946" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statCount}>{stats.incidents.count}</Text>
            <Text style={styles.statLabel}>Incidentes</Text>
            <View style={styles.statChange}>
              {stats.incidents.change < 0 ? (
                <TrendingDown size={14} color="#2A9D8F" />
              ) : (
                <TrendingUp size={14} color="#E63946" />
              )}
              <Text style={[
                styles.statChangeText,
                stats.incidents.change < 0 ? styles.statPositive : styles.statNegative
              ]}>
                {Math.abs(stats.incidents.change)}%
              </Text>
            </View>
            <Text style={styles.statPeriod}>{stats.incidents.period}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <AlertTriangle size={20} color="#FCA311" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statCount}>{stats.alerts.count}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
            <View style={styles.statChange}>
              {stats.alerts.change < 0 ? (
                <TrendingDown size={14} color="#2A9D8F" />
              ) : (
                <TrendingUp size={14} color="#E63946" />
              )}
              <Text style={[
                styles.statChangeText,
                stats.alerts.change < 0 ? styles.statPositive : styles.statNegative
              ]}>
                {Math.abs(stats.alerts.change)}%
              </Text>
            </View>
            <Text style={styles.statPeriod}>{stats.alerts.period}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Shield size={20} color="#0A3161" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statCount}>{stats.response.time}</Text>
            <Text style={styles.statLabel}>Respuesta</Text>
            <View style={styles.statChange}>
              {stats.response.change < 0 ? (
                <TrendingDown size={14} color="#2A9D8F" />
              ) : (
                <TrendingUp size={14} color="#E63946" />
              )}
              <Text style={[
                styles.statChangeText,
                stats.response.change < 0 ? styles.statPositive : styles.statNegative
              ]}>
                {Math.abs(stats.response.change)}%
              </Text>
            </View>
            <Text style={styles.statPeriod}>{stats.response.period}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Shield size={20} color="#2A9D8F" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statCount}>{stats.patrols.count}</Text>
            <Text style={styles.statLabel}>Patrullas</Text>
            <View style={styles.statChange}>
              {stats.patrols.change < 0 ? (
                <TrendingDown size={14} color="#2A9D8F" />
              ) : (
                <TrendingUp size={14} color="#2A9D8F" />
              )}
              <Text style={[styles.statChangeText, styles.statPositive]}>
                {Math.abs(stats.patrols.change)}%
              </Text>
            </View>
            <Text style={styles.statPeriod}>{stats.patrols.period}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  statPositive: {
    color: '#2A9D8F',
  },
  statNegative: {
    color: '#E63946',
  },
  statPeriod: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
