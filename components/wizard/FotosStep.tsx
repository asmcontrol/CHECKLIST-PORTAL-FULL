import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Ajusta si no usas alias

type Props = {
  tienda: string;
  rol: 'jefe_tienda' | 'empresa_inventario' | 'auditor';
};

export default function FotosStep({ tienda, rol }: Props) {
  const [archivos, setArchivos] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  const storage = getStorage();

  const handleSeleccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 20) : [];
    setArchivos(files);
    setPreviewURLs(files.map(file => URL.createObjectURL(file)));
    setMensaje('');
  };

  const handleSubida = async () => {
    if (archivos.length === 0) {
      setMensaje('❌ No hay imágenes seleccionadas para subir.');
      return;
    }

    setMensaje('⏳ Subiendo imágenes...');
    setSubiendo(true);

    try {
      const urls: string[] = [];

      for (const file of archivos) {
        const nombre = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `fotos_checklist/${tienda}/${nombre}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);

        // Guardar en Firestore
        await updateDoc(doc(db, 'checklists', tienda), {
          fotos: arrayUnion(url)
        });
      }

      setArchivos([]);
      setPreviewURLs([]);
      setMensaje('✅ Imágenes subidas y guardadas exitosamente.');
    } catch (e) {
      console.error('Error subiendo imágenes:', e);
      setMensaje('❌ Error al subir imágenes.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div style={{ color: '#222' }}>
      <h3>📸 Subida de Fotos (máx. 20)</h3>
      <p style={{ fontSize: '0.95rem', color: '#555' }}>
        <strong>Rol:</strong> {rol} &nbsp; | &nbsp; <strong>Tienda:</strong> {tienda}
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSeleccion}
        style={{
          margin: '10px 0',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          width: '100%',
          backgroundColor: '#f9f9f9'
        }}
      />

      <button
        onClick={handleSubida}
        disabled={subiendo}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: subiendo ? 'not-allowed' : 'pointer',
          marginTop: '10px'
        }}
      >
        {subiendo ? 'Subiendo...' : 'Subir Imágenes'}
      </button>

      {mensaje && (
        <p style={{ marginTop: '10px', color: mensaje.includes('❌') ? 'red' : 'green' }}>
          {mensaje}
        </p>
      )}

      {previewURLs.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>👁️ Vista Previa</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {previewURLs.map((src, i) => (
              <img
                key={`preview-${i}`}
                src={src}
                alt={`preview-${i}`}
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

