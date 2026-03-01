
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  sendEmailVerification
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeolJOwLatoYszcPYJ3bXq9J9sKJAMsYo",
  authDomain: "techtales-labs.firebaseapp.com",
  projectId: "techtales-labs",
  storageBucket: "techtales-labs.firebasestorage.app",
  messagingSenderId: "103699066243",
  appId: "1:103699066243:web:64b91cb66c9cba02729ab6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  googleProvider,
  sendEmailVerification
};

export type { User };

