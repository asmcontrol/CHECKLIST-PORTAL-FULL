// pages/admin.tsx
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import styles from '../styles/login.module.css';

// ✅ Tipo para solicitudes
interface Solicitud {
  id: string;
  tienda: string;
  email: string;
  rol: string;
  estado: string;
}

export default function AdminPanel() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const fetchSolicitudes = async () => {
    const snapshot = await getDocs(collection(db, 'solicitudes-cuenta'));
    const data: Solicitud[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Solicitud, 'id'>),
    }));
    setSolicitudes(data.filter((s) => s.estado === 'pendiente'));
  };

  const aceptarSolicitud = async (solicitud: Solicitud) => {
    try {
      // ✅ Crear usuario con contraseña temporal
      await createUserWithEmailAndPassword(auth, solicitud.email, 'temporal123');

      // ✅ Enviar link para cambiar contraseña
      await sendPasswordResetEmail(auth, solicitud.email);

      // ✅ Actualizar estado en Firestore
      await updateDoc(doc(db, 'solicitudes-cuenta', solicitud.id), {
        estado: 'aceptado',
      });

      fetchSolicitudes();
    } catch (error) {
      console.error('Error al aceptar:', error);
    }
  };

  const rechazarSolicitud = async (id: string) => {
    await updateDoc(doc(db, 'solicitudes-cuenta', id), { estado: 'rechazado' });
    fetchSolicitudes();
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Panel de Administración</h1>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul className={styles.form}>
          {solicitudes.map((s) => (
            <li
              key={s.id}
              style={{
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid #ccc',
              }}
            >
              <p>
                <strong>Tienda:</strong> {s.tienda}
              </p>
              <p>
                <strong>Email:</strong> {s.email}
              </p>
              <p>
                <strong>Rol:</strong> {s.rol}
              </p>
              <button className={styles.button} onClick={() => aceptarSolicitud(s)}>
                Aceptar
              </button>{' '}
              <button
                className={styles.button}
                style={{ backgroundColor: 'gray' }}
                onClick={() => rechazarSolicitud(s.id)}
              >
                Rechazar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
