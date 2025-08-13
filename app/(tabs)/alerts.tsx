import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, TriangleAlert as AlertTriangle, Eye, Clock, Info, Filter } from 'lucide-react-native';

// Mock data for alerts
type AlertType = 'Emergencia' | 'Sospecha' | 'Información';
type AlertStatus = 'activa' | 'verificando' | 'resuelta';
interface Alert {
  id: string;
  type: AlertType;
  title: string;
  location: string;
  time: string;
  status: AlertStatus;
  description: string;
}

const ALERTS_DATA: Alert[] = [
  {
    id: '1',
    type: 'Emergencia',
    title: 'Robo en proceso',
    location: 'Av. Alemania 01160',
    time: '15 min',
    status: 'activa',
    description:
      'Se reporta un robo en proceso en vivienda. Dos individuos con vestimenta oscura.',
  },
  {
    id: '2',
    type: 'Sospecha',
    title: 'Persona sospechosa',
    location: 'Calle Manuel Montt 850',
    time: '32 min',
    status: 'verificando',
    description: 'Individuo merodeando y observando casas de la cuadra.',
  },
  {
    id: '3',
    type: 'Información',
    title: 'Corte de energía',
    location: 'Sector Amanecer',
    time: '1h',
    status: 'resuelta',
    description: 'Corte programado por CGE desde 14:00 a 18:00 hrs.',
  },
  {
    id: '4',
    type: 'Emergencia',
    title: 'Intento de allanamiento',
    location: 'Pablo Neruda 02150',
    time: '2h',
    status: 'resuelta',
    description:
      'Vecinos reportaron intento de forzar cerradura. Carabineros atendió el llamado.',
  },
  {
    id: '5',
    type: 'Sospecha',
    title: 'Vehículo desconocido',
    location: 'Av. Recabarren 01745',
    time: '4h',
    status: 'resuelta',
    description:
      'Automóvil blanco estacionado por más de 3 horas con ocupantes en su interior.',
  },
];

export default function AlertsScreen() {
  const [filters, setFilters] = useState<{
    showEmergencies: boolean;
    showSuspicious: boolean;
    showInformation: boolean;
    onlyActive: boolean;
  }>({
    showEmergencies: true,
    showSuspicious: true,
    showInformation: true,
    onlyActive: false,
  });
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAlerts = ALERTS_DATA.filter((alert: Alert) => {
    if (filters.onlyActive && alert.status === 'resuelta') return false;
    if (!filters.showEmergencies && alert.type === 'Emergencia') return false;
    if (!filters.showSuspicious && alert.type === 'Sospecha') return false;
    if (!filters.showInformation && alert.type === 'Información') return false;
    return true;
  });

  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'Emergencia':
        return <AlertTriangle size={20} color="#E63946" />;
      case 'Sospecha':
        return <Eye size={20} color="#FCA311" />;
      case 'Información':
        return <Info size={20} color="#2A9D8F" />;
      default:
        return <Bell size={20} color="#0A3161" />;
    }
  };

  const getStatusColor = (status: AlertStatus) => {
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

  const renderAlertItem = ({ item }: { item: Alert }) => (
    <TouchableOpacity 
      style={styles.alertCard}
      onPress={() => setExpandedAlert(expandedAlert === item.id ? null : item.id)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTypeContainer}>
          {getAlertIcon(item.type)}
          <Text style={[styles.alertType, { 
            color: item.type === 'Emergencia' ? '#E63946' : 
                   item.type === 'Sospecha' ? '#FCA311' : '#2A9D8F'
          }]}>
            {item.type}
          </Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      
      <Text style={styles.alertTitle}>{item.title}</Text>
      
      <View style={styles.alertDetails}>
        <Text style={styles.alertLocation} numberOfLines={1}>{item.location}</Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.alertTime}>{item.time}</Text>
        </View>
      </View>
      
      {expandedAlert === item.id && (
        <View style={styles.expandedContent}>
          <Text style={styles.descriptionLabel}>Descripción:</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Reportar Actualización</Text>
            </TouchableOpacity>
            {item.status !== 'resuelta' && (
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Text style={styles.secondaryButtonText}>Marcar como Resuelta</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Alertas de Seguridad</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#0A3161" />
          </TouchableOpacity>
        </View>
        
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Emergencias</Text>
              <Switch
                value={filters.showEmergencies}
                onValueChange={() => toggleFilter('showEmergencies')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor={filters.showEmergencies ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Sospechas</Text>
              <Switch
                value={filters.showSuspicious}
                onValueChange={() => toggleFilter('showSuspicious')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor={filters.showSuspicious ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Información</Text>
              <Switch
                value={filters.showInformation}
                onValueChange={() => toggleFilter('showInformation')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor={filters.showInformation ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Solo alertas activas</Text>
              <Switch
                value={filters.onlyActive}
                onValueChange={() => toggleFilter('onlyActive')}
                trackColor={{ false: '#E2E8F0', true: '#0A3161' }}
                thumbColor={filters.onlyActive ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        )}
        
        <FlatList
          data={filteredAlerts}
          renderItem={renderAlertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.alertsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>No hay alertas que coincidan con tus filtros</Text>
            </View>
          }
        />
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  alertsList: {
    padding: 16,
    paddingTop: 0,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  alertDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLocation: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#0A3161',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0A3161',
  },
  secondaryButtonText: {
    color: '#0A3161',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});