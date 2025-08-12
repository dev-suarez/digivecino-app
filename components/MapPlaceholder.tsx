import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';

export default function MapPlaceholder() {
  const [loading, setLoading] = useState(true);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <MapPin size={36} color="#0A3161" />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      ) : (
        <>
          {/* This would be a real map implementation in a production app */}
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          
          {/* Simulate pins on the map */}
          <View style={[styles.pin, { top: '30%', left: '40%', backgroundColor: '#E63946' }]}>
            <MapPin size={14} color="#FFFFFF" />
          </View>
          <View style={[styles.pin, { top: '45%', left: '65%', backgroundColor: '#FCA311' }]}>
            <MapPin size={14} color="#FFFFFF" />
          </View>
          <View style={[styles.pin, { top: '60%', left: '25%', backgroundColor: '#2A9D8F' }]}>
            <MapPin size={14} color="#FFFFFF" />
          </View>
          
          {/* User location pin */}
          <View style={styles.userLocationPin}>
            <View style={styles.userPinDot} />
            <View style={styles.userPinRipple} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  userLocationPin: {
    position: 'absolute',
    bottom: '25%',
    right: '45%',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0A3161',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  userPinRipple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 49, 97, 0.2)',
    ...Platform.select({
      web: {
        animationKeyframes: {
          '0%': {
            transform: [{scale: 0.5}],
            opacity: 1,
          },
          '100%': {
            transform: [{scale: 1.5}],
            opacity: 0,
          },
        },
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-out',
      },
    }),
  },
});