import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRRxg9WNazMD3xgh4MOSz6er9jI5sW4Tc",
  authDomain: "gamereview-e0c54.firebaseapp.com",
  projectId: "gamereview-e0c54",
  storageBucket: "gamereview-e0c54.firebasestorage.app",
  messagingSenderId: "79091165759",
  appId: "1:79091165759:web:050c532c8da1c20302a68a",
  measurementId: "G-W7HXQWLEMW"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get Auth instance
const auth = getAuth(app);

// Get Firestore instance
const db = getFirestore(app);

// Initialize Analytics
const analytics = getAnalytics(app);

export { auth, db, analytics };
