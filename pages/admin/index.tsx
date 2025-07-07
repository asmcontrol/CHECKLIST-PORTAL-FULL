'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [checklists, setChecklists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cargarChecklists = async () => {
      try {
        const q = query(collection(db, 'checklists'), orderBy('updatedAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChecklists(data);
      } catch (error) {
        console.error('Error cargando checklists:', error);
      }
    };

    cargarChecklists();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin-login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard Administrativo</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Tienda</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Estado</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Responsable</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Última modificación</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {checklists.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {item.tienda || item.tiendaInfo?.['CÓDIGO DE TIENDA'] || 'Sin nombre'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {item.estado || 'Pendiente'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {item.responsable || 'No asignado'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleString() : 'Sin registro'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                <button
                  onClick={() => router.push(`/admin/tienda/${item.id}`)}
                  style={{
                    backgroundColor: '#1e40af',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}





