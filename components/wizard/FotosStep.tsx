'use client';

import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/firebase/firebaseConfig';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

type Props = {
  tienda: string;
  rol: 'jefe_tienda' | 'empresa_inventario' | 'auditor';
};

interface FotoGuardada {
  id: string;
  url: string;
  nombreArchivo: string;
  timestamp: Timestamp;
  rol: string;
}

export default function FotosStep({ tienda, rol }: Props) {
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [galeria, setGaleria] = useState<FotoGuardada[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarFotos = async () => {
      try {
        const fotosRef = collection(db, 'evidencias_fotos');
        const q = query(fotosRef, where('tienda', '==', tienda), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);

        const fotos: FotoGuardada[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<FotoGuardada, 'id'>)
        }));

        setGaleria(fotos);
      } catch (error) {
        console.error('Error al cargar las fotos:', error);
      }
    };

    cargarFotos();
  }, [tienda]);

  const handleSeleccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 10) : [];
    setImagenes(files);
    setMensaje('');
  };

  const handleSubida = async () => {
    if (imagenes.length === 0) {
      setMensaje('Selecciona al menos una imagen.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMensaje('❌ Debes iniciar sesión para subir imágenes.');
      return;
    }

    setSubiendo(true);
    setMensaje('Subiendo imágenes...');

    try {
      const tiendaSegura = tienda.replace(/[^a-zA-Z0-9_-]/g, '_');

      for (const file of imagenes) {
        const storageRef = ref(storage, `evidencias/${tiendaSegura}/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'evidencias_fotos'), {
          tienda,
          rol,
          url,
          nombreArchivo: file.name,
          timestamp: Timestamp.now()
        });
      }

      setMensaje('✅ Imágenes subidas con éxito.');
      setImagenes([]);

      // Recargar galería
      const q = query(
        collection(db, 'evidencias_fotos'),
        where('tienda', '==', tienda),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const nuevasFotos: FotoGuardada[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<FotoGuardada, 'id'>)
      }));
      setGaleria(nuevasFotos);
    } catch (error: any) {
      console.error('❌ Error al subir imágenes:', error.code || error.message || error);
      setMensaje(`❌ Ocurrió un error al subir las imágenes: ${error.code || error.message}`);
    }

    setSubiendo(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📷 Fotos de Evidencia</h2>

      {(rol === 'jefe_tienda' || rol === 'empresa_inventario') && (
        <>
          <input type="file" accept="image/*" multiple onChange={handleSeleccion} />
          <button onClick={handleSubida} disabled={subiendo}>
            {subiendo ? 'Subiendo...' : 'Subir Imágenes'}
          </button>
        </>
      )}

      <p>{mensaje}</p>

      <h3>Galería</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {galeria.map(foto => (
          <div key={foto.id} style={{ textAlign: 'center' }}>
            <img src={foto.url} alt={foto.nombreArchivo} width={100} />
            <p style={{ fontSize: '0.75rem' }}>{foto.nombreArchivo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

















