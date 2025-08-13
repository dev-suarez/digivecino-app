import Constants from 'expo-constants';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const cfg = (Constants.expoConfig?.extra as any)?.firebase;
const app = getApps().length ? getApps()[0] : initializeApp(cfg);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
