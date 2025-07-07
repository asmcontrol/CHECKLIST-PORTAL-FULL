'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

export default function DetalleTienda() {
  const router = useRouter();
  const { id } = router.query;

  const [datos, setDatos] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    const obtenerChecklist = async () => {
      try {
        const ref = doc(db, 'checklists', String(id));
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setDatos({ id: snap.id, ...snap.data() });
        } else {
          setDatos(null);
        }
      } catch (error) {
        console.error('Error cargando checklist:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerChecklist();
  }, [id]);

  if (cargando) return <p style={{ padding: '2rem' }}>Cargando...</p>;
  if (!datos) return <p style={{ padding: '2rem', color: 'red' }}>No se encontró el checklist.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Detalle de Tienda: {datos.tienda || datos.id}</h1>
      <p><strong>Responsable:</strong> {datos.responsable || 'No asignado'}</p>
      <p><strong>Estado:</strong> {datos.estado || 'Pendiente'}</p>
      <p><strong>Última modificación:</strong> {datos.updatedAt ? new Date(datos.updatedAt.seconds * 1000).toLocaleString() : 'Sin registro'}</p>

      <hr style={{ margin: '1rem 0' }} />

      <div>
        {Object.entries(datos).map(([key, value]) => (
          !['id', 'updatedAt'].includes(key) && (
            <div key={key} style={{ marginBottom: '8px' }}>
              <strong>{key}:</strong> {typeof value === 'string' ? value : JSON.stringify(value)}
            </div>
          )
        ))}
      </div>

      <button onClick={() => router.back()} style={{
        marginTop: '1.5rem',
        padding: '10px 20px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        ← Volver al Dashboard
      </button>
    </div>
  );
}
