import Constants from 'expo-constants';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cfg = (Constants.expoConfig?.extra as any)?.firebase;
const app = getApps().length ? getApps()[0] : initializeApp(cfg);

export const auth = getApps().length
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
export const db = getFirestore(app);
export const storage = getStorage(app);
