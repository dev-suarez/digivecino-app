import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

type PanicButtonProps = {
  onPress: () => void;
};

export default function PanicButton({ onPress }: PanicButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.panicButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <AlertTriangle size={32} color="#FFFFFF" />
          <Text style={styles.buttonText}>ALERTA DE EMERGENCIA</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.helpText}>Presiona en caso de emergencia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  panicButton: {
    backgroundColor: '#E63946',
    width: '100%',
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
          transform: 'scale(1.02)',
        },
        ':active': {
          transform: 'scale(0.98)',
        },
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  helpText: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748B',
  },
});