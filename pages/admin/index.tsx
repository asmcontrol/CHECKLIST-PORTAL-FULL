'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig'; // ✅ Ruta corregida
import { useAuth } from '../../hooks/useAuth';

const AdminPanel = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user?.rol !== 'admin') {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'checklists'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChecklists(data);
      } catch (error) {
        console.error('Error fetching checklists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklists();
  }, []);

  if (loading) return <div className="p-4">Cargando datos...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Administración</h1>

      <p className="mb-4 text-gray-600">
        Aquí puedes ver el progreso de cada tienda, quién está a cargo y revisar la base de datos completa.
      </p>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Tienda</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Responsable</th>
            <th className="border p-2">Última modificación</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {checklists.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border p-2 font-medium">{item.tienda || 'Sin nombre'}</td>
              <td className="border p-2">{item.estado || 'Pendiente'}</td>
              <td className="border p-2">{item.responsable || 'No asignado'}</td>
              <td className="border p-2">
                {item.updatedAt
                  ? new Date(item.updatedAt.seconds * 1000).toLocaleString()
                  : 'Sin registro'}
              </td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => router.push(`/admin/tienda/${item.id}`)}
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
};

export default AdminPanel;



