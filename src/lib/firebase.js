import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfig = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

export function isFirebaseConfigured() {
  return requiredConfig.every((key) => Boolean(import.meta.env[key]));
}

export function getFirebaseAuth() {
  const missing = requiredConfig.filter((key) => !import.meta.env[key]);

  if (missing.length) {
    throw new Error(
      `Firebase is not configured. Add these values to your .env file: ${missing.join(', ')}.`
    );
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export function observeAuthState(callback) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function signInWithProvider(providerName) {
  const auth = getFirebaseAuth();
  let provider;

  if (providerName === 'google') {
    provider = new GoogleAuthProvider();
  } else if (providerName === 'github') {
    provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
  } else {
    throw new Error('Unsupported sign-in provider.');
  }

  return signInWithPopup(auth, provider);
}

export function signOutCurrentUser() {
  return signOut(getFirebaseAuth());
}

export function friendlyAuthError(error) {
  const messages = {
    'auth/account-exists-with-different-credential':
      'An account with this email already uses another sign-in method. Sign in with that method first.',
    'auth/popup-closed-by-user': 'The sign-in window was closed before authentication finished.',
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups and try again.',
    'auth/unauthorized-domain':
      'This website domain is not authorized in Firebase Authentication. Add it under Authorized domains.',
    'auth/operation-not-allowed':
      'This sign-in provider is not enabled in your Firebase Authentication settings.',
    'auth/network-request-failed':
      'A network error interrupted sign-in. Check your connection and try again.',
    'auth/invalid-api-key':
      'The Firebase API key is invalid. Check your VITE_FIREBASE_API_KEY setting.',
  };

  return messages[error?.code] || error?.message || 'Sign-in failed. Please try again.';
}
