// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔹 Firestore
import { getStorage } from "firebase/storage";     // 🔹 Storage (para imágenes)

const firebaseConfig = {
  apiKey: "AIzaSyD20X_UNGxA6aqjAPoYdkdiDHyC-Z8zy_c",
  authDomain: "checklist-asmcontrol.firebaseapp.com",
  projectId: "checklist-asmcontrol",
  storageBucket: "checklist-asmcontrol.appspot.com",
  messagingSenderId: "650271132075",
  appId: "1:650271132075:web:435f5d476000b59740eaee"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);     // ✅ para usar collection(db, 'nombre')
export const storage = getStorage(app);  // ✅ para subir imágenes














