import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, correo, clave);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('Tu cuenta no tiene datos asignados. Contacta al administrador.');
        return;
      }

      const { rol, tienda } = docSnap.data();

      if (!rol || !tienda) {
        setError('Tu cuenta no tiene rol o tienda asignada.');
        return;
      }

      // Redirige usando el código de tienda exacto que necesitas en checklist
      router.push(`/portal/${tienda}?rol=${rol}`);
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '800px', marginBottom: '1rem', padding: '0 2rem' }}>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <img src="/asm-logo.png" alt="ASM Logo" style={{ height: '50px', objectFit: 'contain' }} />
          <img src="/fashions_park_logo.png" alt="Fashion Park Logo" style={{ height: '50px', objectFit: 'contain' }} />
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>MI PORTAL DE INVENTARIO</h2>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
        />

        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Ingresar
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}











