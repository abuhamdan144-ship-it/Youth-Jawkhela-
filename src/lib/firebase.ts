import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrKi0GQCv-KgdMaQ4Pa5M3VskHpOrfvGU",
  authDomain: "zwanan-jawkhel.firebaseapp.com",
  projectId: "zwanan-jawkhel",
  storageBucket: "zwanan-jawkhel.firebasestorage.app",
  messagingSenderId: "83494766145",
  appId: "1:83494766145:web:9b3070d3a83c31f7d368c0",
  measurementId: "G-G81BT122GP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
