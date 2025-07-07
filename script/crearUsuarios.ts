// ✅ Carga segura de variables de entorno desde .env
import dotenv from 'dotenv';
dotenv.config();

// Verificación de carga
console.log('✅ API KEY cargada:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// Firebase SDK
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc
} from 'firebase/firestore';

// Configuración Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const crearUsuarios = async () => {
  console.log('\n⏳ Cargando documentos de tiendas desde la colección "checklists"...');

  const snapshot = await getDocs(collection(db, 'checklists'));

  for (const documento of snapshot.docs) {
    const datos = documento.data();
    const correo = datos?.tiendaInfo?.CORREO?.trim();
    const codigoTienda = datos?.tiendaInfo?.['CÓDIGO DE TIENDA']?.trim();
    const rol = datos?.tiendaInfo?.ROL?.toLowerCase().replace(/\s/g, '_') || 'jefe_tienda';

    if (!correo || !codigoTienda) {
      console.warn(`⚠️ Datos faltantes en el documento ${documento.id}`);
      continue;
    }

    const claveTemporal = `${codigoTienda}Inventario2025`;

    try {
      const existe = await fetchSignInMethodsForEmail(auth, correo);
      if (existe.length > 0) {
        console.log(`👤 Usuario ya existe: ${correo}`);
        continue;
      }

      const cred = await createUserWithEmailAndPassword(auth, correo, claveTemporal);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        email: correo,
        rol,
        tienda: codigoTienda
      });

      console.log(`✅ Usuario creado: ${correo} | Rol: ${rol} | Contraseña temporal: ${claveTemporal}`);
    } catch (error: any) {
      console.error(`❌ Error creando usuario ${correo}:`, error.message);
    }
  }

  console.log('\n🎉 ✅ Proceso finalizado: todos los usuarios han sido procesados.\n');
};

crearUsuarios();





