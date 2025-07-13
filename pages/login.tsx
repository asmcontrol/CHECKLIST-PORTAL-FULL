'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('jefe_tienda');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/portal/demo-tienda?rol=${rol}`);
    } catch (err: any) {
      setError('❌ Credenciales inválidas o error en la autenticación');
      console.error(err);
    }
  };

  const entrarComoDemo = (rolDemo: string) => {
    router.push(`/portal/demo-tienda?rol=${rolDemo}`);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '2rem',
      border: '1px solid #ccc',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2>🔐 Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '10px' }}
      />

      <select
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '15px' }}
      >
        <option value="jefe_tienda">Jefe de Tienda</option>
        <option value="empresa_inventario">Empresa Inventario</option>
        <option value="auditor">Auditor</option>
      </select>

      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '0.6rem',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Iniciar sesión
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <hr style={{ margin: '20px 0' }} />

      <h3>🚀 Acceso Rápido DEMO</h3>
      <button onClick={() => entrarComoDemo('jefe_tienda')} style={demoBtn}>Entrar como Jefe de Tienda</button>
      <button onClick={() => entrarComoDemo('empresa_inventario')} style={demoBtn}>Entrar como Empresa Inventario</button>
      <button onClick={() => entrarComoDemo('auditor')} style={demoBtn}>Entrar como Auditor</button>
    </div>
  );
}

const demoBtn = {
  width: '100%',
  padding: '0.6rem',
  margin: '5px 0',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold' as const
};

































