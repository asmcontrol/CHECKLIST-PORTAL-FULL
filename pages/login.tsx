// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

export default function LoginPage() {
  const [tienda, setTienda] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('tienda');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simula login exitoso (aquí puedes agregar lógica de autenticación si lo deseas)
    const ruta = `/portal/${rol}?rol=${rol}&tienda=${tienda}`;
    router.push(ruta);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/asm-logo.png" alt="ASM Control" className={styles.logo} />
        <h1 className={styles.title}>Inicio de Sesión</h1>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <label className={styles.label}>
          Tienda:
          <input
            className={styles.input}
            value={tienda}
            onChange={(e) => setTienda(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Usuario:
          <input
            className={styles.input}
            type="email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Contraseña:
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Rol:
          <select
            className={styles.input}
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="Tienda">Tienda</option>
            <option value="Proveedor">Proveedor</option>
            <option value="Auditor">Auditor</option>
          </select>
        </label>
        <button type="submit" className={styles.button}>Ingresar</button>
      </form>
    </div>
  );
}












