import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Maximize, Play, Grid2x2 as Grid, List, RotateCcw, Wifi } from 'lucide-react-native';

// Sample camera data
const CAMERAS_DATA = [
  {
    id: '1',
    name: 'Cámara Entrada Principal',
    location: 'Av. Alemania 01160',
    preview: 'https://images.pexels.com/photos/668297/pexels-photo-668297.jpeg',
    isLive: true,
    isPublic: true,
  },
  {
    id: '2',
    name: 'Cámara Esquina Manuel Montt',
    location: 'Calle Manuel Montt 850',
    preview: 'https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg',
    isLive: true,
    isPublic: true,
  },
  {
    id: '3',
    name: 'Cámara Plaza Sector',
    location: 'Pablo Neruda 02150',
    preview: 'https://images.pexels.com/photos/109919/pexels-photo-109919.jpeg',
    isLive: false,
    isPublic: true,
  },
  {
    id: '4',
    name: 'Cámara Interna Condominio',
    location: 'Av. Recabarren 01745',
    preview: 'https://images.pexels.com/photos/3309268/pexels-photo-3309268.jpeg',
    isLive: true,
    isPublic: false,
  },
];

export default function CamerasScreen() {
  const [selectedCamera, setSelectedCamera] = useState(CAMERAS_DATA[0]);
  const [gridView, setGridView] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
    setIsFullscreen(false);
  };

  const renderCameraItem = ({ item }) => (
    <TouchableOpacity
      style={[
        gridView ? styles.gridItem : styles.listItem,
        selectedCamera.id === item.id && styles.selectedCamera,
      ]}
      onPress={() => handleCameraSelect(item)}
    >
      <Image
        source={{ uri: item.preview }}
        style={gridView ? styles.gridItemImage : styles.listItemImage}
        resizeMode="cover"
      />
      <View 
        style={[
          gridView ? styles.gridItemOverlay : styles.listItemContent,
          !item.isLive && styles.offlineOverlay
        ]}
      >
        {!gridView && (
          <View style={styles.listItemTextContainer}>
            <Text style={styles.cameraName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cameraLocation} numberOfLines={1}>{item.location}</Text>
          </View>
        )}
        {item.isLive ? (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>EN VIVO</Text>
          </View>
        ) : (
          <View style={styles.offlineIndicator}>
            <RotateCcw size={14} color="#FFFFFF" />
            <Text style={styles.offlineText}>OFFLINE</Text>
          </View>
        )}
        {!item.isPublic && (
          <View style={styles.privateIndicator}>
            <Text style={styles.privateText}>PRIVADA</Text>
          </View>
        )}
      </View>
      {gridView && (
        <Text style={styles.gridItemText} numberOfLines={1}>{item.name}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cámaras de Seguridad</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewToggleButton, gridView && styles.activeViewToggle]}
              onPress={() => setGridView(true)}
            >
              <Grid size={20} color={gridView ? '#0A3161' : '#64748B'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleButton, !gridView && styles.activeViewToggle]}
              onPress={() => setGridView(false)}
            >
              <List size={20} color={!gridView ? '#0A3161' : '#64748B'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.mainCameraContainer, isFullscreen && styles.fullscreenContainer]}>
          <Image
            source={{ uri: selectedCamera.preview }}
            style={styles.mainCameraImage}
            resizeMode="cover"
          />
          <View style={styles.mainCameraOverlay}>
            <View style={styles.mainCameraHeader}>
              <View>
                <Text style={styles.mainCameraName}>{selectedCamera.name}</Text>
                <Text style={styles.mainCameraLocation}>{selectedCamera.location}</Text>
              </View>
              <TouchableOpacity 
                style={styles.fullscreenButton}
                onPress={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {selectedCamera.isLive ? (
              <View style={styles.mainLiveIndicator}>
                <View style={styles.mainLiveDot} />
                <Text style={styles.mainLiveText}>EN VIVO</Text>
              </View>
            ) : (
              <View style={styles.mainOfflineIndicator}>
                <Wifi size={20} color="#FFFFFF" strokeWidth={1.5} />
                <Text style={styles.mainOfflineText}>
                  Cámara sin conexión
                </Text>
                <TouchableOpacity style={styles.retryButton}>
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedCamera.isLive && (
              <TouchableOpacity style={styles.playButton}>
                <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!isFullscreen && (
          <View style={styles.cameraListContainer}>
            <Text style={styles.cameraListTitle}>
              {gridView ? 'Todas las cámaras' : 'Lista de cámaras'}
            </Text>
            <FlatList
              data={CAMERAS_DATA}
              renderItem={renderCameraItem}
              keyExtractor={(item) => item.id}
              numColumns={gridView ? 2 : 1}
              key={gridView ? 'grid' : 'list'}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cameraList}
              columnWrapperStyle={gridView ? styles.gridRow : null}
            />
          </View>
        )}
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  viewToggleButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  activeViewToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mainCameraContainer: {
    height: 240,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  fullscreenContainer: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
  mainCameraImage: {
    width: '100%',
    height: '100%',
  },
  mainCameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 16,
  },
  mainCameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainCameraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainCameraLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  fullscreenButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  mainLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mainLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E63946',
    marginRight: 6,
  },
  mainLiveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainOfflineIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  mainOfflineText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0A3161',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cameraListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  cameraList: {
    paddingBottom: 16,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCamera: {
    borderWidth: 2,
    borderColor: '#0A3161',
  },
  gridItemImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E2E8F0',
  },
  gridItemOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  offlineOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemText: {
    fontSize: 12,
    color: '#1E293B',
    padding: 8,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemImage: {
    width: 100,
    height: 70,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  listItemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  cameraName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  cameraLocation: {
    fontSize: 12,
    color: '#64748B',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E63946',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  privateIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privateText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});