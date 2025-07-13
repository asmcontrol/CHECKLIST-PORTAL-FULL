// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración directa de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD20X_UNGxA6aqjAPoYdkdiDHyC-Z8zy_c",
  authDomain: "checklist-asmcontrol.firebaseapp.com",
  projectId: "checklist-asmcontrol",
  storageBucket: "checklist-inventario-fotos", // ✅ NUEVO BUCKET PERSONALIZADO
  messagingSenderId: "650271132075",
  appId: "1:650271132075:web:435f5d476000b59740eaee"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Verificación de conexión
console.log("🔐 Firebase conectado al proyecto: checklist-asmcontrol");

// Exporta los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
















