// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX1DLrZ6jfDyW8pw9j8yl8mUDIHqTeNk4",
  authDomain: "prepwise-3b045.firebaseapp.com",
  projectId: "prepwise-3b045",
  storageBucket: "prepwise-3b045.firebasestorage.app",
  messagingSenderId: "39614282025",
  appId: "1:39614282025:web:4fc051b1cf733c9b2e5f38",
  measurementId: "G-QXTFRSM3XS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
