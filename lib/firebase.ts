import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0Ck29AAzuW6A_dt7c48Dm4Q3mEdAuUBk",
  authDomain: "penjaga-langit-17882.firebaseapp.com",
  projectId: "penjaga-langit-17882",
  storageBucket: "penjaga-langit-17882.firebasestorage.app",
  messagingSenderId: "171862228227",
  appId: "1:171862228227:web:19f806807ffbb34b047d36",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
