// firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyD20X_UNGxA6aqjAPoYdkdiDHyC-Z8zy_c",
  authDomain: "checklist-asmcontrol.firebaseapp.com",
  projectId: "checklist-asmcontrol",
  storageBucket: "checklist-asmcontrol.appspot.com",
  messagingSenderId: "650271132075",
  appId: "1:650271132075:web:435f5d476000b59740eaae"
};

// Inicializa Firebase solo una vez
const app = initializeApp(firebaseConfig);

// Exporta Firestore y Auth para usarlos en tu app
export const db = getFirestore(app);
export const auth = getAuth(app);


