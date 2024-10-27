// firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Ensure Firestore is imported

const firebaseConfig = {
  apiKey: "AIzaSyDRRxg9WNazMD3xgh4MOSz6er9jI5sW4Tc",
  authDomain: "gamereview-e0c54.firebaseapp.com",
  projectId: "gamereview-e0c54",
  storageBucket: "gamereview-e0c54.appspot.com",
  messagingSenderId: "79091165759",
  appId: "1:79091165759:web:7733b3d185ab4d1102a68a",
  measurementId: "G-S5PK3SY0BM"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore(); // Initialize Firestore
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
