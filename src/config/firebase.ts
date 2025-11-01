// src/config/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPTH3_zE3Q8esxAm9HtWz7Brq8uLkUTTo",
  authDomain: "studybbudy-73439.firebaseapp.com",
  projectId: "studybbudy-73439",
  storageBucket: "studybbudy-73439.firebasestorage.app",
  messagingSenderId: "564554364065",
  appId: "1:564554364065:web:21057a8f1ea5d703c32ce0",
  measurementId: "G-36G5YXN29R",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
