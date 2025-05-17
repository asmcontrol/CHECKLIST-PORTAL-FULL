import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

export default function Login() {
  const router = useRouter();
  const [tienda, setTienda] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('tienda'); // Valor por defecto
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!tienda || !rol) {
      setError('Debes completar todos los campos');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/portal/${tienda}?rol=${rol}`);
    } catch (err: any) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingTop: '4rem' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/asm-logo.png" alt="ASM Control" style={{ width: '200px', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Inicio de Sesión</h1>
      </div>

      <div style={{
        background: 'white',
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <label>Tienda:</label>
        <input
          type="text"
          value={tienda}
          onChange={(e) => setTienda(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <label>Correo:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        <label>Rol:</label>
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        >
          <option value="tienda">Tienda</option>
          <option value="proveedor">Proveedor</option>
          <option value="auditor">Auditor</option>
        </select>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
}




