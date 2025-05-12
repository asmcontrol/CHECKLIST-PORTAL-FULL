import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function VerificarAdmin() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || '';

        if (email === 'rvidela@asmcontrol.cl') {
          // ✅ Redirige al portal como admin
          router.push(`/portal/${email}?tienda=admin&rol=admin`);
        } else {
          // ❌ Otros usuarios no autorizados
          alert('Tu cuenta no tiene acceso directo. Espera aprobación.');
          auth.signOut();
        }
      } else {
        // No hay usuario logueado
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return <p>Verificando acceso como administrador...</p>;
}
