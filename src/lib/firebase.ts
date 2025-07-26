// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore }from "firebase/firestore";

// IMPORTANT: Replace this with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyB6-1LHqwQldiaGAMxT6rlP5QdVusCvN5s",
  authDomain: "sahayak-71ce4.firebaseapp.com",
  projectId: "sahayak-71ce4",
  storageBucket: "sahayak-71ce4.appspot.com",
  messagingSenderId: "1013268447743",
  appId: "1:1013268447743:web:62c9526097d352173d67ca",
  measurementId: "G-ZS3D82J5R9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
