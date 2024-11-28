// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDRRxg9WNazMD3xgh4MOSz6er9jI5sW4Tc",
  authDomain: "gamereview-e0c54.firebaseapp.com",
  projectId: "gamereview-e0c54",
  storageBucket: "gamereview-e0c54.appspot.com",
  messagingSenderId: "79091165759",
  appId: "1:79091165759:web:7733b3d185ab4d1102a68a",
  measurementId: "G-S5PK3SY0BM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Enable offline persistence with better configuration
try {
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    synchronizeTabs: true
  });
  console.log('Offline persistence enabled');
} catch (err) {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Multiple tabs open, persistence disabled');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Current browser doesnt support persistence');
  } else {
    console.error('Error enabling persistence:', err);
  }
}

export default app;
