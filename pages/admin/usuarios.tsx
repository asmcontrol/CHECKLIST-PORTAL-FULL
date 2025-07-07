'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'usuarios'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsuarios(lista);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const cambiarRol = async (id: string, nuevoRol: string) => {
    try {
      await updateDoc(doc(db, 'usuarios', id), { rol: nuevoRol });
      setUsuarios(prev =>
        prev.map(user =>
          user.id === id ? { ...user, rol: nuevoRol } : user
        )
      );
      setMensaje('✅ Rol actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      setMensaje('❌ Error al actualizar rol.');
    }
  };

  const enviarReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje(`📩 Email de recuperación enviado a ${email}`);
    } catch (error) {
      console.error('Error al enviar reset:', error);
      setMensaje('❌ Error al enviar correo de recuperación.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👥 Gestión de Usuarios</h1>

      {mensaje && <p style={{ marginTop: '10px', color: 'green' }}>{mensaje}</p>}

      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f3f3' }}>
              <th style={th}>Correo</th>
              <th style={th}>Rol</th>
              <th style={th}>Cambiar Rol</th>
              <th style={th}>Recuperar Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td style={td}>{u.email}</td>
                <td style={td}>{u.rol}</td>
                <td style={td}>
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.id, e.target.value)}
                  >
                    <option value="jefe_tienda">Jefe de Tienda</option>
                    <option value="empresa_inventario">Empresa Inventario</option>
                    <option value="auditor">Auditor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={td}>
                  <button onClick={() => enviarReset(u.email)}>🔁 Enviar Email</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left' as const
};

const td = {
  border: '1px solid #ccc',
  padding: '8px'
};
