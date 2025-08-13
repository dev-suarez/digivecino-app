import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: email.split('@')[0],
          neighborhood: 'Barrio Central',
          alertLevel: 'Moderado',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={isRegister ? 'Registrarse' : 'Ingresar'} onPress={handleAuth} />
      <Text style={styles.toggle} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center', color: '#0A3161', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#FFFFFF' },
  toggle: { marginTop: 16, color: '#0A3161', textAlign: 'center' },
});
