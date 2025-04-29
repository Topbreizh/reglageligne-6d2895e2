
// Initialisation de l'app Firebase selon la config partagée

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDykuIJIg-Jy34pKQ5LMMr6QmNzDx-F_Fo",
  authDomain: "reglage-ligne.firebaseapp.com",
  projectId: "reglage-ligne",
  storageBucket: "reglage-ligne.appspot.com",
  messagingSenderId: "1004760071799",
  appId: "1:1004760071799:web:69a60325a3aedcfd50d072",
  measurementId: "G-J56W4XV9XK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
