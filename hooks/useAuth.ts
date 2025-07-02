// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig'; // ✅ ruta actualizada

interface UsuarioConRol {
  uid: string;
  email: string | null;
  rol: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UsuarioConRol | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, 'usuarios', firebaseUser.uid);
          const snap = await getDoc(ref);
          const rol = snap.exists() ? snap.data().rol : 'sin-rol';

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            rol,
          });
        } catch (error) {
          console.error('Error obteniendo rol:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user };
};
