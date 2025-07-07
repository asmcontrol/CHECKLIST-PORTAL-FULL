'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function AdminLoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, correo, clave);
      const uid = cred.user.uid;

      const ref = doc(db, 'usuarios', uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().rol === 'admin') {
        router.push('/admin');
      } else {
        setError('⚠️ No tienes permisos para acceder al Portal Administrativo.');
      }
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Ingreso Portal Administrativo</h2>

      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <input
          type="email"
          placeholder="Correo de administrador"
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

        <button onClick={handleAdminLogin} style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#1e40af',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Ingresar al Portal
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}
