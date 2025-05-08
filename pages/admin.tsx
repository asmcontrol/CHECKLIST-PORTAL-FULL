import { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function Admin() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'solicitudes-cuenta'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSolicitudes(data);
    };
    fetchData();
  }, []);

  const aprobarSolicitud = async (solicitud: any) => {
    try {
      const email = solicitud.email;
      const password = 'temporal123'; // contraseña temporal para crear cuenta

      // 1. Crear cuenta
      await createUserWithEmailAndPassword(auth, email, password);

      // 2. Enviar correo para que el usuario cree su contraseña
      await sendPasswordResetEmail(auth, email);

      // 3. Actualizar estado en Firestore
      await updateDoc(doc(db, 'solicitudes-cuenta', solicitud.id), {
        estado: 'aceptado',
      });

      alert(`✅ Solicitud aprobada y correo enviado a ${email}`);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      alert('❌ Hubo un error al aprobar la solicitud.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Solicitudes de Cuenta</h2>
      <ul>
        {solicitudes.map((s) => (
          <li key={s.id} style={{ marginBottom: '1rem' }}>
            <strong>{s.tienda}</strong> — {s.email} — {s.rol} — Estado: {s.estado}
            {s.estado === 'pendiente' && (
              <button onClick={() => aprobarSolicitud(s)} style={{ marginLeft: '1rem' }}>
                Aprobar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}



