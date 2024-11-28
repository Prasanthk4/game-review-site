import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRRxg9WNazMD3xgh4MOSz6er9jI5sW4Tc",
  authDomain: "gamereview-e0c54.firebaseapp.com",
  projectId: "gamereview-e0c54",
  storageBucket: "gamereview-e0c54.firebasestorage.app",
  messagingSenderId: "79091165759",
  appId: "1:79091165759:web:e58b099053f9aae202a68a",
  measurementId: "G-B9ZC19R1YX"
};

// Initialize Firebase only if it hasn't been initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
