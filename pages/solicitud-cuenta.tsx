// pages/solicitud-cuenta.tsx
import { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import styles from '../styles/login.module.css';
import { useRouter } from 'next/router';

export default function SolicitudCuenta() {
  const [tienda, setTienda] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('tienda');
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'solicitudes-cuenta'), {
        tienda: tienda.trim(),
        email: email.trim().toLowerCase(),
        rol,
        estado: 'pendiente',
        fechaSolicitud: Timestamp.now(),
      });

      // Limpiar campos y mostrar mensaje de éxito
      setTienda('');
      setEmail('');
      setRol('tienda');
      setEnviado(true);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('❌ Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
    }
  };

  if (enviado) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img src="/asm-logo.png" alt="ASM Control Logo" className={styles.logo} />
          <h1 className={styles.title}>✅ Solicitud enviada</h1>
          <p>Pronto nos pondremos en contacto contigo para crear tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/asm-logo.png" alt="ASM Control Logo" className={styles.logo} />
        <h1 className={styles.title}>Solicitud de Cuenta</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Tienda:
          <input
            type="text"
            value={tienda}
            onChange={(e) => setTienda(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Rol:
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className={styles.input}
          >
            <option value="tienda">Tienda</option>
            <option value="proveedor">Proveedor</option>
            <option value="auditor">Auditor</option>
          </select>
        </label>
        <button type="submit" className={styles.button}>
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}

