import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layers, Filter, Navigation, CircleAlert as AlertCircle } from 'lucide-react-native';
import MapPlaceholder from '@/components/MapPlaceholder';
import { LinearGradient } from 'expo-linear-gradient';

export default function MapScreen() {
  const [mapType, setMapType] = useState('Estándar');
  const [filterActive, setFilterActive] = useState(false);
  interface Incident {
    id: number;
    type: string;
    location: string;
    time: string;
    status: string;
  }

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Mock incidents data
  const incidents: Incident[] = [
    { id: 1, type: 'Robo', location: 'Av. Alemania 01160', time: '10:30', status: 'Reportado' },
    { id: 2, type: 'Sospechoso', location: 'Calle Manuel Montt 850', time: '11:45', status: 'En revisión' },
    { id: 3, type: 'Allanamiento', location: 'Pablo Neruda 02150', time: '12:15', status: 'Atendido' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mapa de Alertas</Text>
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.mapTypeButton}
              onPress={() => setMapType(mapType === 'Estándar' ? 'Satélite' : 'Estándar')}
            >
              <Layers size={20} color="#0A3161" />
              <Text style={styles.mapTypeText}>{mapType}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filterActive && styles.filterButtonActive]}
              onPress={() => setFilterActive(!filterActive)}
            >
              <Filter size={20} color={filterActive ? "#FFFFFF" : "#0A3161"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.mapContainer}>
          <MapPlaceholder />
          
          {/* Location button positioned over the map */}
          <TouchableOpacity style={styles.locationButton}>
            <Navigation size={24} color="#0A3161" />
          </TouchableOpacity>
          
          {/* Legend overlay */}
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E63946' }]} />
              <Text style={styles.legendText}>Emergencia</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FCA311' }]} />
              <Text style={styles.legendText}>Sospechoso</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2A9D8F' }]} />
              <Text style={styles.legendText}>Resuelto</Text>
            </View>
          </View>
        </View>
        
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={styles.gradientOverlay}
        />
        
        <View style={styles.recentIncidentsContainer}>
          <Text style={styles.recentIncidentsTitle}>Incidentes Recientes</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.incidentsScroll}
          >
            {incidents.map((incident) => (
              <TouchableOpacity 
                key={incident.id}
                style={styles.incidentCard}
                onPress={() => setSelectedIncident(incident)}
              >
                <View style={styles.incidentIconContainer}>
                  <AlertCircle size={20} color="#E63946" />
                </View>
                <Text style={styles.incidentType}>{incident.type}</Text>
                <Text style={styles.incidentLocation} numberOfLines={1}>{incident.location}</Text>
                <Text style={styles.incidentTime}>{incident.time}</Text>
                <View style={[
                  styles.incidentStatus, 
                  { backgroundColor: 
                    incident.status === 'Atendido' ? '#2A9D8F' : 
                    incident.status === 'En revisión' ? '#FCA311' : '#E63946' 
                  }
                ]}>
                  <Text style={styles.incidentStatusText}>{incident.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  mapControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mapTypeText: {
    fontSize: 14,
    color: '#0A3161',
    marginLeft: 4,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#0A3161',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  locationButton: {
    position: 'absolute',
    bottom: 140,
    right: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapLegend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#1E293B',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 10,
  },
  recentIncidentsContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    marginTop: -20,
    zIndex: 20,
  },
  recentIncidentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  incidentsScroll: {
    paddingBottom: 24,
    paddingRight: 16,
  },
  incidentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 16,
    width: 180,
  },
  incidentIconContainer: {
    marginBottom: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  incidentLocation: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  incidentTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  incidentStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  incidentStatusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});