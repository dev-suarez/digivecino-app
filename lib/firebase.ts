// Firebase configuration and initialization
// This file will contain Firebase setup once you add the Firebase SDK

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Placeholder for Firebase config - replace with your actual config
export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDrqAmVPe13I3QFOEj7X1WsXGuUvW7nH-Y",
  authDomain: "vigivecino.firebaseapp.com",
  projectId: "vigivecino",
  storageBucket: "vigivecino.firebasestorage.app",
  messagingSenderId: "857423133454",
  appId: "1:857423133454:web:553b9c94c0591f5b87355f",
  measurementId: "G-R97LXWDG9Q"
};

// Firebase app initialization will go here
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);