// firebase-config.js or firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ FIXED HERE
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlXyIOrX6oAgtxHDkeouuVVSh79sVwA2c",
  authDomain: "swine-care-a42e1.firebaseapp.com",
  projectId: "swine-care-a42e1",
  storageBucket: "swine-care-a42e1.firebasestorage.app",
  messagingSenderId: "452239186829",
  appId: "1:452239186829:web:b16fb1bf26d0eeef8bfbc4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);   // ✅ No longer causes error
export const auth = getAuth(app);
export default app;
