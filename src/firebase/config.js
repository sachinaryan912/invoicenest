// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA9FD2MDZaz2efQhhVU0GX7etzdcRso230",
  authDomain: "invoice-generator-3da95.firebaseapp.com",
  projectId: "invoice-generator-3da95",
  storageBucket: "invoice-generator-3da95.appspot.com",
  messagingSenderId: "1096213265167",
  appId: "1:1096213265167:web:1f221e70c9c9999faa9c7a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
