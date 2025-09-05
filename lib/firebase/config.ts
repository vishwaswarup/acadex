import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for Acadex project
const firebaseConfig = {
  apiKey: "AIzaSyCEeJ7WNBiyT4DqxzJ7XJck4ooYdT-TfIA",
  authDomain: "acadex-dc1a3.firebaseapp.com",
  projectId: "acadex-dc1a3",
  storageBucket: "acadex-dc1a3.appspot.com",
  messagingSenderId: "801798447070",
  appId: "1:801798447070:web:8de3bbc2f47d93d412474f",
  measurementId: "G-88PGB12NFE"
};

// Initialize Firebase app only once
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export { firebaseApp };

// Initialize Firebase services
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export default firebaseApp;