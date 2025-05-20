// firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // <- IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyD20X_UNGxA6aqjAPoYdkdiDHyC-Z8zy_c",
  authDomain: "checklist-asmcontrol.firebaseapp.com",
  projectId: "checklist-asmcontrol",
  storageBucket: "checklist-asmcontrol.appspot.com",
  messagingSenderId: "650271132075",
  appId: "1:650271132075:web:435f5d476000b59740eaee"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // <- IMPORTANTE

export { db, auth, storage }; // <- AGREGA `storage` AQUÍ





