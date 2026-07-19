import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"AIzaSyDKw2h7WW7RaGNzx9dlzpZQWlJQddxIL1w",
  authDomain: "meelad-2026.firebaseapp.com",
  projectId: "meelad-2026",
  storageBucket: "meelad-2026.firebasestorage.app",
  messagingSenderId: "1080203913108",
  appId: "1:1080203913108:web:9104beaed9d04132bf9181"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };