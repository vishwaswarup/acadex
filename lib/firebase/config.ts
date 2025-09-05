import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read envs explicitly so Next.js can inline them in client bundles
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Only validate on the server (dynamic env access is stripped in client bundles)
if (typeof window === 'undefined') {
  const missingServer = [
    ['NEXT_PUBLIC_FIREBASE_API_KEY', apiKey],
    ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', authDomain],
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', projectId],
    ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', storageBucket],
    ['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', messagingSenderId],
    ['NEXT_PUBLIC_FIREBASE_APP_ID', appId],
  ].filter(([, v]) => !v).map(([k]) => k as string);

  if (missingServer.length > 0) {
    throw new Error(
      `Missing Firebase env vars: ${missingServer.join(', ')}. Add them to .env.local and restart the dev server.`
    );
  }
}

const firebaseConfig = {
  apiKey: apiKey as string,
  authDomain: authDomain as string,
  projectId: projectId as string,
  storageBucket: storageBucket as string,
  messagingSenderId: messagingSenderId as string,
  appId: appId as string,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebaseApp;