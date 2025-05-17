// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [tienda, setTienda] = useState('');
  const [rol, setRol] = useState<'jefe_tienda' | 'empresa_inventario' | 'auditor'>('jefe_tienda');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, clave);
      router.push(`/portal/${tienda}?rol=${rol}`);
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <img src="/asm-logo.png" alt="ASM Logo" style={{ height: '60px', width: 'auto' }} />
        <img src="/fashions_park_logo.png" alt="Fashions Park Logo" style={{ height: '60px', width: 'auto' }} />
      </div>

      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>MI PORTAL DE INVENTARIO</h2>

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
          style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
        />

        <input
          placeholder="Código de Tienda"
          value={tienda}
          onChange={(e) => setTienda(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
        />

        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as 'jefe_tienda' | 'empresa_inventario' | 'auditor')}
          style={{ width: '100%', marginBottom: '16px', padding: '8px' }}
        >
          <option value="jefe_tienda">Jefe de Tienda</option>
          <option value="empresa_inventario">Empresa de Inventario</option>
          <option value="auditor">Auditor</option>
        </select>

        <button onClick={handleLogin} style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Ingresar
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}








