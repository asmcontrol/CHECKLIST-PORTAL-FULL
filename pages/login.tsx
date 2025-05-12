import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function LoginPage() {
  const [tienda, setTienda] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [rol, setRol] = useState('tienda');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tienda || !email || !pass || !rol) {
      setError('Completa todos los campos');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push(`/portal/${rol}?rol=${rol}&tienda=${tienda}`);
    } catch (err: any) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <img src="/asm-logo.png" alt="Logo ASM" style={styles.logo} />
        <h2 style={styles.title}>Inicio de Sesión</h2>

        <label style={styles.label}>Tienda:</label>
        <input
          type="text"
          value={tienda}
          onChange={(e) => setTienda(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Usuario:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Rol:</label>
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
          style={styles.input}
        >
          <option value="tienda">Tienda</option>
          <option value="proveedor">Proveedor</option>
          <option value="auditor">Auditor</option>
          <option value="admin">Administrador</option> {/* ✅ agregado */}
        </select>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  logo: {
    display: 'block',
    margin: '0 auto 1.5rem',
    height: '60px',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#2563eb',
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: 'bold',
    marginTop: '1rem',
    display: 'block',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginTop: '0.3rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
};



