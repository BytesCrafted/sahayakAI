// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6-1LHqwQldiaGAMxT6rlP5QdVusCvN5s",
  authDomain: "sahayak-71ce4.firebaseapp.com",
  projectId: "sahayak-71ce4",
  storageBucket: "sahayak-71ce4.firebasestorage.app",
  messagingSenderId: "1013268447743",
  appId: "1:1013268447743:web:ecda80bb8c483dcf3d67ca",
  measurementId: "G-KXYWPD5CSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);